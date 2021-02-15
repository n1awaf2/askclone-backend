const router = require('express').Router()
const jwt = require('jsonwebtoken')
const client = require("../../db");

router.put('/:verifyToken', async(req,res)=>{
    const verifyToken = req.params.verifyToken
    let userId
    let email

//Verify the token and extract userdata from it
    try {
        const decoded = jwt.verify(verifyToken, process.env.VERIFY_EMAIL_SECRET)
        userId = decoded.userId
        email = decoded.email
    } catch (error) {
        console.log(error);
        return res.json('token invalid')
    }

//querying the database to change the user_verified to true
    try {
       await client.query('UPDATE users_data SET is_verified = $1 WHERE user_id = $2', [true, userId])
       res.json('account verified, welcome to askfm clone')
    } catch (error) {
        console.log(error);
        return res.json('verify failed please try again')
    }

})

module.exports = router