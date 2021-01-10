const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");
router.post("/:id", protect, async (req, res) => {
  const recieverId = req.params.id;
  const senderId = req.user;
  const { question, isAnonymous } = req.body;

  try {
      await client.query(
        "INSERT INTO questions (sender_id, reciever_id, question, is_anonymous, asked_date) VALUES ($1, $2, $3, $4, $5)",
        [senderId, recieverId, question, isAnonymous, new Date()]
      )
      res.status(200).json(['succeed'])
  } catch (error) {
      console.log(error);
      res.status(400).json('error')
  }

});

module.exports = router;
