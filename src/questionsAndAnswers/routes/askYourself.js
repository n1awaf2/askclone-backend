const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const askQuestion = require('../helpers/askQuestion')

router.post("/", protect, async (req, res) => {
  const { question, isAnonymous } = req.body;
  const sender_Id = req.user;
  askQuestion(sender_Id, sender_Id, question, isAnonymous, res)  

});

module.exports = router;
