import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

const LANDSCAPE_WIDTH = 842;
const LANDSCAPE_HEIGHT = 595;
const MARGIN = 50;
const ACCENT = { r: 0, g: 0.94, b: 1 }; // #00F0FF neon blue
const GOLD = { r: 0.85, g: 0.65, b: 0.13 };
const TEXT = { r: 0.11, g: 0.12, b: 0.16 };
const MUTED = { r: 0.58, g: 0.64, b: 0.72 };

export type CertificateData = {
  fullName: string;
  courseTitle: string;
  completionDate: Date;
  certificateId: string;
  verifyUrl: string;
};

export async function generateCertificatePDF(data: CertificateData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([LANDSCAPE_WIDTH, LANDSCAPE_HEIGHT]);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const w = page.getWidth();
  const h = page.getHeight();

  // Subtle gradient-like background (light band at top)
  page.drawRectangle({
    x: 0,
    y: h - 120,
    width: w,
    height: 120,
    color: rgb(0.96, 0.97, 0.98),
  });

  // Accent line under header
  page.drawLine({
    start: { x: MARGIN, y: h - 95 },
    end: { x: w - MARGIN, y: h - 95 },
    thickness: 2,
    color: rgb(ACCENT.r, ACCENT.g, ACCENT.b),
  });

  // Kulmis Academy
  page.drawText("Kulmis Academy", {
    x: w / 2 - helveticaBold.widthOfTextAtSize("Kulmis Academy", 24) / 2,
    y: h - 70,
    size: 24,
    font: helveticaBold,
    color: rgb(TEXT.r, TEXT.g, TEXT.b),
  });

  // Certificate of Completion
  page.drawText("Certificate of Completion", {
    x: w / 2 - helveticaBold.widthOfTextAtSize("Certificate of Completion", 18) / 2,
    y: h - 115,
    size: 18,
    font: helveticaBold,
    color: rgb(TEXT.r, TEXT.g, TEXT.b),
  });

  // Body text
  const bodyY = h - 220;
  page.drawText("This is to certify that", {
    x: w / 2 - helvetica.widthOfTextAtSize("This is to certify that", 12) / 2,
    y: bodyY,
    size: 12,
    font: helvetica,
    color: rgb(MUTED.r, MUTED.g, MUTED.b),
  });

  page.drawText(data.fullName, {
    x: w / 2 - helveticaBold.widthOfTextAtSize(data.fullName, 20) / 2,
    y: bodyY - 36,
    size: 20,
    font: helveticaBold,
    color: rgb(TEXT.r, TEXT.g, TEXT.b),
  });

  page.drawText("has successfully completed the course", {
    x: w / 2 - helvetica.widthOfTextAtSize("has successfully completed the course", 12) / 2,
    y: bodyY - 64,
    size: 12,
    font: helvetica,
    color: rgb(MUTED.r, MUTED.g, MUTED.b),
  });

  page.drawText(data.courseTitle, {
    x: w / 2 - helveticaBold.widthOfTextAtSize(data.courseTitle, 16) / 2,
    y: bodyY - 96,
    size: 16,
    font: helveticaBold,
    color: rgb(ACCENT.r, ACCENT.g, ACCENT.b),
  });

  page.drawText("at Kulmis Academy, demonstrating dedication and mastery of the subject.", {
    x: w / 2 - helvetica.widthOfTextAtSize("at Kulmis Academy, demonstrating dedication and mastery of the subject.", 10) / 2,
    y: bodyY - 120,
    size: 10,
    font: helvetica,
    color: rgb(MUTED.r, MUTED.g, MUTED.b),
  });

  // Footer line
  page.drawLine({
    start: { x: MARGIN, y: 140 },
    end: { x: w - MARGIN, y: 140 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.92),
  });

  const dateStr = data.completionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  page.drawText(`Date: ${dateStr}`, {
    x: MARGIN,
    y: 115,
    size: 10,
    font: helvetica,
    color: rgb(MUTED.r, MUTED.g, MUTED.b),
  });
  page.drawText(`Certificate ID: ${data.certificateId}`, {
    x: MARGIN,
    y: 95,
    size: 9,
    font: helvetica,
    color: rgb(MUTED.r, MUTED.g, MUTED.b),
  });

  // Signature line
  page.drawText("Authorized Signature", {
    x: w - MARGIN - 120,
    y: 115,
    size: 9,
    font: helvetica,
    color: rgb(MUTED.r, MUTED.g, MUTED.b),
  });
  page.drawLine({
    start: { x: w - MARGIN - 120, y: 108 },
    end: { x: w - MARGIN, y: 108 },
    thickness: 0.5,
    color: rgb(TEXT.r, TEXT.g, TEXT.b),
  });

  // QR code
  const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, { width: 80, margin: 0 });
  const b64 = qrDataUrl.split(",")[1];
  if (b64) {
    const qrBytes = new Uint8Array(Buffer.from(b64, "base64"));
    const qrImage = await doc.embedPng(qrBytes);
    page.drawImage(qrImage, {
      x: w / 2 - 40,
      y: 30,
      width: 80,
      height: 80,
    });
  }
  page.drawText("Verify at kulmisacademy.com/verify/" + data.certificateId, {
    x: w / 2 - helvetica.widthOfTextAtSize("Verify at kulmisacademy.com/verify/" + data.certificateId, 8) / 2,
    y: 18,
    size: 8,
    font: helvetica,
    color: rgb(MUTED.r, MUTED.g, MUTED.b),
  });

  return doc.save();
}
