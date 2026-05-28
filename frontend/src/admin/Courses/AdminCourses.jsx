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

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

const {
  courses,
  filteredCourses,
  fetchCourses,
  search,
  setSearch,
  category: filterCategory,
  setCategory: setFilterCategory,
  showEnrolled,
  setShowEnrolled,
} = CourseData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/admin/course`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      await fetchCourses();

      
      setTitle("");
      setDescription("");
      setCategory("");
      setCreatedBy("");
      setDuration("");
      setImage("");
      setImagePrev("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-courses">
      
      
      <div className="left">
        <h1>All Courses</h1>
         <div style={{ marginBottom: "20px" }}>
  

  <input
    type="text"
    placeholder="Search courses..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "8px",
      marginRight: "10px",
      width: "200px",
    }}
  />

 
  <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    style={{ padding: "8px", marginRight: "10px" }}
  >
    <option value="all">All Categories</option>
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  
  <button
  onClick={() => navigate("/my-courses")}
  style={{ padding: "8px 12px" }}
>
  My Courses
</button>

</div>
        <div className="dashboard-content">
  {courses && courses.length > 0 ? (
    (filteredCourses || courses).map((e) => (
      <div key={e._id}>

        <CourseCard course={e} />

        <button onClick={() => navigate(`/admin/quiz/${e._id}`)}>
          Manage Quiz
        </button>

      </div>
    ))
  ) : (
    <p>No Courses Yet</p>
  )}
</div>
      </div>

      
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
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <label>Duration (in hours)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />

              <label>Course Image</label>
              <input type="file" required onChange={changeImageHandler} />

              {imagePrev && (
                <img src={imagePrev} alt="preview" width={250} />
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