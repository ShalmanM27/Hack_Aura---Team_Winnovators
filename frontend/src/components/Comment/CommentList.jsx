import React, { useEffect, useState } from "react";
import { getComments } from "../../api/api";
import CreateComment from "./CreateComment";

const CommentList = ({ postId, userAddress }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    if (!postId) return;
    try {
      const res = await getComments(postId);
      if (res.success) {
        setComments(res.comments); // corrected from res.data.comments
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div style={{ marginTop: "10px" }}>
      <CreateComment postId={postId} refresh={fetchComments} userAddress={userAddress} />
      {comments.length > 0 && (
        <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
          {comments.map((c) => (
            <div key={c.id} style={{ padding: "5px 0", borderBottom: "1px solid #eee" }}>
              <p style={{ margin: 0 }}>{c.content}</p>
              <small>By: {c.author}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
