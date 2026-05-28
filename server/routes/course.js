import express from "express";
import {
  getAllCourses,
  getLectures,
  updateWatchTime,
  getProgress,
  getWatchPosition,   // ✅ resume
  getCourseStructure,
  enrollCourse,
  getMyCourses,
  getNextLecture,
  getPrevLecture,
  continueWatching,
  getCourseById,
} from "../controllers/course.js";

import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// ================= COURSES =================
router.get("/", getAllCourses);

// ================= LECTURES =================
router.get("/lecture/:courseId", isAuth, getLectures);

// ================= WATCH SYSTEM =================

// 🔥 track watch time (core logic)
router.post("/watch-time", isAuth, updateWatchTime);

// 🔥 resume video position
router.get("/watch/:lectureId", isAuth, getWatchPosition);

// 🔥 full course progress
router.get("/progress/:courseId", isAuth, getProgress);



// ================= STRUCTURE =================
router.get("/structure/:courseId", isAuth, getCourseStructure);

// ================= ENROLL =================
router.post("/enroll/:courseId", isAuth, enrollCourse);
router.get("/my-courses", isAuth, getMyCourses);

// ================= NAVIGATION =================
router.get("/next/:lectureId", isAuth, getNextLecture);
router.get("/prev/:lectureId", isAuth, getPrevLecture);

// ================= CONTINUE WATCHING =================
router.get("/continue", isAuth, continueWatching);
router.get("/:id", isAuth, getCourseById);
export default router;