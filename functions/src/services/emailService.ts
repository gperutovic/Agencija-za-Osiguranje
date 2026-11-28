import { AGENCY_BRAND } from '../config.js';

export interface EmailMessagePayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailSendResult {
  delivered: boolean;
  provider: 'resend' | 'dry_run';
  messageId?: string;
}

function wrapBrandHtml(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="hr">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
  <div style="max-width:580px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
    <div style="padding:20px 28px;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#111827;">${AGENCY_BRAND.brandName}<span style="color:#FF006E;">.</span></span>
      <span style="font-size:11px;color:#6B7280;">HANFA ${AGENCY_BRAND.hanfaRegistrationNumber}</span>
    </div>
    <div style="padding:28px;">
      <h1 style="margin:0 0 14px;font-size:20px;line-height:1.3;color:#111827;">${title}</h1>
      ${bodyHtml}
    </div>
    <div style="padding:18px 28px;background:#F7F7F5;border-top:1px solid #E5E7EB;font-size:11px;line-height:1.5;color:#6B7280;">
      <strong>${AGENCY_BRAND.legalName}</strong> • OIB: ${AGENCY_BRAND.oib} • ${AGENCY_BRAND.address}<br/>
      Tel: ${AGENCY_BRAND.phone} • Štete 24/7: ${AGENCY_BRAND.claimsPhone} • <a href="${AGENCY_BRAND.siteUrl}" style="color:#111827;">${AGENCY_BRAND.siteUrl}</a>
    </div>
  </div>
</body>
</html>`;
}

export async function sendTransactionalEmail(
  payload: EmailMessagePayload,
  resendApiKey?: string
): Promise<EmailSendResult> {
  if (!resendApiKey) {
    console.info('[Vedro Email Dry-Run]', {
      to: payload.to,
      subject: payload.subject,
      preview: payload.text.slice(0, 180),
    });
    return { delivered: false, provider: 'dry_run' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: AGENCY_BRAND.emailFrom,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('[Vedro Email Error]', res.status, errText);
      return { delivered: false, provider: 'resend' };
    }
    const data = (await res.json()) as { id?: string };
    return { delivered: true, provider: 'resend', messageId: data.id };
  } catch (err) {
    console.error('[Vedro Email Exception]', err);
    return { delivered: false, provider: 'resend' };
  }
}

export function buildQuoteReceiptEmail(params: {
  to: string;
  customerName: string;
  referenceNumber: string;
  carrierName: string;
  annualPriceEur: number;
  productLine: string;
}): EmailMessagePayload {
  const formatted = `${params.annualPriceEur.toFixed(2).replace('.', ',')} €`;
  const subject = `Potvrda zahtjeva za ponudu ${params.referenceNumber} — ${AGENCY_BRAND.brandName}`;
  const text = `Poštovani/a ${params.customerName},\n\nzaprimili smo vaš zahtjev za obvezujuću ponudu pod oznakom ${params.referenceNumber}.\nOsiguratelj: ${params.carrierName}\nInformativna premija: ${formatted}\n\nNaš ovlašteni zastupnik dostavit će vam finalnu policu i uplatnicu bez ikakve agencijske naknade (0 €).\n\nSrdačan pozdrav,\n${AGENCY_BRAND.legalName}`;
  const html = wrapBrandHtml(
    `Zahtjev ${params.referenceNumber} je zaprimljen`,
    `<p style="font-size:14px;line-height:1.6;color:#374151;">Poštovani/a <strong>${params.customerName}</strong>,</p>
     <p style="font-size:14px;line-height:1.6;color:#374151;">vaš zahtjev za obvezujuću ponudu osiguranja uspješno je zaprimljen i dodijeljen našem licenciranom timu.</p>
     <div style="background:#F7F7F5;border:1px solid #E5E7EB;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:13px;">
       <div><strong>Referentni broj:</strong> ${params.referenceNumber}</div>
       <div><strong>Osiguratelj:</strong> ${params.carrierName}</div>
       <div><strong>Vrsta osiguranja:</strong> ${params.productLine}</div>
       <div><strong>Informativna premija:</strong> ${formatted}</div>
     </div>
     <p style="font-size:13px;color:#6B7280;">Podsjećamo: za ugovaratelja nema nikakve agencijske naknade (0,00 €).</p>`
  );
  return { to: params.to, subject, html, text };
}

export function buildSwitchReceiptEmail(params: {
  to: string;
  customerName: string;
  referenceNumber: string;
  insurer: string;
  estimatedSavingsEur: number;
  reminderDate: string;
}): EmailMessagePayload {
  const savings = `${params.estimatedSavingsEur.toFixed(2).replace('.', ',')} €`;
  const subject = `Analiza police ${params.referenceNumber} i podsjetnik isteka — ${AGENCY_BRAND.brandName}`;
  const text = `Poštovani/a ${params.customerName},\n\nzaprimili smo vašu postojeću policu (${params.insurer}) pod oznakom ${params.referenceNumber}.\nProcijenjena godišnja ušteda: ${savings}\nPodsjetnik prije skadence zakazan je za: ${params.reminderDate}.\n\nSrdačan pozdrav,\n${AGENCY_BRAND.legalName}`;
  const html = wrapBrandHtml(
    `Switch & Save analiza ${params.referenceNumber}`,
    `<p style="font-size:14px;line-height:1.6;color:#374151;">Poštovani/a <strong>${params.customerName}</strong>,</p>
     <p style="font-size:14px;line-height:1.6;color:#374151;">usporedili smo uvjete vaše trenutne police (<strong>${params.insurer}</strong>) i zakazali automatski podsjetnik prije isteka.</p>
     <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:13px;">
       <div><strong>Procijenjena godišnja ušteda:</strong> ${savings}</div>
       <div><strong>Podsjetnik prije skadence:</strong> ${params.reminderDate}</div>
     </div>`
  );
  return { to: params.to, subject, html, text };
}

export function buildClaimReceiptEmail(params: {
  to: string;
  claimantName: string;
  referenceNumber: string;
  policyNumber: string;
  carrierName: string;
}): EmailMessagePayload {
  const subject = `Prijava štete ${params.referenceNumber} zaprimljena — ${AGENCY_BRAND.brandName}`;
  const text = `Poštovani/a ${params.claimantName},\n\nvaša digitalna prijava štete (${params.referenceNumber}) za policu ${params.policyNumber} (${params.carrierName}) uspješno je zaprimljena.\nStatus možete pratiti na ${AGENCY_BRAND.siteUrl}/prijava-stete pomoću referentnog broja i zadnje 4 znamenke OIB-a.\n\nHitna podrška: ${AGENCY_BRAND.claimsPhone}`;
  const html = wrapBrandHtml(
    `Prijava štete ${params.referenceNumber} je zaprimljena`,
    `<p style="font-size:14px;line-height:1.6;color:#374151;">Poštovani/a <strong>${params.claimantName}</strong>,</p>
     <p style="font-size:14px;line-height:1.6;color:#374151;">zaprimili smo vašu FNOL prijavu štete za policu <strong>${params.policyNumber}</strong> (${params.carrierName}). Naš tim preuzima daljnju komunikaciju s osigurateljem.</p>
     <p style="font-size:13px;color:#374151;">Status prijave možete u svakom trenutku pratiti na <a href="${AGENCY_BRAND.siteUrl}/prijava-stete" style="color:#FF006E;font-weight:600;">Praćenje štete</a> pomoću broja <strong>${params.referenceNumber}</strong>.</p>`
  );
  return { to: params.to, subject, html, text };
}

export function buildClaimStatusUpdateEmail(params: {
  to: string;
  claimantName: string;
  referenceNumber: string;
  stageLabel: string;
  note: string;
}): EmailMessagePayload {
  const subject = `Promjena statusa štete ${params.referenceNumber}: ${params.stageLabel}`;
  const text = `Poštovani/a ${params.claimantName},\n\nstatus vaše prijave štete ${params.referenceNumber} ažuriran je na fazu: ${params.stageLabel}.\nNapomena zastupnika: ${params.note}\n\n${AGENCY_BRAND.legalName}`;
  const html = wrapBrandHtml(
    `Novi status prijave ${params.referenceNumber}`,
    `<p style="font-size:14px;line-height:1.6;color:#374151;">Poštovani/a <strong>${params.claimantName}</strong>,</p>
     <div style="background:#FFF0F6;border:1px solid #FBCFE8;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:13px;">
       <div><strong>Nova faza:</strong> ${params.stageLabel}</div>
       <div style="margin-top:6px;"><strong>Napomena zastupnika:</strong> ${params.note}</div>
     </div>`
  );
  return { to: params.to, subject, html, text };
}

export function buildComplaintReceiptEmail(params: {
  to: string;
  fullName: string;
  protocolNumber: string;
  statutoryDeadlineDate: string;
}): EmailMessagePayload {
  const subject = `Potvrda zaprimanja prigovora ${params.protocolNumber} (čl. 401. Zakona o osiguranju)`;
  const text = `Poštovani/a ${params.fullName},\n\nvaš pisani prigovor urudžbiran je pod oznakom ${params.protocolNumber}.\nSukladno članku 401. Zakona o osiguranju, pisani odgovor dostavit ćemo najkasnije do ${params.statutoryDeadlineDate} (zakonski rok od 15 dana).\n\n${AGENCY_BRAND.legalName}`;
  const html = wrapBrandHtml(
    `Prigovor urudžbiran: ${params.protocolNumber}`,
    `<p style="font-size:14px;line-height:1.6;color:#374151;">Poštovani/a <strong>${params.fullName}</strong>,</p>
     <p style="font-size:14px;line-height:1.6;color:#374151;">potvrđujemo primitak vašeg pisanog prigovora sukladno čl. 401. Zakona o osiguranju RH.</p>
     <div style="background:#F7F7F5;border:1px solid #E5E7EB;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:13px;">
       <div><strong>Urudžbeni broj:</strong> ${params.protocolNumber}</div>
       <div><strong>Zakonski rok odgovora (15 dana):</strong> ${params.statutoryDeadlineDate}</div>
     </div>`
  );
  return { to: params.to, subject, html, text };
}

export function buildComplaintResolvedEmail(params: {
  to: string;
  fullName: string;
  protocolNumber: string;
  resolutionNotes: string;
}): EmailMessagePayload {
  const subject = `Pisani odgovor na prigovor ${params.protocolNumber} — ${AGENCY_BRAND.brandName}`;
  const text = `Poštovani/a ${params.fullName},\n\ndostavljamo službeni pisani odgovor na vaš prigovor ${params.protocolNumber}:\n\n${params.resolutionNotes}\n\nUkoliko niste zadovoljni rješenjem, imate pravo na izvansudsko rješavanje spora pri Centru za mirenje Hrvatskog ureda za osiguranje (huo.hr/hr/centar-za-mirenje).\n\n${AGENCY_BRAND.legalName}`;
  const html = wrapBrandHtml(
    `Pisani odgovor na prigovor ${params.protocolNumber}`,
    `<p style="font-size:14px;line-height:1.6;color:#374151;">Poštovani/a <strong>${params.fullName}</strong>,</p>
     <div style="background:#F7F7F5;border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin:16px 0;font-size:14px;line-height:1.6;color:#111827;">
       ${params.resolutionNotes.replace(/\n/g, '<br/>')}
     </div>
     <p style="font-size:12px;color:#6B7280;">Pravo na izvansudsko rješavanje sporova: Centar za mirenje pri HUO (https://huo.hr/hr/centar-za-mirenje).</p>`
  );
  return { to: params.to, subject, html, text };
}

