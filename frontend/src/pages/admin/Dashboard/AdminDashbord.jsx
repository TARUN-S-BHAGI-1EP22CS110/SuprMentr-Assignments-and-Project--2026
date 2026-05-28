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
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const { data } = await axios.get(`${server}/api/stats`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        setStats(data.stats);
      } catch (error) {
        console.log(error);
      }
    };

    getStats();
  }, []);

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