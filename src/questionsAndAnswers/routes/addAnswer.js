const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");
const tokenSender = require("../helpers/tokenSender");

router.put("/:questionid", protect, async (req, res) => {
  const questionId = req.params.questionid;
  const answer = req.body.answer;
  const imagePath = req.body.imagePath

  try {
    const data = (await client.query(
      "UPDATE questions SET answer = $1, answered_date=$2, answer_image=$3 WHERE question_id = $4 AND answer IS NULL RETURNING sender_id AS notification_reciever, reciever_id AS notification_sender",
      [answer, new Date(), imagePath, questionId]
    )).rows[0];
      const notificationReciever = data.notification_reciever
      const notificationSender = data.notification_sender
    await client.query('INSERT INTO notifications (notification_type, notification_sender, notification_reciever, question_id,notification_date) VALUES ($1, $2, $3, $4,$5)', ['Answer', notificationSender, notificationReciever, questionId, new Date()])
    global.connectedUsers[notificationReciever].forEach((id) => {
      global.io.to(id).emit("answer", "U got a new Answer");
    });

    if (res.get("isrefreshed") === "true") {
      tokenSender(res);
    } else {
      return res.status(200).json({
        message: "answered successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.json(400).json("error");
  }
});

module.exports = router;
