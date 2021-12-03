const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')
    
    socket.emit('message', "Welcome!")
    
    socket.broadcast.emit('message', 'A new user has joined')
    
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', (userLocation, callback) => {
        console.log(`http://google.com/maps?q=${userLocation.lat},${userLocation.long}`)
        io.emit('userLocation', `http://google.com/maps?q=${userLocation.lat},${userLocation.long}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })

})

server.listen(port, () => console.log(`Server listening on port ${port}!`))