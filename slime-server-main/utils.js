const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const axios = require("axios");
var nodemailer = require("nodemailer");
const speakeasy = require('speakeasy');

const secret = speakeasy.generateSecret({ length: 4 });


const hashPassword = (password) => {
   console.log('Password to hash:', password);  // Log password before hashing
 
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const compareHashedPassword = (hashedPassword, password) => {
  const isSame = bcrypt.compareSync(password, hashedPassword);
  return isSame;
};




// const sendDepositEmail = async ({ from, amount, method,timestamp}) => {
//   let transporter = nodemailer.createTransport({
//     host: "mail.privateemail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER, // generated ethereal user
//       pass: process.env.EMAIL_PASSWORD, // generated ethereal password
//     },
//   });

//   let info = await transporter.sendMail({
//     from: `${process.env.EMAIL_USER}`, // sender address
//     to: "support@Blurmint.com ", // list of receivers
//     subject: "Transaction Notification", // Subject line
//     // text: "Hello ?", // plain text body
//     html: `



const sendWithdrawalRequestEmail = async ({  from, amount, method,address }) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Blurmint.com ", // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello Chief</p>

    <p>${from} just applied to withdraw ${amount}ETH.
    </p>

    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const userRegisteration = async ({  name,email}) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Blurmint.com ", // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello Chief</p>

    <p>${name} with email ${email} just signed up.Please visit your dashboard for confirmation.
    </p>

    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};


const sendWithdrawalEmail = async ({  to,address, amount, method,timestamp,from }) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: from, // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

   <html>
  <body style="background-color: #0b0e11; color: #eaecef; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border: 1px solid #ffd70044;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://res.cloudinary.com/dsyjlantq/image/upload/v1747381149/opro9wihdbyfjjugv8ft.png" alt="Logo" style="width: 140px;" />
      </div>
      <h2 style="color: #f0b90b; font-size: 1.6em;">Withdrawal Notification</h2>
      <p>Hello Esteemed,</p>
      <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <p>You have placed a withdrawal request for:</p>
        <p><strong>Amount:</strong> ${amount}ETH</p>
      </div>
      <p style="background-color: #2b3139; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f0b90b;">
        Your request is being processed. You will receive a confirmation once completed.
      </p>
      <p>Best regards,</p>
      <p style="color: #f0b90b;">Blurmint Team</p>
    </div>
  </body>
</html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};


const sendDepositEmail = async ({ from, amount, to, timestamp }) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`,
    to: "support@Blurmint.com",
    subject: "Deposit Notification",
    html: `
    <html>
      <body style="background-color: #0b0e11; color: #eaecef; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border: 1px solid #ffd70044;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/dsyjlantq/image/upload/v1747381149/opro9wihdbyfjjugv8ft.png" alt="Logo" style="width: 140px;" />
          </div>
          <h2 style="color: #f0b90b; font-size: 1.6em;">Deposit Notification</h2>
          <p>Hello,</p>
          <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p>Your just received a deposit request from;</p>
            <p><strong>User:</strong> ${from}</p>
            <p><strong>Amount:</strong> ${amount}</p>
              <p><strong>Timestamp:</strong> ${timestamp}</p>
          </div>
          <p style="background-color: #2b3139; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f0b90b;">
            Please remember to update their dashboard.
          </p>
          <p>Best regards,</p>
          <p style="color: #f0b90b;">Blurmint Team</p>
        </div>
      </body>
    </html>
    `
  });

  console.log("Message sent: %s", info.messageId);
};

const sendUserDepositEmail = async ({ from, amount, to, timestamp }) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`,
    to: to,
    subject: "New Deposit Request",
    html: `
    <html>
      <body style="background-color: #0b0e11; color: #eaecef; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border: 1px solid #ffd70044;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/dsyjlantq/image/upload/v1747381149/opro9wihdbyfjjugv8ft.png" alt="Logo" style="width: 140px;" />
          </div>
          <h2 style="color: #f0b90b; font-size: 1.6em;">New Deposit Request</h2>
          <p>Hello ${from},</p>
          <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p>A new deposit request has just been sent by you:</p>
            <p><strong>From:</strong> ${from}</p>
            <p><strong>Amount:</strong> $${amount}</p>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
          </div>
          <p>Our Team will review and process this deposit request.</p>
          <p>Best regards,</p>
          <p style="color: #f0b90b;">Blurmint Team</p>
        </div>
      </body>
    </html>
    `
  });

  console.log("Message sent: %s", info.messageId);
};

