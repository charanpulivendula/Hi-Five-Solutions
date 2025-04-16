const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("New client connected");
  
  let interval;
  let score = 0;
  let wickets = 0;
  let scoreInterval = null;
  let wicketInterval = null;
  socket.on("startStreaming", () => {
    if (!scoreInterval) {
      scoreInterval = setInterval(() => {
        score = (wickets >= 10) ? 0 : score + Math.floor(Math.random() * 6);
        socket.emit("cricketData", { score, wickets });
      }, 1000); 
    }
  
    if (!wicketInterval) {
      wicketInterval = setInterval(() => {
        wickets = wickets >= 10 ? 0 : wickets + (Math.random()<0.3?1:0);
        socket.emit("cricketData", { score, wickets });
      }, 1000); 
    }
  });

  socket.on("stopStreaming", () => {
    clearInterval(interval);
    interval = null;
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
