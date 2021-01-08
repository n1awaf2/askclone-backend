const router = require('express').Router()
const protect = require('../../auth/middlewares/protect')
const client = require('../../db')
router.delete('/:questionid', protect, async (req,res)=>{
const questionId = req.params.questionid
const userId = req.user
    try {
        await client.query('DELETE FROM questions WHERE question_id = $1', [questionId])

        if (res.get("isrefreshed") === "true") {
            tokenSender(userId, res);
          } else {
            res.json(["Deleted Successfully"]);
          }
    } catch (error) {
        res.status(400).json('Error')
    }
})

module.exports = router