const sendDepositApproval = async ({  from, amount, method,timestamp,to}) => {
  
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello ${from}</p>

    <p>Your deposit of ${amount} of ${method} has been approved.</p>
    <p>Kindly visit your dashboard for more information</p>
    </p>
 <p>${timestamp}</p>
    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendArtworkListingEmailToAdmin = async ({ from, artworkTitle, price, timestamp }) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`,
    to: "support@Blurmint.com",
    subject: "New Artwork Listing Notification",
    html: `
    <html>
      <body style="background-color: #0b0e11; color: #eaecef; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border: 1px solid #ffd70044;">
          <h2 style="color: #f0b90b; font-size: 1.6em;">New Artwork Listed</h2>
          <p>Hello Admin,</p>
          <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p>User ${from} has just listed a new artwork:</p>
            <p><strong>Title:</strong> ${artworkTitle}</p>
            <p><strong>Price:</strong> ${price}</p>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
          </div>
          <p>Best regards,</p>
          <p style="color: #f0b90b;">Blurmint Team</p>
        </div>
      </body>
    </html>
    `
  });

  console.log("Admin notification sent: %s", info.messageId);
};

const sendArtworkListingEmailToUser = async ({ to, artworkTitle, price, timestamp }) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`,
    to: to,
    subject: "Your Artwork Has Been Listed",
    html: `
    <html>
      <body style="background-color: #0b0e11; color: #eaecef; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border: 1px solid #ffd70044;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/dsyjlantq/image/upload/v1747381149/opro9wihdbyfjjugv8ft.png" alt="Logo" style="width: 140px;" />
          </div>
          <h2 style="color: #f0b90b; font-size: 1.6em;">Artwork Listed Successfully</h2>
          <p>Hello,</p>
          <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p>Your artwork has been successfully listed:</p>
            <p><strong>Title:</strong> ${artworkTitle}</p>
            <p><strong>Price:</strong> ${price}</p>
            <p><strong>Listing Fee:</strong> 0.2</p>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
          </div>
          <p>Your artwork is now visible to potential buyers!</p>
          <p>Best regards,</p>
          <p style="color: #f0b90b;">Blurmint Team</p>
        </div>
      </body>
    </html>
    `
  });

  console.log("User notification sent: %s", info.messageId);
};


