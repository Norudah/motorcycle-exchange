import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import CommunicationRouter from "./routes/Communication.js";
import SalonRouter from "./routes/Salon.js";
import SecurityRouter from "./routes/Security.js";

import { checkIsAuthenticated } from "./middlewares/checkIsAuthenticated.js";
import { checkToken } from "./utils/jwt.js";

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

// Middlewares

const isConnectedMiddleware = (socket, next) => {
  const { token } = socket.handshake.auth;
  const { id, firstName, lastName, role } = checkToken(token);

  if (id) {
    // console.log("IsConnectedMiddleware : Connected");
    socket.user = {
      id,
      firstName,
      lastName,
      role,
    };
    return next();
  }

  // console.log("IsConnectedMiddleware : Disconnected");
  socket.disconnect();
  next(new Error("Authentication error from userNamespace"));
};

const isAdminMiddleware = (socket, next) => {
  const { user } = socket;

  if (user.role === "ADMIN") {
    console.log("IsAdminMiddleware : Connected");
    return next();
  }

  console.log("IsAdminMiddleware : Disconnected");
  socket.disconnect();
  next(new Error("Authentication error from adminNamespace"));
};

// Namespaces

const userNamespace = io.of("/user");

userNamespace.use(isConnectedMiddleware);

const adminNamespace = io.of("/admin");

adminNamespace.use(isConnectedMiddleware);
adminNamespace.use(isAdminMiddleware);

// Events

userNamespace.on("connection", (socket) => {
  // console.log("Authenticated user connected");

  socket.on("join-room", (room) => {
    userNamespace.emit("join-room", room);
    adminNamespace.emit("user-joinded-room", room);
  });

  socket.on("leave-room", (room) => {
    userNamespace.emit("leave-room", room);
    adminNamespace.emit("user-leave-room", room);
  });

  socket.on("send-message", (message, room, user) => {
    userNamespace.emit("send-message", message, room, user);
    console.log("send-message", message, room, user);
  });

  socket.on("create-communication-request", (userId) => {
    adminNamespace.emit("create-communication-request", userId);
  });
});

//

adminNamespace.on("connection", (socket) => {
  // console.log("Authenticated admin connected");

  socket.on("add-room", (room) => {
    userNamespace.emit("add-room", room);
  });

  socket.on("update-room", (room) => {
    userNamespace.emit("update-room", room);
  });

  socket.on("delete-room", (room) => {
    userNamespace.emit("delete-room", room);
  });

  socket.on("delete-user", (idUser, idRoom) => {
    userNamespace.emit("delete-user", idUser, idRoom);
  });

  socket.on("join-room", (room) => {
    userNamespace.emit("join-room", room);
  });

  socket.on("leave-room", (room) => {
    userNamespace.emit("join-room", room);
  });

  socket.on("advisor-available-change", (user, isAvailable) => {
    userNamespace.emit("advisor-available-change", user, isAvailable);
  });

  socket.on("admin-update-availability", (userId) => {
    userNamespace.emit("admin-update-availability", userId);
  });

  socket.on("accept-communication-request", (userId, idRequest) => {
    userNamespace.emit("accept-communication-request", userId, idRequest);
  });
  socket.on("refuse-communication-request", (userId, idRequest) => {
    userNamespace.emit("refuse-communication-request", userId, idRequest);
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port} , , http://localhost:${port}`);
});

app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }));

app.use(SecurityRouter);

app.use("/salon", checkIsAuthenticated, SalonRouter);

// SSE

let clients = [];
let testData = [];

app.get("/events", (request, response, next) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(testData)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  clients.push(newClient);

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
});

app.post("/notify", (request, res, next) => {
  console.log("notification reçus du front");

  const { title, message } = request.body;
  console.log("params", title, message);

  if (!title || !message) {
    return res.status(400).json({ error: "title and message are required" });
  }

  const notification = {
    title,
    message,
  };

  console.log("clients");
  console.table(clients);

  res.json(notification);
  return clients.forEach((client) => client.response.write(`data: ${JSON.stringify(notification)}\n\n`));
});

app.use(SecurityRouter);

app.use("/salon", checkIsAuthenticated, SalonRouter);
app.use("/communication", checkIsAuthenticated, CommunicationRouter);
