const router = require('express').Router()
const protect = require('../../auth/middlewares/protect')
const client = require('../../db')
const tokenSender = require("../helpers/tokenSender");

router.get('/:questionid', protect, async(req, res)=>{
    const userId = req.user
    const questionId = req.params.questionid

    try {
        const data = (await client.query('SELECT question, is_anonymous FROM questions WHERE question_id = $1 AND reciever_id = $2', [questionId, userId])).rows[0]
        if (res.get("isrefreshed") === "true") {
            tokenSender(res, data);
          } else {
            return res.status(200).json({
              message: "answered successfully",
              payload: data
            });
          }
    } catch (error) {
        console.log(error);
    }

})

module.exports = router