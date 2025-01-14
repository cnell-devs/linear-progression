const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, message) => {
  if (email.startsWith("@")) throw new Error("Invalid Email")
  const host = "linearprogressionmail@gmail.com";
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: host,
        pass: "dqly xafh iqaj aduf",
      },
    });

    transporter.sendMail({
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
