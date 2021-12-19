const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')
   
    socket.on('join', ({username, room}, callback) => {
        console.log('in join listener' + username + room)
        console.log(socket.id)
        const { error, user } = addUser({id: socket.id, username, room})
        console.log(user)
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined`))
        callback()
    })
    
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        console.log(' inside sendMessage listener' + user)
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (userLocation, callback) => {
        const user = getUser(socket.id)
        const url = `http://google.com/maps?q=${userLocation.lat},${userLocation.long}`
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, url))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left!`))
        }
    })

})

server.listen(port, () => console.log(`Server listening on port ${port}!`))
