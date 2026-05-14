const bcrypt = require("bcryptjs");
const { Resend } = require("resend");
const speakeasy = require("speakeasy");

// ─── BCRYPT ──────────────────────────────────────────────────────────────────
const salt = bcrypt.genSaltSync(10);
const secret = speakeasy.generateSecret({ length: 4 });

const hashPassword = (password) => bcrypt.hashSync(password, salt);
const compareHashedPassword = (hashedPassword, password) =>
  bcrypt.compareSync(password, hashedPassword);

// ─── RESEND CLIENT ───────────────────────────────────────────────────────────
// Add RESEND_API_KEY to your .env  →  RESEND_API_KEY=re_xxxxxxxxxxxx
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM     = process.env.EMAIL_FROM    || "aureliusmint <noreply@aureliusmint.com>";
const SUPPORT  = "support@aureliusmint.com";

// ─── SHARED UTILITIES ────────────────────────────────────────────────────────

/**
 * Low-level send wrapper.
 * Throws on hard failures so callers can catch/log if needed.
 */
async function sendEmail({ to, subject, html }) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });

  if (error) {
    console.error("[Resend] send error:", error);
    throw new Error(error.message);
  }

  console.log("[Resend] sent:", data?.id, "→", to);
  return data;
}

/**
 * Branded dark-mode wrapper used by most emails.
 */
const template = (title, body) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b0e11;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#1e2329;border-radius:12px;border:1px solid #ffd70033;
                    box-shadow:0 0 20px rgba(255,215,0,0.15);">
        <tr>
          <td align="center" style="padding:30px 30px 0;">
            <img src="https://res.cloudinary.com/dsyjlantq/image/upload/v1749240354/ccsoio9nyu9ne97exriv.png"
                 alt="aureliusmint" width="130" style="display:block;" />
          </td>
        </tr>
        <tr>
          <td style="padding:24px 30px 0;">
            <h2 style="margin:0 0 16px;color:#f0b90b;font-size:1.5em;">${title}</h2>
            <div style="color:#eaecef;font-size:0.95em;line-height:1.65;">
              ${body}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 30px;">
            <p style="margin:0;color:#eaecef;">Best regards,</p>
            <p style="margin:4px 0 0;color:#f0b90b;font-weight:bold;">aureliusmint Team</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0 30px 24px;color:#555;font-size:0.8em;">
            This is an automated message — please do not reply.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

/** Dark info-box used inside emails */
const infoBox = (rows, borderColor = "#f0b90b") => `
<div style="background:#2b3139;padding:20px;border-radius:10px;margin:16px 0;
            border-left:4px solid ${borderColor};">
  ${rows}
</div>`;

/** Single row inside an info-box */
const row = (label, value) =>
  `<p style="margin:6px 0;"><strong>${label}:</strong> ${value}</p>`;

// ─── AUTH / ONBOARDING ───────────────────────────────────────────────────────

const sendWelcomeEmail = ({ to, otp }) =>
  sendEmail({
    to,
    subject: "Welcome to aureliusmint — Verify Your Account",
    html: template(
      "Welcome to aureliusmint 🎨",
      `<p>Hello <strong>Esteemed</strong>,</p>
       <p>Thank you for signing up. Explore, create, and purchase amazing digital artwork.</p>
       ${infoBox(`
         <p style="margin:0 0 8px;">Your one-time verification code:</p>
         <p style="font-size:2em;letter-spacing:6px;color:#f0b90b;margin:0;text-align:center;">
           ${otp}
         </p>
         <p style="color:#8a8a8a;margin:10px 0 0;text-align:center;font-size:0.85em;">
           Expires in 5 minutes — do not share.
         </p>`)}
       <p>Get started by visiting your Dashboard.</p>`
    ),
  });

