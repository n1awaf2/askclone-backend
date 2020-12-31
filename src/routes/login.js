const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const client = require('../db')
const loginValidator = require("../middlewares/validate").loginSchema;

router.post('/', async (req,res)=>{
    
    // validate request
    try {
        await loginValidator.validateAsync(req.body)
        console.log('Login request validated');
    } catch (error) {
        return res.json(error.details[0].message)
    }

    //grab data from request body
    const password = req.body.password
    const email = req.body.email.toLowerCase()

    // query database for the credentials with the provided email
    try {
        const data = await client.query('SELECT user_email, user_password, user_id FROM users_credentials WHERE user_email = $1', [email])
        if(data.rows[0] === undefined){return res.json('either email or password is incorrect')}
       // compare and return true or false
        const hashedPassword = data.rows[0].user_password
        const userId = data.rows[0].user_id
        const compare = await bcrypt.compare(password, hashedPassword)
        //generate access token and refresh token and send them to the user
        if (compare === true){
            const userQuery = await client.query('SELECT user_name FROM users_data WHERE user_id = $1', [userId])
            const username = userQuery.rows[0].user_name
            const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
            const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET + hashedPassword, { expiresIn: '7d' })
            return res.json({accessToken, refreshToken, username})

        }
    } catch (error) {
        return res.json('error')
    }
})

module.exports = router