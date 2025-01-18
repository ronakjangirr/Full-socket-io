import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs for groups

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
let allGroupChats = [];

// let chatData= [
//   {roomId:"xyz", roomName:"room1", chats:[{userName:"alex", message:"hello Bob"},{userName:"bob", message:"hi alex"},{userName:"alex", message:"all good"}]},
//   {roomId:"abc", roomName:"room2", chats:[{userName:"mike", message:"hello tyson"},{userName:"tyson", message:"hi mike"},{userName:"mike", message:"all good"}]}
// ]
io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);
  connectedUsers++;
  io.emit("userCount", connectedUsers);

  socket.on("userName", (name) => {
    users[socket.id] = { name, id: socket.id }; // Store the user with their socket.id
    console.log({ users });

    socket.newUser = name;
    socket.broadcast.emit("newUserName", users[socket.id]);
  });

  socket.on("newGroup", (name) => {
    const groupId = uuidv4(); // Generate a unique ID for the group
    const group = { id: groupId, name: name }; // Create a group object
    groupList.push(group); // Store the group with its name and ID

    console.log("Group List:", groupList);
    io.emit("groupCreated", groupList);
  });

  socket.on("deleteGroup", (deleteSelectedGroup) => {
    // console.log({deleteSelectedGroup})
    // Filter out the group that needs to be deleted
    groupList = groupList.filter((group) => group.id !== deleteSelectedGroup);

    // console.log("Updated Group List after Deletion:", groupList);

    io.emit("groupCreated", groupList);
  });

  socket.on("sendMessage", ({ message, privateId }) => {
    console.log({ message, privateId });
    if (connectedUsers <= 1) {
      const alertMessage = "No other users to talk";
      socket.emit("alertMessage", alertMessage);
    } else {
      // NOTE- io.emit("receiveMessage",receiveMessage)  // BroadCast to all Event Me
      // socket.broadcast.emit("receiveMessage", receiveMessage); // BroadCast to all but not me Event Me

      socket.to(privateId).emit("receiveMessage", message); // Send the message to the selected user

      // socket.emit("receiveMessage", message);   // Also send the message to the sender so they see it in their chat
    }
  });

  socket.on("roomChat", (roomChatMsg) => {
    console.log({ roomChatMsg });

    let group = allGroupChats.find(
      (chat) => chat.roomId === roomChatMsg.roomId
    );
    console.log({ "roomChat group": group });

    if (group) {
      group.chats.push({
        userName: roomChatMsg.userName,
        message: roomChatMsg.userMessage,
      });

      console.log("if", group);
    } else {
      group = {
        roomId: roomChatMsg.roomId,
        roomName: roomChatMsg.roomName,
        chats: [
          {
            userName: roomChatMsg.userName,
            message: roomChatMsg.userMessage,
          },
        ],
      };

      console.log("else", group);
      allGroupChats.push(group);
    }
    let selectedRoom = roomChatMsg.roomId;
    let selectedRoomMsg = group.chats;
    io.to(selectedRoom).emit("myRoomChat", selectedRoomMsg);
    console.log("Emitting to room:", selectedRoom, "with message:", selectedRoomMsg);

    console.log("allGroupChats===", allGroupChats)
    // io.emit("myRoomChat", allGroupChats);

  });

  socket.on("joinGroup", (roomInfo) => {
    socket.join(roomInfo.id); // Join the group room

    console.log({ roomInfo });

 // Debugging step: Print allGroupChats to ensure it has the expected structure
 console.log("Current allGroupChats:", allGroupChats);

 // Find the group in `allGroupChats`
 const group = allGroupChats.find((chat) => chat.roomId === roomInfo.id);
 console.log("join==> group", group); // This should show the group if it exists

    if (group && group.chats.length > 0) {
      // Send existing messages of this group to the user who just joined
      io.to(roomInfo.id).emit("myRoomChat", group.chats);
      console.log("Sending existing chats:", group.chats);
    } else {
      // Send an empty array if no messages exist
      io.to(roomInfo.id).emit("myRoomChat", []);
      console.log("No previous messages for this group.");
    }
    });

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
