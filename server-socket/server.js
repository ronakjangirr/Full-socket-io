import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs for groups

const app = express();
const PORT = process.env.PORT || 8080;

let server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

let connectedUsers = 0; // Track number of connected users
let users = {}; // Object to store users by socket.id
let groupList = [];
io.on("connection", (socket) => {
  // Use "connection" and handle each client's socket
  console.log("Socket Connected:", socket.id); // Log the socket ID to identify each connection
  connectedUsers++;
  io.emit("userCount", connectedUsers);

  socket.on("userName", (name) => {
    users[socket.id] = { name, id: socket.id }; // Store the user with their socket.id
    console.log({users})

    socket.newUser = name;
    // socket.broadcast.emit("newUserName", name); // BroadCast to all but not me Event Me
    socket.broadcast.emit("newUserName", users[socket.id]); // Broadcast the user object
  })

  socket.on("newGroup", (name)=>{
    const groupId = uuidv4(); // Generate a unique ID for the group
    const group = { id: groupId, name: name }; // Create a group object
    groupList.push(group); // Store the group with its name and ID

    console.log("Group List:", groupList);
    io.emit("groupCreated", groupList)

  })

  socket.on("deleteGroup", (deleteSelectedGroup)=>{
    // Filter out the group that needs to be deleted
  groupList = groupList.filter((group) => group.id !== deleteSelectedGroup);
  
  console.log("Updated Group List after Deletion:", groupList);

  io.emit("groupCreated", groupList)
  })

  socket.on("sendMessage", ({message,privateId }) => {
    console.log({ message,privateId });
    if (connectedUsers <= 1) {
      const alertMessage = "No other users to talk";
      socket.emit("alertMessage", alertMessage);
    } else {
      // NOTE- io.emit("receiveMessage",receiveMessage)  // BroadCast to all Event Me
      // socket.broadcast.emit("receiveMessage", receiveMessage); // BroadCast to all but not me Event Me
      
      socket.to(privateId).emit("receiveMessage", message);         // Send the message to the selected user

      // socket.emit("receiveMessage", message);   // Also send the message to the sender so they see it in their chat
    }
  });

  // socket.on("startPrivateChat", (user)=>{
  //   console.log({"selected user":user})
  //   socket.emit("selectedPrivateUser", user)
  // })

    // Handle private chat initiation
    socket.on("startPrivateChat", (selectedUser) => {
      const { name, id } = selectedUser; // The selected user's name and socket.id
      console.log(`Starting private chat with: ${name} (ID: ${id})`);
      socket.emit("selectedPrivateUser", { name, id });
    });
  

  socket.on("disconnect", () => {
    connectedUsers--;
    io.emit("updateUserCount", connectedUsers);
    if (socket.newUser) {
      socket.broadcast.emit("userLeftNotification", socket.newUser);
    }
    console.log("User Disconnected. Total users:", connectedUsers);
  });
});

server.listen(PORT, () => {
  console.log(`Server is connected ${PORT}`);
});     