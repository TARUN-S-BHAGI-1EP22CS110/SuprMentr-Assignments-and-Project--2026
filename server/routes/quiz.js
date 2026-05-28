import express from "express";
import {
  getQuiz,
  submitQuiz,
} from "../controllers/quiz.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// ✅ GET QUIZ
router.get("/:courseId", isAuth, getQuiz);

// ✅ SUBMIT QUIZ
router.post("/submit", isAuth, submitQuiz);

export default router;