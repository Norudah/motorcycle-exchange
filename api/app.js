import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import CommunicationRouter from "./routes/Communication.js";
import ReservationRouter from "./routes/Reservation.js";
import SalonRouter from "./routes/Salon.js";
import SecurityRouter from "./routes/Security.js";

import { checkIsAdmin } from "./middlewares/checkIsAdmin.js";
import { checkIsAuthenticated } from "./middlewares/checkIsAuthenticated.js";
import { checkToken } from "./utils/jwt.js";
import {
  isValidYear,
  isDateMoreThanOneYearAway,
  isValidDate,
} from "./utils/helps.js";

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
    userNamespace.emit("clear-bot");
    userNamespace.emit("welcome-bot", botResume, [
      {
        step: null,
        anwers: 0,
        message: "Bonjour, comment puis-je vous aider ?",
      },
      {
        step: 1,
        anwers: 1,
        message: " * Vérifier l'entretien de mon véhicule",
      },
      { step: 2, anwers: 1, message: " * Informations sur les véhicules" },
      { step: 3, anwers: 1, message: " * Informations de contact" },
      { step: 4, anwers: 1, message: " * Merci et au revoir" },
    ]);
  });

  socket.on("response-message-bot", (botResume) => {
    switch (botResume.step) {
      case 1:
        if (
          botResume.newMessageUser == " * Vérifier l'entretien de mon véhicule"
        ) {
          userNamespace.emit("send-bot-message", botResume, [
            {
              step: 1,
              message: "Votre véhicule est de quel année ? (aaaa)",
            },
          ]);
        }

        if (isValidYear(botResume.newMessageUser) == true) {
          userNamespace.emit("send-bot-message", botResume, [
            {
              step: 1,
              message:
                "Quel est la date de votre dernier entretien ? (jj/mm/aaaa)",
            },
          ]);
        }
        if (isValidDate(botResume.newMessageUser) == true) {
          if (isDateMoreThanOneYearAway(botResume.newMessageUser) == true) {
            userNamespace.emit("send-bot-message", botResume, [
              {
                step: 5,
                message:
                  "Nombre de kilomètres parcourus depuis votre dernier entretien ?n,xcnv,xcnv,",
              },
            ]);
          } else {
            userNamespace.emit("send-bot-message", botResume, [
              {
                step: 1,
                message:
                  "Nombre de kilomètres parcourus depuis votre dernier entretien ?qsdqds",
              },
            ]);
          }
        }
        break;
      case 2:
        userNamespace.emit("clear-bot");
        userNamespace.emit("send-bot-message", botResume, [
          {
            step: null,
            anwers: 0,
            message: "Quel est le type d'usage de votre véhicule ?",
          },
          { step: 5, anwers: 1, message: "un usage routier" },
          { step: 5, anwers: 1, message: "un usage tout terrain" },
          { step: 5, anwers: 1, message: "un usage sportif" },
        ]);
        break;
      case 3:
        switch (botResume.newMessageUser) {
          case "par mail":
            userNamespace.emit("clear-bot");
            userNamespace.emit("send-bot-message", botResume, [
              { step: null, message: "contact@motorcycle-exchange.com" },
            ]);
            userNamespace.emit("welcome-bot", botResume, [
              { step: null, message: "Bonjour, comment puis-je vous aider ?" },
              {
                step: 1,
                anwers: 1,
                message: " * Vérifier l'entretien de mon véhicule",
              },
              {
                step: 2,
                anwers: 1,
                message: " * Informations sur les véhicules",
              },
              { step: 3, anwers: 1, message: " * Informations de contact" },
              { step: 4, anwers: 1, message: " * Merci et au revoir" },
            ]);
            break;
          case "par téléphone":
            userNamespace.emit("clear-bot");
            userNamespace.emit("send-bot-message", botResume, [
              { step: null, message: "01 23 45 67 89" },
            ]);
            userNamespace.emit("welcome-bot", botResume, [
              { step: null, message: "Bonjour, comment puis-je vous aider ?" },
              {
                step: 1,
                anwers: 1,
                message: " * Vérifier l'entretien de mon véhicule",
              },
              {
                step: 2,
                anwers: 1,
                message: " * Informations sur les véhicules",
              },
              { step: 3, anwers: 1, message: " * Informations de contact" },
              { step: 4, anwers: 1, message: " * Merci et au revoir" },
            ]);
            break;
          default:
            userNamespace.emit("clear-bot");
            userNamespace.emit("send-bot-message", botResume, [
              {
                step: null,
                anwers: 0,
                message: "Comment souhaitez-vous être contacté ?",
              },
              { step: 3, anwers: 1, message: "par mail" },
              { step: 3, anwers: 1, message: "par téléphone" },
            ]);
            break;
        }
        break;
      case 4:
        userNamespace.emit("clear-bot");
        userNamespace.emit("send-bot-message", botResume, [
          { step: null, message: "Merci, j'espère avoir été utile" },
        ]);
        break;
      case 5:
        userNamespace.emit("clear-bot");
        botResume.query = true;
        userNamespace.emit("send-bot-message", botResume, [
          {
            step: 5,
            query: true,
            message: "Voici les heures disponibles pour votre réservation :",
          },
        ]);
        break;
      default:
        userNamespace.emit(
          "welcome-bot",
          botResume,
          "Bonjour, comment puis-je vous aider ?",
          {
            1: "Vérifier l'entretien de mon véhicule",
            2: "Informations sur les véhicules",
            3: "Informations de contact",
            4: "Merci et au revoir",
          }
        );
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

app.post(
  "/notify",
  checkIsAuthenticated,
  checkIsAdmin,
  (request, res, next) => {
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
    return clients.forEach((client) =>
      client.response.write(`data: ${JSON.stringify(notification)}\n\n`)
    );
  }
);

app.use(SecurityRouter);

app.use("/salon", checkIsAuthenticated, SalonRouter);
app.use("/communication", checkIsAuthenticated, CommunicationRouter);
app.use("/reservation", checkIsAuthenticated, ReservationRouter);
