export const checkIsAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.sendStatus(403);
  }
  next();
};
