const users = []
const rooms = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return { error : "username and room are required"}
    }

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return { error : "username and room are required"}
    }

    const user = {id, username, room}
    users.push(user)
    const existingRoom = rooms.find((room)=>{
        return user.room === room
    })
    if(!existingRoom)
        rooms.push(user.room)

    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index==-1)
        return;
    const usersInRoom = getUsersInRoom(user.room)
    if(usersInRoom.length===0){
        const roomIndex = users.findIndex((room)=>{
            return user.room === room
        })
        rooms.splice(roomIndex,1)
    }
    return users.splice(index,1)[0]
}

const getUser = (id) => {
    return users.find((user)=>user.id===id)
}

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user)=> user.room === room)
    return usersInRoom
}

const getRooms = () => {
    return rooms;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
}