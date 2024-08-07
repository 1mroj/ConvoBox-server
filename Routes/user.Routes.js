import { Router } from "express";
import userService from "../services/userService.js";
import * as userController from "../controllers/UserController.js";
import { resetPassword } from "../controllers/UserController.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const userRoutes = Router();

userRoutes.post("/signup", async (req, res) => {
  try {
    // const userData = extractUserParams(req);
    const userData = req.body;
    console.log(userData);
    const user = await userService.createUser(
      userData.businessName,
      userData.businessWebsite,
      userData.name,
      userData.email,
      userData.phone,
      userData.password
    );

    res
      .status(200)
      .json({ message: "User registered successfully", user: user });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === "USER_ALREADY_EXISTS") {
      return res
        .status(201)
        .json({ error: "Email already exists.", errorCode: 201 });
    }
    if (error.code === "SITE_ALREADY_EXISTS") {
      return res
        .status(201)
        .json({ error: "Business Website already exists.", errorCode: 201 });
    }
    res.status(500).json({ error: "Internal server error", errorCode: 500 });
  }
});

userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userController.loginUser(email, password);

    await userController.updateUserLastLogin(email);

    res
      .status(200)
      .json({ message: "Login successful", accessToken: user.accessToken });

    console.log(user.accessToken);
  } catch (error) {
    console.error("Error logging in:", error);
    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found", errorCode: 404 });
    } else if (error.message === "Invalid password") {
      return res
        .status(201)
        .json({ error: "Invalid password", errorCode: 201 });
    }
    res.status(500).json({ error: "Internal server error", errorCode: 500 });
  }
});

userRoutes.post("/resendotp", async (req, res) => {
  try {
    const { email } = req.body;
    await userService.resendOTP(email);
    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ error: "Internal server error", errorCode: 500 });
  }
});

userRoutes.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;
    await userService.forgotPassword(email);
    res.status(200).json({ message: "Please check your email for OTP" });
  } catch (error) {
    console.error("Error sending OTP for password reset:", error);
    res.status(500).json({ error: "Internal server error", errorCode: 500 });
  }
});

userRoutes.post("/verifyotp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { status, token } = await userService.verifyOTP(email, otp);

    if (status) {
      res
        .status(200)
        .json({ message: "OTP verified successfully", token: token });
    } else {
      res.status(400).json({ error: "Invalid OTP", errorCode: 400 });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error", errorCode: 500 });
  }
});

userRoutes.post("/resetpassword", async (req, res) => {
  try {
    const { email, newPassword, confirmPassword, token } = req.body;
    if (!token)
      return res.status(400).json({ message: "credentials are needed" });
    const isverify = jwt.verify(token, process?.env?.JWT_SECRET);
    if (!isverify) {
      return res.status(404).json({ message: "session is expired" });
    }
    const { status, code, message } = await resetPassword(
      email,
      newPassword,
      confirmPassword
    );
    if (status) {
      res.status(200).json({ message: "Password reset successful" });
    } else {
      return res.status(403).json({ message: message });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
  }
});

export default userRoutes;
