import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";

const categories = [
  "Programming",
  "DSA",
  "Office Tools",
  "System Core",
  "Security",
  "Mobile Development",
  "Networking",
  "Web Development",
  "Database",
  "AI & Data Science",
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  // ✅ allow admin + superadmin
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "superadmin") {
      navigate("/");
    }
  }, [user, navigate]);

  const { courses, fetchCourses } = CourseData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  // ✅ image handler
  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  // ✅ submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("image", image); // ✅ match backend multer

    try {
      const { data } = await axios.post(
        `${server}/api/admin/course`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);

      await fetchCourses();

      // reset form
      setTitle("");
      setDescription("");
      setCategory(categories[0]);
      setCreatedBy("");
      setDuration("");
      setImage(null);
      setImagePrev("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding course");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-courses">

 
      <div className="left">
        <h1>All Courses</h1>

        <div className="dashboard-content">
          {courses && courses.length > 0 ? (
            courses.map((e) => (
  <div key={e._id} style={{ marginBottom: "20px" }}>

    <CourseCard course={e} />

    {/* 🔥 ADD THIS BUTTON */}
    <button
      onClick={() => navigate(`/admin/quiz/${e._id}`)}
      className="manage-quiz-btn"
    >
      Manage Quiz
    </button>

  </div>
))
          ) : (
            <p>No Courses Yet</p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
        <div className="add-course">
          <div className="course-form">
            <h2>Add Course</h2>

            <form onSubmit={submitHandler}>

              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <label>Created By</label>
              <input
                type="text"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
              />

              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <label>Duration</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />

              <label>Course Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={changeImageHandler}
                required
              />

              {imagePrev && (
                <img
                  src={imagePrev}
                  alt="preview"
                  width={250}
                  style={{ marginTop: "10px" }}
                />
              )}

              <button
                type="submit"
                disabled={btnLoading}
                className="common-btn"
              >
                {btnLoading ? "Please Wait..." : "Add Course"}
              </button>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminCourses;