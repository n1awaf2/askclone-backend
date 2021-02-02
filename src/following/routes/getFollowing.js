const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const tokenSender = require("../../questionsAndAnswers/helpers/tokenSender");
const client = require("../../db");

router.get("/", protect, async (req, res) => {
  const userId = req.user;

  try {
    const data = (
      await client.query(
        `SELECT is_following, user_name, user_image 
            FROM following_users INNER JOIN users_data 
            ON following_users.is_following = users_data.user_id
            WHERE follower = $1
            `,
        [userId]
      )
    ).rows;
    if (res.get("isrefreshed") === "true") {
        tokenSender(res, data);
      } else {
        return res.status(200).json({
          message: "success",
          payload: data
        });
      }
  } catch (error) {
      console.log(error);
      res.status(400).json('Error')
  }
});

module.exports = router;
