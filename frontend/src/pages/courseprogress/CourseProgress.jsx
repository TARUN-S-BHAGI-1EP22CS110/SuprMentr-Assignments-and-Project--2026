import React, { useEffect, useState } from "react";
import "./courseprogress.css";
import { useParams, useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import axios from "axios";
import { server } from "../../main";

const CourseProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchCourse,
    course,
    progress,
    fetchProgress,
    lectures,
    fetchLectures,
  } = CourseData();

  const [continueData, setContinueData] = useState(null);



  // 🔥 CONTINUE WATCHING DATA
 const getContinueWatching = async () => {
  try {
    const { data } = await axios.get(
      `${server}/api/course/continue`,
      {
        headers: { token: localStorage.getItem("token") },
      }
    );

    const current = data.data.find(
  (c) => c.courseId?.toString() === id
);
    setContinueData(current);
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  const loadData = async () => {
    await fetchCourse(id);
    await fetchProgress(id);
    await fetchLectures(id);
    await getContinueWatching();
  };

  loadData();

  // eslint-disable-next-line
}, [id]);

  // 🔥 NEXT LECTURE LOGIC
const getNextLecture = () => {
  if (!lectures || lectures.length === 0) {
    console.log("No lectures loaded yet");
    return null;
  }

  const completed = progress?.completedLectures || [];

  if (completed.length === 0) {
    return lectures[0];
  }

  for (let lec of lectures) {
    if (!completed.includes(lec._id)) {
      return lec;
    }
  }

  return lectures[0];
};
  if (!course) return <h2>Loading...</h2>;

  return (
    <div className="cp-page">

      {/* HEADER */}
      <div className="cp-header">
        <button onClick={() => navigate(-1)}>←</button>
        <div>
          <h1>{course.title}</h1>
          <p>Course Details & Progress Tracking</p>
        </div>
      </div>

      {/* PROGRESS CARD */}
      <div className="cp-card">

        {/* 🔥 CIRCLE */}
        <div className="cp-circle">
          <img
    src={`${server}/${course.image}`}
    alt="course"
    className="cp-course-img"
  />

          <div className="cp-text">
            {progress.percentage}%
            <span>Progress</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="cp-right">
          <h3>Learning Progress</h3>
          <p>Track your learning journey</p>

          <div className="cp-stats">
            <div>
              <h2>{progress.percentage}%</h2>
              <p>Completed</p>
            </div>

            <div>
              <h2>{100 - progress.percentage}%</h2>
              <p>Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="cp-bottom">
        <div className="cp-box">
          <p>Total Modules</p>
          <h3>
            {[...new Set(lectures.map((l) => l.module))].length}
          </h3>
        </div>

        <div className="cp-box">
          <p>Total Lessons</p>
          <h3>{lectures.length}</h3>
        </div>

        <div className="cp-box">
          <p>Duration</p>
          <h3>{course.duration || 0}</h3>
        </div>
      </div>

      {/* 🔥 BUTTON SECTION */}
      <div className="cp-actions">

       {continueData ? (
  <button
    className="primary"
    onClick={() =>
      navigate(
        `/course/study/${id}?lecture=${continueData.lectureId}&time=${continueData.watchedSeconds}&from=mycourses`
      )
    }
  >
    ▶ Continue Watching
  </button>
) : (
  <button
    className="primary"
    onClick={() => {
      if (!lectures || lectures.length === 0) {
        navigate(`/course/study/${id}`);
        return;
      }

      const first = lectures[0];
      navigate(`/course/study/${id}?lecture=${first._id}`);
    }}
  >
    ▶ Start Course
  </button>
)}
       

        {/* GO TO COURSE (NEXT LECTURE) */}
        <button
          className="secondary"
         onClick={() => {
  if (!lectures || lectures.length === 0) {
    // 🔥 go to course page (empty lectures page)
    navigate(`/course/study/${id}`);
    return;
  }

  const nextLecture = getNextLecture();

  navigate(
    `/course/study/${id}?lecture=${nextLecture?._id || ""}&from=mycourses`
  );
}}

        >
          Go to Course
        </button>

      </div>

    </div>
  );
};

export default CourseProgress;