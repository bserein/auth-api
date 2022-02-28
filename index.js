const express = require('express')
const cors = require('cors')
const { createUser } = require('./src/users')
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())
app.use(cors())

app.post('/user',createUser)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
