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
        console.log('hello');
        const buttonOpen=document.getElementById('chat-open');
        const buttonClose=document.getElementById('chat-close');

        buttonOpen.style.display='block';
        buttonClose.style.display='block';
    }

    if(data.type==='warning-message'){
        const div=document.getElementById('warning-message');
        const value=`<h3>${data.message}</h3>`;

        div.innerHTML=value;
        
    }

    if(data.type==='total-users'){
        const div=document.getElementById('total-members-container');
        div.innerHTML=`<h3>Total Members in this Room:${data.total}</h3>`;
        console.log('hiii');
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

function openChat(){
    console.log('hi');
    socket.send(JSON.stringify({
        type:'open-chat'
    }))
}

function closeChat(){
    console.log('hi');
    socket.send(JSON.stringify({
        type:'close-chat'
    }))
}