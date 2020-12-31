//@desc Handling user registeration
//@Access not protected
const router = require("express").Router();
const client = require("../db");
const registerValidator = require("../middlewares/validate").registerSchema;
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
      res.json('Registered Successfully')
    } catch (error) {
        console.log(error);
    }
    // add user_id and username into user_data table
    try {
        const userID = await (await client.query("SELECT user_id FROM users_credentials WHERE user_email = $1", [email])).rows[0].user_id
        await client.query('INSERT INTO users_data (user_id, user_name) VALUES ($1, $2)', [userID, username])
        
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;