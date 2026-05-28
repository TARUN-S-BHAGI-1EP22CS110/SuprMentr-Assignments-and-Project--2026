import express from "express";
import {
  addQuestion,
  deleteQuestion,
  updateQuestion,
  setQuizConfig,
  deleteQuizByCourse,
} from "../controllers/adminQuiz.js";

import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import quizUpload from "../middlewares/quizUpload.js";
import { Quiz } from "../models/Quiz.js";

const router = express.Router();



router.post(
  "/",
  isAuth,
  isAdmin,
  quizUpload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "explanationImage", maxCount: 1 },
  ]),
  addQuestion
);

router.put(
  "/:id",
  isAuth,
  isAdmin,
  quizUpload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "explanationImage", maxCount: 1 },
  ]),
  updateQuestion
);
// 🔥 DELETE QUESTION
router.delete("/:id", isAuth, isAdmin, deleteQuestion);

// 🔥 GET QUESTIONS
router.get("/course/:courseId", isAuth, isAdmin, async (req, res) => {
  try {
    const questions = await Quiz.find({
      courseId: req.params.courseId,
    });
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 DELETE FULL QUIZ
router.delete("/course/:courseId", isAuth, isAdmin, deleteQuizByCourse);

// 🔥 SET TIMER
router.post("/config", isAuth, isAdmin, setQuizConfig);

export default router;