import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopics } from "../../api/api";

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
    navigate(`/learning/topic/${topicId}`);
  };

  return (
    <div
      style={{
        padding: "40px 0",
        background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
        minHeight: "600px",
        borderRadius: "28px",
        boxShadow: "0 8px 32px rgba(44,62,80,0.09)",
        maxWidth: "1100px",
        margin: "32px auto",
        animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: 800,
          marginBottom: "32px",
          color: "#2563eb",
          textAlign: "center",
          letterSpacing: "1px",
          textShadow: "0 2px 8px rgba(44,62,80,0.10)",
        }}
      >
        Available Topics
      </h1>
      {topics.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontWeight: 600,
            fontSize: "1.1rem",
          }}
        >
          No topics available.
        </p>
      )}
      <div
        style={{
          display: "grid",
          gap: "32px",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          padding: "0 32px",
        }}
      >
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            style={{
              padding: "32px 24px",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)",
              boxShadow: "0 4px 18px rgba(52,152,219,0.10)",
              cursor: "pointer",
              transition: "box-shadow 0.25s, transform 0.25s",
              border: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              minHeight: "180px",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(52,152,219,0.18)";
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 18px rgba(52,152,219,0.10)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#2563eb",
                marginBottom: "12px",
                letterSpacing: "0.5px",
              }}
            >
              {topic.title}
            </h2>
            <p
              style={{
                color: "#22223b",
                marginTop: "4px",
                fontSize: "1.08rem",
                marginBottom: "10px",
                fontWeight: 500,
              }}
            >
              {topic.description}
            </p>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.98rem",
                marginTop: "auto",
                fontWeight: 600,
                background: "rgba(203,213,225,0.18)",
                borderRadius: "8px",
                padding: "6px 14px",
                alignSelf: "flex-end",
              }}
            >
              Modules: {topic.totalModules}
            </p>
            <span
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                background:
                  "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
                color: "#fff",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.1rem",
                boxShadow: "0 2px 8px rgba(52,152,219,0.10)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7z" fill="#fff" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicList;
