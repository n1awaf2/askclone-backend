const router = require('express').Router();
const protect = require('../../auth/middlewares/protect');
const client = require('../../db');
const tokenSender = require('../helpers/tokenSender');

router.get('/', protect, async(req, res)=>{
    const userId = req.user;
    //get followers
    const following = (await client.query({
        text: 'SELECT is_following FROM following_users WHERE follower = $1',
        values: [userId],
        rowMode: 'array'
    })).rows.flat(1)

    //Getting Answers
    try {
        let result = [];
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const queryAnswersString =
        `SELECT 
        questions.question_id, questions.sender_id, questions.reciever_id, questions.question, questions.answer, questions.is_anonymous, questions.asked_date, questions.answered_date, questions.liked_by, questions.answer_image, users_data.user_name AS questioner_name, users_data.user_image AS questioner_image
        FROM questions
        INNER JOIN users_data ON questions.sender_id = users_data.user_id
        WHERE reciever_id = $1 AND answered_date >= $2`
        for(let i = 0; i < following.length; i++){
            let posts = (await client.query(queryAnswersString, [following[i], yesterday])).rows
            result.push(posts)
        }
        if(res.get("isrefreshed") === "true"){
            tokenSender(res, result.flat(Infinity))
        }else{
            res.status(200).json({
                message: 'sucess',
                payload: result.flat(Infinity)
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json('error')
    }

    

    
})

module.exports = router;