import React, { useState } from "react";
import { createProposal } from "../../api/api";

const CreateProposal = ({ refresh }) => {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!description) return;
    await createProposal({ description, duration: 86400 });
    setDescription("");
    refresh();
  };

  return (
    <div>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Proposal description"
      />
      <button onClick={handleSubmit}>
        Create Proposal
      </button>
    </div>
  );
};

export default CreateProposal;
