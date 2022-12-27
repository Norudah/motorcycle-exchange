import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
// Socket.io
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
// Import routes
import SalonRouter from "./routes/Salon.js";
import SecurityRouter from "./routes/Security.js";

dotenv.config();
const app = express();
const port = process.env.API_PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://admin.socket.io",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

io.on("connection", (socket) => {
  console.log("SocketIO: connected with ID: ", socket.id);

  // Listen to message from client
  // socket.on("clientMessage", (message) => {
  //   console.log(message);
  // });

  // socket.on("message", (message) => {
  //   console.log(`Received message from client: ${message}`);
  //   socket.emit("message", message);
  // });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("SocketIO: join-room", room);
  });

  // ecouter les messages envoyer sur les salons
  socket.on("send-message", (message, room, userName) => {
    console.log("Send from Room : ", room, " by : ", userName, " -> ", message);

    // add unique id to message
    let date = Date.now();
    let messageId = date + socket.id;
    socket
      .to(room)
      .emit("message", message, room, socket.id, messageId, date, userName);
    console.log("SocketIO: send-message", userName);
  });

  socket.on("disconnect", () => {
    console.log("SocketIO: disconnected with ID", socket.id);
  });
});

io.of("/admin").on("connection", (socket) => {
  console.log("A admin has connected");

  // Send a message to client
  socket.emit("message", "Hello from server Admin!");

  // Listen to message from client
  socket.on("adminMessage", (message) => {
    console.log(message);
  });

  socket.on("message", (message) => {
    console.log(`Received message from admin: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("admin disconnected");
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port} , , http://localhost:${port}`);
});

app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hellow World!");
});

app.use(SecurityRouter);
app.use(SalonRouter);

// app.listen(port, () =>
//   console.log(`Server running on port ${port}, http://localhost:${port}`)
// );
