import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password)
    return res.status(400).json({ message: "All fields are required" });

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({ message: "User Already exists" });

  const hashPassword = await bcrypt.hash(password, 10);

  user = { name, email, password: hashPassword };

  const otp = Math.floor(100000 + Math.random() * 900000);

  const activationToken = jwt.sign(
    { user, otp },
    process.env.Activation_Secret,
    { expiresIn: "5m" }
  );

  try {
    await sendMail(email, "E learning", { name, otp });
  } catch (err) {
    console.log("MAIL ERROR:", err.message);
    return res.status(500).json({ message: "Email sending failed" });
  }

  res.status(200).json({
    message: "Otp send to your mail",
    activationToken,
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  let verify;
  try {
    verify = jwt.verify(activationToken, process.env.Activation_Secret);
  } catch {
    return res.status(400).json({ message: "Otp Expired or Invalid" });
  }

  if (Number(verify.otp) !== Number(otp))
    return res.status(400).json({ message: "Wrong Otp" });

  const existingUser = await User.findOne({ email: verify.user.email });

  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });

  res.json({ message: "User Registered" });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "No User with this email" });

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword)
    return res.status(400).json({ message: "wrong Password" });

  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "50d",
  });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user,
  });
});

export const myProfile = TryCatch(async (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(req.user._id);

  res.json({ user });
});

export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({ message: "No User with this email" });

  const token = jwt.sign(
    { email },
    process.env.Forgot_Secret,
    { expiresIn: "5m" }
  );

  try {
    await sendForgotMail("E learning", { email, token });
  } catch (err) {
    console.log("MAIL ERROR:", err.message);
    return res.status(500).json({ message: "Email sending failed" });
  }

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

  await user.save();

  res.json({
    message: "Reset Password Link is send to you mail",
  });
});

export const resetPassword = TryCatch(async (req, res) => {
  let decodedData;

  try {
    decodedData = jwt.verify(
      req.query.token,
      process.env.Forgot_Secret
    );
  } catch {
    return res.status(400).json({ message: "Token Expired or Invalid" });
  }

  const user = await User.findOne({ email: decodedData.email });

  if (!user)
    return res.status(404).json({ message: "No user with this email" });

  if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now())
    return res.status(400).json({ message: "Token Expired" });

  const password = await bcrypt.hash(req.body.password, 10);

  user.password = password;
  user.resetPasswordExpire = null;

  await user.save();

  res.json({ message: "Password Reset" });
});
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};