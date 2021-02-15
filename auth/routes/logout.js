const router = require('express').Router()
const protect = require('../middlewares/protect')

router.delete('/', protect, (req,res)=>{
    const userId = req.user
    global.connectedUsers[userId].forEach(socketId=>{
        delete global.socketsAndUsers[socketId]
    })
    delete global.connectedUsers[userId]
})

module.exports = router