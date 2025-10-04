import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import MetamaskLogin from "./components/Auth/MetamaskLogin";
import FeedPage from "./pages/FeedPage";
import LearningPage from "./pages/LearningPage";
import DAOPage from "./pages/DAOPage";
import ModerationPage from "./pages/ModerationPage";
import StreakPage from "./pages/StreakPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePost from "./components/Feed/CreatePost";

// --- UI DESIGN CHANGES START ---
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)",
    fontFamily: "Inter, Arial, sans-serif",
    transition: "background 0.6s",
    display: "flex",
    flexDirection: "column",
    animation: "fadeIn 1.2s cubic-bezier(.25,.8,.25,1)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "28px 36px 12px 36px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #e3e6ee",
    boxShadow: "0 2px 16px rgba(91,114,190,0.10)",
    borderRadius: "0 0 24px 24px",
    position: "relative",
    zIndex: 2,
    margin: "0 0 0 0",
  },
  headerTitle: {
    margin: 0,
    fontSize: "2.2rem",
    fontWeight: 900,
    letterSpacing: "1.5px",
    color: "#232946",
    textShadow: "0 2px 12px rgba(91,114,190,0.08)",
    background: "none",
    WebkitBackgroundClip: "unset",
    WebkitTextFillColor: "unset",
    transition: "color 0.3s",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "18px",
    flexWrap: "wrap",
    padding: "18px 0",
    background: "rgba(245,247,250,0.98)",
    borderRadius: "32px",
    boxShadow: "0 2px 12px rgba(91,114,190,0.07)",
    margin: "0 36px",
    position: "relative",
    zIndex: 1,
    border: "1px solid #e3e6ee",
    minHeight: "64px",
    alignItems: "center",
  },
  main: {
    margin: "36px auto",
    maxWidth: "900px",
    background: "rgba(255,255,255,0.98)",
    borderRadius: "28px",
    boxShadow: "0 6px 24px rgba(91,114,190,0.13)",
    padding: "36px",
    minHeight: "480px",
    backdropFilter: "blur(1.5px)",
    width: "92vw",
    transition: "box-shadow 0.3s, background 0.3s",
    animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)",
  },
  welcome: {
    color: "#232946",
    fontSize: "2rem",
    fontWeight: 700,
    textAlign: "center",
    marginTop: "100px",
    textShadow: "0 2px 12px rgba(91,114,190,0.10)",
    letterSpacing: "1px",
  },
};

const linkStyle = {
  color: "#232946",
  fontWeight: 600,
  fontSize: "1.08rem",
  textDecoration: "none",
  padding: "10px 28px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.85)",
  boxShadow: "0 1px 6px rgba(91,114,190,0.07)",
  border: "1px solid #e3e6ee",
  transition: "all 0.25s cubic-bezier(.25,.8,.25,1)",
  position: "relative",
  outline: "none",
  display: "inline-block",
  margin: "0 2px",
};

const activeLinkStyle = {
  ...linkStyle,
  background: "linear-gradient(90deg, #232946 0%, #5f72be 100%)",
  color: "#fff",
  boxShadow: "0 4px 16px rgba(91,114,190,0.18)",
  transform: "scale(1.07)",
  border: "1px solid #5f72be",
};

function AnimatedNavLinks({ links }) {
  const location = useLocation();
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          style={location.pathname.startsWith(link.path) ? activeLinkStyle : linkStyle}
          tabIndex={0}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(91,114,190,0.18)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = location.pathname.startsWith(link.path) ? activeLinkStyle.boxShadow : linkStyle.boxShadow}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

// --- UI DESIGN CHANGES END ---

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);
  const handleFeedRefresh = () => setFeedRefreshKey((k) => k + 1);

  return (
    <Router>
      <div style={styles.wrapper}>
        {/* Butter smooth fade-in animation */}
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px);}
              to { opacity: 1; transform: translateY(0);}
            }
            ::selection {
              background: #5f72be22;
            }
          `}
        </style>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Learning Platform</h1>
          <div style={{ marginLeft: "auto" }}>
            <MetamaskLogin setUserAddress={setUserAddress} />
          </div>
        </header>

        <nav style={styles.nav}>
          <AnimatedNavLinks
            links={[
              { path: "/feed", label: "Feed" },
              { path: "/learning", label: "Learning" },
              { path: "/dao", label: "DAO" },
              { path: "/moderation", label: "Moderation" },
              { path: "/streak", label: "Streak" },
              { path: "/profile", label: "Profile" },
            ]}
          />
        </nav>

        <Routes>
          {/* Feed layout without main */}
          <Route
            path="/feed"
            element={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: "48px",
                  width: "100%",
                  maxWidth: "1400px",
                  margin: "48px auto",
                  padding: "0 24px",
                  animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)",
                }}
              >
                <div style={{
                  minWidth: "340px",
                  flexShrink: 0,
                  background: "rgba(245,247,250,0.98)",
                  borderRadius: "24px",
                  boxShadow: "0 2px 12px rgba(91,114,190,0.08)",
                  padding: "24px 18px",
                  border: "1px solid #e3e6ee",
                  marginTop: "8px",
                  transition: "box-shadow 0.3s",
                }}>
                  <CreatePost refresh={handleFeedRefresh} />
                </div>
                <div style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.98)",
                  borderRadius: "24px",
                  boxShadow: "0 2px 12px rgba(91,114,190,0.09)",
                  padding: "24px 18px",
                  border: "1px solid #e3e6ee",
                  marginTop: "8px",
                  transition: "box-shadow 0.3s",
                }}>
                  <FeedPage userAddress={userAddress} key={feedRefreshKey} />
                </div>
              </div>
            }
          />

          {/* All other pages wrapped in main */}
          <Route
            path="*"
            element={
              <main style={styles.main}>
                <Routes>
                  <Route
                    path="/learning/*"
                    element={<LearningPage userAddress={userAddress} />}
                  />
                  <Route path="/dao" element={<DAOPage userAddress={userAddress} />} />
                  <Route
                    path="/moderation"
                    element={<ModerationPage userAddress={userAddress} />}
                  />
                  <Route
                    path="/streak"
                    element={<StreakPage userAddress={userAddress} />}
                  />
                  <Route
                    path="/profile"
                    element={<ProfilePage userAddress={userAddress} />}
                  />
                  <Route
                    path="/profile/edit"
                    element={<ProfilePage userAddress={userAddress} />}
                  />
                  <Route
                    path="*"
                    element={
                      !userAddress ? (
                        <div style={styles.welcome}>
                          Welcome! Connect your wallet to start.
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "#5f72be",
                            fontSize: "2rem",
                            fontWeight: 700,
                            textAlign: "center",
                            marginTop: "100px",
                            textShadow: "0 2px 12px rgba(91,114,190,0.10)",
                            letterSpacing: "1px",
                          }}
                        >
                          You're connected! Select a page from above.
                        </div>
                      )
                    }
                  />
                </Routes>
              </main>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
