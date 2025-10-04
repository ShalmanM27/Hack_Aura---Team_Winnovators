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
        await removeDislike({ post_id: post.id });
        setDislikeCount(dislikeCount - 1);
        setDislikedByUser(false);
      }

      await likePost({ post_id: post.id });
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
        await removeLike({ post_id: post.id });
        setLikeCount(likeCount - 1);
        setLikedByUser(false);
      }

      await dislikePost({ post_id: post.id });
      setDislikeCount(dislikeCount + 1);
      setDislikedByUser(true);

      if (refresh) refresh();
    } catch (err) {
      console.error("Error disliking post:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
      <p>{post.content}</p>
      {post.mediaHash && (
        <img src={post.mediaHash} alt="media" style={{ maxWidth: "100%" }} />
      )}
      <div style={{ marginTop: "5px" }}>
        <button
          onClick={handleLike}
          style={{ color: likedByUser ? "green" : "black" }}
          disabled={likedByUser || loading}
        >
          👍 {likeCount}
        </button>
        <button
          onClick={handleDislike}
          style={{ marginLeft: "5px", color: dislikedByUser ? "red" : "black" }}
          disabled={dislikedByUser || loading}
        >
          👎 {dislikeCount}
        </button>
      </div>
      {/* Pass a refresh function specifically for comments */}
      <CommentList postId={post.id} userAddress={userAddress} />
    </div>
  );
};

export default PostCard;
