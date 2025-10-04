import React, { useState } from "react";
import { createComment } from "../../api/api";

const CreateComment = ({ postId, refresh, userAddress }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await createComment({ post_id: postId, content, media_hash: "" });
      setContent("");
      refresh();
    } catch (err) {
      console.error("Error creating comment:", err);
      alert("Failed to add comment.");
    }
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add comment..."
        style={{ padding: "6px", width: "70%", marginRight: "10px" }}
      />
      <button onClick={handleSubmit} style={{ padding: "6px 12px" }}>
        Comment
      </button>
    </div>
  );
};

export default CreateComment;
