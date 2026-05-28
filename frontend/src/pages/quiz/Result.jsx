import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import "./quiz.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [attemptsLeft, setAttemptsLeft] = useState(null);

  const storedResult = JSON.parse(
    localStorage.getItem("quizResult") || "null"
  );

  const result = location.state || storedResult;

  // 🔥 BLOCK DIRECT ACCESS
  useEffect(() => {
    if (!location.state && !storedResult) {
      navigate(`/quiz-start/${id}`);
    }
  }, [location.state, storedResult, navigate, id]);

  // 🔥 FIXED CLEANUP (runs on mount + unmount)
  useEffect(() => {
    if (!location.state) {
      localStorage.removeItem("quizResult");
    }

    return () => {
      localStorage.removeItem("quizResult");
    };
  }, [location.state]);

  // 🔥 KEEP RESULT SAFE WHEN NAVIGATED PROPERLY
  useEffect(() => {
    if (location.state) {
      localStorage.setItem(
        "quizResult",
        JSON.stringify(location.state)
      );
    }
  }, [location.state]);

  // ✅ FETCH ATTEMPTS
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/quiz/${id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        setAttemptsLeft(data.attemptsLeft);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAttempts();
  }, [id]);

  if (!result) {
    return <h2>No Result Found</h2>;
  }

  const handleRetry = () => {
    if (attemptsLeft === null) {
      return alert("Please wait...");
    }

    if (attemptsLeft === 0) {
      return alert("No attempts left");
    }

    localStorage.removeItem("quizResult");
    navigate(`/quiz/${id}`);
  };

  return (
    <div className="quiz-page">

      <h2>Score: {(result.percentage ?? 0).toFixed(2)}%</h2>

      {/* ✅ ATTEMPTS */}
      <p>
        Attempts Left:{" "}
        {attemptsLeft === null ? "Loading..." : attemptsLeft}
      </p>

      {attemptsLeft === 0 && (
        <p style={{ color: "red" }}>
          You have used all attempts
        </p>
      )}

      {(result.results || []).map((q, i) => (
        <div key={i} className="result-box">

          <p><strong>Q{i + 1}. {q.question}</strong></p>

          {["A", "B", "C", "D"].map((key) => {
            let className = "";

            if (q.correct === key) className = "correct";
            else if (q.selected === key) className = "wrong";

            return (
              <div key={key} className={className}>
                {key}. {q.options[key]}
              </div>
            );
          })}

         <div className="explanation">
  {q.explanation}
</div>

        </div>
      ))}

     {result.passed ? (
  <button
    className="btn-primary"
    onClick={() => navigate(`/certificate/${id}`)}
  >
    Get Certificate
  </button>
) : (
  <button
    className="btn-primary"
    disabled={attemptsLeft === 0 || attemptsLeft === null}
    onClick={handleRetry}
  >
    Retry Quiz
  </button>
)}

    </div>
  );
};

export default Result;