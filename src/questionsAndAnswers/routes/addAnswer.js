const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");
const tokenSender = require("../helpers/tokenSender");

router.put("/:questionid", protect, async (req, res) => {
  const questionId = req.params.questionid;
  const answer = req.body.answer;
  const imagePath = req.body.imagePath

  try {
    await client.query(
      "UPDATE questions SET answer = $1, answered_date=$2, answer_image=$3 WHERE question_id = $4 AND answer IS NULL",
      [answer, new Date(), imagePath, questionId]
    );

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
