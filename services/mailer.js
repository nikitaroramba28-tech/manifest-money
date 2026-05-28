const nodemailer = require("nodemailer");

const sendZip = async (email) => {

    const transporter = nodemailer.createTransport({

        service: "gmail",

        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }

    });

    await transporter.sendMail({

        from: process.env.EMAIL,
        to: email,
        subject: "Manifest Wealth Access",
        text: "Payment successful."

    });

};

module.exports = { sendZip };