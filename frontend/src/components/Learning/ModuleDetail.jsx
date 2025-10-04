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

  if (loading) return <p style={{ textAlign: "center" }}>Loading module...</p>;
  if (!module)
    return (
      <p style={{ textAlign: "center", color: "red" }}>Module not found.</p>
    );

  const title = module.module_title || module.title || "Untitled Module";
  const questionCount = module.questionCount ?? module.question_count ?? 0;
  const passScore = module.passScore ?? module.pass_score ?? 0;
  const content = module.content ?? "";

  return (
    <div style={{ padding: "16px", maxWidth: "900px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        {title}
      </h1>

      <div style={{ marginBottom: "24px" }}>
        <strong>Questions:</strong> {questionCount} <br />
        <strong>Pass Score:</strong> {passScore}%
      </div>

      <div
        style={{
          padding: "24px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
          marginBottom: "32px",
        }}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      <button
        onClick={handleStartQuiz}
        style={{
          padding: "12px 24px",
          background: "#5f72be",
          color: "#fff",
          fontWeight: 700,
          borderRadius: "8px",
          cursor: "pointer",
          border: "none",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#4356a0")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#5f72be")}
      >
        Start Quiz
      </button>
    </div>
  );
};

export default ModuleDetail;
