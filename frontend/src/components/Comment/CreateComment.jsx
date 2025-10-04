import React, { useState } from "react";
import { createComment } from "../../api/api";

const CreateComment = ({ postId, refresh, userAddress }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await createComment(postId, content, "");
      setContent("");
      refresh();
    } catch (err) {
      console.error("Error creating comment:", err);
      alert("Failed to add comment.");
    }
  };

  return (
    <div
      style={{
        margin: "18px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "rgba(255,255,255,0.7)",
        borderRadius: "32px",
        boxShadow: "0 4px 16px rgba(99,102,241,0.10)",
        padding: "10px 18px",
        backdropFilter: "blur(4px)",
        position: "relative",
        maxWidth: "500px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a stunning comment..."
        style={{
          padding: "12px 20px",
          flex: 1,
          borderRadius: "24px",
          border: "none",
          fontSize: "1.05rem",
          background: "rgba(243,244,246,0.8)",
          boxShadow: "0 2px 8px rgba(99,102,241,0.07)",
          outline: "none",
          marginRight: "12px",
          transition: "box-shadow 0.2s",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: "12px 22px",
          background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "24px",
          fontWeight: 700,
          fontSize: "1.05rem",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(99,102,241,0.15)",
          transition: "background 0.2s, transform 0.2s",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: "1.2rem", verticalAlign: "middle" }}>💬</span>{" "}
        Comment
      </button>
    </div>
  );
};

export default CreateComment;
