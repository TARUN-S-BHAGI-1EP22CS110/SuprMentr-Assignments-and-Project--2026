import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // 🔥 USER ANSWERS (A/B/C/D)
    answers: [
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    selected: {
      type: String,
      enum: ["A", "B", "C", "D"],
    },
    correct: {
      type: String,
      enum: ["A", "B", "C", "D"],
    },
    isCorrect: Boolean,
  },
],

    // 🔥 SCORE %
    score: {
      type: Number,
      required: true,
    },

    // 🔥 PASS/FAIL
    passed: {
      type: Boolean,
      required: true,
    },

    // 🔥 ATTEMPT NUMBER (OPTIONAL)
    attemptNumber: {
      type: Number,
      default: 1,
    },

    // 🔥 TIME TAKEN (seconds)
    timeTaken: {
      type: Number,
      default: 0,
    },

    // 🔥 DATE
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const QuizAttempt = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema
);