const sendRegOtp = ({ to, otp }) =>
  sendEmail({
    to,
    subject: "aureliusmint — Account Verification",
    html: template(
      "Verify Your Account",
      `<p>Your OTP is:</p>
       ${infoBox(`
         <p style="font-size:2em;letter-spacing:6px;color:#f0b90b;margin:0;text-align:center;">
           ${otp}
         </p>
         <p style="color:#8a8a8a;margin:10px 0 0;text-align:center;font-size:0.85em;">
           Valid for a short period. Do not share.
         </p>`)}
       <p>If you did not request this OTP, please ignore this email.</p>`
    ),
  });

const resendWelcomeEmail = ({ to }) => {
  const otp = speakeasy.totp({ secret: secret.base32, encoding: "base32" });
  return sendEmail({
    to,
    subject: "aureliusmint — Confirm Your Email",
    html: template(
      "Confirm Your Email Address",
      `<p>Let us know this is really your email to keep your account secure.</p>
       ${infoBox(`
         <p style="font-size:2em;letter-spacing:6px;color:#f0b90b;margin:0;text-align:center;">
           ${otp}
         </p>`)}
       <p>If you did not request this, you can safely ignore this email.</p>`
    ),
  });
};

const sendPasswordOtp = ({ to }) => {
  const otp = speakeasy.totp({ secret: secret.base32, encoding: "base32" });
  return sendEmail({
    to,
    subject: "aureliusmint — Password Reset OTP",
    html: template(
      "Reset Your Password",
      `<p>Use the OTP below to reset your password.</p>
       ${infoBox(`
         <p style="font-size:2em;letter-spacing:6px;color:#f0b90b;margin:0;text-align:center;">
           ${otp}
         </p>
         <p style="color:#8a8a8a;margin:10px 0 0;text-align:center;font-size:0.85em;">
           Do not share this code.
         </p>`)}
       <p>If you did not request a reset, please contact support immediately.</p>`
    ),
  });
};

const resetEmail = ({ to }) => {
  const otp = speakeasy.totp({ secret: secret.base32, encoding: "base32" });
  return sendEmail({
    to,
    subject: "aureliusmint — Change Password",
    html: template(
      "Change Your Password",
      `<p>You have requested to change your password. Use the OTP below to proceed.</p>
       ${infoBox(`
         <p style="font-size:2em;letter-spacing:6px;color:#f0b90b;margin:0;text-align:center;">
           ${otp}
         </p>`)}
       <p>If you did not request this, please contact support immediately.</p>`
    ),
  });
};

const sendForgotPasswordEmail = (email) =>
  sendEmail({
    to: email,
    subject: "aureliusmint — Password Reset",
    html: template(
      "Forgot Your Password?",
      `<p>We received a request to reset your password.</p>
       ${infoBox(
         `<p style="margin:0;text-align:center;">
            <a href="https://aureliusmint.com/reset-password"
               style="display:inline-block;background:#f0b90b;color:#0b0e11;padding:12px 28px;
                      border-radius:6px;text-decoration:none;font-weight:bold;">
              Reset Password
            </a>
          </p>`
       )}
       <p>If you did not make this request, please ignore this email.</p>`
    ),
  });

const sendValidationOtp = ({ to, otp }) =>
  sendEmail({
    to,
    subject: "aureliusmint — Verify Your Email",
    html: template(
      "Verify Your Email",
      `<p>Welcome to aureliusmint! Use the code below to complete your registration:</p>
       ${infoBox(`
         <p style="font-size:2em;letter-spacing:6px;color:#f0b90b;margin:0;text-align:center;">
           ${otp}
         </p>
         <p style="color:#8a8a8a;margin:10px 0 0;text-align:center;font-size:0.85em;">
           Expires in 5 minutes
         </p>`)}
       <p>If you didn't request this, please ignore this email.</p>`
    ),
  });

const sendUserDetails = ({ to, password, name }) =>
  sendEmail({
    to,
    subject: "aureliusmint — Your Login Details",
    html: template(
      `Hello ${name}`,
      `<p>Thank you for registering. Your login information:</p>
       ${infoBox(`
         ${row("Email", to)}
         ${row("Password", password)}`)}
       <p>If you did not authorise this registration, contact support immediately.</p>`
    ),
  });

// ─── ADMIN ALERTS ────────────────────────────────────────────────────────────

