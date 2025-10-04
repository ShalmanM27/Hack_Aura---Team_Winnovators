// ProfileAvatar.jsx
import React, { useState } from "react";

const ProfileAvatar = ({ avatarURI, size = 80 }) => {
  const [src, setSrc] = useState(avatarURI || "/default.jpg");

  const handleError = () => {
    setSrc("/default.jpg");
  };

  return (
    <img
      src={src}
      alt="Avatar"
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #2563eb",
        background: "#f8fafc",
        boxShadow: "0 2px 12px rgba(44,62,80,0.10)",
      }}
      onError={handleError}
    />
  );
};

export default ProfileAvatar;
