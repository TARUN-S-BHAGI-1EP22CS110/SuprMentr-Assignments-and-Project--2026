import React, { useEffect } from "react";
import "./dashboard.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";

const Dashbord = () => {
  const { mycourse, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchMyCourse();
  }, [fetchMyCourse]);

  return (
    <div className="dashboard">
      <h2>My Courses</h2>

      <div className="dashboard-container">
        {mycourse && mycourse.length > 0 ? (
          mycourse.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p className="empty-text">No Courses Yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashbord;