const router = require("express").Router();
const protect = require("../auth/middlewares/protect");
const client = require("../db");
const emailValidator = require('../auth/middlewares/validate').emailValidator
const tokenSender = require("../questionsAndAnswers/helpers/tokenSender");
router.post("/", protect, async (req, res) => {
  const userId = req.user;
  const { name, birthday, location, gender, bio, imagePath, email } = req.body;
  //Validate Email
  try {
    emailValidator.validateAsync({email});
    console.log("email validated");
  } catch (error) {
    return res.json("Please enter a valid email");
  }
  //write to users_data
  try {
    await client.query(
      `UPDATE users_data 
        SET 
        user_name = $1,
        user_birthday = $2,
        user_location = $3,
        user_gender = $4,
        user_bio = $5,
        user_image = $6
        WHERE user_id = $7`,
      [name, birthday, location, gender, bio, imagePath, userId]
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json("Error");
  }

  try {
    client.query(
      "UPDATE users_credentials SET user_email = $1 WHERE user_id = $2",
      [email, userId]
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json("Error");
  }

  if (res.get("isrefreshed") === "true") {
    tokenSender(res);
  } else {
    res.status(200).json({ message: "updated successfully" });
  }
});

module.exports = router;
