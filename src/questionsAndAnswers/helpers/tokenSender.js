const client = require('../../db')

const tokenSender = async(accessToken, refreshToken, userId, res) => {
const username = (await client.query('SELECT user_name FROM users_data WHERE user_id = $1', [userId])).rows[0].user_name
    const userObject = {
        accessToken,
        refreshToken,
        username
    }
    res.json(['Question sent successfully', userObject])
}

module.exports = tokenSender