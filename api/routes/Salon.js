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
    // récupérer l'id du salon à supprimer dans l'url et le stocker en Int
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

export default router;
