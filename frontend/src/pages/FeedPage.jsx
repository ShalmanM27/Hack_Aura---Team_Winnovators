import React, { useEffect, useState } from "react";
import FeedList from "../components/Feed/FeedList";
import { getLatestPosts } from "../api/api";

const FeedPage = ({ userAddress, refresh }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await getLatestPosts(10, userAddress);
      setPosts(res);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    if (userAddress) fetchPosts();
  }, [userAddress]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1150px", // Extended width for more space
        background: "#fff",
        borderRadius: "32px", // Softer corners
        boxShadow: "0 12px 36px rgba(60,72,88,0.13)",
        border: "1px solid #e0e7ff",
        padding: "56px 56px 48px 56px", // More padding
        minHeight: "700px", // Taller feel
        margin: "0 auto",
        animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)",
        position: "relative",
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
      <h2
        style={{
          color: "#6366f1",
          fontWeight: 800,
          fontSize: "2.4rem",
          marginBottom: "48px",
          letterSpacing: "2px",
          textShadow: "0 2px 8px rgba(60,72,88,0.10)",
          textAlign: "center",
          padding: "0 0 12px 0",
          borderBottom: "1.5px solid #e0e7ff",
        }}
      >
        Feed
      </h2>

      <FeedList posts={posts} userAddress={userAddress} refresh={fetchPosts} />
    </div>
  );
};

export default FeedPage;
