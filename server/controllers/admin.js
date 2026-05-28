import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { Module } from "../models/Module.js";
import { Progress } from "../models/Progress.js";
import { User } from "../models/User.js";

// ======================================================
// 🟢 CREATE COURSE
// ======================================================
export const createCourse = TryCatch(async (req, res) => {
  const { title, description, duration, category, createdBy } = req.body;

  const course = await Courses.create({
    title,
    description,
    duration,
    category,
    createdBy,
    image: req.file?.path || "",
  });

  res.json({ message: "Course created", course });
});


// ======================================================
// 🔴 DELETE COURSE
// ======================================================
export const deleteCourse = TryCatch(async (req, res) => {
  const { courseId } = req.params;

  // delete modules and lectures linked to course
  const modules = await Module.find({ course: courseId });

  for (let m of modules) {
    await Lecture.deleteMany({ module: m._id });
  }

  await Module.deleteMany({ course: courseId });

  // delete progress
  await Progress.deleteMany({ course: courseId });

  // delete course
  await Courses.findByIdAndDelete(courseId);

  res.json({ message: "Course deleted" });
});


// ======================================================
// 🟣 ADD MODULE
// ======================================================
export const addModule = TryCatch(async (req, res) => {
  const { courseId } = req.params;
  const { title, position } = req.body;

  let finalPosition;

  if (
    position !== undefined &&
    position !== null &&
    position !== "" &&
    !isNaN(position) &&
    Number(position) > 0
  ) {
    finalPosition = Number(position);
  }

  // ✅ ONLY check undefined
  if (finalPosition === undefined) {
    const lastModule = await Module.find({ course: courseId })
      .sort({ order: -1 })
      .limit(1);

    finalPosition = lastModule.length ? lastModule[0].order + 1 : 1;
  } else {
    await Module.updateMany(
      { course: courseId, order: { $gte: finalPosition } },
      { $inc: { order: 1 } }
    );
  }

  const module = await Module.create({
    title,
    course: courseId,
    order: finalPosition,
    lectures: [],
  });

  await Courses.findByIdAndUpdate(courseId, {
    $push: { modules: module._id },
  });

  res.json({ message: "Module added", module });
});
// ======================================================
// 🔴 DELETE MODULE
// ======================================================
export const deleteModule = TryCatch(async (req, res) => {
  const { moduleId } = req.params;

  const module = await Module.findById(moduleId);

  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }

  const lectures = await Lecture.find({ module: moduleId });
  const lectureIds = lectures.map((l) => l._id);

  await Lecture.deleteMany({ module: moduleId });

  await Progress.updateMany(
    {},
    { $pull: { completedLectures: { $in: lectureIds } } }
  );

  await Courses.updateMany({}, { $pull: { modules: moduleId } });

  await Module.findByIdAndDelete(moduleId);

  // 🔥 FIX ORDER GAP
  await Module.updateMany(
    { course: module.course, order: { $gt: module.order } },
    { $inc: { order: -1 } }
  );

  res.json({ message: "Module deleted" });
});

// ======================================================
// 🟣 GET MODULES
// ======================================================
export const getModules = TryCatch(async (req, res) => {
  const { courseId } = req.params;

  const modules = await Module.find({ course: courseId })
    .populate({
      path: "lectures",
      options: { sort: { order: 1 } },
    })
    .sort({ order: 1 });

  res.json({ modules });
});


// ======================================================
// 🎥 ADD LECTURE (MODULE BASED)
// ======================================================

export const addLecture = TryCatch(async (req, res) => {
  const { moduleId } = req.params;
  const { title, description, videoUrl, position, duration } = req.body;

  const module = await Module.findById(moduleId);

  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }

  let finalPosition =
    position !== undefined && position !== null
      ? Number(position)
      : undefined;

  if (finalPosition === undefined) {
    const lastLecture = await Lecture.find({ module: moduleId })
      .sort({ order: -1 })
      .limit(1);

    finalPosition = lastLecture.length ? lastLecture[0].order + 1 : 1;
  } else {
    await Lecture.updateMany(
      { module: moduleId, order: { $gte: finalPosition } },
      { $inc: { order: 1 } }
    );
  }

  // ✅ VALIDATE DURATION
  if (!duration || duration <= 0) {
    return res.status(400).json({
      message: "Please enter valid duration in seconds",
    });
  }

  // ✅ CREATE LECTURE
const lecture = await Lecture.create({
  title,
  description,
  videoUrl,

  module: moduleId,

  order: finalPosition,

  duration: Number(duration),

  completionThreshold: 90,

  videoType: "youtube",
});

  // ✅ ADD TO MODULE
  module.lectures.push(lecture._id);
  await module.save();

  // ✅ RESPONSE
  res.json({
    message: "Lecture added",
    lecture,
  });
});


// ======================================================
// 🔴 DELETE LECTURE
// ======================================================
export const deleteLecture = TryCatch(async (req, res) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  // remove from module
  await Module.findByIdAndUpdate(lecture.module, {
    $pull: { lectures: lectureId },
  });

  // delete lecture
  await Lecture.findByIdAndDelete(lectureId);

  // 🔥 REMOVE FROM PROGRESS
  await Progress.updateMany(
    {},
    { $pull: { completedLectures: lectureId } }
  );

  // 🔥 FIX ORDER GAP
  await Lecture.updateMany(
    { module: lecture.module, order: { $gt: lecture.order } },
    { $inc: { order: -1 } }
  );

  res.json({ message: "Lecture deleted" });
});


// ======================================================
// 🟣 COURSE STRUCTURE (NPTEL STYLE)
// ======================================================
export const getCourseStructure = TryCatch(async (req, res) => {
  const { courseId } = req.params;

  const modules = await Module.find({ course: courseId })
    .populate({
      path: "lectures",
      options: { sort: { order: 1 } },
    })
    .sort({ order: 1 });

  res.json({ modules });
});


// ======================================================
// 📊 ADMIN DASHBOARD
// ======================================================
export const getDashboardData = TryCatch(async (req, res) => {
  const totalCourses = await Courses.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalModules = await Module.countDocuments();
  const totalLectures = await Lecture.countDocuments();
  const totalProgress = await Progress.countDocuments();

  res.json({
    totalCourses,
    totalUsers,
    totalModules,
    totalLectures,
    totalProgress,
  });
});
export const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find().select("-password");

  res.json({
    users,
  });
});

export const updateUserRole = TryCatch(async (req, res) => {

  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // toggle role automatically
  user.role =
    user.role === "admin"
      ? "user"
      : "admin";

  await user.save();

  res.json({
    message: "Role updated successfully",
    user,
  });

});