const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");
const tokenSender = require("../helpers/tokenSender");

router.post("/", protect, async (req, res) => {
  const { question, reciever_id, isAnonymous } = req.body;
  const sender_Id = req.user;

  try {
    await client.query(
      "INSERT INTO questions (sender_id, reciever_id, question, is_anonymous, asked_date) VALUES ($1, $2, $3, $4, $5)",
      [sender_Id, reciever_id, question, isAnonymous, new Date()]
    );

    if (res.get("isrefreshed") === "true") {
      tokenSender(sender_Id, res);
    } else {
      return res.json(["Question sent successfully"]);
    }
  } catch (error) {
    console.log(error);
    return res.json("an error has happened please try again");
  }
});

module.exports = router;
