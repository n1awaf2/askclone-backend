const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");
const tokenSender = require("../helpers/tokenSender");

router.get("/:id", protect, async(req, res) => {
    const profileId = req.params.id
  try {
      const data = (await client.query('SELECT * FROM questions WHERE reciever_id = $1 AND answer IS NOT NULL ORDER BY answered_date DESC', [profileId])).rows
      if (res.get("isrefreshed") === "true") {
        tokenSender(res, data);
      } else {
        return res.status(200).json({
          message: "answered successfully",
          payload: data
        });
      }
  } catch (error) {
    console.log(error);
    res.status(400).json('error')
  }
});

module.exports = router;
