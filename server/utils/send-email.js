const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, message) => {
  const host = "linearprogressions@gmail.com"
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: host,
        pass: "dqly xafh iqaj aduf",
    },
  });

  try {
    await transporter.sendMail({
      from: host,
      to: email,
      subject,
      html: message,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

