const router = require('express').Router()
const protect = require('../auth/middlewares/protect')
const client = require('../db')

router.put('/:id', protect, async(req,res)=>{
    const userId = req.user
    const notificationId = req.params.id
    console.log(userId);
    try {
        await client.query('UPDATE notifications SET notification_read_status = TRUE WHERE notification_id = $1 AND notification_reciever = $2', [notificationId, userId])
        res.status(200).json('success')
    } catch (error) {
        console.log(error);
        res.status(400).json('failed')
    }

})

module.exports = router