import nodemailer from "nodemailer";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
const FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || "noreply@kulmisacademy.com";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.error("[Email] SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.");
    return false;
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || APP_URL;
  const fullLink = resetLink.startsWith("http") ? resetLink : `${baseUrl}${resetLink}`;
  try {
    await transport.sendMail({
      from: FROM,
      to: email,
      subject: "Reset Your Kulmis Academy Password",
      text: `We received a request to reset your password.\n\nClick the link below to set a new password:\n\n${fullLink}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <p>We received a request to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <p><a href="${fullLink}">${fullLink}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `.trim(),
    });
    return true;
  } catch (err) {
    console.error("[Email] Send failed:", err);
    return false;
  }
}

export async function sendTemporaryPasswordEmail(
  email: string,
  temporaryPassword: string
): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.error("[Email] SMTP not configured.");
    return false;
  }
  const signInUrl = `${process.env.NEXT_PUBLIC_APP_URL || APP_URL}/sign-in`;
  try {
    await transport.sendMail({
      from: FROM,
      to: email,
      subject: "Your Kulmis Academy Temporary Password",
      text: `An administrator has set a temporary password for your account.\n\nTemporary password: ${temporaryPassword}\n\nPlease sign in at ${signInUrl} and change your password in Dashboard → Security.\n\nDo not share this email.`,
      html: `
        <p>An administrator has set a temporary password for your account.</p>
        <p><strong>Temporary password:</strong> <code>${temporaryPassword}</code></p>
        <p>Please <a href="${signInUrl}">sign in</a> and change your password in Dashboard → Security.</p>
        <p>Do not share this email.</p>
      `.trim(),
    });
    return true;
  } catch (err) {
    console.error("[Email] Send failed:", err);
    return false;
  }
}
