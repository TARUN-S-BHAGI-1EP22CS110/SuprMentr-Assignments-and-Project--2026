import React, { useEffect, useState, useRef, useCallback } from "react";
import "./quiz.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [current, setCurrent] = useState(0);

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(null);

  const submittedRef = useRef(false);

  // 🔥 ADD THIS (prevents auto redirect bug)
  const hasSubmitted = useRef(false);

  // ✅ CHECK PROGRESS
  useEffect(() => {
    const checkProgress = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/course/progress/${id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        console.log("PROGRESS:", data);

        if (data.percentage >= 95) {
          setAllowed(true);
        } else {
          navigate(`/course/${id}`);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setChecking(false);
      }
    };

    checkProgress();
  }, [id, navigate]);

  // 🔥 CLEAN OLD RESULT (important)
  useEffect(() => {
    localStorage.removeItem("quizResult");
  }, []);

  // ✅ FETCH QUIZ
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/quiz/${id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

       setTimeLeft(data.duration && data.duration > 0 ? data.duration : 3600);
        setAttemptsLeft(data.attemptsLeft);
        setQuestions(data.questions);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // ✅ TIMER
  useEffect(() => {
    if (!timeLeft || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result]);

  // 🔥 FIXED REDIRECT (only after submit)
  useEffect(() => {
    if (result && hasSubmitted.current) {
      navigate(`/result/${id}`, { state: result });
    }
  }, [result, navigate, id]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (value) => {
    const updated = [...answers];

    const existingIndex = updated.findIndex(
     (a) => String(a.questionId) === String(questions[current]._id)
    );

    if (existingIndex !== -1) {
      updated[existingIndex].selected = value;
    } else {
      updated.push({
        questionId: questions[current]._id,
        selected: value,
      });
    }

    setAnswers(updated);
  };

  // ✅ SUBMIT
  const handleSubmit = useCallback(async () => {
    if (submittedRef.current) return;

    submittedRef.current = true;

    // 🔥 mark that user actually submitted
    hasSubmitted.current = true;

    try {
     const { data } = await axios.post(
  `${server}/api/quiz/submit`,
  {
  courseId: id,
  
  answers: answers,
  timeTaken: questions.length * 60 - timeLeft,
},
  {
    headers: {
      token: localStorage.getItem("token"),
    },
  }
);
      setResult(data);
      localStorage.setItem("quizResult", JSON.stringify(data));
    } catch (err) {
      submittedRef.current = false;
      alert(err.response?.data?.message || "Error submitting quiz");
    }
  }, [id, answers, questions.length, timeLeft]);

  // ✅ AUTO SUBMIT
  useEffect(() => {
    if (
  timeLeft <= 0 &&
  timeLeft !== null &&
      questions.length > 0 &&
      !result &&
      !submittedRef.current
    ) {
      handleSubmit();
    }
  }, [timeLeft, questions.length, result, handleSubmit]);

  // ✅ STATES
  if (checking) return <p>Checking eligibility...</p>;
  if (!allowed) return <p>Not allowed to take quiz</p>;
  if (loading) return <h2>Loading Quiz...</h2>;
  if (!questions.length) return <h2>No questions found</h2>;
  if (attemptsLeft === 0) return <h2>No attempts left</h2>;

  const q = questions[current];

  const selectedAnswer = answers.find(
    (a) => String(a.questionId) === String(q._id)
  )?.selected;

  return (
    <div className="quiz-container">

      {/* SIDEBAR */}
      <div className="quiz-sidebar">
        {questions.map((q, i) => {
          const answered = answers.some(
            (a) => a.questionId === q._id
          );

          return (
            <div
              key={i}
              className={`q-number ${
                current === i
                  ? "active"
                  : answered
                  ? "answered"
                  : "not-answered"
              }`}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* MAIN */}
      <div className="quiz-main">

        <div className="quiz-header">
          <h3>Question {current + 1}</h3>
          <div className="timer">⏳ {formatTime(timeLeft)}</div>
        </div>

      <div className="question-box">
  <h4>{q.question}</h4>

          {q.questionImage && (
           <img
  src={`${server}${q.questionImage}`}
  alt="quiz"
  className="quiz-image"
/>
          )}
{["A", "B", "C", "D"].map((key) => (
  <label key={key} className="option-label">
    <input
      type="radio"
      name={`question-${q._id}`}
      checked={selectedAnswer === key}
      onChange={() => handleAnswer(key)}
    />
    <span>{key}. {q.options[key]}</span>
  </label>
))}
        </div>

        <div className="quiz-nav">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((p) => p - 1)}
          >
            Previous
          </button>

          {current === questions.length - 1 ? (
            <button onClick={handleSubmit}>Submit</button>
          ) : (
            <button onClick={() => setCurrent((p) => p + 1)}>
              Next
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Quiz;