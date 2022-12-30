import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";

// SSE
// import SSE from "express-sse";

// Socket.io
import { instrument } from "@socket.io/admin-ui";
import { createServer } from "http";
import { Server } from "socket.io";

// Import routes
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
  });

  socket.on("leave-room", (room) => {
    userNamespace.emit("leave-room", room);
  });

  socket.on("send-message", (message, room, user) => {
    userNamespace.emit("send-message", message, room, user);
    console.log("send-message", message, room, user);
  });
});

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
});

// const stream = new SSE();

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port} , , http://localhost:${port}`);
});

app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }));

app.use(SecurityRouter);

app.use("/salon", checkIsAuthenticated, SalonRouter);

// TODO : Find a way to put headers into EventSource within React (pyt POST insted of GET and token in authorization header for example)
// Because EventSource doesn't support headers and therofore can't send token or data in body

// app.get("/notification", (req, res) => {
//   const { title, messsage } = req.body;

//   console.log("data notif", title, messsage);

//   res.writeHead(200, {
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//   });

//   res.write(`data: ${JSON.stringify({ message: "Nouvelle notification" })}\n\n`);
// });

// app.get("/notification/:message", (req, res) => {
//   const messsage = req.params.message;

//   console.log("data notif", messsage);

//   res.writeHead(200, {
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//   });

//   res.write(`data: ${JSON.stringify({ message: `${messsage ?? "Nouvelle Notification"}` })}\n\n`);
// });

// app.get("/notifications", stream.init);

// app.post("/notifications", (req, res) => {
//   const message = req.body.message;

//   stream.send(message);

//   res.send("Notification envoyée avec succès");
// });

// const emitSSE = (res, id, data) => {
//   res.write("id: " + id + "\n");
//   res.write("data: " + data + "\n\n");
//   res.flush();
// };

// const handleSSE = (req, res) => {
//   res.writeHead(200, {
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//   });
//   const id = new Date().toLocaleTimeString();
//   // Sends a SSE every 3 seconds on a single connection.
//   setInterval(function () {
//     emitSSE(res, id, new Date().toLocaleTimeString());
//   }, 3000);

//   emitSSE(res, id, new Date().toLocaleTimeString());
// };

// //use it

// app.get("/stream", handleSSE);

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
  /**
   * register client's response stream which eventually
   * will get used to send events to client
   */

  clients.push(newClient);

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
});

/**
 * Route just to simulate the send events scenario,
 * In your case it could be DB update or any async operation completion
 */

app.post("/notify", (request, res, next) => {
  console.log("notification reçus du front");

  const { title, message } = request.body;

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
