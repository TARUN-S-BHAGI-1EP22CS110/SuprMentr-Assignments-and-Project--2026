import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

const uploadPath = path.resolve("uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);   // ✅ FIXED (absolute path)
  },

  filename(req, file, cb) {
    const id = uuid();
    const ext = path.extname(file.originalname); // safer than split
    cb(null, `${id}${ext}`);
  },
});

export const upload = multer({ storage });