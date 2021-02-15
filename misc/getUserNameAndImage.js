const protect = require("../auth/middlewares/protect");
const client = require("../db");
const router = require("express").Router();
const tokenSender = require('../questionsAndAnswers/helpers/tokenSender')

router.get("/:id", protect, async (req, res) => {
  const requiredUser = req.params.id;

  try {
    const data = (await client.query("SELECT user_name, user_image FROM users_data WHERE user_id = $1", [requiredUser])).rows;
    if (res.get("isrefreshed") === "true") {
        tokenSender(res, data);
      } else {
        return res.status(200).json({
          message: "success",
          payload: data
        });
      }
  } catch (error) {
    console.log(error);
    res.status(400).json('error')
  }

});

module.exports = router;
