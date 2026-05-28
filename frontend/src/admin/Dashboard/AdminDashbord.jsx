import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import "./dashboard.css";

const AdminDashbord = ({ user }) => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLectures: 0,
    totalUsers: 0,
  });


 useEffect(() => {
  if (!user) return;

  if (user.role !== "admin") {
    navigate("/");
    return;
  }

  const getStats = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/admin/dashboard`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  getStats();
}, [user, navigate]);

  return (
    <div className="main-content">
      <div className="box">
        <p>Total Courses</p>
        <p>{stats.totalCourses}</p>
      </div>

      <div className="box">
        <p>Total Lectures</p>
        <p>{stats.totalLectures}</p>
      </div>

      <div className="box">
        <p>Total Users</p>
        <p>{stats.totalUsers}</p>
      </div>
    </div>
  );
};

export default AdminDashbord;