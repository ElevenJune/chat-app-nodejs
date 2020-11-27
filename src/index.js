const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { callbackify } = require('util')
const Filter = require('bad-words')
const {generateMessage, generateLocation} = require('./utils/messages')
const { addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Setup static directory to serve
const publicDirectoryPath = path.join(__dirname, "../public")
app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
   
    socket.on('join',(options, callback) => {
        const {error, user} =  addUser({id:socket.id,...options})
        if(error)
            return callback(error)

        socket.join(user.room)
        
        socket.emit('message',generateMessage("Admin","Welcome!"))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`)) //To all user in the group
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage',(message, callback) => {
        const filter = new Filter()
        console.log("message : ",message)

        if(filter.isProfane(message))
            return callback('profanity not allowed')

        const user = getUser(socket.id)
        if(!user)
            return callback('Your user is not listed in the database')

        io.to(user.room).emit('message',generateMessage(user.username,message)) //emits to all
        callback()
    })

    socket.on('sendLocation',(position, callback) => {
        const user = getUser(socket.id)
        if(!user)
            return callback('Your user is not listed in the database')
        io.to(user.room).emit('locationMessage',generateLocation(user.username,position))
        callback('Location was sent successfully')
    })

    socket.on('disconnect',()=>{ //the disconnect event is on the socket, not io
        const user = removeUser(socket.id)
        if(!user)
        return;

        io.to(user.room).emit('message',generateMessage("Admin",`${user.username} has left`)) //the client is already disconnected, no need to use broadcast
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        })
    })
})


//Listen port
server.listen(PORT, () => {
    console.log("Server running at " + PORT)
})