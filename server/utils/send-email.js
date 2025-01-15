const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_HOST,
      to: email,
      subject: subject,
      html: message,
    });
    console.log("Email sent successfully", email, subject, message);
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
    return error;
  }
};
