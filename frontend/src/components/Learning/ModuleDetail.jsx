import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getModuleById } from "../../api/api";

const ModuleDetail = ({ userAddress }) => {
  const { topicId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (topicId !== undefined && moduleId !== undefined) {
      fetchModule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const mod = await getModuleById(Number(topicId), Number(moduleId));
      setModule(mod);
    } catch (err) {
      console.error("Error fetching module:", err);
      setModule(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    navigate(`/learning/topic/${topicId}/module/${moduleId}/quiz`);
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px",
          color: "#2563eb",
          fontWeight: 700,
          fontSize: "1.2rem",
        }}
      >
        Loading module...
      </div>
    );
  if (!module)
    return (
      <div
        style={{
          textAlign: "center",
          color: "#e11d48",
          fontWeight: 700,
          fontSize: "1.2rem",
          padding: "48px",
        }}
      >
        Module not found.
      </div>
    );

  const title = module.module_title || module.title || "Untitled Module";
  const questionCount = module.questionCount ?? module.question_count ?? 0;
  const passScore = module.passScore ?? module.pass_score ?? 0;
  const content = module.content ?? "";

  return (
    <div
      style={{
        padding: "0",
        maxWidth: "900px",
        margin: "0 auto",
        animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .module-card {
            background: linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%);
            border-radius: 28px;
            box-shadow: 0 8px 32px rgba(44,62,80,0.09);
            padding: 40px 36px 32px 36px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
            animation: fadeIn 0.8s cubic-bezier(.25,.8,.25,1);
          }
          .module-title {
            font-size: 2.2rem;
            font-weight: 900;
            color: #2563eb;
            margin-bottom: 18px;
            letter-spacing: 1px;
            text-shadow: 0 2px 8px rgba(44,62,80,0.10);
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .badge {
            display: inline-block;
            background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
            color: #fff;
            font-weight: 700;
            font-size: 1rem;
            border-radius: 16px;
            padding: 6px 18px;
            margin-right: 12px;
            box-shadow: 0 2px 8px rgba(52,152,219,0.10);
            letter-spacing: 0.5px;
          }
          .progress-bar-bg {
            width: 100%;
            height: 16px;
            background: #e0e7ff;
            border-radius: 8px;
            margin-bottom: 24px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(52,152,219,0.06);
          }
          .progress-bar-fill {
            height: 100%;
            width: 40%;
            background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
            border-radius: 8px;
            transition: width 0.7s cubic-bezier(.25,.8,.25,1);
          }
          .module-content {
            background: rgba(203,213,225,0.18);
            border-radius: 18px;
            padding: 32px 24px;
            margin-bottom: 32px;
            box-shadow: 0 2px 12px rgba(44,62,80,0.07);
            font-size: 1.13rem;
            color: #22223b;
            line-height: 1.7;
            word-break: break-word;
          }
          .module-content h1, .module-content h2, .module-content h3 {
            color: #2563eb;
            font-weight: 800;
            margin-top: 24px;
            margin-bottom: 12px;
            font-size: 1.35em;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .module-content h2:before {
            content: "🎯";
            font-size: 1.1em;
            margin-right: 6px;
          }
          .module-content ul {
            margin: 18px 0;
            padding-left: 24px;
          }
          .module-content ul li {
            margin-bottom: 8px;
            background: #f8fafc;
            border-radius: 8px;
            padding: 6px 12px;
            font-size: 1.08em;
            color: #2563eb;
            position: relative;
          }
          .module-content ul li:before {
            content: "⭐";
            margin-right: 8px;
          }
          .module-content p {
            margin-bottom: 14px;
            font-size: 1.08em;
            color: #22223b;
          }
          .start-quiz-btn {
            padding: 16px 36px;
            background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
            color: #fff;
            font-weight: 800;
            font-size: 1.18rem;
            border-radius: 12px;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(52,152,219,0.10);
            transition: background 0.2s, transform 0.2s;
            margin: 0 auto;
            display: block;
            letter-spacing: 1px;
          }
          .start-quiz-btn:hover {
            background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
            transform: scale(1.05);
          }
        `}
      </style>
      <div className="module-card">
        <div className="module-title">
          {title}
          <span className="badge" title="Questions">
            <svg
              width="18"
              height="18"
              style={{
                marginRight: 4,
                verticalAlign: "middle",
              }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" fill="#fff" />
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="12"
                fill="#2563eb"
                fontWeight="bold"
              >
                {questionCount}
              </text>
            </svg>
            {questionCount} Questions
          </span>
          <span className="badge" title="Pass Score">
            <svg
              width="18"
              height="18"
              style={{
                marginRight: 4,
                verticalAlign: "middle",
              }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="8" fill="#fff" />
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="12"
                fill="#2563eb"
                fontWeight="bold"
              >
                {passScore}
              </text>
            </svg>
            Pass Score: {passScore}%
          </span>
        </div>
        <div
          style={{
            marginBottom: "18px",
            fontWeight: 700,
            color: "#2563eb",
            fontSize: "1.08rem",
          }}
        >
          Module Completion
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill"></div>
        </div>
        <div className="module-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <button onClick={handleStartQuiz} className="start-quiz-btn">
          🚀 Start Quiz
        </button>
      </div>
    </div>
  );
};

export default ModuleDetail;
