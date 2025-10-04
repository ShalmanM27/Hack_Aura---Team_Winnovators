import React, { useEffect, useState } from "react";
import { getComments } from "../../api/api";
import CreateComment from "./CreateComment";

const CommentList = ({ postId, userAddress }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    if (!postId) return;
    try {
      const res = await getComments(postId); // res is an array
      // Filter out comments that are empty, whitespace, or "0"
      const filteredComments = res.filter(
        (c) =>
          typeof c.content === "string" &&
          c.content.trim() !== "" &&
          c.content.trim() !== "0"
      );
      setComments(filteredComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div style={{ marginTop: "10px" }}>
      <CreateComment
        postId={postId}
        refresh={fetchComments}
        userAddress={userAddress}
      />
      {comments.length > 0 && (
        <>
          <div
            style={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "#6366f1",
              marginBottom: "8px",
              letterSpacing: "0.5px",
            }}
          >
            Comments
          </div>
          <div
            style={{
              marginTop: "10px",
              background: "rgba(255,255,255,0.55)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(99,102,241,0.10)",
              padding: "24px 18px",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(99,102,241,0.08)",
              maxWidth: "540px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {comments.map((c, index) => (
              <div
                key={c.id}
                style={{
                  padding: "18px 0",
                  borderBottom:
                    index !== comments.length - 1
                      ? "1px solid #e5e7eb"
                      : "none",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.13rem",
                    color: "#22223b",
                    fontWeight: 500,
                    letterSpacing: "0.2px",
                    marginBottom: "4px",
                  }}
                >
                  {c.content}
                </p>
                <span
                  style={{
                    color: "#6366f1",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    background: "rgba(99,102,241,0.08)",
                    borderRadius: "8px",
                    padding: "2px 8px",
                    letterSpacing: "0.5px",
                  }}
                >
                  By: {c.author}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentList;
