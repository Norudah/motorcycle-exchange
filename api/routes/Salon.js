import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = new Router();
const prisma = new PrismaClient();

router.get("/salon", async (req, res) => {
  try {
    const salon = await prisma.ChatRoom.findMany();
    res.json({ salon });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting salon");
  }
});

router.post("/salon/add", async (req, res) => {
  try {
    const { name, nbMaxUser } = req.body;
    const salon = await prisma.ChatRoom.create({
      data: { name, nbMaxUser },
    });
    res.json({ salon });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding salon");
  }
});

router.delete("/salon/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const salon = await prisma.ChatRoom.delete({
      where: { id },
    });
    res.json({ salon });
    console.log("Salon " + salon.name + " deleted with success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting salon");
  }
});

router.put("/salon/update/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, nbMaxUser } = req.body;
    const salon = await prisma.ChatRoom.update({
      where: { id },
      data: { name, nbMaxUser },
    });
    res.json({ salon });
    console.log("Salon " + salon.name + " updated with success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating salon");
  }
});

router.post("/salon/join/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { userId } = req.body;
    const salon = await prisma.ChatRoom.update({
      where: { id },
      data: { users: { connect: { id: userId } } },
    });
    res.json({ salon });
    console.log("User " + userId + " joined salon " + salon.name);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error joining salon");
  }
});

export default router;
