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

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Send a message to client
  socket.emit("message", "Hello from server");

  // Listen to message from client
  socket.on("clientMessage", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
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

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Succes ! Connexion avec le node réussis",
  });
});

app.use(SecurityRouter);
app.use(SalonRouter);

// app.listen(port, () =>
//   console.log(`Server running on port ${port}, http://localhost:${port}`)
// );
