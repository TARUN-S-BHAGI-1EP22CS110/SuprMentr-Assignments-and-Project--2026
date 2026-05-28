import React from "react";
import "./mycourses.css";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";
import axios from "axios";
import { server } from "../../main";
import { useEffect, useState } from "react";
const MyCourses = () => {
  const navigate = useNavigate();
  const { user } = UserData();
  const { courses } = CourseData();
  const [completedCount, setCompletedCount] = useState(0);
  const enrolledCourses = courses.filter((c) =>
    user?.enrolledCourses?.includes(c._id)
  );
useEffect(() => {
  const fetchCompleted = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/certificate`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setCompletedCount(data.certificates.length); // 🔥 THIS LINE
    } catch (err) {
      console.log(err);
    }
  };

  fetchCompleted();
}, []);
  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Hello, {user?.name?.toUpperCase()}!</h2>
        <p>Here's your learning progress for this week.</p>
      </div>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="icon">📘</div>
          <div>
            <p>Total Enrollments</p>
            <h3>{enrolledCourses.length}</h3>
          </div>
        </div>

     

        <div className="stat-card">
          <div className="icon">🎓</div>
          <div>
            <p>Enrolled Courses</p>
            <h3>{enrolledCourses.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon">✔️</div>
          <div>
            <p>Completed</p>
            <h3>{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* MY ENROLLMENTS */}
      <div className="section-header">
        <h3>My Enrollments</h3>
       
      </div>

      <div className="enrollments-grid">
        {enrolledCourses.map((course) => (
          <div className="course-card" key={course._id}>
            <h4>{course.title}</h4>
            <p className="enrolled">Enrolled: N/A</p>

            <span className="status">Enrolled</span>

            <button
              className="view-btn"
              onClick={() => navigate(`/my-course/${course._id}`)}
            >
              View
            </button>
          </div>
        ))}
      </div>

   
    </div>
  );
};

export default MyCourses;