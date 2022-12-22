import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = new Router();
const prisma = new PrismaClient();

router.post("/api/signup", async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    const user = await prisma.user.create({
      data: { email, password, firstname, lastname },
    });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up");
  }
});

export default router;
