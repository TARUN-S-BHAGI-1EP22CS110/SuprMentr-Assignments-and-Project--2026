import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import "./account.css";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";

import axios from "axios";
import { server } from "../../main";

const Account = () => {
  const { user, setIsAuth, setUser } = UserData();
   const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };
 
  const updateHandler = async () => {
    try {
      const { data } = await axios.put(
        `${server}/api/user/update`,
        { name, email },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);

    
      setUser(data.user);

      setEdit(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    }
  };
return (
    <div className="container">
      {user && (
        <div className="profile">
          <h2>My Profile</h2>

          <div className="profile-info">

           
            {edit ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="profile-input"
                  placeholder="Enter name"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="profile-input"
                  placeholder="Enter email"
                />

                <button
                  onClick={updateHandler}
                  className="common-btn"
                  style={{ background: "#22c55e" }}
                >
                  Save
                </button>

                <button
                  onClick={() => setEdit(false)}
                  className="common-btn"
                  style={{ background: "#ef4444" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Name - {user.name}</strong>
                </p>

                <p>
                  <strong>Email - {user.email}</strong>
                </p>

                <button
                  onClick={() => setEdit(true)}
                  className="common-btn"
                  style={{ background: "#2563eb" }}
                >
                  Edit Profile
                </button>
              </>
            )}

          
            <button
              onClick={() => navigate("/")}
              className="common-btn"
            >
              <MdDashboard />
              Dashboard
            </button>

          
            {user.role === "admin" && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="common-btn"
              >
                <MdDashboard />
                Admin Dashboard
              </button>
            )}

          
            <button
              onClick={logoutHandler}
              className="common-btn"
              style={{ background: "red" }}
            >
              <IoMdLogOut />
              Logout
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Account;