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

router.put("/available/advisor/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const value = req.body.availability;
    const user = await prisma.user.update({
      where: { id },
      data: { availability: value },
    });
    res.json({ user });
    console.log(
      "User " +
        user.firstName +
        " " +
        user.lastName +
        " " +
        user.availability +
        " updated with success"
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});

//get advisor by id
router.get("/advisor/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting user");
  }
});

router.post("/request/create", async (req, res) => {
  try {
    const communication = await prisma.CommunicationRequest.create({
      data: {
        status: "PENDING",
        userId: req.body.userId,
      },
    });
    res.json({ communication });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating communication");
  }
});

//get pending request
router.get("/pending-request", async (req, res) => {
  try {
    const communication = await prisma.CommunicationRequest.findMany({
      where: {
        status: "PENDING",
      },
    });
    res.json({ communication });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting communication");
  }
});

export default router;
