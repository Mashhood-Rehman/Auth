import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenandSetCookie } from "../utils/generateTokenandSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessfullEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name)
      throw new Error("All fields are required");
    const ifUserAlreadyExists = await User.findOne({ email });
    if (ifUserAlreadyExists)
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    const hashPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      name,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();

    generateTokenandSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({
      success: true,
      message: "User added successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("error signup", error);
  }
};
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired verification code",
        });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(500).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(500).json({ message: "Invalid credentials" });
    }

    generateTokenandSetCookie(res, user._id);
    user.lastLogin = Date.now();
    user.save();

    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("error login", error);
    res
      .status(500)
      .json({ success: false, message: "error in login controller", error });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error);
    res
      .status(500)
      .json({ success: false, message: "error in logout controller", error });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(500).json({ success: false, message: "No user found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    return res
      .status(500)
      .json({ success: true, message: "Reset Password Sent successfully" });
  } catch (error) {
    console.log("Error in ResetPassword controller ", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "Invalid or Expired token" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();
    await sendResetSuccessfullEmail(user.email);
    return res
      .status(200)
      .json({ success: true, message: "Password Reset Successfull" });
  } catch (error) {
    console.log("error in password reset controller", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log("error in password reset controller", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
