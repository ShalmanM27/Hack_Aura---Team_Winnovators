import React, { useEffect, useState } from "react";
import FeedList from "../components/Feed/FeedList";
import { getLatestPosts } from "../api/api";

const FeedPage = ({ userAddress }) => {
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
    <div style={{ padding: "20px" }}>
      <h2>Feed</h2>
      <FeedList posts={posts} userAddress={userAddress} refresh={fetchPosts} />
    </div>
  );
};

export default FeedPage;
