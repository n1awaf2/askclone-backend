const router = require("express").Router();
const client = require('../../db')
const protect = require("../../auth/middlewares/protect");

router.post("/:followedid", protect, async (req, res) => {
    const followerId = req.user;
    const followedId = req.params.followedid;

    //check if users are valid
    try {
    const user1 = (await client.query('SELECT user_id FROM users_credentials WHERE user_id = $1', [followerId])).rows[0].user_id
    const user2 = (await client.query('SELECT user_id FROM users_credentials WHERE user_id = $1', [followedId])).rows[0].user_id

    } catch (error) {
        console.log(error);
        return res.status(400).json('something went wrong please try again')
    }
    //do the following process
    try {
        (await client.query('INSERT INTO following_users (follower, is_following) VALUES ($1, $2)', [followerId, followedId]))
    } catch (error) {
        console.log(error);
       return res.status(400).json('something went wrong please try again')
    }

    //refresh the tokens if needed
    res.status(200).json('followed')
});

module.exports = router;
