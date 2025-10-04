import React from "react";
import PostCard from "./PostCard";

const FeedList = ({ posts, userAddress, refresh }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "28px",
        boxShadow: "0 8px 32px rgba(60,72,88,0.10)",
        padding: "40px 0",
        maxWidth: "950px", // Wider for more space
        margin: "0 auto",
        border: "1px solid #e0e7ff",
      }}
    >
      <div style={{ marginTop: "8px" }}>
        {posts.map((post, idx) => (
          <React.Fragment key={post.id}>
            <div
              style={{
                padding: "0 48px",
                marginBottom: "56px", // More space between posts
                animation: "fadeIn 0.7s cubic-bezier(.25,.8,.25,1)",
              }}
            >
              <PostCard post={post} userAddress={userAddress} refresh={refresh} />
            </div>

            {/* Decorative separator */}
            {idx < posts.length - 1 && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 0 32px 0",
                }}
              >
                {/* Lighter gradient line */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    right: "0",
                    height: "4px",
                    background: "linear-gradient(90deg, #e0e7ff 0%, #6366f1 50%, #e0e7ff 100%)",
                    opacity: 0.25,
                    transform: "translateY(-50%)",
                    borderRadius: "2px",
                    boxShadow: "0 1px 6px rgba(99,102,241,0.10)",
                  }}
                />

                {/* Smaller decorative circle with SVG icon */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(99,102,241,0.18), 0 0 0 3px #e0e7ff",
                    border: "2px solid #fff",
                    zIndex: 2,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    filter: "drop-shadow(0 0 4px #6366f1)",
                  }}
                >
                  {/* SVG message icon */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="3" y="6" width="18" height="12" rx="4" fill="#fff" opacity="0.8" />
                    <path
                      d="M3 8l9 5 9-5"
                      stroke="#6366f1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default FeedList;
