const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const askQuestion = require("../helpers/askQuestion");

router.post("/:id", protect, async (req, res) => {
  const recieverId = req.params.id;
  const senderId = req.user;
  const { question, isAnonymous } = req.body;

  askQuestion(senderId, recieverId, question, isAnonymous, res);
});

module.exports = router;