const userRegisteration = ({ name, email }) =>
  sendEmail({
    to: SUPPORT,
    subject: "New User Registration",
    html: template(
      "New Sign-Up 🆕",
      `<p>Hello Chief,</p>
       ${infoBox(`
         ${row("Name", name)}
         ${row("Email", email)}`)}
       <p>Visit your dashboard to review and confirm.</p>`
    ),
  });

const sendVerificationEmail = ({ from, url }) =>
  sendEmail({
    to: SUPPORT,
    subject: "Account Verification Notification",
    html: template(
      "Identity Verification",
      `<p>Hello Chief,</p>
       <p><strong>${from}</strong> just submitted their identity verification.</p>
       ${infoBox(
         `<p style="margin:0;text-align:center;">
            <a href="${url}"
               style="display:inline-block;background:#f0b90b;color:#0b0e11;padding:10px 24px;
                      border-radius:6px;text-decoration:none;font-weight:bold;">
              View Document
            </a>
          </p>`
       )}`
    ),
  });

const sendKycAlert = ({ name }) =>
  sendEmail({
    to: SUPPORT,
    subject: "New Artwork Submission",
    html: template(
      "Artwork Submitted",
      `<p>Hello Chief,</p>
       <p><strong>${name}</strong> just submitted an artwork.</p>
       <p>Kindly check your dashboard to view the details.</p>`
    ),
  });

// ─── DEPOSITS ────────────────────────────────────────────────────────────────

/** Admin notification of a deposit request */
const sendDepositEmail = ({ from, amount, timestamp }) =>
  sendEmail({
    to: SUPPORT,
    subject: "Deposit Notification",
    html: template(
      "New Deposit Request 💰",
      `<p>Hello,</p>
       ${infoBox(`
         ${row("User", from)}
         ${row("Amount", amount)}
         ${row("Timestamp", timestamp)}`)}
       <p>Please remember to update their dashboard.</p>`
    ),
  });

/** User confirmation of their own deposit request */
const sendUserDepositEmail = ({ from, amount, to, timestamp }) =>
  sendEmail({
    to,
    subject: "Deposit Request Received",
    html: template(
      "New Deposit Request",
      `<p>Hello <strong>${from}</strong>,</p>
       ${infoBox(`
         ${row("From", from)}
         ${row("Amount", `$${amount}`)}
         ${row("Timestamp", timestamp)}`)}
       <p>Our team will review and process your deposit request shortly.</p>`
    ),
  });

/** User confirmation after admin approves deposit */
const sendDepositApproval = ({ from, amount, method, timestamp, to }) =>
  sendEmail({
    to,
    subject: "Deposit Approved ✅",
    html: template(
      "Deposit Approved",
      `<p>Hello <strong>${from}</strong>,</p>
       <p>Your deposit has been approved!</p>
       ${infoBox(`
         ${row("Amount", amount)}
         ${row("Method", method)}
         ${row("Timestamp", timestamp)}`)}
       <p>Visit your dashboard for more information.</p>`
    ),
  });

// ─── WITHDRAWALS ─────────────────────────────────────────────────────────────

/** Admin alert about a withdrawal request */
const sendWithdrawalRequestEmail = ({ from, amount }) =>
  sendEmail({
    to: SUPPORT,
    subject: "Withdrawal Request",
    html: template(
      "Withdrawal Request 📤",
      `<p>Hello Chief,</p>
       ${infoBox(`
         ${row("User", from)}
         ${row("Amount", `${amount} ETH`)}`)}
       <p>Please review on the admin dashboard.</p>`
    ),
  });

/** User confirmation that their withdrawal is being processed */
const sendWithdrawalEmail = ({ from, amount }) =>
  sendEmail({
    to: from,
    subject: "Withdrawal Request Received",
    html: template(
      "Withdrawal Notification",
      `<p>Hello Esteemed,</p>
       <p>You have placed a withdrawal request for:</p>
       ${infoBox(`${row("Amount", `${amount} ETH`)}`)}
       <p>Your request is being processed. You will receive a confirmation once completed.</p>`
    ),
  });

