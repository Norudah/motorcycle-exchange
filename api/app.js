import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

const port = process.env.API_PORT || 3000;

app.get("/", (req, res) => {
  res.send("Home Route");
});

app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));
