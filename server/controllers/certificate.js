import { Certificate } from "../models/Certificate.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { User } from "../models/User.js";
import { Courses } from "../models/Courses.js";
import { Progress } from "../models/Progress.js";
import crypto from "crypto";
import QRCode from "qrcode";

export const getCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    // ✅ FIXED PROGRESS CHECK
    const progress = await Progress.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!progress || progress.progressPercentage < 95) {
      return res.status(403).json({
        message: "Complete all lectures to get certificate",
      });
    }

    const attempt = await QuizAttempt.findOne({
      user: req.user._id,
      courseId,
      passed: true,
    }).sort({ createdAt: -1 });

    if (!attempt) {
      return res.status(403).json({
        message: "Pass quiz (≥75%) to get certificate",
      });
    }

    const user = await User.findById(req.user._id).lean();
    const course = await Courses.findById(courseId).lean();

    if (!user || !course) {
      return res.status(404).json({
        message: "User or course not found",
      });
    }

    let cert = await Certificate.findOne({
      user: req.user._id,
      courseId,
    });

    if (!cert) {
      const certId =
        "CERT-" + crypto.randomBytes(4).toString("hex");

      const baseURL =
        process.env.FRONTEND_URL || "http://localhost:5173";

      const verifyURL = `${baseURL}/verify/${certId}`;

      const qrCode = await QRCode.toDataURL(verifyURL);

      cert = await Certificate.create({
        user: req.user._id,
        courseId,
        userName: user.name,
        courseTitle: course.title,
        score: attempt.score,
        certificateId: certId,
        qrCode,
      });
    }

    // ✅ DEBUG
    console.log("COURSE IMAGE:", course.image);
    console.log("QR:", cert.qrCode);

    res.json({
      success: true,
      certificate: {
        name: user.name,
        courseTitle: cert.courseTitle,
        courseImage: course.image,
        score: cert.score,
        certificateId: cert.certificateId,
        date: cert.issuedAt,
        qrCode: cert.qrCode,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({
      user: req.user._id,
    })
      .populate("courseId user")   // ✅ include user
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      certificates: certs.map(cert => ({
        ...cert._doc,
        userName: cert.user?.name || cert.userName, // 🔥 ALWAYS LATEST NAME
      })),
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// 🔥 VERIFY CERTIFICATE
export const verifyCertificate = async (req, res) => {
  try {
    const { certId } = req.params;

    const cert = await Certificate.findOne({
      certificateId: certId,
    })
      .populate("user courseId")
      .lean();

    if (!cert) {
      return res.status(404).json({
        message: "Invalid certificate",
      });
    }

    res.json({
      valid: true,
      name: cert.user.name,
      course: cert.courseId.title,
      score: cert.score,
      date: cert.issuedAt,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};