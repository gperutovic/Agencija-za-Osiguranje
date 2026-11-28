import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { FUNCTIONS_REGION, RESEND_API_KEY } from '../config.js';
import {
  buildClaimReceiptEmail,
  buildClaimStatusUpdateEmail,
  buildComplaintReceiptEmail,
  buildComplaintResolvedEmail,
  buildQuoteReceiptEmail,
  buildRenewalReminderEmail,
  buildSwitchReceiptEmail,
  sendTransactionalEmail,
} from '../services/emailService.js';

const STAGE_LABELS_HR: Record<string, string> = {
  received: 'Zaprimljeno',
  insurer_review: 'U obradi kod osiguratelja',
  assessment: 'Procjena',
  paid: 'Isplaćeno',
};

/**
 * Resolves a registered client's UID by policyNumber, OIB, or email so guest submissions
 * automatically appear inside their /moj-profil portal.
 */
export async function findMatchingUserUid(params: {
  policyNumber?: string;
  oib?: string;
  email?: string;
}): Promise<string | null> {
  const db = getFirestore();

  if (params.policyNumber) {
    const polSnap = await db
      .collection('policies')
      .where('policyNumber', '==', params.policyNumber.trim().toUpperCase())
      .limit(1)
      .get();
    if (!polSnap.empty) {
      const uid = polSnap.docs[0]!.data().userId;
      if (typeof uid === 'string' && uid.length > 0) return uid;
    }
  }

  if (params.oib && /^\d{11}$/.test(params.oib.trim())) {
    const userByOib = await db
      .collection('users')
      .where('oib', '==', params.oib.trim())
      .limit(1)
      .get();
    if (!userByOib.empty) return userByOib.docs[0]!.id;
  }

  if (params.email && params.email.includes('@')) {
    const userByEmail = await db
      .collection('users')
      .where('email', '==', params.email.trim().toLowerCase())
      .limit(1)
      .get();
    if (!userByEmail.empty) return userByEmail.docs[0]!.id;
  }

  return null;
}

export const onQuoteCreated = onDocumentCreated(
  {
    document: 'quotes/{quoteId}',
    region: FUNCTIONS_REGION,
    secrets: [RESEND_API_KEY],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();

    if (!data.userId) {
      const matchedUid = await findMatchingUserUid({
        oib: data.customer?.oib,
        email: data.customer?.email,
      });
      if (matchedUid) {
        await snap.ref.update({ userId: matchedUid, updatedAt: new Date().toISOString() });
      }
    }

    if (data.customer?.email) {
      await sendTransactionalEmail(
        buildQuoteReceiptEmail({
          to: data.customer.email,
          customerName: data.customer.fullName || 'Poštovani',
          referenceNumber: data.referenceNumber || snap.id,
          carrierName: data.selectedOffer?.carrierName || 'Partnerski osiguratelj',
          annualPriceEur: Number(data.selectedOffer?.annualPrice || 0),
          productLine: String(data.productLine || 'osiguranje'),
        }),
        RESEND_API_KEY.value()
      );
    }
  }
);

export const onSwitchAnalysisCreated = onDocumentCreated(
  {
    document: 'switch_analyses/{analysisId}',
    region: FUNCTIONS_REGION,
    secrets: [RESEND_API_KEY],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();

    if (!data.userId && data.customerEmail) {
      const matchedUid = await findMatchingUserUid({ email: data.customerEmail });
      if (matchedUid) {
        await snap.ref.update({ userId: matchedUid, updatedAt: new Date().toISOString() });
      }
    }

    if (data.customerEmail) {
      await sendTransactionalEmail(
        buildSwitchReceiptEmail({
          to: data.customerEmail,
          customerName: data.customerName || 'Poštovani',
          referenceNumber: data.referenceNumber || snap.id,
          insurer: data.extractedPolicy?.insurer || 'Postojeći osiguratelj',
          estimatedSavingsEur: Number(data.estimatedAnnualSavings || 0),
          reminderDate: String(data.reminderScheduledFor || ''),
        }),
        RESEND_API_KEY.value()
      );
    }
  }
);

