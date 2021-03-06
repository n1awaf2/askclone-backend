const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");
const tokenSender = require("../helpers/tokenSender");
router.get("/:answerid", protect, async (req, res) => {
  const answerId = req.params.answerid;

  try {
    const data = (
      await client.query(
        `SELECT question_id, sender_id, reciever_id, answer, question, is_anonymous, asked_date, answered_date, liked_by, answer_image, user_name AS questioner_name, user_image AS questioner_image
          FROM questions INNER JOIN users_data ON questions.sender_id = users_data.user_id 
          WHERE questions.question_id = $1 AND answer IS NOT NULL`,
        [answerId]
      )
    ).rows[0];

    if (data === undefined) {
      throw new Error("this question has no answer");
    }

    const authorId = data.reciever_id
    const authorData = (await client.query('SELECT user_image AS author_image, user_name AS author_name FROM users_data WHERE user_id = $1', [authorId])).rows[0]
    data.author_image = authorData.author_image
    data.author_name = authorData.author_name

    if (res.get("isrefreshed") === "true") {
      tokenSender(res, data);
    } else {
      return res.status(200).json({
        message: "success",
        payload: data,
      });
    }
  } catch (error) {
    console.log(error);
    res.json("this question has no answer");
  }
});

module.exports = router;
