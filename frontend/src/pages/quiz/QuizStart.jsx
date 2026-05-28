import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";
import { useNavigate, useParams } from "react-router-dom";

const QuizStart = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [agreed, setAgreed] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 FETCH ATTEMPTS
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `${server}/api/quiz/${id}`,
          {
            headers: { token },
          }
        );

        setAttemptsLeft(data.attemptsLeft);
      } catch (err) {
        console.log(err);

        // 🔥 HANDLE BACKEND ERRORS
        if (err.response) {
          setError(err.response.data.message);

          // If course not completed → redirect
          if (err.response.status === 403) {
            setTimeout(() => {
              navigate("/courses");
            }, 2000);
          }
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [id, navigate]);
const startQuiz = () => {
  if (!agreed) return alert("Accept terms first");

  if (attemptsLeft === 0) {
    return alert("No attempts left");
  }

  // 🔥 IMPORTANT FIX
  localStorage.removeItem("quizResult");

  navigate(`/quiz/${id}`);
};

  // 🔥 LOADING UI
  if (loading) {
    return <h3 style={{ padding: "20px" }}>Loading quiz...</h3>;
  }

  // 🔥 ERROR UI
  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h3>{error}</h3>
      </div>
    );
  }

  return (
  <div className="quiz-container">
    
    {/* Sidebar (optional, can stay empty) */}
    <div className="quiz-sidebar"></div>

    <div className="quiz-main">

      <div className="quiz-start">
        <h2> Quiz Instructions</h2>

        <ul>
          <li>Complete course 100%</li>
          <li>Time limited test</li>
          <li>75% required to pass</li>
          <li>Maximum 10 attempts allowed</li>
        </ul>

        <p>
          <strong>Attempts Left:</strong> {attemptsLeft}
        </p>

        {attemptsLeft === 0 && (
          <p style={{ color: "red" }}>
            🚫 You have used all attempts
          </p>
        )}

        <div className="terms">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label>I agree to the terms and conditions</label>
        </div>

        <button
          onClick={startQuiz}
          disabled={!agreed || attemptsLeft === 0}
          className="start-btn"
        >
           Start Quiz
        </button>
      </div>

    </div>
  </div>
);
  
};

export default QuizStart;