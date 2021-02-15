const router = require('express').Router()
const protect = require('../../auth/middlewares/protect')
const client = require('../../db')
const tokenSender = require('../helpers/tokenSender')
router.get('/',protect,async (req,res)=>{
    const userId = req.user

    try {
        const data = (await client.query(`SELECT question_id, sender_id, question, is_anonymous, asked_date FROM questions WHERE reciever_id = $1 AND answer IS NULL ORDER BY asked_date DESC`, [userId])).rows

        if (res.get("isrefreshed") === "true") {
            tokenSender(res, data);
          } else {
            return res.status(200).json({
              message: "success",
              payload: data
            });
          }
    } catch (error) {
        res.status(400).json('error')
    }
})

module.exports = router
