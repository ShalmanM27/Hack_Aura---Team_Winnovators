import React, { useState } from "react";
import { flagContent } from "../api/api";

const ModerationPage = ({ userAddress }) => {
  const [contentId, setContentId] = useState("");

  const handleFlag = async () => {
    if (!contentId) return;
    await flagContent({ content_id: parseInt(contentId) });
    alert("Flag submitted");
    setContentId("");
  };

  return (
    <div>
      <h2>Moderation</h2>
      <input
        type="number"
        placeholder="Enter Post/Comment ID"
        value={contentId}
        onChange={(e) => setContentId(e.target.value)}
      />
      <button onClick={handleFlag}>
        Flag Content
      </button>
    </div>
  );
};

export default ModerationPage;
