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
        border: "2px solid #4b6cb7",
        background: "#eee",
      }}
      onError={handleError}
    />
  );
};

export default ProfileAvatar;
