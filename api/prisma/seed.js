import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const userEmail1 = "user1@test.com";
  const userEmail2 = "user2@test.com";
  const adminEmail = "admin@test.com";

  const chatRommUser1VSUser2Name = "Room 1";
  const chatRoomGroup = "About the next ES version";

  const ROLE = {
    USER: "USER",
    ADMIN: "ADMIN",
  };

  const password = "azerty";
  const encryptedPassword = await bcryptjs.hash(
    password,
    await bcryptjs.genSalt(10)
  );

  const user1 = await prisma.User.upsert({
    where: { email: userEmail1 },
    update: {},
    create: {
      email: userEmail1,
      firstName: "Didier",
      lastName: "Raoul",
      role: ROLE.USER,
      password: encryptedPassword,
      chatRooms: {
        create: [
          {
            name: chatRommUser1VSUser2Name,
            nbUser: 2,
            nbMaxUser: 2,
          },
        ],
      },
    },
  });

  const user2 = await prisma.User.upsert({
    where: { email: userEmail2 },
    update: {},
    create: {
      email: userEmail2,
      firstName: "Micheline",
      lastName: "Dubotier",
      role: ROLE.USER,
      password: encryptedPassword,
      chatRooms: {
        connect: { id: 1 },
      },
    },
  });

  const admin = await prisma.User.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      firstName: "Jean",
      lastName: "Perrier",
      role: ROLE.ADMIN,
      password: encryptedPassword,
    },
  });

  // const chatRoom2 = await prisma.ChatRoom.upsert({
  //   where: { name: chatRoomGroup },
  //   update: {},
  //   create: {
  //     name: chatRoomGroup,
  //     nbUser: 3,
  //     nbMaxUser: 10,
  //     users: {
  //       connect: [{ id: user1.id }, { id: user2.id }, { id: admin.id }],
  //     },
  //   },
  // });
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
