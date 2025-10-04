import React from "react";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";

const FeedList = ({ posts, userAddress, refresh }) => {
  return (
    <div>
      <CreatePost refresh={refresh} />
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          userAddress={userAddress}
          refresh={refresh}
        />
      ))}
    </div>
  );
};

export default FeedList;
