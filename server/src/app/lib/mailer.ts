import nodemailer from "nodemailer";
import { envVars } from "../config/env";

const port = Number(envVars.SMTP.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: envVars.SMTP.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: envVars.SMTP.SMTP_USER, pass: envVars.SMTP.SMTP_PASS },
});

export const sendResetOtpEmail = (to: string, otp: string) =>
  transporter.sendMail({
    from: envVars.SMTP.SMTP_FROM,
    to,
    subject: "Your password reset code",
    text: `Your password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto">
        <h2>Reset your password</h2>
        <p>Use this code to reset your password:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:bold">${otp}</p>
        <p>It expires in 10 minutes. If you did not request this, you can ignore this email.</p>
      </div>`,
  });