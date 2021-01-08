const client = require('../../db')

const tokenSender = async(userId, res) => {
const username = (await client.query('SELECT user_name FROM users_data WHERE user_id = $1', [userId])).rows[0].user_name
const accessToken = res.get("access-token");
const refreshToken = res.get("refresh-token");
    const userObject = {
        accessToken,
        refreshToken,
        username
    }
    res.status(200).json(['succeeded', userObject])
}

module.exports = tokenSender