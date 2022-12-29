import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = new Router();
const prisma = new PrismaClient();

router.get("/advisor", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "ADMIN",
        availability: true,
      },
    });
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting users");
  }
});

router.get("/available/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { value } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { availability: value },
    });
    res.json({ user });
    console.log(
      "User " + user.firstName + " " + user.lastName + " updated with success"
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});

export default router;