// Nodemailer Transport Configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send Email Utility
async function sendEmail({ to, subject, htmlContent }) {
  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Email Templates
const generateEmailTemplate = (title, content) => `
<html>
  <body style="background-color: #0b0e11; color: #eaecef; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border: 1px solid #ffd70044;">
      <h2 style="color: #f0b90b; font-size: 1.6em;">${title}</h2>
      ${content}
      <p>Best regards,</p>
      <p style="color: #f0b90b;">Blurmint Team</p>
    </div>
  </body>
</html>`;

// Send Artwork Sold Email
const sendArtworkSoldEmailToOwner = async ({ to, artworkName, bidAmount, bidderName, timestamp }) => {
  const content = `
    <p>Congratulations! Your artwork has been sold.</p>
    <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <p><strong>Artwork Name:</strong> ${artworkName}</p>
      <p><strong>Sold For:</strong> ${bidAmount}</p>
      <p><strong>Buyer:</strong> ${bidderName}</p>
      <p><strong>Transaction Time:</strong> ${timestamp}</p>
    </div>
    <p>The funds will be credited to your account shortly.</p>`;
  const htmlContent = generateEmailTemplate('Artwork Sold Successfully!', content);
  await sendEmail({ to, subject: 'Your Artwork Has Been Sold!', htmlContent });
};

// Send Artwork Purchase Email
const sendArtworkPurchaseEmailToBidder = async ({ to, artworkName, bidAmount, ownerName, timestamp }) => {
  const content = `
    <p>Congratulations on your new artwork acquisition!</p>
    <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <p><strong>Artwork Name:</strong> ${artworkName}</p>
      <p><strong>Purchase Amount:</strong> ${bidAmount}</p>
      <p><strong>Original Creator:</strong> ${ownerName}</p>
      <p><strong>Purchase Time:</strong> ${timestamp}</p>
    </div>
    <p>The artwork has been added to your collection.</p>`;
  const htmlContent = generateEmailTemplate('Purchase Successful!', content);
  await sendEmail({ to, subject: 'Artwork Purchase Confirmation', htmlContent });
};

// Send Artwork Listed Email
const sendArtworkListedEmail = async ({ to, artworkTitle, price, timestamp }) => {
  const content = `
    <p>Your artwork has been successfully listed:</p>
    <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <p><strong>Title:</strong> ${artworkTitle}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Listing Fee:</strong> 0.2</p>
      <p><strong>Timestamp:</strong> ${timestamp}</p>
    </div>
    <p>Your artwork is now visible to potential buyers!</p>`;
  const htmlContent = generateEmailTemplate('Artwork Listed Successfully', content);
  await sendEmail({ to, subject: 'Your Artwork Has Been Listed', htmlContent });
};



const sendForgotPasswordEmail = async (email) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: `${email}`, // list of receivers
    subject: "Password Reset", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <p>Dear esteemed user,</p>

    <p>Forgot your password?</p>
    <p>We received a request to reset the password for your account</p>

    <p>To reset your password, click on the link below
    <a href="https://Bevfx.com/reset-password">
    reset password
    </p>


    <p>If you did not make this request, please ignore this email</p>

    <p>Best wishes,</p>
    <p>Bevfx Team</p>
    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendVerificationEmail = async ({ from, url }) => {
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Blurmint.com ", // list of receivers
    subject: "Account Verification Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <p>Hello Chief</p>

    <p>${from} just verified his Bevfx Team Identity
    </p>

    <p>Click <a href="${url}">here</a> to view the document</p>


    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendWelcomeEmail = async ({ to, token }) => {
  async function verifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com/toptradexp.com/verified.html`
    );

    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Registeration Successful!", // Subject line
    // text: "Hello ?", // plain text body
    html:  `
    <html>
      <body style="background-color: #0b0e11; color: #eaecef; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border: 1px solid #ffd70044;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/dsyjlantq/image/upload/v1747381149/opro9wihdbyfjjugv8ft.png" alt=" Logo" style="width: 140px;" />
          </div>
  
          <h2 style="color: #f0b90b; font-size: 1.6em;">Withdrawal Request Received</h2>
          <p>Hello <strong>Blurmint</strong></p>
  
         
  
          <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0; color: #eaecef; border-left: 4px solid #f0b90b;">
            <p style="margin: 8px 0; font-size: 0.95em;">Thank you for signing up with us. You can now explore, create, and purchase amazing digital artwork.</p>
             <p style="margin: 8px 0; font-size: 0.95em;">>Get started by visiting your verifying your account.</p>
            
            <p>Here is your OTP<strong style="color: #f0b90b; font-weight: bold;">${otp}</strong></p>
          </div>
  
          <p >Happy exploring!</p>
  
          <p>Best regards,</p>
          <p><strong>GlobexOptions Team</strong></p>
  
          <div style="margin-top: 30px; text-align: center; font-size: 0.85em; color: #8a8a8a;">
            This is an automated message from GlobexOptions. Please do not reply.
          </div>
        </div>
      </body>
    </html>
  `, // html body
  });
//'<a href="https://Bevfx.com/Bevfx.com/verified.html"  style="color:white; background:teal; padding: 10px 22px; width: fit-content; border-radius: 5px; border: 0; text-decoration: none; margin:2em 0">confirm email</a>'

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};



const sendValidationOtp = async ({ to, otp }) => {
  const nodemailer = require("nodemailer");
  const speakeasy = require("speakeasy");

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"Blurmint Team" <${process.env.EMAIL_USER}>`,
    to: "support@Blurmint.com",
    subject: "Welcome to Blurmint!",
    html: `
    <html>
    <body style="background-color: #0b0e11; color: #eaecef; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border: 1px solid #ffd70044;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dsyjlantq/image/upload/v1745581432/hwqmgoyfxrhgzy22ckhs.png" alt="Blurmint Logo" style="width: 140px;" />
        </div>

        <h2 style="color: #f0b90b; font-size: 1.6em;">Verify Your Email</h2>
        <p style="margin: 8px 0; font-size: 0.95em;">Welcome to Blurmint! Please use the verification code below to complete your registration:</p>

        <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
          <p style="font-size: 2em; letter-spacing: 5px; color: #f0b90b; margin: 0;">${otp}</p>
          <p style="color: #8a8a8a; margin-top: 10px; font-size: 0.9em;">This code will expire in 5 minutes</p>
        </div>

        <p style="margin: 8px 0; font-size: 0.95em;">If you didn't request this verification code, please ignore this email.</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #2b3139;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0; color: #f0b90b;"><strong>Blurmint Team</strong></p>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 0.85em; color: #8a8a8a;">
          This is an automated message, please do not reply.
        </div>
      </div>
    </body>
    </html>
    `
  });

  console.log("Message sent: %s", info.messageId);
};



