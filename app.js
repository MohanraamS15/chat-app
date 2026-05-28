const socket=new WebSocket('ws://localhost:5000');


socket.onmessage=(event)=>{
    const data=JSON.parse(event.data);

    if(data.type==='update-upvote'){
        const button=document.getElementById(`${data.message.roomId}-${data.message.id}`);
        button.innerText=`Upvotes : ${data.message.upvote}`;
    
    }

    if(data.type==='chat' || data.type=='chat-history'){
        const div=document.createElement('div');
        div.id=`${data.message.roomId}-${data.message.id}-div`;
        div.innerText=`${data.message.username} : ${data.message.text} -- ${data.message.id}`;
        
        const button=document.createElement('button');
        button.id=`${data.message.roomId}-${data.message.id}`;
        button.innerText=`Upvotes : ${data.message.upvote}`;

        button.onclick=()=>updateUpvote(data.message.id);
        div.appendChild(button);

        document.getElementById('messages').appendChild(div);
    }

    
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

function updateUpvote(messageId){
    const data=JSON.stringify({
        type:'update-upvote',
        Id:messageId
    })

    socket.send(data);
}