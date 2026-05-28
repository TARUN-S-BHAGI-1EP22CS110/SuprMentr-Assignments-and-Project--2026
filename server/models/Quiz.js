import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 FIXED 4 OPTIONS
    options: {
      A: { type: String, required: true },
      B: { type: String, required: true },
      C: { type: String, required: true },
      D: { type: String, required: true },
    },

    // 🔥 CORRECT ANSWER
    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    // 🔥 EXPLANATION (for result screen)
    explanation: {
      type: String,
      required: true,
    },

    // 🔥 IMAGE (LOCAL STORAGE)
// ✅ QUESTION IMAGE
    questionImage: {
      type: String,
      default: "",
    },

    // ✅ EXPLANATION IMAGE
    explanationImage: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
  },
  { timestamps: true }
);


export const Quiz = mongoose.model("Quiz", quizSchema);