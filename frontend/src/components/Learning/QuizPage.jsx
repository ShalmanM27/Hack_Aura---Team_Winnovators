import React, { useState, useEffect } from "react";
import { completeModule, getModules } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

const QuizPage = ({ userAddress }) => {
  const { topicId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getModules(topicId)
      .then((mods) => {
        const mod = mods.find((m) => m.id.toString() === moduleId);
        if (mod) setModule(mod);
      })
      .catch(console.error);
  }, [topicId, moduleId]);

  const handleSelect = (qIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleFinishQuiz = async () => {
    if (!module) return;

    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answerIndex) correctCount += 1;
    });

    const calcScore = Math.round((correctCount / questions.length) * 100);
    setScore(calcScore);
    setResult(calcScore >= (module.passScore || 60) ? "Passed" : "Try Again");

    try {
      await completeModule(
        userAddress,
        module.topic_id,
        module.module_id,
        calcScore,
        questions.length
      );
    } catch (err) {
      console.error("Error recording completion:", err);
    }
  };

  const handleTakeQuiz = async () => {
    try {
      const res = await completeModule(
        userAddress,
        module.topic_id,
        module.module_id,
        0,
        module.questionCount
      );

      const quiz = res.data?.receipt?.quiz || [];
      if (Array.isArray(quiz)) setQuestions(quiz);
    } catch (err) {
      console.error("Error generating quiz:", err);
    }
  };

  if (!module) return <p>Loading module...</p>;

  const getColorForScore = (score) => {
    if (score >= (module.passScore || 60)) return "#4caf50"; // green
    if (score >= 40) return "#ff9800"; // orange
    return "#f44336"; // red
  };

  return (
    <div style={{ padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
        {module.module_title || module.title} - Quiz
      </h2>

      {questions.length === 0 ? (
        <button
          onClick={handleTakeQuiz}
          style={{
            padding: "12px 24px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Start Quiz
        </button>
      ) : (
        <div>
          {questions.map((q, idx) => {
            const selected = answers[idx];
            const correct = q.answerIndex;
            const isCorrect = selected === correct;
            return (
              <div
                key={idx}
                style={{
                  padding: "16px",
                  marginBottom: "12px",
                  backgroundColor: "#f3f3f3",
                  borderRadius: "8px",
                  border: `2px solid ${isCorrect ? "#4caf50" : "#f44336"}`,
                  transition: "border 0.3s",
                }}
              >
                <p style={{ fontWeight: "bold" }}>{q.q}</p>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {q.options.map((opt, i) => (
                    <li key={i} style={{ margin: "4px 0" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "20px",
                          fontWeight: selected === i ? "bold" : "normal",
                        }}
                      >
                        {String.fromCharCode(65 + i)}.
                      </span>{" "}
                      {opt}{" "}
                      {score !== null &&
                        i === correct &&
                        "✅"}{" "}
                      {score !== null &&
                        selected === i &&
                        selected !== correct &&
                        "❌"}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {score === null ? (
            <button
              onClick={handleFinishQuiz}
              style={{
                padding: "12px 24px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Finish Quiz
            </button>
          ) : (
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  border: `12px solid ${getColorForScore(score)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: getColorForScore(score),
                  animation: "spin 1s ease",
                }}
              >
                {score}%
              </div>
              <h3 style={{ color: getColorForScore(score) }}>
                {result === "Passed"
                  ? "🎉 Awesome! You passed this module!"
                  : "💪 Don't worry! Keep practicing and try again!"}
              </h3>
              <button
                onClick={() => navigate(`/learning/topic/${topicId}`)}
                style={{
                  marginTop: "16px",
                  padding: "10px 20px",
                  backgroundColor: "#2196f3",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Back to Modules
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
