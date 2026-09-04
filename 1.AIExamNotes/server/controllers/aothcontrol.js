import UserModel from "../models/usermodel.js";
import { getToken } from "../utils/token.js";
import bcrypt from "bcryptjs";


// ================= GOOGLE AUTH =================

export const googleAuth = async (req, res) => {
  try {

    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
      });
    }

    const token = getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log("Google Auth Error:", error);

    return res.status(500).json({
      message: "Google authentication failed",
    });
  }
};


// ================= REGISTER =================

export const register = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // Check fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = getToken(user._id);

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Account created successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log("Register Error:", error);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};


// ================= LOGIN =================

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please create an account.",
      });
    }

    // Google account check
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google login. Please continue with Google.",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    // Generate token
    const token = getToken(user._id);

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log("Login Error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};


// ================= LOGOUT =================

export const logOut = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "LOG OUT SUCCESSFUL",
    });

  } catch (error) {

    return res.status(500).json({
      message: `LOG OUT ERROR: ${error.message}`,
    });
  }
};