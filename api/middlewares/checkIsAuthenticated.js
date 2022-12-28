import { PrismaClient } from "@prisma/client";
import { checkToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const checkIsAuthenticated = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.sendStatus(401);
  }

  const [type, token] = header.split(/\s+/);
  if (type !== "Bearer") {
    return res.sendStatus(401);
  }

  const { id } = checkToken(token) ?? null;

  if (!id) {
    return res.sendStatus(401);
  }

  const user = await prisma.User.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return res.sendStatus(401);
  }

  req.user = user;
  next();
};

// module.exports = async (req, res, next) => {
//   const header = req.headers.authorization;
//   if (!header) {
//     return res.sendStatus(401);
//   }

//   const [type, token] = header.split(/\s+/);
//   if (type !== "Bearer") {
//     return res.sendStatus(401);
//   }

//   const { id } = checkToken(token) ?? null;

//   if (!id) {
//     return res.sendStatus(401);
//   }

//   const user = await prisma.User.findUnique({
//     where: {
//       id,
//     },
//   });

//   if (!user) {
//     return res.sendStatus(401);
//   }

//   req.user = user;
//   next();
// };
