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
      <h2>{profile.username}</h2>
      <p><strong>Bio:</strong> {profile.bio || "No bio yet"}</p>
      <p><strong>Owner:</strong> {profile.owner}</p>
      <button style={styles.button} onClick={onEdit}>
        Edit Profile
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "350px",
    margin: "auto",
  },
  button: {
    padding: "10px 18px",
    cursor: "pointer",
    backgroundColor: "#4b6cb7",
    color: "#fff",
    outline: "none",
    border: "none",
    borderRadius: "5px",
    marginTop: "10px",
  },
};

export default ProfileView;
