import bwipjs from 'bwip-js';
import { jsPDF } from 'jspdf';
import { AGENCY_DETAILS } from '../content/insurance-data';

export interface Hub3aPaymentData {
  payerName: string;
  payerAddress?: string;
  payerCity?: string;
  recipientName?: string;
  recipientAddress?: string;
  recipientCity?: string;
  recipientIban?: string;
  model?: string;
  callNumber?: string;
  amountEur: number;
  paymentDescription: string;
  purposeCode?: string;
}

export const DEFAULT_AGENCY_PAYMENT = {
  recipientName: 'ŽIVOT d.o.o.',
  recipientAddress: AGENCY_DETAILS.address || 'Junija Palmotića 76',
  recipientCity: '10000 Zagreb',
  recipientIban: 'HR1223600001101234567',
  model: 'HR01',
  purposeCode: 'COST',
};

/**
 * Formats data according to the official Croatian Banking Association HUB 3A standard
 */
export function formatHub3aBarcodeString(data: Hub3aPaymentData): string {
  const amountCents = Math.round(data.amountEur * 100);
  const formattedAmount = amountCents.toString().padStart(15, '0');

  const payerName = (data.payerName || 'Osiguranik').slice(0, 30);
  const payerAddress = (data.payerAddress || 'Ulica i kućni broj').slice(0, 27);
  const payerCity = (data.payerCity || '10000 Zagreb').slice(0, 27);

  const recipientName = (data.recipientName || DEFAULT_AGENCY_PAYMENT.recipientName).slice(0, 25);
  const recipientAddress = (data.recipientAddress || DEFAULT_AGENCY_PAYMENT.recipientAddress).slice(0, 25);
  const recipientCity = (data.recipientCity || DEFAULT_AGENCY_PAYMENT.recipientCity).slice(0, 27);
  const recipientIban = (data.recipientIban || DEFAULT_AGENCY_PAYMENT.recipientIban).replace(/\s+/g, '');

  const model = (data.model || DEFAULT_AGENCY_PAYMENT.model).slice(0, 4);
  const callNumber = (data.callNumber || `2026-${Math.floor(100000 + Math.random() * 900000)}`).slice(0, 22);
  const purposeCode = (data.purposeCode || DEFAULT_AGENCY_PAYMENT.purposeCode).slice(0, 4);
  const paymentDescription = (data.paymentDescription || 'Premija osiguranja').slice(0, 35);

  return [
    'HRVHUB30',
    'EUR',
    formattedAmount,
    payerName,
    payerAddress,
    payerCity,
    recipientName,
    recipientAddress,
    recipientCity,
    recipientIban,
    model,
    callNumber,
    purposeCode,
    paymentDescription,
  ].join('\n');
}

/**
 * Renders the official PDF417 2D barcode to an HTML5 canvas element
 */
export function renderHub3aBarcodeToCanvas(
  canvas: HTMLCanvasElement,
  data: Hub3aPaymentData
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const barcodeText = formatHub3aBarcodeString(data);
      bwipjs.toCanvas(canvas, {
        bcid: 'pdf417',
        text: barcodeText,
        scale: 2,
        height: 12,
        includetext: false,
        textxalign: 'center',
        eclevel: 4,
      } as any);
      resolve();
    } catch (err) {
      console.error('Failed to render HUB 3A PDF417 barcode:', err);
      reject(err);
    }
  });
}

/**
 * Generates an official HUB 3A SEPA payment slip PDF
 */
export async function generateHub3aPaymentSlipPdf(data: Hub3aPaymentData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [210, 99], // Standard Croatian HUB 3A payment slip dimensions (1/3 A4)
  });

  const barcodeString = formatHub3aBarcodeString(data);
  const tempCanvas = document.createElement('canvas');

  await new Promise<void>((resolve, reject) => {
    try {
      bwipjs.toCanvas(tempCanvas, {
        bcid: 'pdf417',
        text: barcodeString,
        scale: 3,
        height: 12,
        includetext: false,
        eclevel: 4,
      } as any);
      resolve();
    } catch (e) {
      reject(e);
    }
  });

  const barcodeImgData = tempCanvas.toDataURL('image/png');

  // Background / Border
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(252, 252, 252);
  doc.rect(5, 5, 200, 89, 'FD');

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 30, 50);
  doc.text('NALOG ZA PLAĆANJE (HUB 3A - SEPA)', 10, 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 110, 120);
  doc.text('Republika Hrvatska • Platni promet u EUR', 140, 12);

  // Divider line
  doc.setDrawColor(220, 220, 220);
  doc.line(10, 14, 200, 14);

  // Payer Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('PLATITELJ:', 10, 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(data.payerName || 'Klijent', 10, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text(data.payerAddress || 'Ulica i kućni broj', 10, 29);
  doc.text(data.payerCity || '10000 Zagreb', 10, 34);

  // Recipient Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('PRIMATELJ:', 10, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(data.recipientName || DEFAULT_AGENCY_PAYMENT.recipientName, 10, 47);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text(data.recipientAddress || DEFAULT_AGENCY_PAYMENT.recipientAddress, 10, 52);
  doc.text(data.recipientCity || DEFAULT_AGENCY_PAYMENT.recipientCity, 10, 57);

  // Payment Details (Right Column)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('VALUTA I IZNOS:', 90, 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`EUR  ${data.amountEur.toFixed(2)} €`, 90, 25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('IBAN PRIMATELJA:', 90, 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.recipientIban || DEFAULT_AGENCY_PAYMENT.recipientIban, 90, 37);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('MODEL I POZIV NA BROJ PRIMATELJA:', 90, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.model || DEFAULT_AGENCY_PAYMENT.model}  ${data.callNumber || '2026-000000'}`, 90, 49);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('OPIS PLAĆANJA:', 90, 56);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(data.paymentDescription || 'Premija osiguranja', 90, 61);

  // Insert 2D PDF417 Barcode on bottom right
  doc.addImage(barcodeImgData, 'PNG', 135, 66, 65, 22);

  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Skenirajte 2D barkod aplikacijom mobilnog bankarstva (m-Zaba, PBZ, George, Keks Pay)', 10, 88);

  const filename = `HUB3A_Uplatnica_${(data.callNumber || '2026').replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
