import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";

// Socket.io
import { instrument } from "@socket.io/admin-ui";
import { createServer } from "http";
import { Server } from "socket.io";

// Import routes
import SalonRouter from "./routes/Salon.js";
import SecurityRouter from "./routes/Security.js";

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

// Functions to use within middlewares

const isAdmin = (socket, next) => {
  if (socket.isAdmin) {
    next();
  } else {
    socket.disconnect();
  }
};

const isConnected = (socket, next) => {
  if (socket.isConnected) {
    next();
  } else {
    socket.disconnect();
  }
};

// Middlewares

const isConnectedMiddleware = (socket, next) => {
  const { token } = socket.handshake.auth;

  // TODO : Vérifier avec la base de donnée si le token est valide
  if (token) {
    socket.isConnected = true; // Permet de garder le "isConnected" dans les autres events en dessous
    console.log("coucou c'est moi le token", token);
    return next();
  }

  console.log("Pas connecté, donc déconnexion");
  socket.disconnect();
  next(new Error("Authentication error from userNamespace"));
};

const isAdminMiddleware = (socket, next) => {
  // TODO : Middleware pour vérifier si l'utilisateur est admin
  next();
};

// Namespaces

const userNamespace = io.of("/user");

userNamespace.use(isConnectedMiddleware);

const adminNamespace = io.of("/admin");

adminNamespace.use(isConnectedMiddleware);
adminNamespace.use(isAdminMiddleware);

// Events

userNamespace.on("connection", (socket) => {
  console.log("Authenticated user connected");
});

// adminNamespace.on("connection", (socket) => {
//   console.log("A admin has connected");

//   const { token } = socket.handshake.auth;
//   console.log("token", token);

//   socket.on("disconnect", () => {
//     console.log("admin disconnected");
//   });
// });

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
    socket.to(room).emit("message", message, room, socket.id, messageId, date, userName);
    console.log("SocketIO: send-message", userName);
  });

  socket.on("disconnect", () => {
    console.log("SocketIO: disconnected with ID", socket.id);
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
