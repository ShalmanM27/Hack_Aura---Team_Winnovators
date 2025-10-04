import React, { useState } from "react";
import { likePost, removeLike, removeDislike, dislikePost } from "../../api/api";
import CommentList from "../Comment/CommentList";

const PostCard = ({ post, userAddress, refresh }) => {
  const [likedByUser, setLikedByUser] = useState(post.likedByUser);
  const [dislikedByUser, setDislikedByUser] = useState(post.dislikedByUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [dislikeCount, setDislikeCount] = useState(post.dislikeCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (likedByUser) return; // prevent multiple likes

      if (dislikedByUser) {
        await removeDislike(post.id);
        setDislikeCount(dislikeCount - 1);
        setDislikedByUser(false);
      }

      await likePost(post.id);
      setLikeCount(likeCount + 1);
      setLikedByUser(true);

      // Refresh the post data from backend to get accurate counts
      if (refresh) refresh();
    } catch (err) {
      console.error("Error liking post:", err);
    }
    setLoading(false);
  };

  const handleDislike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (dislikedByUser) return; // prevent multiple dislikes

      if (likedByUser) {
        await removeLike(post.id);
        setLikeCount(likeCount - 1);
        setLikedByUser(false);
      }

      await dislikePost(post.id);
      setDislikeCount(dislikeCount + 1);
      setDislikedByUser(true);

      if (refresh) refresh();
    } catch (err) {
      console.error("Error disliking post:", err);
    }
    setLoading(false);
  };

  // Format created_at timestamp (assume it's a UNIX timestamp in seconds)
  const formatDate = (timestamp) => {
    if (!timestamp || isNaN(Number(timestamp))) return "N/A";
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  return (
    <div
      style={{
        borderRadius: "22px",
        background: "linear-gradient(120deg, #f8fafc 0%, #f3f4f6 100%)",
        boxShadow: "0 8px 32px rgba(44,62,80,0.09)",
        padding: "32px",
        marginBottom: "0px",
        border: "1px solid #e5e7eb",
        transition: "box-shadow 0.2s, transform 0.2s",
        position: "relative",
        backdropFilter: "blur(2px)",
        overflow: "hidden",
        minHeight: "180px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 1,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 36px rgba(52,152,219,0.16)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(44,62,80,0.09)"}
    >
      {/* Owner info */}
      <div style={{
        fontSize: "1rem",
        color: "#2563eb",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        fontWeight: 600,
        letterSpacing: "0.5px"
      }}>
        <span>
          <strong>{post.owner_username || post.owner || "Unknown"}</strong>
          {" "}
          <span style={{ fontSize: "0.85em", color: "#64748b" }}>
            ({post.owner || "Unknown"})
          </span>
        </span>
        <span style={{ fontSize: "0.85em", color: "#64748b" }}>
          • {formatDate(post.created_at)}
        </span>
      </div>
      <p style={{
        fontSize: "1.18rem",
        fontWeight: 500,
        color: "#22223b",
        marginBottom: "14px",
        wordBreak: "break-word",
        lineHeight: 1.7,
        background: "rgba(203,213,225,0.18)",
        borderRadius: "10px",
        padding: "12px 16px"
      }}>{post.content}</p>
      {post.mediaHash && (
        <img
          src={post.mediaHash}
          alt="media"
          style={{
            maxWidth: "100%",
            borderRadius: "16px",
            marginBottom: "14px",
            boxShadow: "0 2px 8px rgba(52,152,219,0.10)",
            border: "1px solid #e5e7eb"
          }}
        />
      )}
      <div style={{ marginTop: "7px", display: "flex", alignItems: "center", gap: "18px" }}>
        <button
          onClick={handleLike}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: likedByUser
              ? "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)"
              : "linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)",
            color: likedByUser ? "#fff" : "#2563eb",
            border: "none",
            borderRadius: "50px",
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: "1rem",
            marginRight: "8px",
            cursor: likedByUser || loading ? "not-allowed" : "pointer",
            boxShadow: likedByUser
              ? "0 4px 16px rgba(52,152,219,0.13)"
              : "0 2px 8px rgba(44,62,80,0.07)",
            transition: "all 0.2s",
            position: "relative",
            overflow: "hidden"
          }}
          disabled={likedByUser || loading}
        >
          {/* Like SVG icon */}
          <span style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
            transform: likedByUser ? "scale(1.15)" : "scale(1)"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={likedByUser ? "#fff" : "#2563eb"} xmlns="http://www.w3.org/2000/svg">
              <path d="M7 22V10H2V22H7ZM22 11.5C22 10.67 21.33 10 20.5 10H14.69L15.64 5.43L15.67 5.13C15.67 4.6 15.45 4.13 15.09 3.79L14.17 3L7.59 9.59C7.22 9.95 7 10.45 7 11V20C7 21.1 7.9 22 9 22H19C20.1 22 21 21.1 21 20V13.5C21 12.67 20.33 12 19.5 12H18V11.5C18 10.67 17.33 10 16.5 10H15V11.5C15 12.33 15.67 13 16.5 13H18V20C18 21.1 18.9 22 20 22H21C21.55 22 22 21.55 22 21V11.5Z"/>
            </svg>
          </span>
          <span style={{
            fontWeight: 700,
            fontSize: "1.05em",
            letterSpacing: "0.5px"
          }}>{likeCount}</span>
        </button>
        <button
          onClick={handleDislike}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: dislikedByUser
              ? "linear-gradient(90deg, #e11d48 0%, #f59e42 100%)"
              : "linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)",
            color: dislikedByUser ? "#fff" : "#e11d48",
            border: "none",
            borderRadius: "50px",
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: dislikedByUser || loading ? "not-allowed" : "pointer",
            boxShadow: dislikedByUser
              ? "0 4px 16px rgba(225,29,72,0.13)"
              : "0 2px 8px rgba(44,62,80,0.07)",
            transition: "all 0.2s",
            position: "relative",
            overflow: "hidden"
          }}
          disabled={dislikedByUser || loading}
        >
          {/* Dislike SVG icon */}
          <span style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
            transform: dislikedByUser ? "scale(1.15)" : "scale(1)"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={dislikedByUser ? "#fff" : "#e11d48"} xmlns="http://www.w3.org/2000/svg">
              <path d="M17 2v12h5V2h-5zm-2 0H5C3.9 2 3 2.9 3 4v7c0 1.1 0.9 2 2 2h6.31l-0.95 4.57c-0.09 0.43 0.04 0.88 0.35 1.19l0.92 0.92L16.41 14.41C16.78 14.05 17 13.55 17 13V4c0-1.1-0.9-2-2-2z"/>
            </svg>
          </span>
          <span style={{
            fontWeight: 700,
            fontSize: "1.05em",
            letterSpacing: "0.5px"
          }}>{dislikeCount}</span>
        </button>
      </div>
      {/* Pass a refresh function specifically for comments */}
      <CommentList postId={post.id} userAddress={userAddress} />
    </div>
  );
};

export default PostCard;
