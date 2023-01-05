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
import CommunicationRouter from "./routes/Communication.js";

import { checkIsAuthenticated } from "./middlewares/checkIsAuthenticated.js";
import { checkToken } from "./utils/jwt.js";
import { getYear, getDate, isDateMoreThanOneYearAway } from "./utils/helps.js";

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

  socket.on("join-room-bot", (botResume) => {
    console.log("join-room-bot", botResume);
    userNamespace.emit("welcome-bot", botResume, [
      {step: null, message: "Bonjour, comment puis-je vous aider ?"},
      {step: 1, message: "Vérifier l'entretien de mon véhicule"},
      {step: 2, message: "Informations sur les véhicules"},
      {step: 3, message: "Informations de contact"},
      {step: 4, message: "Merci et au revoir"}
    ]);
  });

  socket.on("response-message-bot", (botResume) => {

    console.log("response-message-bot", botResume.newMessageUser);
    console.log("response-message-bot", botResume.step);

    switch (botResume.step) {
      case '1':

        const yearRegex = /\b(?:20|19)\d{2}\b/;
        const dateRegex = /\b\d{2}\/\d{2}\/\d{4}\b/;

        switch (botResume.newMessageUser) {
          case yearRegex.test(getYear(botResume.newMessageUser)):
            userNamespace.emit("send-bot-message", botResume, "Quel est la date de votre dernier entretien pour ce vehicule ? (jj/mm/aaaa)");
            break;
          case dateRegex.test(getDate(botResume.newMessageUser)):
            if (isDateMoreThanOneYearAway(getDate(botResume.newMessageUser))) {
              userNamespace.emit("send-bot-message", botResume, "La date de votre dernier entretien est-il antérieur à aujourd'hui ?", {
                1: "oui",
                2: "non"
              });
            } else {
              userNamespace.emit("send-bot-message", botResume, "La date de votre dernier entretien est-il antérieur à aujourd'hui ?", {
                1: "oui",
                2: "non"
              });
            }
            break;
          default:
            userNamespace.emit("send-bot-message", botResume, "Quel est la date de votre vehicule ?");
            break;
        }
        break;
      case '2':
        switch (botResume.newMessageUser) {
          case 'un usage routier':
            userNamespace.emit("send-bot-message", botResume, "Votre véhicule est-il équipé d'un kit carrosserie ?", {
              1: "oui",
              2: "non"
            });
            break;
          case 'un usage tout terrain':
            userNamespace.emit("send-bot-message", botResume, "Votre véhicule est-il équipé d'un kit carrosserie ?", {
              1: "oui",
              2: "non"
            });
            break;
          case 'un usage sportif':
            userNamespace.emit("send-bot-message", botResume, "Votre véhicule est-il équipé d'un kit carrosserie ?", {
              1: "oui",
              2: "non"
            });
            break;
          default:
            userNamespace.emit("send-bot-message", botResume, "Quel est le type d'usage de votre véhicule ?", {
              1: "un usage routier",
              2: "un usage tout terrain",
              3: "un usage sportif"
            });
            break;
        }
        break;
      case '3':
        switch (botResume.newMessageUser) {
          case 'par mail':
            userNamespace.emit("send-bot-message", botResume, "contact@motorcycle-exchange.com");
            botResume.modifStep = 1;
            userNamespace.emit("send-bot-message", botResume, "Puis-je vous aidez autrement ?", {
              1: "Vérifier l'entretien de mon véhicule",
              2: "Informations sur les véhicules",
              3: "Informations de contact",
              4: "Merci et au revoir"
            });
            break;
          case 'par téléphone':
            userNamespace.emit("send-bot-message", botResume, "01 23 45 67 89");
            botResume.modifStep = 1;
            userNamespace.emit("send-bot-message", botResume, "Puis-je vous aidez autrement ?", {
              1: "Vérifier l'entretien de mon véhicule",
              2: "Informations sur les véhicules",
              3: "Informations de contact",
              4: "Merci et au revoir"
            });
            break;
          default:
            userNamespace.emit("send-bot-message", botResume, "Comment souhaitez-vous être contacté ?", {
              1: "par mail",
              2: "par téléphone"
            });
            break;
        }
        break;
      case '4':
        userNamespace.emit("send-bot-message", botResume, "Merci, j'espère avoir été utile");
        break;
      case 'reservation':
        userNamespace.emit("send-bot-message", botResume, "Voici les heures disponibles pour votre réservation :", {
        });
        break;
      default:
        botResume.modifStep = 1;
        userNamespace.emit("welcome-bot", botResume, "Bonjour, comment puis-je vous aider ?", {
          1: "Vérifier l'entretien de mon véhicule",
          2: "Informations sur les véhicules",
          3: "Informations de contact",
          4: "Merci et au revoir"
        });
        break;
    }
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

app.get("/", (req, res) => {
  res.send("Hellow World!");
});

app.use(SecurityRouter);
app.use("/salon", checkIsAuthenticated, SalonRouter);
app.use("/communication", checkIsAuthenticated, CommunicationRouter);