export const onClaimCreated = onDocumentCreated(
  {
    document: 'claims/{claimId}',
    region: FUNCTIONS_REGION,
    secrets: [RESEND_API_KEY],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();

    if (!data.userId) {
      const matchedUid = await findMatchingUserUid({
        policyNumber: data.policyNumber,
        oib: data.claimantOib,
        email: data.claimantEmail,
      });
      if (matchedUid) {
        await snap.ref.update({ userId: matchedUid, updatedAt: new Date().toISOString() });
      }
    }

    if (data.claimantEmail) {
      await sendTransactionalEmail(
        buildClaimReceiptEmail({
          to: data.claimantEmail,
          claimantName: data.claimantName || 'Poštovani',
          referenceNumber: data.referenceNumber || snap.id,
          policyNumber: data.policyNumber || '',
          carrierName: data.carrierName || '',
        }),
        RESEND_API_KEY.value()
      );
    }
  }
);

export const onClaimUpdated = onDocumentUpdated(
  {
    document: 'claims/{claimId}',
    region: FUNCTIONS_REGION,
    secrets: [RESEND_API_KEY],
  },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    const stageChanged = before.stage !== after.stage;
    const historyGrew =
      Array.isArray(after.stageHistory) &&
      Array.isArray(before.stageHistory) &&
      after.stageHistory.length > before.stageHistory.length;

    if ((stageChanged || historyGrew) && after.claimantEmail) {
      const latestEntry = Array.isArray(after.stageHistory)
        ? after.stageHistory[after.stageHistory.length - 1]
        : null;
      await sendTransactionalEmail(
        buildClaimStatusUpdateEmail({
          to: after.claimantEmail,
          claimantName: after.claimantName || 'Poštovani',
          referenceNumber: after.referenceNumber || event.params.claimId,
          stageLabel: STAGE_LABELS_HR[after.stage] || String(after.stage),
          note: latestEntry?.note || 'Status vaše prijave je ažuriran.',
        }),
        RESEND_API_KEY.value()
      );
    }
  }
);

export const onComplaintCreated = onDocumentCreated(
  {
    document: 'complaints/{complaintId}',
    region: FUNCTIONS_REGION,
    secrets: [RESEND_API_KEY],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();

    if (data.email) {
      await sendTransactionalEmail(
        buildComplaintReceiptEmail({
          to: data.email,
          fullName: data.fullName || 'Poštovani',
          protocolNumber: data.protocolNumber || snap.id,
          statutoryDeadlineDate: String(data.statutoryDeadlineDate || ''),
        }),
        RESEND_API_KEY.value()
      );
    }
  }
);

export const onComplaintUpdated = onDocumentUpdated(
  {
    document: 'complaints/{complaintId}',
    region: FUNCTIONS_REGION,
    secrets: [RESEND_API_KEY],
  },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    if (before.status !== 'resolved' && after.status === 'resolved' && after.email) {
      await sendTransactionalEmail(
        buildComplaintResolvedEmail({
          to: after.email,
          fullName: after.fullName || 'Poštovani',
          protocolNumber: after.protocolNumber || event.params.complaintId,
          resolutionNotes:
            after.resolutionNotes || 'Vaš prigovor je obrađen i riješen od strane naše agencije.',
        }),
        RESEND_API_KEY.value()
      );
    }
  }
);

export const onPolicyUpdated = onDocumentUpdated(
  {
    document: 'policies/{policyId}',
    region: FUNCTIONS_REGION,
    secrets: [RESEND_API_KEY],
  },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    if (before.renewalReminderSentAt !== after.renewalReminderSentAt && after.renewalReminderSentAt) {
      const db = getFirestore();
      const userSnap = after.userId ? await db.collection('users').doc(after.userId).get() : null;
      const clientEmail = userSnap?.data()?.email;
      if (typeof clientEmail === 'string' && clientEmail.includes('@')) {
        await sendTransactionalEmail(
          buildRenewalReminderEmail({
            to: clientEmail,
            clientName: after.clientName || 'Poštovani',
            policyNumber: after.policyNumber || event.params.policyId,
            carrierName: after.carrierName || '',
            expiryDate: String(after.expiryDate || ''),
            assetSummary: after.assetSummary || '',
          }),
          RESEND_API_KEY.value()
        );
      }
    }
  }
);
