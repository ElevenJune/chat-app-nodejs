const users = []
const rooms = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if(room.length>10)
        room = room.substring(0,10)

    if(!username || !room){
        return { error : "username and room are required"}
    }

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return { error : "username is already taken, please choose another one"}
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
    const usersInRoom = getUsersInRoom(users[index].room)
    if(usersInRoom.length===1){
        const roomIndex = users.findIndex((room)=>{
            return users[index].room === room
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
    const roomsInfo = rooms.map((room)=>{
        return {name:room,
                nOfUsers:getUsersInRoom(room).length}
    })
    return roomsInfo;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
}