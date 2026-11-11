import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { envVars } from "../config/env";

const port = Number(envVars.SMTP.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: envVars.SMTP.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: envVars.SMTP.SMTP_USER, pass: envVars.SMTP.SMTP_PASS },
});

const APP_NAME = "BCH BLAZE";
const TAGLINE = "Build fast. Pay instantly. Powered by Bitcoin Cash.";
const EXPIRY_MINUTES = 10;

const LOGO_CID = "bch-blaze-logo";
const LOGO_PATH = path.join(process.cwd(), "assets", "email-logo.png");
const hasLogo = fs.existsSync(LOGO_PATH);

const C = {
  page: "#eef4f2",
  card: "#ffffff",
  border: "#dbe5e1",
  tile: "#f6faf8",
  title: "#0f1a17",
  text: "#374151",
  muted: "#6b7280",
  green: "#0ac18e",
  greenDeep: "#047857",
  greenDark: "#078a66",
  greenSoft: "#e6f9f2",
  greenBorder: "#a7e8d2",
  cyan: "#22d3ee",
  warn: "#92400e",
  warnBorder: "#f59e0b",
  warnBg: "#fffbeb",
};

const font = "'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const mono = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";
const gradient = `linear-gradient(135deg,${C.greenDeep} 0%,${C.green} 62%,${C.cyan} 100%)`;

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const logoMark = hasLogo
  ? `<td width="40" style="width:40px">
       <img src="cid:${LOGO_CID}" width="40" height="40" alt="${APP_NAME}" style="display:block;width:40px;height:40px;border:0;border-radius:10px" />
     </td>`
  : `<td width="40" height="40" align="center" bgcolor="${C.green}" style="width:40px;height:40px;border-radius:12px;background:${C.green};font-family:${font};font-size:22px;font-weight:800;color:#ffffff;line-height:40px">&#8383;</td>`;

const step = (n: number, label: string) => `
  <tr>
    <td width="30" valign="top" style="padding:6px 0">
      <div style="width:24px;height:24px;line-height:24px;border-radius:50%;background:${C.green};font-family:${font};font-size:12px;font-weight:800;text-align:center;color:#ffffff">${n}</div>
    </td>
    <td valign="middle" style="padding:6px 0 6px 8px;font-family:${font};font-size:14px;line-height:1.5;color:${C.text}">${label}</td>
  </tr>`;

const infoTile = (label: string, value: string) => `
  <td width="33%" valign="top" style="padding:0 4px">
    <div style="padding:12px 12px;border:1px solid ${C.border};border-radius:12px;background:${C.tile};text-align:left">
      <div style="font-family:${font};font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:${C.muted}">${label}</div>
      <div style="margin-top:5px;font-family:${font};font-size:13px;font-weight:700;color:${C.title}">${value}</div>
    </div>
  </td>`;

