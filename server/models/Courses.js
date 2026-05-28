import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  
  duration: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  createdBy: {
    type: String,
    required: true,
  },

  // ⚠️ KEEP but treat as OPTIONAL CACHE
  modules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
  ],

  // 🔥 ADD THIS (VERY IMPORTANT)
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // 🔥 ADD THIS (FOR UI)
  totalLectures: {
    type: Number,
    default: 0,
  },

  // 🔥 ADD THIS (FOR UI)
  totalModules: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Courses = mongoose.model("Courses", schema);