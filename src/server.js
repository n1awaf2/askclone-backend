const express = require('express');
const cors = require('cors')
const app = express()
require('dotenv').config()
app.use(cors())
app.use(express.json())

//importing routes
const registerRoute = require('./routes/register')



app.use('/register', registerRoute)




app.listen(4000, ()=>{console.log('listening on port 4000')})