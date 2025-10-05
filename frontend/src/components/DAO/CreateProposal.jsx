import React, { useState } from "react";
import { createProposal } from "../../api/api";

const CreateProposal = ({ onProposalCreated }) => {
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(3600); // default 1 hour
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const receipt = await createProposal(description, Number(duration));
      setDescription("");
      setDuration(3600);
      if (onProposalCreated) onProposalCreated();
      console.log("Proposal created:", receipt);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create proposal");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)",
        borderRadius: "18px",
        boxShadow: "0 4px 24px rgba(44,62,80,0.10)",
        padding: "32px",
        marginBottom: "32px",
        maxWidth: "500px",
        margin: "0 auto 32px auto",
        border: "1px solid #e5e7eb",
        animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
      <h3
        style={{
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "#2563eb",
          marginBottom: "18px",
          letterSpacing: "1px",
          textAlign: "center",
        }}
      >
        Create New Proposal
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Proposal description"
            required
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: "1rem",
              background: "#f8fafc",
              boxShadow: "0 1px 4px rgba(52,152,219,0.06)",
              outline: "none",
              resize: "vertical",
              marginBottom: "8px",
            }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration in seconds"
            min={60}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: "1rem",
              background: "#f8fafc",
              boxShadow: "0 1px 4px rgba(52,152,219,0.06)",
              outline: "none",
              marginBottom: "8px",
            }}
          />
          <span
            style={{
              color: "#64748b",
              fontSize: "0.98rem",
              marginLeft: "4px",
            }}
          >
            (Minimum: 60 seconds)
          </span>
        </div>
        {error && (
          <p
            style={{
              color: "#e11d48",
              fontWeight: 600,
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 32px",
            fontWeight: 700,
            fontSize: "1.08rem",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(52,152,219,0.10)",
            transition: "background 0.2s",
            display: "block",
            margin: "0 auto",
          }}
        >
          {loading ? "Creating..." : "Create Proposal"}
        </button>
      </form>
    </div>
  );
};

export default CreateProposal;
