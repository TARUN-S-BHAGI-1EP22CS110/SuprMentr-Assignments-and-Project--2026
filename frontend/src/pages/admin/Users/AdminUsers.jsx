import React, { useEffect, useState } from "react";
import "./users.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import toast from "react-hot-toast";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  // ✅ allow admin + superadmin
  useEffect(() => {
    if (
      user &&
      user.role !== "admin" &&
      user.role !== "superadmin"
    ) {
      navigate("/");
    }
  }, [user, navigate]);

  // ✅ fetch users (correct API)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/admin/users`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const updateRole = async (id) => {
    if (window.confirm("Are you sure you want to update this user role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/admin/user/${id}`, // ✅ FIXED
          {},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);

        // refresh users
        const res = await axios.get(
          `${server}/api/admin/users`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        setUsers(res.data.users);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  return (
    <div className="users">
      <h1>All Users</h1>

      <table border="1">
        <thead>
          <tr>
            <td>#</td>
            <td>Name</td>
            <td>Email</td>
            <td>Role</td>
            <td>Update Role</td>
          </tr>
        </thead>

        <tbody>
          {users.map((e, i) => (
            <tr key={e._id}>
              <td>{i + 1}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.role}</td>
              <td>
                {/* ✅ only superadmin can update */}
                {user?.role === "superadmin" ? (
                  <button
                    onClick={() => updateRole(e._id)}
                    className="common-btn"
                  >
                    Update Role
                  </button>
                ) : (
                  <span style={{ color: "gray" }}>Not Allowed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;