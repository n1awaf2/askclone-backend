const client = require("../../db");
const tokenSender = require("./tokenSender");

const askQuestion = async (
  senderId,
  recieverId,
  question,
  isAnonymous,
  res
) => {
  try {
    const questionId = (await client.query(
      "INSERT INTO questions (sender_id, reciever_id, question, is_anonymous, asked_date) VALUES ($1, $2, $3, $4, $5) RETURNING question_id",
      [senderId, recieverId, question, isAnonymous, new Date()]
    )).rows[0].question_id
    await client.query('INSERT INTO notifications (notification_type, notification_sender, notification_reciever, question_id,notification_date) VALUES ($1, $2, $3, $4,$5)', ['Question', senderId, recieverId, questionId, new Date()])
    //send notification
    global.connectedUsers[recieverId].forEach((id) => {
      global.io.to(id).emit("question", "U got a new Question");
    });
    //refresh token
    if (res.get("isrefreshed") === "true") {
      tokenSender(res);
    } else {
      return res.status(200).json({
        message: "Question sent Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: "an error has happened please try again",
    });
  }
};

module.exports = askQuestion;
