import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MetamaskLogin from "./components/Auth/MetamaskLogin";
import FeedPage from "./pages/FeedPage";
import LearningPage from "./pages/LearningPage";
import DAOPage from "./pages/DAOPage";
import ModerationPage from "./pages/ModerationPage";
import StreakPage from "./pages/StreakPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePost from "./components/Feed/CreatePost";

function App() {
  const [userAddress, setUserAddress] = useState("");

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "32px 48px 16px 48px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e0eafc",
            boxShadow: "0 2px 16px rgba(91,114,190,0.08)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "2.8rem",
              fontWeight: 900,
              letterSpacing: "2px",
              color: "#5f72be",
              textShadow: "0 2px 16px rgba(91,114,190,0.10)",
            }}
          >
            Learning Platform
          </h1>
          <div style={{ marginLeft: "auto" }}>
            <MetamaskLogin setUserAddress={setUserAddress} />
          </div>
        </header>

        {/* NAVIGATION */}
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
            padding: "24px 0",
            background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
            borderRadius: "0 0 32px 32px",
            boxShadow: "0 2px 16px rgba(91,114,190,0.08)",
            margin: "0 48px",
          }}
        >
          {[
            { path: "/feed", label: "Feed" },
            { path: "/learning", label: "Learning" },
            { path: "/dao", label: "DAO" },
            { path: "/moderation", label: "Moderation" },
            { path: "/streak", label: "Streak" },
            { path: "/profile", label: "Profile" },
          ].map((link) => (
            <Link key={link.path} to={link.path} style={linkStyle}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* MAIN CONTENT */}
        <main
          style={{
            margin: "48px auto",
            maxWidth: "900px",
            background: "rgba(255,255,255,0.98)",
            borderRadius: "32px",
            boxShadow: "0 8px 32px rgba(91,114,190,0.12)",
            padding: "48px",
            minHeight: "480px",
            backdropFilter: "blur(2px)",
          }}
        >
          <Routes>
            {/* Feed */}
            <Route
              path="/feed"
              element={<FeedPage userAddress={userAddress} />}
            />
            <Route
              path="/feed/create"
              element={
                <CreatePost
                  refresh={() => {}}
                  onPostCreated={() => window.location.replace("/feed")}
                />
              }
            />

            {/* Learning */}
            <Route
              path="/learning/*"
              element={<LearningPage userAddress={userAddress} />}
            />

            {/* DAO */}
            <Route path="/dao" element={<DAOPage userAddress={userAddress} />} />

            {/* Moderation */}
            <Route
              path="/moderation"
              element={<ModerationPage userAddress={userAddress} />}
            />

            {/* Streak */}
            <Route
              path="/streak"
              element={<StreakPage userAddress={userAddress} />}
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={<ProfilePage userAddress={userAddress} />}
            />
            <Route
              path="/profile/edit"
              element={<ProfilePage userAddress={userAddress} />}
            />

            {/* Default / Fallback */}
            <Route
              path="*"
              element={
                <div
                  style={{
                    color: "#5f72be",
                    fontSize: "2rem",
                    fontWeight: 700,
                    textAlign: "center",
                    marginTop: "120px",
                    textShadow: "0 2px 16px rgba(91,114,190,0.15)",
                  }}
                >
                  Welcome! Connect your wallet to start.
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// NAV LINK STYLE
const linkStyle = {
  color: "#fff",
  fontWeight: 700,
  fontSize: "1.15rem",
  textDecoration: "none",
  padding: "10px 24px",
  borderRadius: "12px",
  transition: "all 0.2s",
  background: "rgba(255,255,255,0.10)",
};

export default App;
