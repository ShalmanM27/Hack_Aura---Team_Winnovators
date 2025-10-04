import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopics } from "../../api/api"; // ✅ use API helper

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const topics = await getTopics();
      setTopics(topics);
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  };

  const handleTopicClick = (topicId) => {
    navigate(`/learning/topic/${topicId}`); // ✅ matches LearningPage route
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Available Topics
      </h1>
      {topics.length === 0 && <p>No topics available.</p>}
      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            style={{
              padding: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "4px 4px 12px rgba(0,0,0,0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.1)")}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "600" }}>{topic.title}</h2>
            <p style={{ color: "#555", marginTop: "8px" }}>{topic.description}</p>
            <p style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>
              Modules: {topic.totalModules}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicList;
