import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { server } from "../../main";
import "./AdminQuiz.css";
import { useParams } from "react-router-dom";
const AdminQuiz = () => {
  const { id: courseId } = useParams();
  console.log("courseId:", courseId);
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [courseName, setCourseName] = useState("");
  const [form, setForm] = useState({
    question: "",
    A: "",
    B: "",
    C: "",
    D: "",
    correctAnswer: "A",
    explanation: "",
  });
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
  await axios.put(
    `${server}/api/admin/quiz/${editingId}`,
    {
      question: editForm.question,
      options: {
        A: editForm.A,
        B: editForm.B,
        C: editForm.C,
        D: editForm.D,
      },
      correctAnswer: editForm.correctAnswer,
      explanation: editForm.explanation,
    },
    { headers: { token: localStorage.getItem("token") } }
  );

  setEditingId(null);
  fetchQuestions();
};
  // 🔥 FETCH QUESTIONS
  const fetchQuestions = useCallback(async () => {
    try {
      const { data } = await axios.get(
       `${server}/api/admin/quiz/course/${courseId}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    }
  }, [courseId]);

 useEffect(() => {
  fetchQuestions();
}, [fetchQuestions]);
useEffect(() => {
  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/course/${courseId}`
      );

      console.log("COURSE DATA:", data); // 👈 DEBUG

      // ✅ HANDLE BOTH CASES
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

const addQuestion = async () => {
  if (!form.question || !form.A || !form.B || !form.C || !form.D) {
    alert("Fill all fields");
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

  await axios.post(`${server}/api/admin/quiz`, formData, {
    headers: {
      token: localStorage.getItem("token"),
    },
  });

  fetchQuestions();
};
  // 🔥 DELETE QUESTION
  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    await axios.delete(`${server}/api/admin/quiz/${id}`, {
      headers: { token: localStorage.getItem("token") },
    });

    fetchQuestions();
  };

  
  return (
    <div className="admin-quiz">
      <h2>Quiz Management</h2>
      <p className="course-title">
  {courseName || "Loading course..."}
</p>

      {/* ADD FORM */}
      <div className="quiz-form">
        <input
          placeholder="Question"
          value={form.question}
          onChange={(e) =>
            setForm({ ...form, question: e.target.value })
          }
        />

        <input
          placeholder="Option A"
          value={form.A}
          onChange={(e) => setForm({ ...form, A: e.target.value })}
        />
        <input
          placeholder="Option B"
          value={form.B}
          onChange={(e) => setForm({ ...form, B: e.target.value })}
        />
        <input
          placeholder="Option C"
          value={form.C}
          onChange={(e) => setForm({ ...form, C: e.target.value })}
        />
        <input
          placeholder="Option D"
          value={form.D}
          onChange={(e) => setForm({ ...form, D: e.target.value })}
        />

        <select
          value={form.correctAnswer}
          onChange={(e) =>
            setForm({ ...form, correctAnswer: e.target.value })
          }
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <input
          placeholder="Explanation"
          value={form.explanation}
          onChange={(e) =>
            setForm({ ...form, explanation: e.target.value })
          }
        />
        

<input
  type="file"
  onChange={(e) =>
    setForm({
      ...form,
      explanationImage: e.target.files[0],
    })
  }
/>

        <button onClick={addQuestion}>➕ Add Question</button>
      </div>

      {/* LIST */}
      <div className="quiz-list">
        {questions.map((q, index) => (
          <div key={q._id} className="quiz-card">

            {editingId === q._id ? (
              <>
                <input
                  value={editForm.question}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      question: e.target.value,
                    })
                  }
                />

                <input value={editForm.A}
                  onChange={(e)=>setEditForm({...editForm,A:e.target.value})}/>
                <input value={editForm.B}
                  onChange={(e)=>setEditForm({...editForm,B:e.target.value})}/>
                <input value={editForm.C}
                  onChange={(e)=>setEditForm({...editForm,C:e.target.value})}/>
                <input value={editForm.D}
                  onChange={(e)=>setEditForm({...editForm,D:e.target.value})}/>

                <select
                  value={editForm.correctAnswer}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      correctAnswer: e.target.value,
                    })
                  }
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>

                <input
                  value={editForm.explanation}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      explanation: e.target.value,
                    })
                  }
                />

                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>{index + 1}. {q.question}</p>

                <div>A. {q.options.A}</div>
                <div>B. {q.options.B}</div>
                <div>C. {q.options.C}</div>
                <div>D. {q.options.D}</div>

                <div>✔ Correct: {q.correctAnswer}</div>

                <button onClick={() => startEdit(q)}>Edit</button>

                <button onClick={() => deleteQuestion(q._id)}>
                  Delete
                </button>
              </>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminQuiz;