import React, { useState } from "react";
import { createPost } from "../../api/api";

const CreatePost = ({ refresh, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [mediaHash, setMediaHash] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await createPost({ content, media_hash: mediaHash || "" });
      setContent("");
      setMediaHash("");
      if (refresh) refresh();
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post.");
    }
  };

  return (
    <div
      style={{
        marginBottom: "24px",
        background: "linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)",
        borderRadius: "22px",
        boxShadow: "0 8px 32px rgba(44,62,80,0.09)",
        padding: "32px",
        maxWidth: "340px",
        margin: "0",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <h2
        style={{
          fontWeight: 700,
          fontSize: "1.35rem",
          marginBottom: "12px",
          color: "#2563eb",
          letterSpacing: "1px",
        }}
      >
        Create Post
      </h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a post..."
        rows={3}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          fontSize: "1rem",
          marginBottom: "8px",
          background: "#f8fafc",
          boxSizing: "border-box",
          resize: "vertical",
          boxShadow: "0 2px 8px rgba(52,152,219,0.06)",
        }}
      />
      <input
        type="text"
        value={mediaHash}
        onChange={(e) => setMediaHash(e.target.value)}
        placeholder="Media URL (optional)"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          fontSize: "1rem",
          marginBottom: "12px",
          background: "#f8fafc",
          boxSizing: "border-box",
          boxShadow: "0 2px 8px rgba(52,152,219,0.06)",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "10px 28px",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(52,152,219,0.10)",
          transition: "background 0.2s",
          alignSelf: "flex-end",
        }}
      >
        Post
      </button>
    </div>
  );
};

export default CreatePost;
