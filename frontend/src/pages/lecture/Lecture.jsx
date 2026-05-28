import React, { useEffect, useState, useCallback, useRef } from "react";
import "./lecture.css";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
const Lecture = ({ user }) => {
  const { id } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
const params = new URLSearchParams(search);

const lectureId = params.get("lecture");
const fromMyCourses = params.get("from") === "mycourses";

  // ================= STATE =================
  const [modules, setModules] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lecturePosition, setLecturePosition] = useState("");
  const [completed, setCompleted] = useState(0);
  const [completedLec, setCompletedLec] = useState(0);
  const [lectLength, setLectLength] = useState(0);

  const [_progress] = useState([]);
  const [_modulePosition, _setModulePosition] = useState("");
  const [openModules, setOpenModules] = useState({});
  const [completedIds, setCompletedIds] = useState([]);

  const timeRef = useRef(0);
  const intervalRef = useRef(null);

  // ================= FORM =================
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDesc, setLectureDesc] = useState("");
  const [lectureUrl, setLectureUrl] = useState("");
const [lectureDuration, setLectureDuration] = useState("");
  // ================= FETCH =================
  const fetchStructure = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/admin/module/${id}`,
        { headers: { token: localStorage.getItem("token") } }
      );

      setModules(data.modules);

      if (!current && data.modules.length > 0) {
        const first = data.modules[0]?.lectures[0];
        if (first) setCurrent(first);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load modules");
      setLoading(false);
    }
  }, [id, current]);
const fetchProgress = useCallback(async () => {
  try {
    const { data } = await axios.get(
      `${server}/api/course/progress/${id}`,
      {
        headers: { token: localStorage.getItem("token") },
      }
    );

    setCompleted(data.percentage);
    setCompletedLec(data.completedLectures);
    setLectLength(data.totalLectures);
    setCompletedIds(data.completedIds || []);
  } catch (err) {
    console.log(err);
  }
}, [id]);
  // ================= MODULE =================
  const addModule = async () => {
  const title = prompt("Module title");
  if (!title) return;

  // 🔥 NEW: ask for position
  let position = prompt("Enter position (optional)");

  // convert safely
  position = position ? Number(position) : undefined;

  try {
    await axios.post(
      `${server}/api/admin/module/${id}`,
      {
        title,
        position, // 🔥 send to backend
      },
      { headers: { token: localStorage.getItem("token") } }
    );

    toast.success("Module added");
    fetchStructure();
  } catch {
    toast.error("Error");
  }
};

  const deleteModule = async (moduleId) => {
    if (!window.confirm("Delete module?")) return;

    try {
      await axios.delete(
        `${server}/api/admin/module/${moduleId}`,
        { headers: { token: localStorage.getItem("token") } }
      );

      toast.success("Deleted");
      fetchStructure();
    } catch {
      toast.error("Error");
    }
  };

  // ================= LECTURE =================
  const convertEmbed = (url) => {
    if (url.includes("watch?v=")) {
      const id = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be")) {
      const id = url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const submitLecture = async () => {
  if (!lectureTitle || !lectureUrl) {
    toast.error("Fill all fields");
    return;
  }

  if (!selectedModule) {
    toast.error("Module not selected");
    return;
  }

  if (!lectureDuration || lectureDuration <= 0) {
    toast.error("Enter valid duration (seconds)");
    return;
  }

  try {
    await axios.post(
      `${server}/api/admin/lecture/${selectedModule}`,
      {
        title: lectureTitle,
        description: lectureDesc,
        videoUrl: convertEmbed(lectureUrl),
        duration: Number(lectureDuration), // ✅ USE MANUAL INPUT
        position: lecturePosition
          ? Number(lecturePosition)
          : undefined,
      },
      {
        headers: { token: localStorage.getItem("token") },
      }
    );

    toast.success("Lecture added");

    setLectureTitle("");
    setLectureDesc("");
    setLectureUrl("");
    setLecturePosition("");
    setLectureDuration(""); // ✅ reset
    setShowLectureForm(false);

    fetchStructure();
  } catch (err) {
    console.log(err);
    toast.error("Error adding lecture");
  }
};
  const deleteLecture = async (lectureId) => {
    if (!window.confirm("Delete lecture?")) return;

    try {
      await axios.delete(
        `${server}/api/admin/lecture/${lectureId}`,
        { headers: { token: localStorage.getItem("token") } }
      );

      toast.success("Deleted");
      fetchStructure();
    } catch {
      toast.error("Error");
    }
  };

  const toggleModule = (id) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ================= WATCH TIME =================
useEffect(() => {
  if (!current) return;

  if (intervalRef.current) clearInterval(intervalRef.current);

  intervalRef.current = setInterval(async () => {
    try {
      timeRef.current += 5;

      const res = await axios.post(
        `${server}/api/course/watch-time`,
        {
          lectureId: current._id,
          watchedSeconds: timeRef.current,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      // ✅ ONLY update sometimes
      if (res.data.completed) {
        fetchProgress(); // when lecture finished
      }

      // ✅ OR every 30 seconds
      if (timeRef.current % 30 === 0) {
        fetchProgress();
      }

    } catch (err) {
      console.log(err);
    }
  }, 5000);

  return () => clearInterval(intervalRef.current);

}, [current, fetchProgress]);
useEffect(() => {
  const loadData = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/admin/module/${id}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      setModules(data.modules);

      if (data.modules.length > 0) {

  if (fromMyCourses && lectureId) {
    let found = null;

    for (let mod of data.modules) {
      const lec = mod.lectures.find(
        (l) => l._id === lectureId
      );
      if (lec) {
        found = lec;
        break;
      }
    }

    if (found) {
      setCurrent(found);
    } else {
      const first = data.modules[0]?.lectures[0];
      if (first) setCurrent(first);
    }

  } else {
    const first = data.modules[0]?.lectures[0];
    if (first) setCurrent(first);
  }
}
      const progress = await axios.get(
        `${server}/api/course/progress/${id}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      setCompleted(progress.data.percentage);
      setCompletedLec(progress.data.completedLectures);
      setLectLength(progress.data.totalLectures);
      setCompletedIds(progress.data.completedIds || []);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [id, lectureId, fromMyCourses]); // ✅ ONLY id
  // ================= UI =================
