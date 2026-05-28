import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },

    order: {
      type: Number,
      required: true,
    },

    // ✅ REQUIRED — NO DEFAULT
    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    // ✅ THRESHOLD
     completionThreshold: {
      type: Number,
      default:90,
      required: true,
    },

    videoType: {
      type: String,
      enum: ["youtube", "mp4"],
      default: "youtube",
    },

    thumbnail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", schema);