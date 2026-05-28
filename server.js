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
            const roomId=parsedData.room;
            socket.roomId=parsedData.room;
            console.log(roomId);
            if(!rooms.get(roomId)){
                rooms.set(roomId,{
                    users:[],
                    messages:[]
                });
            }
            rooms.get(roomId).users.push(socket);

            console.log(`${socket.username} joined the room ${socket.roomId}`);

            rooms.get(roomId).messages.forEach((message)=>{
                socket.send(JSON.stringify({
                    type:"chat-history",
                    message:message
                }))
            })
            

        }

        if(parsedData.type==='join-user'){
            socket.username=parsedData.username;
            console.log(`${socket.username} have joined the chat`);
        }

        if(parsedData.type==='chat'){

            console.log(parsedData.message);
            const roomId=socket.roomId;
            const message={
                id:messageId++,
                username:socket.username,
                text:parsedData.message,
                upvote:0
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



        
    })

    socket.on('close',()=>{
        console.log('Client got Disconnected');
    })
})


server.listen(5000,()=>{
    console.log('Server is connected to Port:5000');
})

