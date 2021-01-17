const router = require('express').Router()
const protect = require('../../auth/middlewares/protect')
const client = require('../../db')
const tokenSender = require("../helpers/tokenSender");

router.put('/:id', protect, async(req,res)=>{
    const questionId = req.params.id
    const userId = req.user

    try {
        await client.query('UPDATE questions SET liked_by = array_append(liked_by, $1) WHERE question_id = $2', [userId, questionId])
        if (res.get("isrefreshed") === "true") {
            tokenSender(res);
          } else {
            return res.status(200).json({
              message: "liked successfully",
            });
          }
    } catch (error) {
        res.status(400).json({message: 'Error'})
        console.log(error);
    }
})

module.exports = router