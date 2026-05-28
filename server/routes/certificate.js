import express from "express";
import {
  getCertificate,
  verifyCertificate,
  getMyCertificates,
} from "../controllers/certificate.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// 🎓 GET ALL CERTIFICATES (for MyCourses tab)
router.get("/", isAuth, getMyCertificates);

// 🔍 VERIFY CERTIFICATE (PUBLIC) → KEEP ABOVE
router.get("/verify/:certId", verifyCertificate);

// 🎓 GET SINGLE CERTIFICATE
router.get("/:courseId", isAuth, getCertificate);

export default router;