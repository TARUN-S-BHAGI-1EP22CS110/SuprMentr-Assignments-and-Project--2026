import React, { useState } from "react";
import "./courseCard.css";
import { server } from "../../main";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";
import toast from "react-hot-toast";
import axios from "axios";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { isAuth, user } = UserData();
  const { fetchCourses } = CourseData();

  const [loading, setLoading] = useState(false);

  // ================= DELETE =================
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      setLoading(true);

      const { data } = await axios.delete(
        `${server}/api/admin/course/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      fetchCourses();

    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SAFE FALLBACKS =================
  const imageUrl = course?.image
    ? `${server}/${course.image}`
    : "https://via.placeholder.com/300x200?text=Course";

  const title = course?.title || "Untitled Course";
  const instructor = course?.createdBy || "Unknown";
  const duration = course?.duration || "N/A";

  // ================= NAVIGATION =================
const handleStart = () => {
  if (!course?._id) return;

  if (!isAuth) return navigate("/login");

  // ✅ GO TO ENROLL PAGE FIRST
  navigate(`/course/${course._id}`);
};

  // ================= UI =================
  return (
    <div className="course-card">

      {/* IMAGE */}
      <img
        src={imageUrl}
        alt={title}
        className="course-image"
      />

      {/* CONTENT */}
      <div className="course-content">
        <h3 className="course-title">{title}</h3>

        <p className="course-info">
          👨‍🏫 {instructor}
        </p>

        <p className="course-info">
          ⏱ {duration} Weeks
        </p>
      </div>

      {/* BUTTONS */}
      <div className="btn-group">
        <button
          className="common-btn"
          onClick={handleStart}
        >
          Start Learning
        </button>

        {user?.role === "admin" && (
          <button
            className="delete-btn"
            disabled={loading}
            onClick={() => deleteHandler(course._id)}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;