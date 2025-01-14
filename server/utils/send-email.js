const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, message) => {
  const host = "linearprogressionmail@gmail.com";
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: host,
        pass: "dqly xafh iqaj aduf",
      },
    });

    await transporter.sendMail({
      from: host,
      to: email,
      subject: subject,
      html: message,
    });
    console.log("Email sent Successfully", email, subject, message);
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
    return error;
  }
};
