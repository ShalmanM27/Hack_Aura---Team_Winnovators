// ProfileEdit.jsx
import React, { useState } from "react";

const ProfileEdit = ({ profile, onSave, onCancel }) => {
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarURI, setAvatarURI] = useState(profile?.avatarURI || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ username, bio, avatarURI });
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <label>Username</label>
      <input
        style={styles.input}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label>Bio</label>
      <textarea
        style={styles.textarea}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <label>Avatar URL</label>
      <input
        style={styles.input}
        value={avatarURI}
        onChange={(e) => setAvatarURI(e.target.value)}
      />

      <div style={styles.buttonRow}>
        <button type="submit" style={styles.saveBtn}>
          Save
        </button>
        <button type="button" style={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    width: "350px",
    margin: "auto",
    gap: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "8px",
    borderRadius: "4px",
    height: "80px",
    border: "1px solid #ccc",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  saveBtn: {
    backgroundColor: "#4b6cb7",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#aaa",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ProfileEdit;
