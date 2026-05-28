import { Quiz } from "../models/Quiz.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { QuizConfig } from "../models/QuizConfig.js";
import { Progress } from "../models/Progress.js";
import { Certificate } from "../models/Certificate.js";
import { User } from "../models/User.js";
import { Courses } from "../models/Courses.js";
import crypto from "crypto";
import QRCode from "qrcode";


// 🔥 GET QUIZ
export const getQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;

    const [progress, questions, config, count] = await Promise.all([
      Progress.findOne({ user: req.user._id, course: courseId }),
      Quiz.find({ courseId }).select("-correctAnswer"),
      QuizConfig.findOne({ courseId }),
      QuizAttempt.countDocuments({ user: req.user._id, courseId }),
    ]);

    if (!progress || (progress.progressPercentage ?? 0) < 100) {
      return res.status(403).json({
        message: "Complete all lectures to unlock quiz",
      });
    }

    if (!questions.length) {
      return res.status(404).json({
        message: "No quiz found",
      });
    }

    let duration = 0;

    if (config) {
      duration =
        (config.duration?.hours || 0) * 3600 +
        (config.duration?.minutes || 0) * 60 +
        (config.duration?.seconds || 0);
    }

    const MAX_ATTEMPTS = 10;
    const attemptsLeft = Math.max(0, MAX_ATTEMPTS - count);

    res.json({
      success: true,
      questions,
      duration,
      attemptsLeft,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 SUBMIT QUIZ
export const submitQuiz = async (req, res) => {
  try {
    const { courseId, answers = [], timeTaken } = req.body;

    const progress = await Progress.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!progress || (progress.progressPercentage ?? 0) < 100) {
      return res.status(403).json({
        message: "Complete course first",
      });
    }

    const questions = await Quiz.find({ courseId });

    if (!questions.length) {
      return res.status(400).json({
        message: "No quiz available",
      });
    }

    // ✅ Attempt limit check
    const MAX_ATTEMPTS = 10;

    const count = await QuizAttempt.countDocuments({
      user: req.user._id,
      courseId,
    });

    if (count >= MAX_ATTEMPTS) {
      return res.status(403).json({
        message: "Maximum attempts reached",
      });
    }

    // ✅ FIXED ANSWER MAPPING (ORDER SAFE)
    let correctCount = 0;

const answerMap = new Map(
  answers.map((a) => [
    String(a.questionId),
    a.selected,
  ])
);

    const formattedAnswers = questions.map((q) => {
      const selected = answerMap.get(q._id.toString()) ?? null;
      const isCorrect = selected === q.correctAnswer;

      if (isCorrect) correctCount++;

      return {
        questionId: q._id,
        selected,
        correct: q.correctAnswer,
        isCorrect,
      };
    });

    const percentage =
      questions.length > 0
        ? (correctCount / questions.length) * 100
        : 0;

    const passed = percentage >= 75;

    // ✅ Save attempt
    await QuizAttempt.create({
      user: req.user._id,
      courseId,
      answers: formattedAnswers,
      score: percentage,
      passed,
      attemptNumber: count + 1,
      timeTaken: timeTaken || 0,
    });

    // 🔥 AUTO CERTIFICATE GENERATION
    if (passed) {
      const [user, course] = await Promise.all([
        User.findById(req.user._id).lean(),
        Courses.findById(courseId).lean(),
      ]);

      if (!user || !course) {
        return res.status(404).json({
          message: "User or course not found",
        });
      }

      const exists = await Certificate.findOne({
        user: req.user._id,
        courseId,
      });

      if (!exists) {
        try {
          const certId = "CERT-" + crypto.randomUUID();

          const baseURL =
            process.env.FRONTEND_URL || "http://localhost:5173";

          const verifyURL = `${baseURL.replace(/\/$/, "")}/verify/${certId}`;

          const qrCode = await QRCode.toDataURL(verifyURL);

          await Certificate.create({
            user: req.user._id,
            courseId,
            userName: user.name,
            courseTitle: course.title,
            score: percentage,
            certificateId: certId,
            qrCode,
          });
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
          // ignore duplicate certificate error
        }
      }
    }

    // 🔥 RESULT RESPONSE (UI READY)
    const results = questions.map((q) => {
      const selected =
        answerMap.get(q._id.toString()) ?? null;

      return {
        question: q.question,
        selected,
        correct: q.correctAnswer,
        explanation: q.explanation,
        isCorrect: selected === q.correctAnswer,
        options: q.options,
        image: q.questionImage || "",
      };
    });

    res.json({
      success: true,
      percentage,
      passed,
      results,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};