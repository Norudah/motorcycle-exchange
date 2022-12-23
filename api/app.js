import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

// Create Express server
dotenv.config();
const app = express();
const port = process.env.API_PORT || 3000;

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

app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);
