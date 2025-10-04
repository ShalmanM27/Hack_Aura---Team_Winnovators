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
    <div style={{ marginBottom: "20px" }}>
      <h2>Create Post</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a post..."
        rows={3}
        style={{ width: "100%", padding: "8px" }}
      />
      <input
        type="text"
        value={mediaHash}
        onChange={(e) => setMediaHash(e.target.value)}
        placeholder="Media URL (optional)"
        style={{ width: "100%", padding: "6px", marginTop: "5px" }}
      />
      <button onClick={handleSubmit} style={{ marginTop: "5px", padding: "8px 16px" }}>
        Post
      </button>
    </div>
  );
};

export default CreatePost;
