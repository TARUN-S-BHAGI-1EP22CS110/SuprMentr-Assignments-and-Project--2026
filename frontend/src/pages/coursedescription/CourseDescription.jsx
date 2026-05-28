import React, { useEffect } from "react";
import "./coursedescription.css";
import { useParams, useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";

const CourseDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchCourse, course, deleteCourse } = CourseData();
  const { isAuth, user } = UserData();

  useEffect(() => {
    fetchCourse(id);
  }, [id, fetchCourse]);

  // ✅ Check if enrolled (safer)
  const isEnrolled =
    Array.isArray(user?.enrolledCourses) &&
    user.enrolledCourses.map(String).includes(String(id));

  // ❌ REMOVE THIS BLOCK (it hides your page)
  // useEffect(() => {
  //   if (isAuth && user && course) {
  //     if (isEnrolled) {
  //       navigate(`/course/study/${id}`);
  //     }
  //   }
  // }, [isAuth, user, course, isEnrolled, id, navigate]);
console.log("USER:", user);
console.log("ENROLLED COURSES:", user?.enrolledCourses);
console.log("CURRENT COURSE ID:", id);
console.log("IS ENROLLED:", isEnrolled);
  // ✅ Enroll function (unchanged)
  const handleEnroll = async () => {
    try {
      await fetch(`${server}/api/course/enroll/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });

      navigate(`/course/study/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Prevent blank page
  if (!course) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

 return (
  <div className="course-description">

    {/* 🔥 WRAPPER */}
    <div className="course-top">

      {/* HERO */}
      <div
        className="course-header"
        style={{
          backgroundImage: `url(${server}/${course.image})`,
        }}
      >
        <div className="course-info">
          <h2>{course.title}</h2>
          <p>Instructor: {course.createdBy}</p>
          <p>Duration: {course.duration} Weeks</p>
        </div>
      </div>

      {/* 🔥 CARD OUTSIDE HEADER */}
      <div className="course-card-box">
        <img
          src={`${server}/${course.image}`}
          alt=""
          className="card-image"
        />

        <p>📚 {course.duration} Weeks</p>
        <p>👨‍🏫 {course.createdBy}</p>

        <p className="start-text">Let’s get started 🚀</p>

        {isAuth ? (
          isEnrolled ? (
            <button
              onClick={() => navigate(`/course/study/${id}`)}
              className="common-btn"
            >
              Start Learning
            </button>
          ) : (
            <button onClick={handleEnroll} className="common-btn">
              Enroll Now
            </button>
          )
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="common-btn"
          >
            Get Started
          </button>
        )}

        {user?.role === "admin" && (
          <button
            className="common-btn delete-btn"
            onClick={() => deleteCourse(course._id)}
          >
            Delete Course
          </button>
        )}
      </div>

    </div>

    {/* BODY */}
    <div className="course-body">
      <h3>Description</h3>
      <p>{course.description}</p>
    </div>

  </div>
);
};

export default CourseDescription;