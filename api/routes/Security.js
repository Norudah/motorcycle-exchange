import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { createToken } from "../utils/jwt.js";

const router = new Router();
const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await prisma.user.create({
      data: { email, password, firstName, lastName },
    });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user && user.password === password) {
      const token = await createToken(user);
      res.status(200).json({ user, token });
      console.log("User " + user.email + " logged in with success");
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

router.get("/logout", async (req, res) => {
  try {
    res.status(200).json({ user: null, token: null });
    console.log("User logged out with success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging out");
  }
});

export default router;