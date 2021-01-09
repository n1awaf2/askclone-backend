const router = require('express').Router()
const protect = require('../../auth/middlewares/protect')
const client = require('../../db')

router.put('/:questionid', protect, async(req,res)=>{
    const questionId = req.params.questionid
    const answer = req.body.answer
    console.log(answer);
    console.log(questionId);
    try {

        await client.query('UPDATE questions SET answer = $1, answered_date=$2 WHERE question_id = $3 AND answer IS NULL', [answer, new Date(), questionId])
        
        res.status(200).json('answered successfully')
    } catch (error) {
        console.log(error);
        res.json(400).json('error')
    }
})

module.exports = router