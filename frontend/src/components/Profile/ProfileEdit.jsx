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
    width: "100%",
    maxWidth: "350px",
    margin: "auto",
    gap: "14px",
    background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
    borderRadius: "18px",
    boxShadow: "0 4px 24px rgba(44,62,80,0.10)",
    padding: "32px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    fontSize: "1rem",
    marginBottom: "4px",
    boxShadow: "0 1px 4px rgba(52,152,219,0.06)",
    outline: "none",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    height: "80px",
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    fontSize: "1rem",
    marginBottom: "4px",
    boxShadow: "0 1px 4px rgba(52,152,219,0.06)",
    outline: "none",
    resize: "vertical",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  saveBtn: {
    background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "1.08rem",
    boxShadow: "0 2px 8px rgba(52,152,219,0.10)",
    transition: "background 0.2s",
  },
  cancelBtn: {
    background: "linear-gradient(90deg, #64748b 0%, #94a3b8 100%)",
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "1.08rem",
    boxShadow: "0 2px 8px rgba(52,152,219,0.06)",
    transition: "background 0.2s",
  },
};

export default ProfileEdit;
