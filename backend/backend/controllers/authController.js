import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // token valid for 7 days
  });
};

// -------------------- REGISTER --------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, dob, phone } = req.body;

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
      dob,
      phone,
    });

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        dob: newUser.dob,
        phone: newUser.phone,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// -------------------- LOGIN --------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// -------------------- GET LOGGED-IN USER --------------------
export const getProfile = async (req, res) => {
  try {
    // req.user is added by auth middleware
    res.status(200).json({
      success: true,
      user: req.user, 
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
