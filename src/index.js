const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')
   
    socket.on('join', ({username, room}) => {
        socket.join(room)
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))
    })
    
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.to('Node').emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (userLocation, callback) => {
        console.log(`http://google.com/maps?q=${userLocation.lat},${userLocation.long}`)
        // io.emit('locationMessage', `http://google.com/maps?q=${userLocation.lat},${userLocation.long}`)
        const url = `http://google.com/maps?q=${userLocation.lat},${userLocation.long}`
        io.emit('locationMessage', generateLocationMessage(url))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })

})

server.listen(port, () => console.log(`Server listening on port ${port}!`))