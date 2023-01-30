import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = new Router();
const prisma = new PrismaClient();

router.get("/getFreeReservation", async (req, res) => {
  const currentDate = new Date();
  const startOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  );
  const endOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + (6 - currentDate.getDay())
  );

  try {
    const availability = await prisma.booking.findMany({
      where: {
        // type: {
        //   equals: bookingType,
        // },
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      select: {
        createdAt,
      },
    });
    res.json({ availability });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up");
  }
});

export default router;
