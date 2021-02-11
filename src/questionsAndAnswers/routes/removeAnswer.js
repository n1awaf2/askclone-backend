const router = require('express').Router()
const protect = require('../../auth/middlewares/protect')
const client = require('../../db')
router.delete('/:questionid', protect, async(req, res)=>{
    const userId = req.user
    const questionId = req.params.questionid
    const authorId = (await client.query('SELECT reciever_id FROM questions WHERE question_id = $1', [questionId])).rows[0].reciever_id
    if(userId === authorId){
        try {
            await client.query('UPDATE questions SET answer = NULL, answer_image = NULL, answered_date = NULL, liked_by = NULL WHERE question_id = $1', [questionId])
            await client.query('DELETE FROM notifications WHERE question_id = $1 AND notification_sender = $2 AND notification_type = $3', [questionId, userId, 'Answer'])

            return res.status(200).json('deleted successfully')
        } catch (error) {
            console.log(error);
            return res.status(400).json('something went wrong please try again')
        }
    } else {
        return res.status(400).json("you can't delete other users questions!")
    }

})

module.exports = router;