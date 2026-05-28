import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";
import { useParams } from "react-router-dom";
import "./AdminQuiz.css";

const AdminQuiz = () => {
  const { id: courseId } = useParams();
  console.log("courseId:", courseId);

  const [courseName, setCourseName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    question: "",
    A: "",
    B: "",
    C: "",
    D: "",
    correctAnswer: "A",
    explanation: "",
    questionImage: null,
    explanationImage: null,
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkQuestions, setBulkQuestions] = useState([]);

  const startEdit = (q) => {
    setEditingId(q._id);
    setEditForm({
      question: q.question,
      A: q.options.A,
      B: q.options.B,
      C: q.options.C,
      D: q.options.D,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
  };

 
  const saveEdit = async () => {
    try {
      await axios.put(
        `${server}/api/admin/quiz/${editingId}`,
        {
          question: editForm.question,
          options: JSON.stringify({
            A: editForm.A,
            B: editForm.B,
            C: editForm.C,
            D: editForm.D,
          }),
          correctAnswer: editForm.correctAnswer,
          explanation: editForm.explanation,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setEditingId(null);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/admin/quiz/course/${courseId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/course/${courseId}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        if (data.course) {
          setCourseName(data.course.title);
        } else if (data.title) {
          setCourseName(data.title);
        } else {
          setCourseName("Course");
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  useEffect(() => {
  if (courseId) fetchQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [courseId]);

  const addQuestion = async () => {
    if (
      !form.question ||
      !form.A ||
      !form.B ||
      !form.C ||
      !form.D ||
      !form.explanation
    ) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();

    formData.append("courseId", courseId);
    formData.append("question", form.question);

    formData.append(
      "options",
      JSON.stringify({
        A: form.A,
        B: form.B,
        C: form.C,
        D: form.D,
      })
    );

    formData.append("correctAnswer", form.correctAnswer);
    formData.append("explanation", form.explanation);

    if (form.questionImage) {
      formData.append("questionImage", form.questionImage);
    }

    if (form.explanationImage) {
      formData.append("explanationImage", form.explanationImage);
    }

    try {
      await axios.post(`${server}/api/admin/quiz`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      alert("Question added ✅");

      setForm({
        question: "",
        A: "",
        B: "",
        C: "",
        D: "",
        correctAnswer: "A",
        explanation: "",
        questionImage: null,
        explanationImage: null,
      });

      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding question");
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    await axios.delete(`${server}/api/admin/quiz/${id}`, {
      headers: { token: localStorage.getItem("token") },
    });

    fetchQuestions();
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return alert("No questions selected");

    if (!window.confirm("Delete selected questions?")) return;

    await Promise.all(
      selectedIds.map((id) =>
        axios.delete(`${server}/api/admin/quiz/${id}`, {
          headers: { token: localStorage.getItem("token") },
        })
      )
    );

    setSelectedIds([]);
    fetchQuestions();
  };

  const submitBulk = async () => {
    try {
      await Promise.all(
        bulkQuestions.map((q) => {
          const formData = new FormData();

          formData.append("courseId", courseId);
          formData.append("question", q.question);
          formData.append(
            "options",
            JSON.stringify({
              A: q.A,
              B: q.B,
              C: q.C,
              D: q.D,
            })
          );
          formData.append("correctAnswer", q.correctAnswer);
          formData.append("explanation", q.explanation);

          return axios.post(`${server}/api/admin/quiz`, formData, {
            headers: {
              token: localStorage.getItem("token"),
            },
          });
        })
      );

      setBulkQuestions([]);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  if (!courseId) {
    return <h2 style={{ textAlign: "center" }}>No course selected</h2>;
  }

  return (
    <div className="admin-quiz">
      <h2>Quiz Management</h2>

      <p className="course-title">
        {courseName || "Loading course..."}
      </p>

      <div className="quiz-form">

  <h3>Add Question</h3>

  
  <label>Question</label>
  <textarea
    placeholder="Enter question..."
    value={form.question}
    onChange={(e)=>setForm({...form,question:e.target.value})}
  />

 
  <div className="file-row">
    <div>
      <label>Question Image</label>
      <input type="file"
        onChange={(e)=>setForm({...form,questionImage:e.target.files[0]})}
      />
    </div>

    <div>
      <label>Explanation Image</label>
      <input type="file"
        onChange={(e)=>setForm({...form,explanationImage:e.target.files[0]})}
      />
    </div>
  </div>

  <label>Options</label>
  <div className="options-grid">
    <input placeholder="Option A" value={form.A} onChange={(e)=>setForm({...form,A:e.target.value})}/>
    <input placeholder="Option B" value={form.B} onChange={(e)=>setForm({...form,B:e.target.value})}/>
    <input placeholder="Option C" value={form.C} onChange={(e)=>setForm({...form,C:e.target.value})}/>
    <input placeholder="Option D" value={form.D} onChange={(e)=>setForm({...form,D:e.target.value})}/>
  </div>

 
  <label>Correct Answer</label>
  <select
    value={form.correctAnswer}
    onChange={(e)=>setForm({...form,correctAnswer:e.target.value})}
  >
    <option value="A">A</option>
    <option value="B">B</option>
    <option value="C">C</option>
    <option value="D">D</option>
  </select>


  <label>Explanation</label>
  <textarea
    placeholder="Explain the answer..."
    value={form.explanation}
    onChange={(e)=>setForm({...form,explanation:e.target.value})}
  />

  <button className="primary-btn" onClick={addQuestion}>
    ➕ Create Question
  </button>
</div>
      <button onClick={submitBulk}>📤 Upload Bulk</button>

      <button onClick={deleteSelected}>🗑 Delete Selected</button>
<div className="quiz-list">
  {questions.map((q, index) => (
    <div key={q._id} className="quiz-card">

      <input
        type="checkbox"
        checked={selectedIds.includes(q._id)}
        onChange={()=>{
          if(selectedIds.includes(q._id)){
            setSelectedIds(prev => prev.filter(id=>id!==q._id));
          } else {
            setSelectedIds(prev => [...prev,q._id]);
          }
        }}
      />

      <p><strong>{index + 1}. {q.question}</strong></p>

      {q.questionImage && (
        <img
         src={`${server}${q.questionImage?.replace(/(\.png)+$/, ".png")}`}
          alt="question"
          style={{
            width: "250px",
            margin: "10px 0",
            borderRadius: "8px"
          }}
        />
      )}

      <div>A. {q.options.A}</div>
      <div>B. {q.options.B}</div>
      <div>C. {q.options.C}</div>
      <div>D. {q.options.D}</div>

      <div style={{ marginTop: "5px" }}>
        ✔ Correct: <strong>{q.correctAnswer}</strong>
      </div>

   
      <p style={{ marginTop: "8px" }}>
        {q.explanation}
      </p>

     
      {q.explanationImage && (
        <img
          src={`${server}${q.explanationImage?.replace(/^\/?/, "/").replace(/(\.png)+$/, ".png")}`}
          alt="explanation"
          style={{
            width: "250px",
            marginTop: "10px",
            borderRadius: "8px"
          }}
        />
      )}

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => startEdit(q)}>Edit</button>
        <button onClick={() => deleteQuestion(q._id)}>Delete</button>
      </div>

      {editingId === q._id && (
        <div style={{ marginTop: "10px" }}>
          <textarea
            value={editForm.question}
            onChange={(e)=>setEditForm({...editForm,question:e.target.value})}
          />

          <input value={editForm.A} onChange={(e)=>setEditForm({...editForm,A:e.target.value})}/>
          <input value={editForm.B} onChange={(e)=>setEditForm({...editForm,B:e.target.value})}/>
          <input value={editForm.C} onChange={(e)=>setEditForm({...editForm,C:e.target.value})}/>
          <input value={editForm.D} onChange={(e)=>setEditForm({...editForm,D:e.target.value})}/>

          <select
            value={editForm.correctAnswer}
            onChange={(e)=>setEditForm({...editForm,correctAnswer:e.target.value})}
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </select>

          <textarea
            value={editForm.explanation}
            onChange={(e)=>setEditForm({...editForm,explanation:e.target.value})}
          />

          <button onClick={saveEdit}>Save</button>
        </div>
      )}

    </div>
  ))}
</div>
    </div>
  );
};

export default AdminQuiz;