import multer from "multer";
import path from "path";
import fs from "fs";

// 📁 ENSURE FOLDER EXISTS
const uploadPath = path.resolve("quiz-lms");
console.log("✅ quizUpload FILE LOADED");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// 📁 STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

filename: function (req, file, cb) {
  console.log("ORIGINAL:", file.originalname);

  const nameWithoutExt = path.parse(file.originalname).name;
  const ext = path.extname(file.originalname);

  const safeName = nameWithoutExt
    .replace(/\s/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");

  const finalName = "quiz-" + Date.now() + "-" + safeName + ext;

  console.log("FINAL MULTER NAME:", finalName);

  cb(null, finalName);
},
});

// 🔒 FILE FILTER (ONLY IMAGES)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

// 🚫 LIMIT FILE SIZE
const quizUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default quizUpload;