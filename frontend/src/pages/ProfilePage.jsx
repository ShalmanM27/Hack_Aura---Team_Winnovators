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
    return <p>Connect your wallet to manage profile.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>My Profile</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}

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

export default ProfilePage;
