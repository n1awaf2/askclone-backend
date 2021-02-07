const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");
const tokenSender = require("../helpers/tokenSender");
router.get("/:answerid", protect, async (req, res) => {
  const answerId = req.params.answerid;

  try {
    const data = (
      await client.query(
        "SELECT * FROM questions WHERE question_id = $1 AND answer IS NOT NULL",
        [answerId]
      )
    ).rows[0];
    if (data === undefined) {
      throw new Error("this question has no answer");
    }
    if (res.get("isrefreshed") === "true") {
      tokenSender(res, data);
    } else {
      return res.status(200).json({
        message: "success",
        payload: data,
      });
    }
  } catch (error) {
    console.log(error);
    res.json("this question has no answer");
  }
});

module.exports = router;
