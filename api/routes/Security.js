import { Router } from "express";
import { PrismaClient } from "@prisma/client";

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

export default router;
