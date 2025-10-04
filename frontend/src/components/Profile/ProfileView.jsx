// ProfileView.jsx
import React from "react";
import ProfileAvatar from "./ProfileAvatar";

const ProfileView = ({ profile, onEdit }) => {
  if (!profile || !profile.exists) {
    return <p>No profile found. Please create one.</p>;
  }

  return (
    <div style={styles.container}>
      <ProfileAvatar avatarURI={profile.avatarURI} size={120} />
      <h2 style={{
        color: "#2563eb",
        fontWeight: 700,
        fontSize: "1.5rem",
        margin: "18px 0 8px 0",
        letterSpacing: "1px"
      }}>{profile.username}</h2>
      <p style={{
        color: "#22223b",
        fontSize: "1.08rem",
        marginBottom: "8px"
      }}><strong>Bio:</strong> {profile.bio || "No bio yet"}</p>
      <p style={{
        color: "#64748b",
        fontSize: "0.98rem",
        marginBottom: "12px"
      }}><strong>Owner:</strong> {profile.owner}</p>
      <button style={styles.button} onClick={onEdit}>
        Edit Profile
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "32px",
    border: "none",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "350px",
    margin: "auto",
    background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
    boxShadow: "0 4px 24px rgba(44,62,80,0.10)",
  },
  button: {
    padding: "10px 24px",
    cursor: "pointer",
    background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
    color: "#fff",
    outline: "none",
    border: "none",
    borderRadius: "8px",
    marginTop: "18px",
    fontWeight: 700,
    fontSize: "1.08rem",
    boxShadow: "0 2px 8px rgba(52,152,219,0.10)",
    transition: "background 0.2s",
  },
};

export default ProfileView;
