// ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/api";
import ProfileView from "../components/Profile/ProfileView";
import ProfileEdit from "../components/Profile/ProfileEdit";

const ProfilePage = ({ userAddress }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const editing = location.pathname.endsWith("/edit");

  const fetchProfile = async () => {
    if (!userAddress) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await getProfile(userAddress);
      setLoading(false);
      if (res.success && res.data) {
        setProfile({ ...res.data, exists: !!res.data.owner && res.data.owner !== "0x0000000000000000000000000000000000000000" });
      } else {
        setProfile({ exists: false });
        setMessage(res.error || "Failed to load profile");
      }
    } catch (err) {
      setLoading(false);
      setProfile({ exists: false });
      setMessage("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userAddress]);

  const handleSave = async (updatedData) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await updateProfile(userAddress, updatedData);
      setLoading(false);
      if (res.success) {
        alert(`Profile updated! Tx: ${res.data?.txHash || "unknown"}`);
        navigate("/profile"); // go back to view after edit
        fetchProfile();
      } else {
        alert("Failed to update profile: " + (res.error || "unknown"));
      }
    } catch (err) {
      setLoading(false);
      alert("Error updating profile: " + err.message);
    }
  };

  if (!userAddress) {
    return (
      <div style={{
        background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
        borderRadius: "18px",
        boxShadow: "0 4px 24px rgba(44,62,80,0.10)",
        padding: "32px",
        textAlign: "center",
        color: "#2563eb",
        fontWeight: 600,
        fontSize: "1.15rem",
        margin: "40px auto",
        maxWidth: "400px"
      }}>
        Connect your wallet to manage profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
        borderRadius: "18px",
        boxShadow: "0 4px 24px rgba(44,62,80,0.10)",
        padding: "32px",
        textAlign: "center",
        color: "#2563eb",
        fontWeight: 600,
        fontSize: "1.15rem",
        margin: "40px auto",
        maxWidth: "400px"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
      borderRadius: "24px",
      boxShadow: "0 8px 32px rgba(44,62,80,0.09)",
      padding: "40px",
      maxWidth: "480px",
      margin: "48px auto",
      textAlign: "center",
      animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)"
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
      <h2 style={{
        color: "#2563eb",
        fontWeight: 800,
        fontSize: "2rem",
        marginBottom: "24px",
        letterSpacing: "1px",
        textShadow: "0 2px 8px rgba(44,62,80,0.10)"
      }}>My Profile</h2>
      {message && <p style={{ color: "#e11d48", fontWeight: 600, marginBottom: "18px" }}>{message}</p>}

      {!profile?.exists && !editing && (
        <button
          style={styles.createButton}
          onClick={() => navigate("/profile/edit")}
        >
          Create Profile
        </button>
      )}

      {profile?.exists && !editing && (
        <ProfileView profile={profile} onEdit={() => navigate("/profile/edit")} />
      )}

      {editing && (
        <ProfileEdit
          profile={profile || {}}
          onSave={handleSave}
          onCancel={() => navigate("/profile")}
        />
      )}
    </div>
  );
};

const styles = {
  createButton: {
    padding: "12px 28px",
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

export default ProfilePage;
