const router = require("express").Router();
const protect = require("../../auth/middlewares/protect");
const client = require("../../db");

router.get("/:followedid", protect, async (req, res) => {
  const followerId = req.user;
  const followedId = req.params.followedid;
  try {
    const data = (
      await client.query(
        "SELECT is_following FROM following_users WHERE follower = $1 AND is_following = $2",
        [followerId, followedId]
      )
    ).rows[0];
    if (data == undefined) {
      throw new Error("User 1 isn't following user 2");
    }
    res.status(200).json("success");
  } catch (error) {
    res.status(400).json("User 1 isn't following user 2");
  }
});

module.exports = router;
