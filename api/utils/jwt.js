import jwt from "jsonwebtoken";

export async function createToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });
  return token;
}

export async function verifyToken(token) {
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  return id;
}
