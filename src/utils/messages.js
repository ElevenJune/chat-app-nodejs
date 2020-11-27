const generateMessage = (username,message) =>{
    return {
        username,
        text : message,
        createdAt:new Date().getTime()
    }
}

const generateLocation = (username,position) =>{
    return {
        username,
        url : `http://google.com/maps?q=${position.latitude},${position.longitude}`,
        createdAt:new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}

