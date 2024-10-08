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
