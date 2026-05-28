import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
    userName: { type: String, required: true },
    courseTitle: { type: String, required: true },
    score: { type: Number, required: true },
    passingScore: { type: Number, default: 75 },
    certificateId: { type: String, unique: true, required: true },
    issuedAt: { type: Date, default: Date.now },
    pdfUrl: { type: String, default: "" },
    qrCode: { type: String, default: "" },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

certificateSchema.index(
  { user: 1, courseId: 1 },
  { unique: true }
);

export const Certificate = mongoose.model(
  "Certificate",
  certificateSchema
);