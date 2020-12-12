const socket = io()

const $roomSelection = document.querySelector('#rooms')
const $roomlist = document.querySelector('#availableRoomsList')

socket.on('roomList',(list)=>{
    console.log("roomSelection",list)
    let selectionStr = ''
    let displayStr = ''
    for (var i=0; i < list.length;++i){
        selectionStr += '<option value="'+list[i].name+'" />'; // Storing options in variable
        displayStr += '<p>'+list[i].name+' ('+list[i].nOfUsers+')</p>'
    }
    if(displayStr==='')
        displayStr='<p>There is no room yet, please create one bellow</p>'
    $roomSelection.innerHTML = selectionStr
    $roomlist.innerHTML = displayStr;
})