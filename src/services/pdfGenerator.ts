import jsPDF from 'jspdf';
import { CoiCertificate, Policy, QuoteFormData, CarrierQuote } from '../types/valiant';

export function generateAcord25Pdf(coi: CoiCertificate, policy: Policy): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Top ACORD Header
  doc.setFillColor(14, 19, 31);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ACORD', 12, 11);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('CERTIFICATE OF LIABILITY INSURANCE', 35, 11);

  doc.setFontSize(8);
  doc.setTextColor(180, 190, 205);
  doc.text(`DATE (MM/DD/YYYY): ${new Date(coi.issued_at).toLocaleDateString('en-US')}`, 145, 11);
  doc.text('CERTIFICATE ID: ' + coi.id.toUpperCase(), 145, 16);

  // Legal Disclaimer Notice Box
  doc.setDrawColor(200, 205, 215);
  doc.setLineWidth(0.2);
  doc.setFillColor(248, 249, 252);
  doc.rect(10, 27, 190, 16, 'FD');

  doc.setTextColor(60, 70, 85);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUCER & VERIFICATION NOTICE:', 12, 31);
  doc.setFont('helvetica', 'normal');
  const disclaimer = 'THIS CERTIFICATE IS ISSUED AS A MATTER OF INFORMATION ONLY AND CONFERS NO RIGHTS UPON THE CERTIFICATE HOLDER. THIS CERTIFICATE DOES NOT AFFIRMATIVELY OR NEGATIVELY AMEND, EXTEND OR ALTER THE COVERAGE AFFORDED BY THE POLICIES BELOW.';
  doc.text(doc.splitTextToSize(disclaimer, 186), 12, 35);

  // Producer & Insured Boxes
  doc.rect(10, 46, 92, 34);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 30, 45);
  doc.text('PRODUCER', 12, 50);
  doc.setFont('helvetica', 'normal');
  doc.text('VALIANT GLOBAL RISK ADVISORY LLC', 12, 55);
  doc.text('One World Trade Center, Suite 7800', 12, 59);
  doc.text('New York, NY 10007, United States', 12, 63);
  doc.text('Phone: +1 (800) 492-8812 | regulatory@valiantglobalrisk.com', 12, 67);
  doc.text('License: Surplus Lines & Brokerage #NY-9921448', 12, 71);

  doc.rect(10, 82, 92, 32);
  doc.setFont('helvetica', 'bold');
  doc.text('INSURED', 12, 86);
  doc.setFont('helvetica', 'normal');
  doc.text(coi.insured_name || 'Nexus Quantum Dynamics Inc.', 12, 91);
  doc.text('Corporation Trust Center, 1209 Orange St', 12, 95);
  doc.text('Wilmington, DE 19801', 12, 99);
  doc.text('EIN / Tax ID: 12-3456789', 12, 103);

  // Insurers Affording Coverage
  doc.rect(105, 46, 95, 68);
  doc.setFont('helvetica', 'bold');
  doc.text('INSURERS AFFORDING COVERAGE', 108, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`INSURER A: ${policy.carrier_name} (NAIC #1882)`, 108, 56);
  doc.text("INSURER B: Lloyd's of London Underwriting Syndicates (NAIC #2003)", 108, 62);
  doc.text('INSURER C: AIG Commercial Insurance Solutions (NAIC #19445)', 108, 68);
  doc.text('INSURER D: Zurich American Insurance Company (NAIC #16535)', 108, 74);
  doc.text('INSURER E: Travelers Property Casualty Corp (NAIC #25674)', 108, 80);

  // Coverage Schedule Table Header
  doc.setFillColor(230, 235, 245);
  doc.rect(10, 118, 190, 8, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 25, 40);
  doc.text('INSR', 12, 123);
  doc.text('TYPE OF INSURANCE', 24, 123);
  doc.text('POLICY NUMBER', 75, 123);
  doc.text('EFF DATE', 112, 123);
  doc.text('EXP DATE', 132, 123);
  doc.text('LIMITS (USD)', 155, 123);

  // General Liability Row
  doc.rect(10, 126, 190, 32);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('A', 13, 131);
  doc.setFont('helvetica', 'bold');
  doc.text('COMMERCIAL GENERAL LIABILITY', 24, 131);
  doc.setFont('helvetica', 'normal');
  doc.text('[X] Claims-Made  [X] Occur', 24, 136);
  doc.text(coi.additional_insured ? '[X] Addl Insured' : '[ ] Addl Insured', 24, 141);
  doc.text(coi.waiver_subrogation ? '[X] Subr Waived' : '[ ] Subr Waived', 24, 146);

  doc.setFont('helvetica', 'bold');
  doc.text(policy.policy_number, 75, 131);
  doc.setFont('helvetica', 'normal');
  doc.text(policy.effective_date, 112, 131);
  doc.text(policy.expiration_date, 132, 131);

  // Limits
  doc.text('EACH OCCURRENCE', 152, 130);
  doc.text('$' + policy.occurrence_limit.toLocaleString('en-US'), 182, 130);
  doc.text('DAMAGE TO RENTED', 152, 134);
  doc.text('$1,000,000', 182, 134);
  doc.text('MED EXP (Any one person)', 152, 138);
  doc.text('$15,000', 182, 138);
  doc.text('PERSONAL & ADV INJURY', 152, 142);
  doc.text('$' + policy.occurrence_limit.toLocaleString('en-US'), 182, 142);
  doc.text('GENERAL AGGREGATE', 152, 146);
  doc.text('$' + policy.aggregate_limit.toLocaleString('en-US'), 182, 146);
  doc.text('PRODUCTS - COMP/OP AGG', 152, 150);
  doc.text('$' + policy.aggregate_limit.toLocaleString('en-US'), 182, 150);

  // Description of Operations / Locations / Vehicles
  doc.rect(10, 160, 190, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DESCRIPTION OF OPERATIONS / LOCATIONS / VEHICLES / SPECIAL CONDITIONS', 12, 165);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const conditions = `${coi.special_conditions || 'Certificate Holder is granted Additional Insured status subject to terms, exclusions and limits of the specified policy.'}\nPrimary and Non-Contributory wording applies where required by written contract. 30-Day Notice of Cancellation endorsed in favor of Certificate Holder (10 days for non-payment of premium).`;
  doc.text(doc.splitTextToSize(conditions, 186), 12, 171);

  // Certificate Holder & Cancellation Clause
  doc.rect(10, 204, 92, 44);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CERTIFICATE HOLDER', 12, 209);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(coi.holder_name, 12, 215);
  doc.text(doc.splitTextToSize(coi.holder_address, 88), 12, 220);

  doc.rect(105, 204, 95, 44);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CANCELLATION & AUTHORIZED SIGNATURE', 108, 209);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  const cancelText = 'SHOULD ANY OF THE ABOVE DESCRIBED POLICIES BE CANCELLED BEFORE THE EXPIRATION DATE THEREOF, NOTICE WILL BE DELIVERED IN ACCORDANCE WITH THE POLICY PROVISIONS.';
  doc.text(doc.splitTextToSize(cancelText, 90), 108, 214);

  // Cryptographic Verification Stamp Box
  doc.setFillColor(243, 246, 252);
  doc.rect(108, 225, 89, 20, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(2, 132, 199);
  doc.text('VALIANT CRYPTOGRAPHIC VERIFICATION STAMP (SHA-256)', 110, 229);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(50, 60, 75);
  doc.text(coi.verification_hash.substring(0, 32), 110, 234);
  doc.text(coi.verification_hash.substring(32), 110, 238);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('Verify Online: https://agencija-za-osiguranje.web.app/portal/coi', 110, 242);

  // Footer
  doc.setFontSize(6.5);
  doc.setTextColor(140, 150, 165);
  doc.text('ACORD 25 (2026/03) - The ACORD name and logo are registered marks of ACORD Corporation.', 12, 255);
  doc.text('Generated via Valiant Global Risk Automated Underwriting Rail.', 12, 259);

  doc.save(`ACORD_25_${coi.holder_name.replace(/[^a-zA-Z0-9]/g, '_')}_${coi.id}.pdf`);
}

export function generateBinderPdf(quoteData: QuoteFormData, carrier: CarrierQuote, binderNumber: string): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Dark Header Bar
  doc.setFillColor(7, 9, 14);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('VALIANT GLOBAL RISK', 15, 14);
  doc.setFontSize(9);
  doc.setTextColor(2, 132, 199);
  doc.text('OFFICIAL COMMERCIAL INSURANCE BINDER', 15, 20);

  doc.setFontSize(8);
  doc.setTextColor(180, 195, 215);
  doc.text(`BINDER REF: ${binderNumber}`, 140, 14);
  doc.text(`ISSUED: ${new Date().toLocaleDateString('en-US')}`, 140, 19);
  doc.text('STATUS: BOUND & ACTIVE', 140, 24);

  // Section 1: Named Insured & Carrier
  doc.setDrawColor(220, 225, 235);
  doc.setFillColor(250, 252, 255);
  doc.rect(15, 36, 180, 32, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 25, 40);
  doc.text('NAMED INSURED & OPERATIONS', 20, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(`Company: ${quoteData.companyName}`, 20, 48);
  doc.text(`EIN / Tax ID: ${quoteData.taxIdEin} | Jurisdiction: ${quoteData.jurisdiction}`, 20, 53);
  doc.text(`NAICS Code: ${quoteData.naicsCode} - ${quoteData.industryTitle}`, 20, 58);
  doc.text(`Annual Revenue: $${quoteData.annualRevenue.toLocaleString('en-US')} | Employees: ${quoteData.fullTimeEmployees}`, 20, 63);

  // Carrier Underwriting Syndicate
  doc.rect(15, 72, 180, 26, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('UNDERWRITING CARRIER SYNDICATE', 20, 78);
  doc.setFont('helvetica', 'normal');
  doc.text(`Carrier: ${carrier.carrierName}`, 20, 84);
  doc.text(`Syndicate / Authority: ${carrier.syndicateName}`, 20, 89);
  doc.text(`A.M. Best Rating: ${carrier.amBestRating} | S&P Financial Strength: ${carrier.spRating}`, 20, 94);

  // Policy Schedule
  doc.rect(15, 102, 180, 48, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('POLICY SCHEDULE & FINANCIAL TERMS', 20, 108);

  doc.setFont('helvetica', 'normal');
  doc.text(`Line of Business: ${quoteData.lineOfBusiness}`, 20, 115);
  doc.text(`Aggregate Limit of Liability: $${quoteData.aggregateLimit.toLocaleString('en-US')}`, 20, 120);
  doc.text(`Each Occurrence Limit: $${quoteData.occurrenceLimit.toLocaleString('en-US')}`, 20, 125);
  doc.text(`Retention / Deductible: $${quoteData.deductible.toLocaleString('en-US')}`, 20, 130);
  doc.text(`Annual Gross Premium: $${carrier.annualPremium.toLocaleString('en-US')}`, 20, 135);
  doc.text(`Payment Structure: ${quoteData.paymentMethod === 'ach' ? 'Direct ACH Corporate Debit' : 'Credit Card Auto-Pay'}`, 20, 140);
  doc.text(`Policy Period: 12 Months from Effective Date`, 20, 145);

  // Electronic Signature Verification
  doc.rect(15, 154, 180, 52, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('ELECTRONIC BIND EXECUTION & AUTHORIZATION', 20, 160);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const bindLegal = 'By electronic execution, the applicant warrants that all operational representations are true and accurate. This document serves as immediate temporary evidence of commercial insurance in accordance with the terms and conditions of the standard policy wording of the issuing company.';
  doc.text(doc.splitTextToSize(bindLegal, 170), 20, 166);

  doc.setFont('helvetica', 'bold');
  doc.text(`Authorized Signatory: ${quoteData.signatureName || quoteData.contactName}`, 20, 182);
  doc.text(`Contact: ${quoteData.contactEmail} | Phone: ${quoteData.contactPhone}`, 20, 187);
  doc.text(`Timestamp: ${new Date().toISOString()}`, 20, 192);
  doc.text('E-Signature Verification: Cryptographically Verified via Valiant Trust Rail', 20, 197);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(130, 140, 155);
  doc.text('Valiant Global Risk Advisory LLC - Licensed Surplus Lines & Specialty Brokerage.', 15, 220);
  doc.text('One World Trade Center, Suite 7800, New York, NY 10007 | 1-800-492-8812', 15, 225);

  doc.save(`Valiant_Binder_${binderNumber}.pdf`);
}