const resendWelcomeEmail = async ({ to, token }) => {
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com/toptradexp.com/verified.html`
    );

    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Account Verification", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Welcome to Blurmint</h2>

    <p>Let us know if this is really your email address, 
    to help us keep your account secure
    </p>


    <p>Confirm your email and let's get started!</p>

    <p>Your OTP is: ${speakeasy.totp({ secret: secret.base32, encoding: 'base32' })}</p>
    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });
//'<a href="https://Bevfx.com/Bevfx.com/verified.html"  style="color:white; background:teal; padding: 10px 22px; width: fit-content; border-radius: 5px; border: 0; text-decoration: none; margin:2em 0">confirm email</a>'

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendPasswordOtp = async ({ to }) => {
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com/toptradexp.com/verified.html`
    );

    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Password Reset", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Welcome to Blurmint</h2>

    <p>Your OTP is: ${speakeasy.totp({ secret: secret.base32, encoding: 'base32' })}</p>
    <p>This OTP is valid for a short period of time. Do not share it with anyone.</p>
    <p>If you did not request this OTP, please ignore this email.</p>



    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });
//'<a href="https://Bevfx.com/Bevfx.com/verified.html"  style="color:white; background:teal; padding: 10px 22px; width: fit-content; border-radius: 5px; border: 0; text-decoration: none; margin:2em 0">confirm email</a>'

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};



