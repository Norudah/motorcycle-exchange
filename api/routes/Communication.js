import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = new Router();
const prisma = new PrismaClient();

router.get("/advisor", async (req, res) => {
  try {
    const users = await prisma.User.findMany({
      where: {
        role: "ADMIN",
      },
    });
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting users");
  }
});

export default router;
