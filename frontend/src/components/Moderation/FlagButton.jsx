import React from "react";
import { flagContent } from "../../api/api";

const FlagButton = ({ contentId }) => {
  const handleFlag = async () => {
    await flagContent({ content_id: contentId });
    alert("Content flagged!");
  };

  return (
    <button onClick={handleFlag}>
      Flag
    </button>
  );
};

export default FlagButton;
