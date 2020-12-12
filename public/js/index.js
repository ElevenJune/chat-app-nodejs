const socket = io()

const $roomList = document.querySelector('#rooms')

socket.on('roomList',(list)=>{
    console.log("roomlist",list)
    let str = ''
    for (var i=0; i < list.length;++i){
        str += '<option value="'+list[i]+'" />'; // Storing options in variable
    }
    $roomList.innerHTML = str
})