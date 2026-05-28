import { Quiz } from "../models/Quiz.js";
import { QuizConfig } from "../models/QuizConfig.js";


// 🔥 ADD QUESTION
export const addQuestion = async (req, res) => {
  try {
    const {
      courseId,
      question,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    if (!courseId || !question || !correctAnswer || !explanation) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (!options) {
      return res.status(400).json({
        message: "Options missing",
      });
    }

    let parsedOptions;

    try {
      parsedOptions =
        typeof options === "string"
          ? JSON.parse(options)
          : options;
    } catch {
      return res.status(400).json({
        message: "Invalid options format",
      });
    }

    if (
      !parsedOptions.A ||
      !parsedOptions.B ||
      !parsedOptions.C ||
      !parsedOptions.D
    ) {
      return res.status(400).json({
        message: "Options must include A, B, C, D",
      });
    }

    if (!["A", "B", "C", "D"].includes(correctAnswer)) {
      return res.status(400).json({
        message: "Correct answer must be A, B, C, or D",
      });
    }

    let questionImage = "";
    let explanationImage = "";

    if (req.files?.questionImage?.length > 0) {
      questionImage = `/quiz-lms/${req.files.questionImage[0].filename}`;
    }

    if (req.files?.explanationImage?.length > 0) {
      explanationImage = `/quiz-lms/${req.files.explanationImage[0].filename}`;
    }

  const quiz = await Quiz.create({
  courseId,
  question,
  options: parsedOptions,
  correctAnswer,
  explanation,

  // 🔥 FIXED: match schema
questionImage: questionImage || "",

  explanationImage
});
    res.json({
      success: true,
      message: "Question added successfully",
      quiz,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 UPDATE QUESTION (FIXED)
export const updateQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const {
      question,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    if (question) quiz.question = question;

    if (options) {
      try {
        quiz.options =
          typeof options === "string"
            ? JSON.parse(options)
            : options;
      } catch {
        return res.status(400).json({
          message: "Invalid options format",
        });
      }
    }

    if (correctAnswer) {
      if (!["A", "B", "C", "D"].includes(correctAnswer)) {
        return res.status(400).json({
          message: "Invalid correct answer",
        });
      }
      quiz.correctAnswer = correctAnswer;
    }

    if (explanation) quiz.explanation = explanation;

   if (req.files?.questionImage?.length > 0) {
  quiz.questionImage =
    `/quiz-lms/${req.files.questionImage[0].filename}`;
}

  if (req.files?.explanationImage?.length > 0) {
  quiz.explanationImage =
    `/quiz-lms/${req.files.explanationImage[0].filename}`;
}
    await quiz.save();

    res.json({
      success: true,
      message: "Question updated",
      quiz,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 DELETE QUESTION
export const deleteQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    await quiz.deleteOne();

    res.json({
      success: true,
      message: "Question deleted",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 SET QUIZ CONFIG
export const setQuizConfig = async (req, res) => {
  try {
    const { courseId, duration } = req.body;

    if (!courseId || !duration) {
      return res.status(400).json({
        message: "CourseId and duration required",
      });
    }

    const { hours = 0, minutes = 0, seconds = 0 } = duration;

    if (hours < 0 || minutes < 0 || seconds < 0) {
      return res.status(400).json({
        message: "Invalid duration values",
      });
    }

    if (minutes >= 60 || seconds >= 60) {
      return res.status(400).json({
        message: "Minutes/seconds must be < 60",
      });
    }

    let config = await QuizConfig.findOne({ courseId });

    if (!config) {
      config = await QuizConfig.create({ courseId, duration });
    } else {
      config.duration = duration;
      await config.save();
    }

    res.json({
      success: true,
      message: "Duration set successfully",
      duration,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 DELETE FULL QUIZ
export const deleteQuizByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const questions = await Quiz.find({ courseId });

    if (!questions.length) {
      return res.status(404).json({
        message: "No quiz found",
      });
    }

    await Quiz.deleteMany({ courseId });
    await QuizConfig.deleteOne({ courseId });

    res.json({
      success: true,
      message: "Quiz deleted completely",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};