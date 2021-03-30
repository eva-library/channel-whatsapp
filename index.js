const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server, { origins: '*:*'})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

io.on('connection', socket => {
    socket.on('loadData', data => {
    	  io.emit('loadData', data)
    })
})

require('./routes/userRoutes')(app, io)


const port = process.env.PORT || 8000;

server.listen(port, () => {
})