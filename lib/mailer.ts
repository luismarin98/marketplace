import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationCode(
  email: string,
  code: string
): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Your Verification Code - Marketplace",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #d81b60; margin-bottom: 16px;">Verification Code</h2>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          You requested a password reset for your Marketplace account. Use the code below to verify your identity:
        </p>
        <div style="background-color: #fce4ec; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #d81b60;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.5;">
          This code expires in 10 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  });
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
