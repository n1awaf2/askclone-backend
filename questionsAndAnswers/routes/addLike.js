const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");
const tokenSender = require("../helpers/tokenSender");

router.put("/:id", protect, async (req, res) => {
  const questionId = req.params.id;
  const userId = req.user;

  try {
    const recieverId = (
      await client.query(
        "UPDATE questions SET liked_by = array_append(liked_by, $1) WHERE question_id = $2 RETURNING reciever_id",
        [userId, questionId]
      )
    ).rows[0].reciever_id;
    await client.query(
      "INSERT INTO notifications (notification_type, notification_sender, notification_reciever, question_id,notification_date) VALUES ($1, $2, $3, $4,$5)",
      ["Like", userId, recieverId, questionId, new Date()]
    );
//send notification
    global.connectedUsers[recieverId].forEach((id) => {
      global.io.to(id).emit("like", "U got a new like");
    });

    if (res.get("isrefreshed") === "true") {
      tokenSender(res);
    } else {
      return res.status(200).json({
        message: "liked successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
});

module.exports = router;
