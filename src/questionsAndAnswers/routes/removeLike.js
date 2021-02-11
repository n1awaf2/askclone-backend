const router = require('express').Router()
const protect = require('../../auth/middlewares/protect')
const client = require('../../db')
const tokenSender = require('../helpers/tokenSender')
router.put('/:id', protect, async(req,res)=>{
    const userId = req.user
    const questionId = req.params.id

    try {
        await client.query('UPDATE questions SET liked_by = array_remove(liked_by, $1) WHERE question_id = $2', [userId, questionId])
        await client.query('DELETE FROM notifications WHERE question_id = $1 AND notification_sender = $2 AND notification_type = $3', [questionId, userId, 'Like'])
        if (res.get("isrefreshed") === "true") {
            tokenSender(res);
          } else {
            return res.status(200).json({
              message: "unliked successfully",
            });
          }
    } catch (error) {
        res.status(400).json({message: 'Error'})
        console.log(error);
    }
})

module.exports = router