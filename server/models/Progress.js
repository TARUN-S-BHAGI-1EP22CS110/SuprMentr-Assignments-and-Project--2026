import mongoose from "mongoose";

const watchSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },

  watchedSeconds: {
    type: Number,
    default: 0,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  // 🔥 ADD THIS → fast lookup
  lastWatchedAt: {
    type: Date,
    default: Date.now,
  },

});

const schema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
      index: true, // 🔥 faster queries
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],

    watchTime: [watchSchema],

    // 🔥 ADD THIS (VERY IMPORTANT)
    totalLectures: {
      type: Number,
      default: 0,
    },

    // 🔥 ADD THIS (FAST UI)
    progressPercentage: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true }
);

// ✅ already good
schema.index({ user: 1, course: 1 }, { unique: true });

export const Progress = mongoose.model("Progress", schema);