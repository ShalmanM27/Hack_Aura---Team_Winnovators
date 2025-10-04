import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getModules, getTopics } from "../../api/api";

const ModuleList = ({ topicId }) => {
  const [modules, setModules] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (topicId !== undefined && topicId !== null) {
      fetchModules();
      fetchTopicTitle();
    }
  }, [topicId]);

  const fetchModules = async () => {
    try {
      const modules = await getModules(topicId);
      setModules(modules);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const fetchTopicTitle = async () => {
    try {
      const topics = await getTopics();
      const topic = topics.find((t) => t.id === Number(topicId));
      setTopicTitle(topic?.title || "");
    } catch (err) {
      console.error("Error fetching topic title:", err);
    }
  };

  const handleModuleClick = (moduleId) => {
    navigate(`/learning/topic/${topicId}/module/${moduleId}`);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Modules for: {topicTitle}
      </h1>
      {modules.length === 0 && <p>No modules available.</p>}
      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {modules.map((mod) => (
          <div
            key={mod.module_id}
            onClick={() => handleModuleClick(mod.module_id)}
            style={{
              padding: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "4px 4px 12px rgba(0,0,0,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.1)")
            }
          >
            <h2 style={{ fontSize: "18px", fontWeight: "600" }}>{mod.module_title}</h2>
            <p style={{ color: "#555", marginTop: "8px" }}>
              Questions: {mod.question_count}
            </p>
            <p style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>
              Pass Score: {mod.pass_score}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleList;
