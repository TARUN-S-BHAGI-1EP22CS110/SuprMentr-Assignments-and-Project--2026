import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import { UserData } from "./UserContext";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);

  // ================= EXISTING =================
  const [progress, setProgress] = useState({
    completedLectures: [],
    percentage: 0,
  });

  // ================= 🔥 FILTER STATES =================
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showEnrolled, setShowEnrolled] = useState(false);

  const { user } = UserData(); // needed for enrolled filter

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${server}/api/course`);
      setCourses(data.courses || data);
    } catch (e) {
      console.log(e);
    }
  };

 useEffect(() => {
  const load = async () => {
    await fetchCourses();
  };
  load();
}, []);
const fetchCourse = async (id) => {
  try {
    const { data } = await axios.get(
      `${server}/api/course/${id}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    setCourse(data.course || data);
  } catch (e) {
    console.log("FETCH COURSE ERROR:", e.response?.data || e.message);
  }
};
  // ================= 🔥 FILTER LOGIC =================
  const filteredCourses = courses.filter((course) => {
    // SEARCH
    const matchSearch = (course.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    // CATEGORY (case safe)
    const matchCategory =
      category === "all" ||
      (course.category || "").toLowerCase() === category.toLowerCase();

    // ENROLLED FILTER (optional)
    const matchEnrolled =
      !showEnrolled ||
      user?.enrolledCourses?.some(
        (id) => id.toString() === course._id.toString()
      );

    return matchSearch && matchCategory && matchEnrolled;
  });

  // ================= DELETE COURSE =================
  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${server}/api/admin/course/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      fetchCourses();
    } catch (e) {
      console.log(e);
    }
  };

  // ================= LECTURES =================
 const fetchLectures = async (id) => {
  try {
    const { data } = await axios.get(
      `${server}/api/course/lecture/${id}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    setLectures(data.lectures);
  } catch (error) {
    console.log(error);
  }
};
  const addLecture = async (
    courseId,
    title,
    description,
    videoUrl,
    module,
    moduleTitle
  ) => {
    try {
      await axios.post(
        `${server}/api/course/lecture/${courseId}`,
        {
          title,
          description,
          videoUrl,
          module,
          moduleTitle,
        },
        { headers: { token: localStorage.getItem("token") } }
      );
      fetchLectures(courseId);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteLecture = async (lectureId, courseId) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await axios.delete(
        `${server}/api/course/lecture/${lectureId}`,
        { headers: { token: localStorage.getItem("token") } }
      );
      fetchLectures(courseId);
      fetchProgress(courseId);
    } catch (e) {
      console.log(e);
    }
  };

  // ================= MODULE =================
  const deleteModule = async (courseId, module) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await axios.post(
        `${server}/api/course/module/${courseId}`,
        { module },
        { headers: { token: localStorage.getItem("token") } }
      );
      fetchLectures(courseId);
      fetchProgress(courseId);
    } catch (e) {
      console.log(e);
    }
  };

  // ================= PROGRESS =================
  const fetchProgress = async (courseId) => {
    try {
      const { data } = await axios.get(
        `${server}/api/course/progress/${courseId}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      setProgress({
        completedLectures: data.completedLectures || [],
        percentage: data.percentage || 0,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const addProgress = async (courseId, lectureId) => {
    try {
      await axios.post(
        `${server}/api/course/progress?course=${courseId}&lectureId=${lectureId}`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      fetchProgress(courseId);
    } catch (e) {
      console.log(e);
    }
  };

  // ================= PROVIDER =================
  return (
    <CourseContext.Provider
      value={{
        courses,
        filteredCourses,
        lectures,
        progress,
        course,
        fetchCourse,

        // 🔥 FILTER EXPORTS
        search,
        setSearch,
        category,
        setCategory,
        showEnrolled,
        setShowEnrolled,

        // EXISTING
        fetchCourses,
        deleteCourse,
        fetchLectures,
        addLecture,
        deleteLecture,
        deleteModule,
        fetchProgress,
        addProgress,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);