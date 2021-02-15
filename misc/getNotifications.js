const router = require("express").Router();
const protect = require("../auth/middlewares/protect");
const client = require("../db");
const tokenSender = require("../questionsAndAnswers/helpers/tokenSender");

router.get("/", protect, async (req, res) => {
  const userId = req.user;
  try {
    const data = (
      await client.query(
        `SELECT notifications.notification_id, notifications.notification_type, notifications.notification_sender, notifications.notification_date, notifications.question_id, users_data.user_name, users_data.user_image, questions.is_anonymous
            FROM notifications
            INNER JOIN users_data
            ON notifications.notification_sender = users_data.user_id
            INNER JOIN questions
            ON notifications.question_id = questions.question_id
            WHERE notifications.notification_reciever = $1 AND notifications.notification_read_status = FALSE
            ORDER BY notifications.notification_date DESC
            `,
        [userId]
      )
    ).rows;

    if (res.get("isrefreshed") === "true") {
      tokenSender(res, data);
    } else {
      return res.status(200).json({
        message: "success",
        payload: data,
      });
    }

  } catch (error) {
    res.status(404).json("no data found");
    console.log(error);
  }
});

module.exports = router;