export function buildRenewalReminderEmail(params: {
  to: string;
  clientName: string;
  policyNumber: string;
  carrierName: string;
  expiryDate: string;
  assetSummary: string;
}): EmailMessagePayload {
  const subject = `Podsjetnik za obnovu police ${params.policyNumber} — ${AGENCY_BRAND.brandName}`;
  const text = `Poštovani/a ${params.clientName},\n\nvaša polica ${params.policyNumber} (${params.carrierName} — ${params.assetSummary}) istječe ${params.expiryDate}.\nPrijavite se u Moj Profil (${AGENCY_BRAND.siteUrl}/moj-profil) kako biste jednim klikom zatražili obnovu ili usporedbu novih tarifa bez naknade.`;
  const html = wrapBrandHtml(
    `Vaša polica ${params.policyNumber} uskoro istječe`,
    `<p style="font-size:14px;line-height:1.6;color:#374151;">Poštovani/a <strong>${params.clientName}</strong>,</p>
     <p style="font-size:14px;line-height:1.6;color:#374151;">podsjećamo vas da polica <strong>${params.policyNumber}</strong> (${params.carrierName} — ${params.assetSummary}) istječe dana <strong>${params.expiryDate}</strong>.</p>
     <p style="margin:20px 0;"><a href="${AGENCY_BRAND.siteUrl}/moj-profil" style="display:inline-block;background:#FF006E;color:#FFFFFF;text-decoration:none;font-weight:600;padding:11px 20px;border-radius:8px;font-size:14px;">Otvori Moj Profil i obnovi policu</a></p>`
  );
  return { to: params.to, subject, html, text };
}
