const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");
const tokenSender = require("../helpers/tokenSender");

router.get("/:id", protect, async (req, res) => {
  const profileId = req.params.id;
  try {
    const data = (
      await client.query(
        "SELECT question_id, sender_id, reciever_id, question, answer, is_anonymous, asked_date, answered_date, liked_by, answer_image, user_name, user_image  FROM questions INNER JOIN users_data ON questions.sender_id = users_data.user_id WHERE reciever_id = $1 AND answer IS NOT NULL ORDER BY answered_date DESC",
        [profileId]
      )
    ).rows;
    if (res.get("isrefreshed") === "true") {
      tokenSender(res, data);
    } else {
      return res.status(200).json({
        message: "answered successfully",
        payload: data,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("error");
  }
});

module.exports = router;