// ─── ARTWORKS ────────────────────────────────────────────────────────────────

const sendArtworkListingEmailToAdmin = ({ from, artworkTitle, price, timestamp }) =>
  sendEmail({
    to: SUPPORT,
    subject: "New Artwork Listed",
    html: template(
      "New Artwork Listing 🖼️",
      `<p>Hello Admin,</p>
       <p>User <strong>${from}</strong> has listed a new artwork:</p>
       ${infoBox(`
         ${row("Title", artworkTitle)}
         ${row("Price", price)}
         ${row("Timestamp", timestamp)}`)}`,
    ),
  });

const sendArtworkListingEmailToUser = ({ to, artworkTitle, price, timestamp }) =>
  sendEmail({
    to,
    subject: "Your Artwork Has Been Listed",
    html: template(
      "Artwork Listed Successfully 🎉",
      `${infoBox(`
         ${row("Title", artworkTitle)}
         ${row("Price", price)}
         ${row("Listing Fee", "0.5")}
         ${row("Timestamp", timestamp)}`)}
       <p>Your artwork is now visible to potential buyers!</p>`
    ),
  });

const sendArtworkListedEmail = ({ to, artworkTitle, price, timestamp }) =>
  sendArtworkListingEmailToUser({ to, artworkTitle, price, timestamp });

const sendArtworkSoldEmailToOwner = ({ to, artworkName, bidAmount, bidderName, timestamp }) =>
  sendEmail({
    to,
    subject: "Your Artwork Has Been Sold! 🎊",
    html: template(
      "Artwork Sold Successfully!",
      `<p>Congratulations! Your artwork has been sold.</p>
       ${infoBox(`
         ${row("Artwork", artworkName)}
         ${row("Sold For", bidAmount)}
         ${row("Buyer", bidderName)}
         ${row("Transaction Time", timestamp)}`)}
       <p>The funds will be credited to your account shortly.</p>`
    ),
  });

const sendArtworkPurchaseEmailToBidder = ({ to, artworkName, bidAmount, ownerName, timestamp }) =>
  sendEmail({
    to,
    subject: "Artwork Purchase Confirmation 🖼️",
    html: template(
      "Purchase Successful!",
      `<p>Congratulations on your new acquisition!</p>
       ${infoBox(`
         ${row("Artwork", artworkName)}
         ${row("Purchase Amount", bidAmount)}
         ${row("Original Creator", ownerName)}
         ${row("Purchase Time", timestamp)}`)}
       <p>The artwork has been added to your collection.</p>`
    ),
  });

// ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────

const sendUserPlanEmail = ({ from, subamount, to, subname, timestamp }) =>
  sendEmail({
    to,
    subject: "Subscription Confirmation",
    html: template(
      "Plan Activated",
      `<p>Hello <strong>${from}</strong>,</p>
       ${infoBox(`
         ${row("Plan", subname)}
         ${row("Amount", `$${subamount}`)}
         ${row("Timestamp", timestamp)}`)}
       <p>Your plan is now active. Visit your dashboard to get started.</p>`
    ),
  });

// ─── EXPORTS ─────────────────────────────────────────────────────────────────
module.exports = {
  hashPassword,
  compareHashedPassword,

  // Auth / onboarding
  sendWelcomeEmail,
  sendRegOtp,
  resendWelcomeEmail,
  sendPasswordOtp,
  resetEmail,
  sendForgotPasswordEmail,
  sendValidationOtp,
  sendUserDetails,

  // Admin alerts
  userRegisteration,
  sendVerificationEmail,
  sendKycAlert,

  // Deposits
  sendDepositEmail,
  sendUserDepositEmail,
  sendDepositApproval,

  // Withdrawals
  sendWithdrawalRequestEmail,
  sendWithdrawalEmail,

  // Artworks
  sendArtworkListingEmailToAdmin,
  sendArtworkListingEmailToUser,
  sendArtworkListedEmail,
  sendArtworkSoldEmailToOwner,
  sendArtworkPurchaseEmailToBidder,

  // Subscriptions
  sendUserPlanEmail,
};