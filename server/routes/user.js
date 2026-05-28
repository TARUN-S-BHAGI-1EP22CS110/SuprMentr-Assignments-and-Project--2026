import express from "express";
import { register, verifyUser, loginUser, myProfile } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/user.js";
import {
  updateProfile
} from "../controllers/user.js";
const router = express.Router();
router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);

router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.put("/update", isAuth, updateProfile);
export default router;