const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendManifestEmail(email) {
  return transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Your Manifest Money Ebook",
    text: "Thank you for your purchase. Your ebook is attached.",
    attachments: [
      {
        filename: "manifest.zip",
        path: "../Public/assets/manifest.zip.zip"
      }
    ]
  });
}

module.exports = { sendManifestEmail };