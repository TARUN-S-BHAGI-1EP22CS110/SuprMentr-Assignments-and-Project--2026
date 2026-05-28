import React from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();

  const {
    courses,
    filteredCourses,
    search,
    setSearch,
    category,
    setCategory,
  } = CourseData();

  return (
    <div className="courses">
      <h2>Available Courses</h2>

    
      <div style={{ marginBottom: "20px" }}>
        
       
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="all">All Categories</option>
          <option value="Programming">Programming</option>
          <option value="DSA">DSA</option>
          <option value="Web Development">Web Development</option>
          <option value="AI & Data Science">AI & Data Science</option>
          <option value="Networking">Networking</option>
        </select>

        
        <button
          onClick={() => navigate("/my-courses")}
          style={{
            padding: "8px 16px",
            background: "#6a5acd",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          My Courses
        </button>

      </div>

      <div className="course-container">
        {(filteredCourses.length ? filteredCourses : courses).length > 0 ? (
          (filteredCourses.length ? filteredCourses : courses).map((e) => (
            <CourseCard key={e._id} course={e} />
          ))
        ) : (
          <p>No Courses Found!</p>
        )}
      </div>

     

    </div>
  );
};

export default Courses;