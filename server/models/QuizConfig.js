import mongoose from "mongoose";

const quizConfigSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    unique: true,
  },
  duration: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    seconds: { type: Number, default: 0 },
  },
});

export const QuizConfig = mongoose.model("QuizConfig", quizConfigSchema);