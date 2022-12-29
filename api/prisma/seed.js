import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const ROLE = {
    USER: "USER",
    ADMIN: "ADMIN",
  };

  const password = "azerty";
  const encryptedPassword = await bcryptjs.hash(password, await bcryptjs.genSalt(10));

  const user = await prisma.User.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      firstName: "Jean",
      lastName: "Didier",
      role: ROLE.USER,
      password: encryptedPassword,
    },
  });

  const admin = await prisma.User.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      firstName: "Jean",
      lastName: "Didier",
      role: ROLE.ADMIN,
      password: encryptedPassword,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
