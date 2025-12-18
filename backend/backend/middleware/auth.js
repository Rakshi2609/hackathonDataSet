import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    // token will come from frontend (headers)
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next(); // allow request to continue
  } catch (error) {
    console.log("Auth Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
