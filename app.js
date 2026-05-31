const socket=new WebSocket('ws://localhost:5000');


socket.onmessage=(event)=>{
    const data=JSON.parse(event.data);

    if(data.type==='room-created'){
        const {roomId,username}=data.message;
        const adminToken=localStorage.getItem('adminToken');
        console.log('tok',adminToken);
        console.log(roomId);
        socket.send(JSON.stringify({
            type:"join-room",
            username:username,
            room:roomId,
            adminToken:adminToken
        })) 


    }


    if(data.type==='room-joined'){
        const onboarding=document.getElementById('onboarding');
        onboarding.style.display='none';

        const chatContainer=document.getElementById('chat-container');
        chatContainer.style.display='block';
    }

    if(data.type==='update-upvote'){
        const button=document.getElementById(`${data.message.roomId}-${data.message.id}`);
        button.innerText=`Upvotes : ${data.message.upvote}`;
    
    }

    if(data.type==='chat' || data.type==='chat-history'){
        const div=document.createElement('div');
        div.id=`${data.message.roomId}-${data.message.id}-div`;
        div.innerHTML=`${data.message.username} : ${data.message.text}`;
        
        const button=document.createElement('button');
        button.id=`${data.message.roomId}-${data.message.id}`;
        button.innerText=`Upvotes : ${data.message.upvote}`;

        button.onclick=()=>updateUpvote(data.message.id);
        div.appendChild(button);

        document.getElementById('messages').appendChild(div);
    }


    if(data.type==='highlight-message'){
        
        const div=document.getElementById('highlight-container');
        div.style.display = 'block';
        const highlight=document.createElement('div');
        
        highlight.innerHTML=
            ` <h5>${data.message.text} :- ${data.message.username}</h5>  `


        div.appendChild(highlight);

    }

    if(data.type==='alert-message'){
        const div=document.getElementById('alert-container');
        div.style.display = 'block';

        const alertDiv=document.createElement('div');
        alertDiv.innerHTML=
             ` <h5>${data.message.text} :- ${data.message.username}</h5>  `;
        div.appendChild(alertDiv);
    }

    if(data.type==='admin-access'){
        const adminToken=data.adminToken;
        console.log('admintoken',adminToken);
        localStorage.setItem('adminToken',adminToken);

        const buttonOpen=document.getElementById('chat-open');
        const buttonClose=document.getElementById('chat-close');
        const enterRoom=document.getElementById('join-room');

        enterRoom.value=data.roomId;
        
        console.log('hi');

        buttonOpen.style.display='block';
        buttonClose.style.display='block';
    }

    if(data.type==='room-message'){
        const div=document.getElementById('room-message-container');
        div.innerHTML=`<h2>${data.message}</h2>`;
        setTimeout(() => {
            div.innerHTML = '';  
        }, 2000);
    }

    if(data.type==='warning-message'){
        // should add the time effect for 2s
        const div=document.getElementById('warning-message-container');
        const value=`<h3>${data.message}</h3>`;
        div.innerHTML=value;

        setTimeout(() => {
            div.innerHTML = '';  
        }, 2000);
        
    }

    if(data.type==='total-users'){

        const div=document.getElementById('room-info-container');
        div.innerHTML=`<h2>Room ID: ${data.roomId}</h2>`
        div.innerHTML+=`<h3>Total Members in this Room:${data.total}</h3>`;
        console.log('hiii');
    }

    if(data.type==='online-users'){
        const usernames=data.usernames;
        const div=document.getElementById('online-users-container');
        div.innerHTML=`<h2>Online Users</h2>`;

        const value=document.createElement('p');
        usernames.forEach((username)=>{

            value.innerHTML+=`<h5>${username}</h5>`;
            
        })
        div.appendChild(value);
    }



    
}

function createRoom(){
    const username=document.getElementById('username').value.trim();
    const userRoom=document.getElementById('create-room').value.trim();
    if(!username || !userRoom){
        const div=document.getElementById('room-message-container');
        div.innerHTML=`<h2>Enter Both Username and RoomID</h2>`;
    }

    socket.send(JSON.stringify({
        type:"join-user",
        username:username
    }))

    socket.send(JSON.stringify({
        type:"create-room",
        room:userRoom
     }))
}

function joinRoom(){
    const username=document.getElementById('username').value.trim();
    const userRoom=document.getElementById('join-room').value.trim();
    const adminToken=localStorage.getItem('adminToken');
    if(!username || !userRoom){
        const div=document.getElementById('room-message-container');
        div.innerHTML=`<h2>Enter Both Username and RoomID</h2>`;
    }

    socket.send(JSON.stringify({
        type:"join-user",
        username:username
    }))

    
    socket.send(JSON.stringify({
        type:"join-room",
        room:userRoom,
        adminToken:adminToken
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

function openChat(){
    console.log('hi');
    const adminToken = localStorage.getItem('adminToken');
    socket.send(JSON.stringify({
        type:'open-chat',
        adminToken:adminToken
    }))
}

function closeChat(){
    console.log('hi');
    const adminToken = localStorage.getItem('adminToken');
    socket.send(JSON.stringify({
        type:'close-chat',
        adminToken:adminToken
    }))
}