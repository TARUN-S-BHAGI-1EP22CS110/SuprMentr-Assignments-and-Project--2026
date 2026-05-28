import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDb } from "./database/db.js";

import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import quizRoutes from "./routes/quiz.js";
import adminQuizRoutes from "./routes/adminQuiz.js";
import certificateRoutes from "./routes/certificate.js";

dotenv.config({ path: "./.env" });


console.log("ENV CHECK:");
console.log("GMAIL:", process.env.GMAIL);
console.log("PASSWORD:", process.env.PASSWORD);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/quiz-lms", express.static("quiz-lms"));
app.get("/", (req, res) => {
  res.send("Server is working");
});
app.use("/api/admin/quiz", adminQuizRoutes); // ✅ FIRST
app.use("/api/admin", adminRoutes);

app.use("/api/quiz", quizRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/certificate", certificateRoutes);


const startServer = async () => {
  try {
    await connectDb();

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Server start error:", error);
    process.exit(1);
  }
};

startServer();