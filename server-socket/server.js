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
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );


// "connection" is a predefined event in Socket.IO, both on the server and client side. It is automatically triggered when a client successfully connects to the server, and you don't need to define it yourself.
// When a new client connects, Socket.IO automatically provides this socket object to the callback function. This object allows the server to interact with that specific client.  
// 
io.on("connection", (socket)=>{     // When connection is build with frontend side then it will show "User Connected" at server side
    console.log("User Connected")
    console.log("Id", socket.id);    // Each connected user (client) will have a unique socket.id. Whenever a client establishes a new connection with the server, the Socket.IO server generates a new socket.id for that specific connection.

    socket.emit("welcome", `Welcome to the server ${socket.id}`);   // Example- 1.1 "emit" used for sending the message and "on" is used to receive the message. Open 2 taps on frontend side then In emit when reload or refresh the app from frontend for ex. 1st is reload then only that user socket.id will change and not second it means through socket.emit it will only send message to that particular user not to all like broadcast  
    // socket.broadcast.emit("broadcast", `Welcome to Broadcast server ${socket.id}`)  // "broadcast" when you reload 1st tab from frontend then it will send the message to all the tabs or circuits and but not that 1st tab. like you will see the message "Welcome to Broadcast server" and "connected GgFIKp_On6LRoiBpAAAB" to all the tabs and not that 1st tab.

    socket.on("disconnect", ()=>{
      console.log("User Disconnected",socket.id);       // Example- 1.2 This event will show on server side only
    })

    // socket.on("sendMessage", (data)=>{           // EXAMPLE- 2.1
    //     console.log(data);

    //    io.emit("io-to-all",data)       // Example- 1.1.1 io.emit sending message to all so now everyone will receive the message even sender on frontend console.
    
    //    socket.broadcast.emit("io-to-except-sender",data)  // Example- 1.1.2
    // })

    socket.on("sendMessage", ({message, roomName})=>{                  // EXAMPLE- 2.2
        console.log({ roomName, message });
        io.to(roomName).emit("receive-message",{ message });
    })
    
});

app.get("/",(req,resp)=>{
    resp.send("Hello World");
})

server.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})