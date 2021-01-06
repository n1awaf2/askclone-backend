const router = require('express').Router()
const jwt = require('jsonwebtoken')
const passwordValidator = require('../middlewares/validate').updatePasswordSchema
const bcrypt = require('bcrypt')
const client = require("../../db");
router.put('/:resetToken', async (req,res)=>{

//grab the token from url params, verify it and extract userId and Email from it
    const resetToken = req.params.resetToken
    let userId
    let userEmail
    try {
        const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET)
        userId = decoded.userId
        userEmail = decoded.userEmail
    } catch (error) {
        console.log(error);
        return res.json('reset token invalid please go to reset password page to request a new token')
    }

//grab hashed token from the database and compare it with the recieved token
    try {
        const data = await client.query('SELECT password_reset_token FROM users_credentials WHERE user_id = $1 AND user_email = $2', [userId, userEmail])
        const hashedToken = data.rows[0].password_reset_token
        await bcrypt.compare(resetToken, hashedToken)
        console.log('Tokes is Valid, Proceeding');
    } catch (error) {
        console.log(error);
        return res.json('reset token invalid please go to reset password page to request a new token')
    }

//validate passwords request
try {
    await passwordValidator.validateAsync(req.body)
    console.log('request validated');
} catch (error) {
    return res.json("passwords don't match")
}

//hash the new password and add it to the data base
const password = req.body.password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

try {
    await client.query('UPDATE users_credentials SET user_password = $1 WHERE user_id = $2 AND user_email = $3', [hashedPassword, userId, userEmail])
    res.json('Password has been updated now login with your new password')
} catch (error) {
    return res.json('Update failed please try again')
}

//remove the token from the database
try {
    await client.query('UPDATE users_credentials SET password_reset_token = $1 WHERE user_id = $2 AND user_email = $3', [null, userId, userEmail])
} catch (error) {
    console.log(error);
}
})

module.exports = router