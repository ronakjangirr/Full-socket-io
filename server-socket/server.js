import express from "express";
import { Server } from "socket.io";
import { createServer } from "http"; 
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

let server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    }
})

app.use(
    // CORS Setup: This setup allows the server to accept requests from the React app (http://localhost:3000). It supports GET and POST methods with credentials.
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );


// "connection" is a predefined event in Socket.IO, both on the server and client side. It is automatically triggered when a client successfully connects to the server, and you don't need to define it yourself.
// When a new client connects, Socket.IO automatically provides this socket object to the callback function. This object allows the server to interact with that specific client.  

// This event is triggered when a new client successfully connects to the server. The socket object represents that specific connection.
io.on("connection", (socket)=>{     // When connection is build with frontend side then it will show "User Connected" at server side
    console.log("User Connected")
    console.log("Id", socket.id);    // Each connected user (client) will have a unique socket.id. Whenever a client establishes a new connection with the server, the Socket.IO server generates a new socket.id for that specific connection.


    // The server sends a welcome message only to the newly connected client using socket.emit, which sends data only to that specific client.
    socket.emit("welcome", `Welcome You are connected to the server, Your socket Id is- ${socket.id}`);   // Example- 1.1 "emit" used for sending the message and "on" is used to receive the message. Open 2 taps on frontend side then In emit when reload or refresh the app from frontend for ex. 1st is reload then only that user socket.id will change and not second it means through socket.emit it will only send message to that particular user not to all like broadcast  
    

    // "broadcast" when you reload 1st tab from frontend then it will send the message to all the tabs or circuits and but not that 1st tab. like you will see the message "Welcome to Broadcast server" and "connected GgFIKp_On6LRoiBpAAAB" to all the tabs and not that 1st tab.
    // This emits a message to all clients except the sender. So, if the client with socket.id = "abc123" triggers this, all other connected clients except abc123 will receive the message "Welcome to Broadcast server abc123". This is useful for notifying users about events (e.g., a user joining a room) without notifying the user who triggered the event.
    // socket.broadcast.emit("broadcast", `Welcome to Broadcast server ${socket.id}`)  


    // When a client disconnects (e.g., closes the browser or navigates away), this event is triggered, and the server logs the disconnection.
    socket.on("disconnect", ()=>{
      console.log("User Disconnected",socket.id);       // Example- 1.2 This event will show on server side only
    })

    // socket.on("sendMessage", (data)=>{           // EXAMPLE- 2.1
    //     console.log(data);



    // This sends the data to all connected clients. Every client will receive the message, including the one that sent it.
    // Use Case: You would use this in scenarios where you want all connected users to receive the same information (e.g., a global chat message, updates about system-wide events).
    // io.emit("io-to-all",data)       // Example- 1.1.1 io.emit sending message to all so now everyone will receive the message even sender on frontend console.
    
    //    socket.broadcast.emit("io-to-except-sender",data)  // Example- 1.1.2
    // })


    // This event listens for a sendMessage from the client, which includes both the message and room.
    // The server broadcasts the message to all clients in the specified room using io.to(room).emit(...). Only clients in that room will receive the message.
    socket.on("sendMessage", ({message, room})=>{                  // EXAMPLE- 2.2
        console.log({ room, message });
        io.to(room).emit("receive-message",{ message });
    })


    // When a client wants to join a specific room (for targeted messaging), they emit a join-room event with the room name as data.
    // The server uses socket.join(roomName) to add the client to the room. From this point on, the client can receive messages sent to that room.
    socket.on("join-room", (roomName)=>{
        socket.join(roomName)
        console.log(`User has joined the room ${roomName}`);
    })
    
});

app.get("/",(req,resp)=>{
    resp.send("Hello World");
})

server.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})