const router = require("express").Router();
const emailValidator = require("../middlewares/validate").forgotPasswordSchema;
const client = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
router.post("/", async (req, res) => {
  //validate request
  try {
    emailValidator.validateAsync(req.body);
    console.log("email validated");
  } catch (error) {
    return res.json("Please enter a valid email");
  }

  //query database for emai
  const email = req.body.email;
  try {
    const data = await client.query(
      "SELECT user_email, user_id FROM users_credentials WHERE user_email = $1",
      [email]
    );
    //if email presists in the database generate token with email and user id, hash it, save the hash in the data base and send it to user's email

    if (data.rows[0] !== undefined) {
      const userEmail = data.rows[0].user_email;
      const userId = data.rows[0].user_id;
      const resetToken = jwt.sign({ userId, userEmail }, process.env.RESET_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      const salt = await bcrypt.genSalt(10);
      const hashedToken = await bcrypt.hash(resetToken, salt);
      await client.query(
        "UPDATE users_credentials SET password_reset_token = $1 WHERE user_email = $2",
        [hashedToken, email]
      );
      // send Email
      const sendEmail = require('../helpers/sendMail')
      const messageBody = `U recieved this email regarding the password reset request
      if u didn't send a request please ignore this email
      else you can click on this url to reset your password 
      http://localhost:3000/updatepassword/${resetToken}`
      const subject = 'Askfm clone password reset'
      sendEmail(email, subject, messageBody)
      console.log(resetToken);
      return res.json(
        "An email has been sent to you with instructions to reset your password"
      );
    } else {
      console.log("email not found");
    }
  } catch (error) {
    console.log(error);
    return res.json("EROOOOOOOOOOOOOOOOR");
  }
});

module.exports = router;
