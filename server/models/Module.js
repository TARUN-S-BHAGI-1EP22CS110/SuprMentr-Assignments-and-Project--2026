import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // 🔥 add
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
      index: true, // 🔥 faster queries
    },

    order: {
      type: Number,
      default: 0,
      index: true, // 🔥 sorting speed
    },

    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],

    // 🔥 OPTIONAL (VERY USEFUL)
    totalLectures: {
      type: Number,
      default: 0,
    },

    // 🔥 OPTIONAL (UI)
    isPublished: {
      type: Boolean,
      default: true,
    },

  },
  {
    timestamps: true,
  }
);

export const Module = mongoose.model("Module", moduleSchema);