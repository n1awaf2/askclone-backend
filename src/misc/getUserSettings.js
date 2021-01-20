const router = require('express').Router()
const protect = require('../auth/middlewares/protect')
const client = require('../db')

router.get('/', protect, async(req,res)=>{
    const userId = req.user

    try {
        const data = (await client.query('SELECT * from users_data JOIN users_credentials ON users_credentials.user_id = $1 AND users_data.user_id = $1 ', [userId])).rows[0]
        delete data.user_password
        delete data.password_reset_token

        if (res.get("isrefreshed") === "true") {
            tokenSender(res, data);
          } else {
            res.status(200).json({ message: 'updated successfully', payload: data});
          }
    } catch (error) {
        console.log(error);
        res.status(400).json('error')
    }
})

module.exports = router