import React, { useState, useEffect } from "react";
import { completeModule, getModules } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

const QuizPage = ({ userAddress }) => {
  const { topicId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    getModules(topicId)
      .then((mods) => {
        const mod = mods.find((m) => m.id.toString() === moduleId);
        if (mod) {
          setModule(mod);
          setNumQuestions(mod.questionCount || 5);
        }
      })
      .catch(console.error);
  }, [topicId, moduleId]);

  const handleTakeQuiz = async () => {
    const res = await completeModule(
      userAddress,
      parseInt(topicId),
      parseInt(moduleId),
      100,
      numQuestions
    );
    setQuestions(res.data?.quiz || []);
  };

  if (!module) return <p>Loading...</p>;

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        {module.title} - Quiz
      </h2>

      {questions.length === 0 ? (
        <div>
          <p>Select number of questions:</p>
          <input
            type="number"
            min={module.questionCount || 1}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            style={{
              border: "1px solid #ccc",
              padding: "4px 8px",
              marginRight: "8px",
            }}
          />
          <button
            onClick={handleTakeQuiz}
            style={{
              padding: "8px 16px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Take Quiz
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "16px" }}>
          {questions.map((q, idx) => (
            <div
              key={idx}
              style={{
                padding: "16px",
                marginBottom: "12px",
                backgroundColor: "#f3f3f3",
                borderRadius: "6px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>{q.q}</p>
              <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={() => navigate(`/learning/topic/${topicId}`)}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Modules
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
