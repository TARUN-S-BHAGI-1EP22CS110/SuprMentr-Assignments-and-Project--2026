import express from "express";
import {
  createCourse,
  deleteCourse,
  addModule,
  deleteModule,
  getModules,
  addLecture,
  deleteLecture,
  getCourseStructure,
  getDashboardData,
  getAllUsers,
  updateUserRole
} from "../controllers/admin.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import { isAuth, isAdmin } from "../middlewares/isAuth.js";

const router = express.Router();

// ================= COURSE =================
router.post("/course", isAuth, isAdmin, upload.single("file"), createCourse);
router.delete("/course/:courseId", isAuth, isAdmin, deleteCourse);

// ================= MODULE =================
router.post("/module/:courseId", isAuth, isAdmin, addModule);
router.get("/module/:courseId", isAuth, getModules);
router.delete("/module/:moduleId", isAuth, isAdmin, deleteModule);

// ================= LECTURE =================
router.post("/lecture/:moduleId", isAuth, isAdmin, addLecture);
router.delete("/lecture/:lectureId", isAuth, isAdmin, deleteLecture);

// ================= STRUCTURE =================
router.get("/structure/:courseId", isAuth, getCourseStructure);

// ================= DASHBOARD =================
router.get("/dashboard", isAuth, isAdmin, getDashboardData);
router.get("/users", isAuth, isAdmin, getAllUsers);
router.put("/user/:id", isAuth, isAdmin, updateUserRole);
export default router;