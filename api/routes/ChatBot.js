import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = new Router();
const prisma = new PrismaClient();

router.get("/chatBot", async (req, res) => {
  try {
    const help = [
      { name: "help", description: "Bonjour, comment puis-je vous aidez ?" },
      { name: "Options", 
        options: ["Vérifier l'entretien de son véhicule", 
        "Information sur les véhicules", 
        "Information sur un contact", 
        "Fin de l'aide"] }
    ]
    res.json({ help });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting salon");
  }
});

export default router;
