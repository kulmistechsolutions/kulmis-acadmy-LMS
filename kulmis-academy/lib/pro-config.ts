/**
 * Pro upgrade payment & support config.
 * Set in .env for production: NEXT_PUBLIC_PRO_PAYMENT_NUMBER, etc.
 */
export const proPaymentConfig = {
  companyPaymentNumber:
    process.env.NEXT_PUBLIC_PRO_PAYMENT_NUMBER || "061 123 4567",
  paymentAmount: process.env.NEXT_PUBLIC_PRO_PAYMENT_AMOUNT || "$29",
  instructions:
    process.env.NEXT_PUBLIC_PRO_PAYMENT_INSTRUCTIONS ||
    "Send the payment amount to the company number above. Include your full name or email in the reference. After payment, submit this form with your details and proof image.",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+255 612 345 678",
  /** WhatsApp link (e.g. https://wa.me/255612345678) */
  supportWhatsApp:
    process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ||
    "https://wa.me/255612345678",
};
