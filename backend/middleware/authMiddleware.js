import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Store user ID in request
    req.user = decoded.id;

    // Optional: store full user object
    req.userData = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ msg: "Not authorized, token failed" });
  }
};
