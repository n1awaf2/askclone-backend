const router = require('express').Router()
const protect = require('../../auth/middlewares/protect')
const client = require('../../db')
router.get('/:questionid', protect, async(req, res)=>{
    const userId = req.user
    const questionId = req.params.questionid

    try {
        const data = (await client.query('SELECT question, is_anonymous FROM questions WHERE question_id = $1 AND reciever_id = $2', [questionId, userId])).rows
        res.json(data[0])
    } catch (error) {
        console.log(error);
    }

})

module.exports = router