import express from 'express';
import {WebSocketServer} from 'ws';
import {createServer} from 'http';

const app=express();

app.use(express.json());
app.use(express.static('.'));


const server=createServer(app);

const wss=new WebSocketServer({
    server
});

const rooms=new Map();
let messageId=1;

wss.on('connection',(socket)=>{

    console.log('New Client Connected');

    socket.on('message',(data)=>{
        const parsedData=JSON.parse(data);
        console.log(parsedData);

        if(parsedData.type==='join-room'){
            // if(!socket.username){
            //     console.log('enter your username first');
            //     return ;
            // }
            


            const roomId=parsedData.room;
            socket.roomId=parsedData.room;
            console.log(roomId);
            if(!rooms.get(roomId)){
                rooms.set(roomId,{
                    admin:"",
                    is_open:true,
                    users:[],
                    messages:[],
                    highlightMessage:[],
                    alertMessage:[]
                });
            }

            if(socket.username==='Mohan'){
                rooms.get(roomId).admin='Mohan';
                console.log('hello');
                socket.send(JSON.stringify({
                    type:"admin-access"
                }))
            }

            rooms.get(roomId).users.push(socket);

            console.log(`${socket.username} joined the room ${socket.roomId}`);

            rooms.get(roomId).messages.forEach((message)=>{
                socket.send(JSON.stringify({
                    type:"chat-history",
                    message:message
                }))
            })

            const total=rooms.get(roomId).users.length;
            rooms.get(roomId).users.forEach((client)=>{
                client.send(JSON.stringify({
                    type:'total-users',
                    total:total
                }))
            })
            

        }

        if(parsedData.type==='join-user'){
            
            socket.username=parsedData.username;
            
            console.log(`${socket.username} have joined the chat`);
        }

        if(parsedData.type==='chat'){
            if(!socket.username){
                console.log('enter your username first');
                return ;
            }


            const roomId=socket.roomId;

            if(!rooms.get(roomId).is_open){
                socket.send(JSON.stringify({
                    type:"warning-message",
                    message:'The Chat is currently Closed,Message after the Open'
                }))
                return ;
            }
            const message={
                id:messageId++,
                roomId:roomId,
                username:socket.username,
                text:parsedData.message,
                upvote:0,
                voters:new Set()
            }

            rooms.get(roomId).messages.push(message);
            console.log(rooms.get(roomId).messages);
            rooms.get(roomId).users.forEach((client)=>{
                    client.send(JSON.stringify({
                    type:"chat",
                    message:message
                    
                }))
                
            })
        }

        if(parsedData.type==='update-upvote'){

            if(!socket.username){
                console.log('enter your username first');
                return ;
            }
            const messageId=parsedData.Id;
            const roomId=socket.roomId;
            
            const message=rooms.get(roomId).messages.find((msg)=>msg.id===messageId);

            if(message.voters.has(socket.username)){
                console.log('you have already Voted');
                return ;
            }

            message.voters.add(socket.username);
            message.upvote=message.voters.size;

            rooms.get(roomId).users.forEach((client)=>{
                client.send(JSON.stringify({
                    type:'update-upvote',   
                    message:message
                }))
            })

            const adminName=rooms.get(roomId).admin;
            if(!adminName){
                    console.log('there is no admin');
                    return ;
            }
            

            if(message.upvote<3){
                return ;
            }
            
            const users=rooms.get(roomId).users;
            const socketName=users.find((user)=>adminName===user.username);

            if(message.upvote>=10){
                const alreadyAlerted=rooms.get(roomId).alertMessage.find((msg)=>msg.id===message.id);
                if(alreadyAlerted){
                    return ;
                }

                rooms.get(roomId).alertMessage.push(message);
                socketName.send(JSON.stringify({
                    type:'alert-message',
                    message:message
                }))
            }

            if(message.upvote>=3){
                const alreadyHighlighted=rooms.get(roomId).highlightMessage.find((msg)=>msg.id===message.id);
                if(alreadyHighlighted){
                    return ;
                }
                rooms.get(roomId).highlightMessage.push(message); 

                socketName.send(JSON.stringify({
                    type:'highlight-message',
                    message:message
                }))




            }

            



            
            
        }


        if(parsedData.type==='open-chat'){
            const roomId=socket.roomId;
            if(rooms.get(roomId).is_open){
                console.log('The chat is already in open');
                socket.send(JSON.stringify({
                    type:"warning-message",
                    message:'The Chat is already in Open'
                }))
                return ;
            }
            rooms.get(roomId).is_open=true;
            
            
        }

        if(parsedData.type==='close-chat'){

            const roomId=socket.roomId;

            if(!rooms.get(roomId).is_open){
                console.log('The chat is already in closed');
                socket.send(JSON.stringify({
                    type:"warning-message",
                    message:'The Chat is already in Closed'
                }))
                return ;
            }
            rooms.get(roomId).is_open=false
            
            
        }



        
    })

    socket.on('close',()=>{
        
        const roomId=socket.roomId;
        
        if(!roomId){
            return ;
        }

        

        rooms.get(roomId).users=rooms.get(roomId).users.filter((user)=>user!==socket);

        const total=rooms.get(roomId).users.length;

        rooms.get(roomId).users.forEach((client)=>{
            client.send(JSON.stringify({
                type:'total-users',
                total:total
            }))
        })

        console.log(`${socket.username} got Disconnected`);
    })
})


server.listen(5000,()=>{
    console.log('Server is connected to Port:5000');
})