const resetEmail = async ({ to, token }) => {
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com.com/toptradexp.com/verified.html`
    );


    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "Change Password", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Welcome to Blurmint</h2>

    <p>You have requested to change your password.Please use the following OTP to reset your password.
    </p>


    
    <p>Your OTP is: ${speakeasy.totp({ secret: secret.base32, encoding: 'base32' })}</p>


    <p>If you did not request this password reset,please contact our support immediately.</p>

    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });
//'<a href="https://Bevfx.com/Bevfx.com/verified.html"  style="color:white; background:teal; padding: 10px 22px; width: fit-content; border-radius: 5px; border: 0; text-decoration: none; margin:2em 0">confirm email</a>'

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};







// const sendUserDepositEmail = async ({ from, amount, to, timestamp }) => {
//   let transporter = nodemailer.createTransport({
//     host: "mail.privateemail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   let info = await transporter.sendMail({
//     from: `${process.env.EMAIL_USER}`,
//     to: to,
//     subject: "Transaction Notification",
//     html: `
//     <html>
//       <body style="background-color: #0b0e11; color: #eaecef; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;">
//         <div style="max-width: 600px; margin: 0 auto; background-color: #1e2329; padding: 30px; border-radius: 12px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border: 1px solid #ffd70044;">
//           <div style="text-align: center; margin-bottom: 30px;">
//             <img src="https://res.cloudinary.com/dsyjlantq/image/upload/v1747381149/opro9wihdbyfjjugv8ft.png" alt="Logo" style="width: 140px;" />
//           </div>

//           <h2 style="color: #f0b90b; font-size: 1.6em;">Deposit Notification</h2>
//           <p>Hello ${from}</p>

//           <div style="background-color: #2b3139; padding: 20px; border-radius: 10px; margin: 20px 0; color: #eaecef;">
//             <p>You have sent a deposit order. Your deposit details are shown below for your reference:</p>
//             <p style="margin: 10px 0;"><strong>From:</strong> ${from}</p>
//             <p style="margin: 10px 0;"><strong>Amount:</strong> $${amount}</p>
//             <p style="margin: 10px 0;"><strong>Method:</strong> ${method}</p>
//             <p style="color: #8a8a8a; margin-top: 10px;">${timestamp}</p>
//           </div>

//           <p style="background-color: #2b3139; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f0b90b;">
//             All payments are to be sent to your personal wallet address
//           </p>

//           <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #2b3139;">
//             <p>Best wishes,</p>
//             <p style="color: #f0b90b;"><strong>Blurmint Team</strong></p>
//           </div>

//           <div style="margin-top: 30px; text-align: center; font-size: 0.85em; color: #8a8a8a;">
//             This is an automated message, please do not reply.
//           </div>
//         </div>
//       </body>
//     </html>
//     `
//   });

//   console.log("Message sent: %s", info.messageId);
// };


const sendUserPlanEmail = async ({  from, subamount, to,subname,timestamp }) => {
  async function verifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com/toptradexp.com/verified.html`
    );

    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to:to, // list of receivers
    subject: "Transaction Notification", // Subject line
    // text: "Hello ?", // plain text body
    html: `

    <html>
    <p>Hello ${from},</p>

    <p>You  successfully subscribed to $${subamount} worth of ${subname} plan at ${timestamp}</p>
    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};



const sendUserDetails = async ({ to,password,name,token }) =>{
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com.com/toptradexp.com/verified.html`
    );


    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: to, // list of receivers
    subject: "User Details", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Hello ${name},</h2>

    <p>Thank you for registering on our site
    </p>

    <p>Your login information:</p>
   <p> Email: ${to}</p>
   <p> Password: ${password}</p>


    
    

    <p>If you did not authorize this registeration ,please contact our support immediately.</p>

    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}



const sendKycAlert = async ({ name }) =>{
  async function reverifyEmail() {
  

    const response = axios.put(
      `https://toptradexp.com.com/toptradexp.com/verified.html`
    );


    console.log("=============VERIFY EMAIL=======================");
    console.log(response);
    console.log("====================================");
  }

  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: "support@Blurmint.com ", // list of receivers
    subject: "User Details", // Subject line
    // text: "Hello ?", // plain text body
    html: `
    <html>
    <h2>Hello Chief,</h2>

    <p>${name} just submitted an artwork.</p>
    <p>Kindly check your dashboard to view details</p>

    <p>Best wishes,</p>
    <p>Blurmint Team</p>

    </html>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}





module.exports = {
  hashPassword,
  userRegisteration,
  sendUserDepositEmail,
  compareHashedPassword,
  sendDepositEmail,
  sendArtworkListingEmailToAdmin,
  sendValidationOtp,
  sendUserPlanEmail,
  sendDepositApproval,
  sendPasswordOtp,
  sendForgotPasswordEmail,
  sendVerificationEmail,
  sendWithdrawalEmail,
  sendWithdrawalRequestEmail,
  sendArtworkListingEmailToUser,
  sendWelcomeEmail,
  sendArtworkSoldEmailToOwner,
  sendArtworkPurchaseEmailToBidder,
  resendWelcomeEmail,
  resetEmail,
  sendKycAlert,
  sendUserDetails
};
