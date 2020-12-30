const {Client} = require('pg')

const client = new Client({
    user: process.env.USER,
    host: process.env.HOST ,
    database: process.env.DATABASE_NAME,
    password: process.env.PASSWORD,
    port: parseInt(process.env.PORT)
})
client.connect().then(console.log('Connected to database'))
module.exports = client