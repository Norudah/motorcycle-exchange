import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = new Router();
const prisma = new PrismaClient();

router.get("/salon", async (req, res) => {
  try {
    const salon = await prisma.ChatRoom.findMany({
      include: {
        users: true,
      },
    });
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
      data: {
        nbUser: {
          increment: 1,
        },
        users: {
          connect: { id: userId },
        },
      },
    });

    res.json({ salon });
    console.log(
      "User " + userId + " joined salon " + salon.name,
      "nbUser: " + salon.nbUser
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error joining salon");
  }
});

router.post("/salon/leave/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { userId } = req.body;
    const salon = await prisma.ChatRoom.update({
      where: { id },
      data: {
        nbUser: {
          decrement: 1,
        },
        users: {
          disconnect: { id: userId },
        },
      },
    });
    res.json({ salon });
    console.log("User " + userId + " left salon " + salon.name);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error leaving salon");
  }
});

// fetch the salon join by the user
router.get("/salon/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const salon = await prisma.ChatRoom.findMany({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
    });
    res.json({ salon });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting salon");
  }
});

router.get("/salon/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const salon = await prisma.ChatRoom.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
    res.json({ salon });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting salon");
  }
});

router.post("/salon/user/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { userId } = req.body;
    console.log("id: " + id + " userId: " + userId);
    const salon = await prisma.ChatRoom.update({
      where: { id },
      data: {
        users: {
          disconnect: { id: userId },
        },
        nbUser: {
          decrement: 1,
        },
      },
    });
    res.json({ salon });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting salon");
  }
});

export default router;
