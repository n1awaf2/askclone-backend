const nodemailer = require("nodemailer");

const sendEmail = async (user_email, subject, messageBody) => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });
  const mailOptions = {
    from: '"askfm clone team": <ahmbelal95@gmail.com>',
    to: user_email,
    subject,
    html: messageBody,
  };

  try {
      const info = await transport.sendMail(mailOptions)
      console.log(info);
  } catch (error) {
      console.log(error);
  }
};

module.exports = sendEmail