return loading ? (
  <Loading />
) : (
  <>
    {/* ================= PROGRESS ================= */}
    <div className="progress">
      {completedLec}/{lectLength} completed

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${completed}%` }}
        />
      </div>

      {completed}%
    </div>
    {/* ================= QUIZ BUTTON ================= */}
{/* ================= QUIZ BUTTON ================= */}
<div style={{ textAlign: "center", margin: "20px 0" }}>
  <button
    className="quiz-btn"
    disabled={completed < 100}
    onClick={() => navigate(`/quiz-start/${id}`)}
  >
    Take Quiz
  </button>

  {completed < 100 && (
    <p style={{ color: "#dc2626", marginTop: "8px" }}>
      🔒 Complete all lectures to unlock quiz
    </p>
  )}

  {completed === 100 && (
    <p style={{ color: "#16a34a", marginTop: "8px" }}>
      🎉 Quiz unlocked!
    </p>
  )}
</div>
    {/* ================= MAIN ================= */}
    <div className="lecture-page">
      
      {/* ================= LEFT (VIDEO) ================= */}
      <div className="left">
        {current ? (
          <>
            <div className="video-box">
              <iframe
                width="100%"
                height="400"
                src={`${convertEmbed(
                  current.videoUrl
                )}?rel=0&modestbranding=1&controls=1&disablekb=1`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="lecture-title">
              {current.title}
            </div>
          </>
        ) : (
          <h2>No Lecture Available</h2>
        )}
      </div>

      {/* ================= RIGHT (MODULES) ================= */}
      <div className="right">
        
        {/* ADMIN BUTTON */}
        {user?.role === "admin" && (
          <button className="add-btn" onClick={addModule}>
            + Add Module
          </button>
        )}

        {/* MODULE LIST */}
        {modules.map((mod) => (
          <div key={mod._id} className="module-box">

            {/* MODULE HEADER */}
            <div
              className="module-header"
              onClick={() => toggleModule(mod._id)}
            >
              {openModules[mod._id] ? "▼" : "▶"} {mod.title}
            </div>

            {/* ADMIN OPTIONS */}
            {user?.role === "admin" && (
              <>
                <button
                  onClick={() => {
                    setSelectedModule(mod._id);
                    setShowLectureForm(true);
                  }}
                >
                  
                  + Lecture
                </button>
                

                <button onClick={() => deleteModule(mod._id)}>
                  ❌ Module
                </button>
              </>
            )}

            {/* LECTURES */}
           {openModules[mod._id] &&
  mod.lectures.map((lec) => {
    const isCompleted = completedIds.includes(
      lec._id.toString()
    );

    return (
      <div
        key={lec._id}
        className={`lecture-item ${
          current?._id === lec._id ? "active" : ""
        }`}
        onClick={() => {
          timeRef.current = 0;
          setCurrent(lec);
        }}
      >
        <span>
          {lec.order}. {lec.title}
        </span>

        <div>
          {/* ✅ ONLY REAL COMPLETION */}
          {isCompleted && (
            <TiTick style={{ color: "black", fontSize: "20px" }} />
          )}

          {/* ❌ REMOVE THIS ENTIRE BUTTON BLOCK */}

          {/* ADMIN DELETE */}
          {user?.role === "admin" && (
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteLecture(lec._id);
              }}
            >
              X
            </button>
          )}
        </div>
      </div>
    );
  })}
          </div>
        ))}

        {/* ================= FORM ================= */}
        {showLectureForm && (
          <div className="module-form">
            <input
              placeholder="Title"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
            <input
              placeholder="Description"
              value={lectureDesc}
              onChange={(e) => setLectureDesc(e.target.value)}
            />
            <input
              placeholder="YouTube URL"
              value={lectureUrl}
              onChange={(e) => setLectureUrl(e.target.value)}
            />
            
            <input
              placeholder="Position"
              type="number"
              value={lecturePosition}
              onChange={(e) => setLecturePosition(e.target.value)}
            />
             <input
  placeholder="Duration (seconds)"
  type="number"
  value={lectureDuration}
  onChange={(e) => setLectureDuration(e.target.value)}
/>
            <button onClick={submitLecture}>
              Add Lecture
            </button>

            <button onClick={() => setShowLectureForm(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  </>
);
};

export default Lecture;