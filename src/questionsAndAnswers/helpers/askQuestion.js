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
    await client.query(
      "INSERT INTO questions (sender_id, reciever_id, question, is_anonymous, asked_date) VALUES ($1, $2, $3, $4, $5)",
      [senderId, recieverId, question, isAnonymous, new Date()]
    );

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
