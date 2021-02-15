const router = require("express").Router();
const client = require("../../db");
const registerValidator = require("../middlewares/validate").registerSchema;
const jwt = require('jsonwebtoken')
const sendEmail = require('../helpers/sendMail')
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  // destructuring data from request
  const { username, email, password } = req.body;
  // validate request input
  try {
    await registerValidator.validateAsync(req.body);
    console.log("request validated");
  } catch (error) {
    return res.json(error.details[0].message);
  }

  // check if email exists in the database or not
  try {
    const userExists = await client.query(
      "SELECT user_email from users_credentials WHERE user_email = $1",
      [email]
    );
    if (userExists.rows[0] !== undefined) {
      return res.json("already registered");
    }
  } catch (error) {
    console.log(error);
  }

  // hash the password using bcrypt library
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // register user in the database
  try {
      await client.query('INSERT INTO users_credentials (user_email,user_password) VALUES($1, $2)', ([email,hashedPassword]))
      res.json('Registered successfully, please check your email to verify your account')
    } catch (error) {
        console.log(error);
    }
    // add user_id and username into user_data table
    let userId
    try {
        userId = await (await client.query("SELECT user_id FROM users_credentials WHERE user_email = $1", [email])).rows[0].user_id
        await client.query('INSERT INTO users_data (user_id, user_name) VALUES ($1, $2)', [userId, username])
        
    } catch (error) {
        console.log(error);
    }

//generate token and send it by email to the user to verify the account
    try {
      const verifyToken = jwt.sign({userId, email}, process.env.VERIFY_EMAIL_SECRET, {expiresIn: '1d'})
      const messeageBody = `U recieved this email regarding account verification
      please click on this link to verify your account
      note that the token is valid only for one day!
      <a href="http://localhost:3000/verifyemail/${verifyToken}"> 
      click here
      </a>
      `
      sendEmail(email, 'askfm clone verification email', messeageBody)
    } catch (error) {
      
    }


});

module.exports = router;