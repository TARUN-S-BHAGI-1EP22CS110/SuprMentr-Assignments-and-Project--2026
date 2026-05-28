import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import { Progress } from "../models/Progress.js";
import { Module } from "../models/Module.js";
import mongoose from "mongoose";


const convertToEmbed = (url) => {
  if (!url) return url;

  if (url.includes("youtube.com/watch")) {
    const id = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be")) {
    const id = url.split("/").pop();
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
};


export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find().sort({ createdAt: -1 });
  res.json({ total: courses.length, courses });
});


export const getLectures = TryCatch(async (req, res) => {
  const { courseId } = req.params;

  const modules = await Module.find({ course: courseId });
  if (!modules.length) return res.json({ lectures: [] });

  const moduleIds = modules.map((m) => m._id);

  let lectures = await Lecture.find({
    module: { $in: moduleIds },
  }).sort({ module: 1, order: 1 }); // FIXED SORT

  lectures = lectures.map((l) => ({
    ...l._doc,
    videoUrl: convertToEmbed(l.videoUrl),
  }));

  res.json({ lectures });
});


// ================= WATCH TIME =================

export const updateWatchTime = TryCatch(async (req, res) => {
  const { lectureId, watchedSeconds } = req.body;

  const lecture = await Lecture.findById(lectureId).populate("module");

  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  // ✅ USE ONLY DATABASE DURATION
  const duration = lecture.duration;

  if (!duration || duration <= 0) {
    return res.status(400).json({
      message: "Lecture duration not set",
    });
  }

  const courseId = lecture.module?.course;

  // ================= FIND / CREATE =================
  let progress = await Progress.findOne({
    user: req.user._id,
    course: courseId,
  });

  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      course: courseId,
      watchTime: [],
      completedLectures: [],
      totalLectures: 0,
      progressPercentage: 0,
    });
  }

  let lp = progress.watchTime.find(
    (l) => l.lecture.toString() === lectureId
  );

  if (!lp) {
    lp = {
      lecture: lectureId,
      watchedSeconds: 0,
      completed: false,
      lastWatchedAt: new Date(),
    };
    progress.watchTime.push(lp);
  }

  // ================= SAFE WATCH =================
  let current = Math.min(watchedSeconds, duration);

  if (current < lp.watchedSeconds) {
    current = lp.watchedSeconds;
  }

  const MAX_DELTA = 40;
  if (current - lp.watchedSeconds > MAX_DELTA) {
    current = lp.watchedSeconds + MAX_DELTA;
  }

  lp.watchedSeconds = current;
  lp.lastWatchedAt = new Date();

  // ================= COMPLETION =================
  const threshold = Math.floor(duration * 0.9); // ✅ PURE DB LOGIC

  if (current >= threshold) {
    lp.completed = true;
  }

  // ================= REBUILD =================
  const uniqueCompleted = [
    ...new Set(
      progress.watchTime
        .filter((w) => w.completed)
        .map((w) => w.lecture.toString())
    ),
  ];

  progress.completedLectures = uniqueCompleted.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  // ================= TOTAL =================
  const moduleIds = await Module.find({ course: courseId }).distinct("_id");

  const totalLectures = await Lecture.countDocuments({
    module: { $in: moduleIds },
  });

  progress.totalLectures = totalLectures;

  progress.progressPercentage = totalLectures
    ? Math.floor(
        (progress.completedLectures.length / totalLectures) * 100
      )
    : 0;

  progress.markModified("watchTime");
  await progress.save();

  res.json({
    message: "Updated",
    watchedSeconds: lp.watchedSeconds,
    completed: lp.completed,
  });
});
export const getWatchPosition = TryCatch(async (req, res) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId).select("module");

  if (!lecture) {
    return res.json({ watchedSeconds: 0 });
  }

  const module = await Module.findById(lecture.module).select("course");

  if (!module) {
    return res.json({ watchedSeconds: 0 });
  }

  const progress = await Progress.findOne({
    user: req.user._id,
    course: module.course,
  });

  if (!progress) {
    return res.json({ watchedSeconds: 0 });
  }

  const lp = progress.watchTime.find(
    (l) => l.lecture.toString() === lectureId
  );

  res.json({
    watchedSeconds: lp?.watchedSeconds || 0,
  });
});
export const enrollCourse = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }


  if (!user.enrolledCourses) {
    user.enrolledCourses = [];
  }

  const courseId = req.params.courseId;

 
  const alreadyEnrolled = user.enrolledCourses.some(
    (id) => id.toString() === courseId
  );

  if (!alreadyEnrolled) {
    user.enrolledCourses.push(courseId);
    await user.save();
  }

  res.json({ message: "Enrolled successfully" });
});

export const getCourseStructure = TryCatch(async (req, res) => {
  const modules = await Module.find({
    course: req.params.courseId,
  })
    .populate("lectures")
    .sort({ order: 1 });

  res.json({ modules });
});
export const getProgress = TryCatch(async (req, res) => {
  const courseId = req.params.courseId;

  const progress = await Progress.findOne({
    user: req.user._id,
    course: courseId,
  });

  const moduleIds = await Module.find({ course: courseId }).distinct("_id");

  const totalLectures = await Lecture.countDocuments({
    module: { $in: moduleIds },
  });

  if (!progress) {
    return res.json({
      percentage: 0,
      completedLectures: 0,
      totalLectures,
      completedIds: [],
    });
  }

  res.json({
    percentage: progress.progressPercentage,
    completedLectures: progress.completedLectures.length,
    totalLectures,
    completedIds: progress.completedLectures,
  });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).populate("enrolledCourses");
  res.json({ courses: user.enrolledCourses });
});

export const getCourseById = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json({ course });
});
// ================= NEXT =================
export const getNextLecture = TryCatch(async (req, res) => {
  const l = await Lecture.findById(req.params.lectureId);

  const next = await Lecture.findOne({
    module: l.module,
    order: l.order + 1,
  });

  res.json({ next });
});


// ================= PREV =================
export const getPrevLecture = TryCatch(async (req, res) => {
  const l = await Lecture.findById(req.params.lectureId);

  const prev = await Lecture.findOne({
    module: l.module,
    order: l.order - 1,
  });

  res.json({ prev });
});


// ================= CONTINUE WATCHING =================
export const continueWatching = TryCatch(async (req, res) => {
  const userId = req.user._id;

  const progresses = await Progress.find({ user: userId })
    .populate("course")
    .populate({
      path: "watchTime.lecture",
      populate: { path: "module" },
    });

  const result = [];

  for (let p of progresses) {
    if (!p.watchTime.length) continue;

    const sorted = [...p.watchTime].sort(
      (a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)
    );

    const last = sorted[0];
    if (!last?.lecture) continue;

    result.push({
      courseId: p.course?._id,
      courseTitle: p.course?.title,
      lectureId: last.lecture._id,
      lectureTitle: last.lecture.title,
      moduleId: last.lecture.module?._id,
      moduleTitle: last.lecture.module?.title,
      watchedSeconds: last.watchedSeconds,
    });
  }

  res.json({
    message: "Continue watching data",
    data: result,
  });
});