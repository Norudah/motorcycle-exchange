import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

// Create Express server
dotenv.config();
const app = express();
const port = process.env.API_PORT || 3000;

// Socket.io
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

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
  socket.on("clientMessage", (message) => {
    console.log(message);
  });

  socket.on("message", (message) => {
    console.log(`Received message from client: ${message}`);
    socket.emit("message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("SocketIO: join-room", room);
  });

  // ecouter les messages envoyer sur les salons
  socket.on("send-message", (message, room) => {
    console.log("Send to Room : ", room, " -> ", message);

    // add unique id to message
    let date = Date.now();
    let messageId = date + socket.id;
    socket.to(room).emit("message", message, room, socket.id, messageId, date);
  });

  socket.on("disconnect", () => {
    console.log("SocketIO: disconnected with ID", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port} , , http://localhost:${port}`);
});

// Import routes
import SecurityRouter from "./routes/Security.js";
import SalonRouter from "./routes/Salon.js";

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
