const socket=new WebSocket('ws://localhost:5000');


socket.onmessage=(event)=>{
    const data=JSON.parse(event.data);

    const div=document.createElement('div');
    div.innerText=`${data.message.username} : ${data.message.text} -- ${data.message.id}`;
    document.getElementById('messages').appendChild(div);
}

function joinRoom(){
    const userRoom=document.getElementById('room').value;

    socket.send(JSON.stringify({
        type:"join-room",
        room:userRoom
    }))
}



function joinChat(){
    const username=document.getElementById('username').value;
    socket.send(JSON.stringify({
        type:"join-user",
        username:username
    }))
}


function sendMessage(){
    const msg=document.getElementById('message').value;

    const data=JSON.stringify({
        type:"chat",
        message:msg
    })
    socket.send(data);
}