const renderResetEmail = (otp: string, to: string) => {
  const code = escapeHtml(otp);
  const requestedAt = `${new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  })} UTC`;
  const loginUrl = `${envVars.FRONTEND_ORIGIN}/login`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>Reset your password</title>
  <style>
    /* Apple Mail animates this; Gmail and Outlook show it static */
    @keyframes riseIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    @keyframes slideBar { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
    @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,.55); } 50% { box-shadow: 0 0 0 10px rgba(255,255,255,0); } }
    .card { animation: riseIn .7s ease-out both; }
    .bar { background-size: 200% 100%; animation: slideBar 3s linear infinite; }
    .lock { animation: pulse 2.4s ease-out infinite; }
    @media (prefers-reduced-motion: reduce) { .card, .bar, .lock { animation: none !important; } }
    @media only screen and (max-width: 480px) {
      .code { font-size: 32px !important; letter-spacing: 6px !important; padding: 16px 8px 16px 14px !important; }
      .pad { padding-left: 18px !important; padding-right: 18px !important; }
      .h1 { font-size: 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">
    Your code is ${code}. It expires in ${EXPIRY_MINUTES} minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.page}" style="background:${C.page}">
    <tr>
      <td align="center" style="padding:36px 12px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

          <!-- brand -->
          <tr>
            <td align="center" style="padding-bottom:20px">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  ${logoMark}
                  <td style="padding-left:11px;font-family:${font};font-size:20px;font-weight:800;color:${C.title};letter-spacing:2px">${APP_NAME}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- card -->
          <tr>
            <td class="card" bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.border};border-radius:24px;overflow:hidden;box-shadow:0 18px 44px rgba(7,60,45,.12)">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <!-- hero -->
                <tr>
                  <td class="pad" align="center" bgcolor="${C.green}" style="padding:38px 32px 34px;background-color:${C.green};background-image:${gradient}">
                    <div class="lock" style="display:inline-block;width:60px;height:60px;line-height:60px;border-radius:50%;background:#ffffff;font-size:28px;text-align:center;box-shadow:0 8px 20px rgba(4,70,50,.35)">&#128274;</div>
                    <div style="margin-top:16px">
                      <span style="display:inline-block;padding:4px 12px;border:1px solid rgba(255,255,255,.55);border-radius:999px;background:rgba(255,255,255,.16);font-family:${font};font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#ffffff">Account security</span>
                    </div>
                    <h1 class="h1" style="margin:14px 0 8px;font-family:${font};font-size:30px;line-height:1.2;font-weight:800;color:#ffffff">
                      Reset your password
                    </h1>
                    <p style="margin:0;font-family:${font};font-size:15px;line-height:1.65;color:#eafff7">
                      Someone asked to reset the password for<br />
                      <strong style="color:#ffffff">${escapeHtml(to)}</strong>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="bar" height="4" style="height:4px;line-height:4px;font-size:0;background-color:${C.green};background-image:linear-gradient(90deg,${C.green},${C.cyan},${C.green})">&nbsp;</td>
                </tr>

                <!-- code panel -->
                <tr>
                  <td align="center" style="padding:32px 20px 4px">
                    <div style="font-family:${font};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.greenDark}">Your verification code</div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:12px 20px 6px">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:100%">
                      <tr>
                        <td bgcolor="${C.green}" style="padding:2px;border-radius:18px;background-color:${C.green};background-image:${gradient}">
                          <div class="code" style="display:block;padding:20px 12px 20px 26px;border-radius:16px;background:${C.greenSoft};font-family:${mono};font-size:42px;font-weight:800;letter-spacing:11px;line-height:1;text-align:center;color:${C.title};-webkit-user-select:all;user-select:all">${code}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:14px 32px 26px">
                    <span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${C.warnBg};border:1px solid #fde68a;font-family:${font};font-size:12px;font-weight:700;color:${C.warn}">&#9201; Expires in ${EXPIRY_MINUTES} minutes</span>
                    <p style="margin:12px 0 0;font-family:${font};font-size:13px;line-height:1.6;color:${C.text}">
                      <strong style="color:${C.title}">Tap the code</strong> to select it, then choose Copy.
                    </p>
                  </td>
                </tr>

                <!-- steps -->
                <tr>
                  <td class="pad" style="padding:0 32px 22px">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.border};border-radius:16px;background:${C.tile}">
                      <tr>
                        <td style="padding:12px 18px">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            ${step(1, "Copy the code above")}
                            ${step(2, `Return to the ${APP_NAME} reset form`)}
                            ${step(3, "Paste it and choose a new password")}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- info tiles -->
                <tr>
                  <td class="pad" style="padding:0 28px 24px">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        ${infoTile("Valid for", `${EXPIRY_MINUTES} min`)}
                        ${infoTile("Usage", "One-time")}
                        ${infoTile("Requested", requestedAt)}
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- button -->
                <tr>
                  <td align="center" style="padding:0 32px 26px">
                    <a href="${loginUrl}" target="_blank" rel="noopener"
                       style="display:inline-block;padding:13px 30px;border:2px solid ${C.green};border-radius:12px;font-family:${font};font-size:14px;font-weight:700;color:${C.greenDark};text-decoration:none">
                      Open ${APP_NAME} &rarr;
                    </a>
                  </td>
                </tr>

                <!-- warning -->
                <tr>
                  <td class="pad" style="padding:0 32px 34px">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fde68a;border-left:4px solid ${C.warnBorder};border-radius:12px;background:${C.warnBg}">
                      <tr>
                        <td style="padding:14px 16px;font-family:${font};font-size:13px;line-height:1.65;color:${C.warn}">
                          <strong>Never share this code.</strong>
                          ${APP_NAME} will never ask for it by chat, email or phone.
                          Didn't request a reset? Ignore this email, your password stays unchanged.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td align="center" style="padding:26px 16px 0">
              <p style="margin:0 0 6px;font-family:${font};font-size:13px;font-weight:700;color:${C.text}">${TAGLINE}</p>
              <p style="margin:0;font-family:${font};font-size:12px;line-height:1.7;color:${C.muted}">
                This is an automated message, please don't reply.<br />
                &copy; ${new Date().getFullYear()} ${APP_NAME}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const sendResetOtpEmail = (to: string, otp: string) =>
  transporter.sendMail({
    from: envVars.SMTP.SMTP_FROM,
    to,
    subject: `${otp} is your ${APP_NAME} reset code`,
    headers: { "Auto-Submitted": "auto-generated" },
    attachments: hasLogo ? [{ filename: "logo.png", path: LOGO_PATH, cid: LOGO_CID }] : [],
    text: [
      `Reset your ${APP_NAME} password`,
      ``,
      `Your verification code: ${otp}`,
      `It expires in ${EXPIRY_MINUTES} minutes and works only once.`,
      ``,
      `Never share this code with anyone.`,
      `If you did not request this, you can safely ignore this email.`,
    ].join("\n"),
    html: renderResetEmail(otp, to),
  });