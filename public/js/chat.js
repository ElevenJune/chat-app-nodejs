const socket = io()
//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix : true})

const autoscroll = () => {
    //get new message element
    const $newMessage = $messages.lastElementChild
    
    //height of new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //height of message container
    const visibleHeight = $messages.offsetHeight

    //height of message container
    const contentheight = $messages.scrollHeight

    //How far have I scrolled ?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(contentheight - newMessageHeight <= scrollOffset){
        $messages.scrollTop= $messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        "message-placeholder":message.text,
        "createdAt" : moment(message.createdAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(location)=>{
    console.log(location)
    const html = Mustache.render(locationTemplate,{
        username:location.username,
        url:location.url,
        createdAt:moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room, users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault() //Prevents from reloading
    
    const message = e.target //object receiving the event
    .elements //its elements
    .message //the message (from his id)
    console.log("to send ",message.value)
    socket.emit('sendMessage',$messageFormInput.value, (error) => {
        $messageFormButton.setAttribute('disabled','disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        $messageFormButton.removeAttribute('disabled')
        if(error)
            return console.log(error)
        console.log("Message sent")
    })
})

$locationButton.addEventListener('click', () =>{
    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation)
        return alert('Geolocation not supported by your browser')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            longitude:position.coords.longitude,
             latitude:position.coords.latitude},
             (message) =>{
                $locationButton.removeAttribute('disabled')
                console.log(message)
            })
    })
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }

})

// socket.on('countUpdated',(count)=>{
//     console.log("count updated " , count)

// })

// document.querySelector('#increment').addEventListener('click', ()=>{
//     console.log("cliked")
//     socket.emit('increment')
// })