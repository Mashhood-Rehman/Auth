import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ message: "Invalid token." });
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verifying token", error);
    return res.status(403).json({ message: "Server Error" });
  }
};
