const express = require("express");
const http = require("http");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const { sequelize } = require("./src/models");
const cors = require("cors");
const routers = require("./src/routes/index");
const notFound = require("./src/middleware/404");
const errorHandling = require("./src/middleware/errorhandling");
const hostname = "localhost";
const paginationMiddleWare = require("./src/middleware/paginationMidlleWare");
const { Server } = require("socket.io");
const { saveMessage } = require("./src/controller/chatController");
const { saveMessageGroup } = require("./src/controller/groupController");

// parse JSON
app.use(cors());
app.use(express.json());
app.use(paginationMiddleWare);
app.use(routers);
app.use(errorHandling);
app.use(notFound);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connect dengan socket id", socket.id);
  // kode disini
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("Kode adalah :", data);
  });
  socket.on("send_message", (data) => {
    console.log("pesan adalah", data);
    // *--Menyimpan pesan yang dikirim kedalam database
    saveMessage(data);
    socket.to(data?.room).emit("received_message", data);
  });
  socket.on("send_message_group", (data) => {
    console.log(`pesan dikirim ke ${data.to}`);
    saveMessageGroup(data);
    socket.to(data?.room).emit("received_message_group", data);
  });
  socket.on("broadcast", () => {
    console.log("pesan broadcast adalah", data);
    socket.broadcast.emit("broadcast_received", data);
  });
  socket.on("disconnect", () => {
    console.log("user tidak connection", socket.id);
  });
});

server.listen(port, hostname, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`Server berjalan di http://${hostname}:${port}`);
});
