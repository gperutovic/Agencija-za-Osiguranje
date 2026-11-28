import { getFirestore } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { AGENCY_BRAND, FUNCTIONS_REGION, RESEND_API_KEY } from '../config.js';
import { sendTransactionalEmail } from '../services/emailService.js';

function daysBetween(targetIso: string, now: Date): number {
  const target = new Date(targetIso);
  if (Number.isNaN(target.getTime())) return 999;
  const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((startTarget.getTime() - startNow.getTime()) / 86_400_000);
}

/**
 * Daily Renewal & Statutory Art. 401 SLA Monitor (07:30 Europe/Zagreb).
 * - Flags policies expiring within 60/30/15 days as `expiring_soon` and past-due as `expired`.
 * - Flags Switch & Save analyses whose `reminderScheduledFor` date has arrived.
 * - Alerts agency staff when an unresolved Art. 401 complaint is within 3 days of its 15-day deadline.
 */
export const dailyRenewalAndSlaMonitor = onSchedule(
  {
    schedule: '30 7 * * *',
    timeZone: 'Europe/Zagreb',
    region: FUNCTIONS_REGION,
    secrets: [RESEND_API_KEY],
  },
  async () => {
    const db = getFirestore();
    const now = new Date();
    const todayIso = now.toISOString().slice(0, 10);
    const nowIso = now.toISOString();

    // 1. Policy Expiration & Skadencar Monitor
    const policiesSnap = await db
      .collection('policies')
      .where('status', 'in', ['active', 'expiring_soon'])
      .get();

    const batch = db.batch();
    let flaggedCount = 0;

    for (const docSnap of policiesSnap.docs) {
      const p = docSnap.data();
      const daysLeft = daysBetween(String(p.expiryDate || ''), now);
      if (daysLeft < 0 && p.status !== 'expired') {
        batch.update(docSnap.ref, { status: 'expired', updatedAt: nowIso });
        flaggedCount += 1;
      } else if (daysLeft >= 0 && daysLeft <= 60 && p.status === 'active') {
        batch.update(docSnap.ref, { status: 'expiring_soon', updatedAt: nowIso });
        flaggedCount += 1;
      }
    }

    if (flaggedCount > 0) {
      await batch.commit();
    }

    // 2. Switch & Save Scheduled Reminders Due Today or Earlier
    const dueSwitches = await db
      .collection('switch_analyses')
      .where('reminderScheduledFor', '<=', todayIso)
      .limit(50)
      .get();

    for (const swDoc of dueSwitches.docs) {
      const sw = swDoc.data();
      if (sw.reminderNotified === true) continue;
      if (sw.status === 'bound' || sw.status === 'lost') continue;

      await db.collection('sla_alerts').add({
        type: 'switch_reminder_due',
        entityId: swDoc.id,
        referenceNumber: sw.referenceNumber || swDoc.id,
        message: `Podsjetnik skadence za Switch & Save analizu ${sw.referenceNumber || swDoc.id} (${sw.customerName || 'Klijent'}).`,
        resolved: false,
        createdAt: nowIso,
      });

      await swDoc.ref.update({ reminderNotified: true, updatedAt: nowIso });
    }

    // 3. Statutory Art. 401 Complaints within 3 days of 15-day deadline
    const openComplaints = await db
      .collection('complaints')
      .where('status', 'in', ['received', 'in_review'])
      .get();

    const urgentComplaints: string[] = [];
    for (const compDoc of openComplaints.docs) {
      const comp = compDoc.data();
      const daysRemaining = daysBetween(String(comp.statutoryDeadlineDate || ''), now);
      if (daysRemaining <= 3) {
        urgentComplaints.push(
          `${comp.protocolNumber} (${comp.fullName}) — preostalo ${daysRemaining} dan(a), rok ${comp.statutoryDeadlineDate}`
        );
        await db.collection('sla_alerts').doc(`complaint-${compDoc.id}`).set(
          {
            type: 'complaint_sla_warning',
            entityId: compDoc.id,
            referenceNumber: comp.protocolNumber || compDoc.id,
            daysRemaining,
            message: `HITNO čl. 401.: Prigovor ${comp.protocolNumber} istječe za ${daysRemaining} dana.`,
            resolved: false,
            updatedAt: nowIso,
            createdAt: nowIso,
          },
          { merge: true }
        );
      }
    }

    if (urgentComplaints.length > 0) {
      await sendTransactionalEmail(
        {
          to: AGENCY_BRAND.complaintsEmail,
          subject: `[SLA UPOZORENJE] ${urgentComplaints.length} prigovor(a) čl. 401. blizu zakonskog roka`,
          text: `Sljedeći prigovori su unutar 3 dana od zakonskog roka od 15 dana:\n\n${urgentComplaints.join('\n')}`,
          html: `<p><strong>Hitno SLA upozorenje (čl. 401. Zakona o osiguranju):</strong></p><ul>${urgentComplaints.map((line) => `<li>${line}</li>`).join('')}</ul>`,
        },
        RESEND_API_KEY.value()
      );
    }

    console.info('[Vedro Daily Monitor Complete]', {
      flaggedPolicies: flaggedCount,
      dueSwitches: dueSwitches.size,
      urgentComplaints: urgentComplaints.length,
    });
  }
);
