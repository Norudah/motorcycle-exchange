import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { Router } from "express";
import { createToken } from "../utils/jwt.js";

const router = new Router();
const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const salt = await bcryptjs.genSalt(10);
    const encryptedPassword = await bcryptjs.hash(password, salt);

    const user = await prisma.user.create({
      data: { email, password: encryptedPassword, firstName, lastName },
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
    const invalidMessage = "Invalid email or password";

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).send(invalidMessage);
      return;
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).send(invalidMessage);
      return;
    }

    const token = await createToken(user);
    res.status(200).json({ user, token });
    console.log("User " + user.email + " logged in with success");
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
