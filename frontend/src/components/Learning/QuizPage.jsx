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
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
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
    setLoadingQuiz(true);
    setQuizStarted(true);
    setTimeout(async () => {
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
      } finally {
        setLoadingQuiz(false);
      }
    }, 1800); // simulate AI delay
  };

  const getColorForScore = (score) => {
    if (score >= (module.passScore || 60)) return "#4caf50"; // green
    if (score >= 40) return "#ff9800"; // orange
    return "#f44336"; // red
  };

  // Progress bar for quiz
  const quizProgress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;

  if (!module) return (
    <div style={{
      textAlign: "center",
      padding: "48px",
      color: "#2563eb",
      fontWeight: 700,
      fontSize: "1.2rem"
    }}>
      Loading module...
    </div>
  );

  return (
    <div style={{
      padding: "0",
      maxWidth: "700px",
      margin: "0 auto",
      fontFamily: "Inter, Arial, sans-serif",
      animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)"
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .quiz-card {
            background: linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%);
            border-radius: 28px;
            box-shadow: 0 8px 32px rgba(44,62,80,0.09);
            padding: 40px 36px 32px 36px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
            animation: fadeIn 0.8s cubic-bezier(.25,.8,.25,1);
          }
          .quiz-title {
            font-size: 2rem;
            font-weight: 900;
            color: #2563eb;
            margin-bottom: 18px;
            letter-spacing: 1px;
            text-shadow: 0 2px 8px rgba(44,62,80,0.10);
            text-align: center;
          }
          .quiz-progress-bg {
            width: 100%;
            height: 12px;
            background: #e0e7ff;
            border-radius: 8px;
            margin-bottom: 24px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(52,152,219,0.06);
          }
          .quiz-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
            border-radius: 8px;
            transition: width 0.7s cubic-bezier(.25,.8,.25,1);
          }
          .quiz-question {
            font-size: 1.18rem;
            font-weight: 700;
            color: #22223b;
            margin-bottom: 18px;
            background: rgba(203,213,225,0.18);
            border-radius: 12px;
            padding: 18px 16px;
            box-shadow: 0 2px 8px rgba(44,62,80,0.07);
          }
          .quiz-options {
            list-style: none;
            padding-left: 0;
            margin-bottom: 24px;
          }
          .quiz-option-btn {
            display: block;
            width: 100%;
            text-align: left;
            background: #f8fafc;
            border: 2px solid #e0e7ff;
            border-radius: 10px;
            padding: 12px 18px;
            margin-bottom: 12px;
            font-size: 1.08rem;
            color: #2563eb;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s, border 0.2s, color 0.2s;
          }
          .quiz-option-btn.selected {
            background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
            color: #fff;
            border: 2px solid #2563eb;
            font-weight: 700;
          }
          .quiz-nav-btn {
            padding: 10px 24px;
            background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1.08rem;
            cursor: pointer;
            margin: 0 8px;
            box-shadow: 0 2px 8px rgba(52,152,219,0.10);
            transition: background 0.2s;
          }
          .quiz-nav-btn:disabled {
            background: #e0e7ff;
            color: #64748b;
            cursor: not-allowed;
          }
          .quiz-result-circle {
            width: 120px;
            height: 120px;
            margin: 0 auto 16px;
            border-radius: 50%;
            border: 12px solid #4caf50;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: #4caf50;
            animation: spin 1s ease;
            background: #fff;
          }
          .quiz-result-circle.fail {
            border-color: #f44336;
            color: #f44336;
          }
          .quiz-result-circle.mid {
            border-color: #ff9800;
            color: #ff9800;
          }
        `}
      </style>
      <div className="quiz-card">
        <div className="quiz-title">
          {module.module_title || module.title} - Quiz
        </div>
        {/* Progress bar */}
        {questions.length > 0 && score === null && (
          <div className="quiz-progress-bg">
            <div className="quiz-progress-fill" style={{ width: `${quizProgress}%` }} />
          </div>
        )}

        {/* Start Quiz Button and AI Loading */}
        {!quizStarted && (
          <button
            onClick={handleTakeQuiz}
            className="quiz-nav-btn"
            style={{ display: "block", margin: "0 auto", marginTop: "32px" }}
          >
            Start Quiz
          </button>
        )}

        {loadingQuiz && (
          <div style={{
            textAlign: "center",
            margin: "32px 0",
            color: "#2563eb",
            fontWeight: 700,
            fontSize: "1.15rem",
            animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)"
          }}>
            <span role="img" aria-label="stepper" style={{fontSize:"2rem"}}>🧠</span>
            <br />
            You are one step closer!<br />
            <span style={{fontWeight:600}}>Wait a minute, the AI is generating a personalized quiz for you...</span>
          </div>
        )}

        {/* Gamified Question Display */}
        {questions.length > 0 && score === null && !loadingQuiz && (
          <div>
            <div className="quiz-question">
              <span style={{fontSize:"1.3em",marginRight:"8px"}}>Q{currentQ+1}:</span>
              {questions[currentQ].q}
            </div>
            <ul className="quiz-options">
              {questions[currentQ].options.map((opt, i) => (
                <li key={i}>
                  <button
                    className={`quiz-option-btn${answers[currentQ] === i ? " selected" : ""}`}
                    onClick={() => handleSelect(currentQ, i)}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: "center", marginTop: "18px" }}>
              <button
                className="quiz-nav-btn"
                onClick={() => setCurrentQ(currentQ - 1)}
                disabled={currentQ === 0}
              >
                Previous
              </button>
              {currentQ < questions.length - 1 ? (
                <button
                  className="quiz-nav-btn"
                  onClick={() => setCurrentQ(currentQ + 1)}
                  disabled={answers[currentQ] === undefined}
                >
                  Next
                </button>
              ) : (
                <button
                  className="quiz-nav-btn"
                  onClick={handleFinishQuiz}
                  disabled={answers[currentQ] === undefined}
                >
                  Finish Quiz
                </button>
              )}
            </div>
            <div style={{
              marginTop: "18px",
              color: "#64748b",
              fontWeight: 500,
              fontSize: "1rem"
            }}>
              {currentQ + 1} / {questions.length} questions answered
            </div>
          </div>
        )}

        {/* Result Display */}
        {score !== null && (
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <div
              className={`quiz-result-circle${score >= (module.passScore || 60) ? "" : score >= 40 ? " mid" : " fail"}`}
              style={{
                borderColor: getColorForScore(score),
                color: getColorForScore(score)
              }}
            >
              {score}%
            </div>
            <h3 style={{ color: getColorForScore(score), fontWeight: 800 }}>
              {result === "Passed"
                ? "🎉 Awesome! You passed this module!"
                : "💪 You have done a great job! Read the module carefully and attend the quiz again with full confidence!"}
            </h3>
            <button
              onClick={() => {
                if (result === "Passed") {
                  navigate(`/learning/topic/${topicId}`);
                } else {
                  setScore(null);
                  setResult(null);
                  setAnswers({});
                  setCurrentQ(0);
                  setQuizStarted(false);
                  setQuestions([]);
                }
              }}
              className="quiz-nav-btn"
              style={{ marginTop: "16px" }}
            >
              {result === "Passed" ? "Back to Modules" : "Retry Quiz"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
