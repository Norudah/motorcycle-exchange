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

import { checkToken } from "./utils/jwt.js";

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

  socket.on("join-room-bot", (botResume) => {
    userNamespace.emit("welcome-bot", botResume, "Bonjour, comment puis-je vous aider ?", {
      1 : "Vérifier l'entretien de mon véhicule",
      2 : "Informations sur les véhicules",
      3 : "Informations de contact",
      4 : "Merci et au revoir"
    });
  });

  socket.on("response-message-bot", (botResume) => { 
    console.log("response-message-bot", botResume);
    switch (botResume.step) {
      case '1':
        userNamespace.emit("send-bot-message", botResume, "Veuillez nous indiquer votre immatriculation", {
          1 : "AB-123-CD",
          2 : "AB-456-CD",
          3 : "AB-789-CD",
          4 : "AB-012-CD"
        });
        break;
      case '2':
        userNamespace.emit("send-bot-message", botResume, "Votre véhicule est en bon état", {
          1 : "Merci",
          2 : "Informations de contact",
          3 : "Merci et au revoir"
        });
        break;
      case '3':
        if(botResume.lastMessageUser === "par mail") {
          userNamespace.emit("send-bot-message", botResume, "contact@motorcycle-exchange.com");
          botResume.modifStep = 1;
          userNamespace.emit("send-bot-message", botResume, "Bonjour, comment puis-je vous aider ?", {
            1 : "Vérifier l'entretien de mon véhicule",
            2 : "Informations sur les véhicules",
            3 : "Informations de contact",
            4 : "Merci et au revoir"
          });
        } else if (botResume.lastMessageUser === "par téléphone") {
          userNamespace.emit("send-bot-message", botResume, "01 23 45 67 89");
          botResume.modifStep = 1;
          userNamespace.emit("send-bot-message", botResume, "Bonjour, comment puis-je vous aider ?", {
            1 : "Vérifier l'entretien de mon véhicule",
            2 : "Informations sur les véhicules",
            3 : "Informations de contact",
            4 : "Merci et au revoir"
          });
        } else {
          userNamespace.emit("send-bot-message", botResume, "Souhaitez-vous nous contacter par mail ou téléphone ?", {
            1 : "par mail",
            2 : "par téléphone"
          });
        }
        break;
      case '4':
        userNamespace.emit("disconnect-bot", botResume, "Merci, j'espère avoir été utile");
        break;
      default:
        botResume.modifStep = 1;
        userNamespace.emit("welcome-bot", botResume, "Bonjour, comment puis-je vous aider ?", {
          1 : "Vérifier l'entretien de mon véhicule",
          2 : "Informations sur les véhicules",
          3 : "Informations de contact",
          4 : "Merci et au revoir"
        });
        break;
    } 
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

// io.on("connection", (socket) => {
//   console.log("SocketIO: connected with ID: ", socket.id);

//   socket.on("join-room", (room) => {
//     socket.join(room);
//     console.log("SocketIO: join-room", room);
//   });

//   // ecouter les messages envoyer sur les salons
//   socket.on("send-message", (message, room, userName) => {
//     console.log("Send from Room : ", room, " by : ", userName, " -> ", message);

//     // add unique id to message
//     let date = Date.now();
//     let messageId = date + socket.id;
//     socket
//       .to(room)
//       .emit("message", message, room, socket.id, messageId, date, userName);
//     console.log("SocketIO: send-message", userName);
//   });

//   socket.on("disconnect", () => {
//     console.log("SocketIO: disconnected with ID", socket.id);
//   });
// });

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