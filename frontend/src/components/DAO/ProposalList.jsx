import React, { useEffect, useState } from "react";
import { voteProposal, executeProposal, getUserVote } from "../../api/api";

const ProposalList = ({ proposals, userAddress, onUpdated, hideProposer }) => {
  const [votes, setVotes] = useState({}); // { proposalId: voteType }

  const fetchVotes = async () => {
    if (!userAddress) return;
    const newVotes = {};
    for (const p of proposals) {
      const vt = await getUserVote(p.id, userAddress);
      newVotes[p.id] = vt;
    }
    setVotes(newVotes);
  };

  useEffect(() => {
    fetchVotes();
  }, [proposals, userAddress]);

  const handleVote = async (proposalId, support) => {
    try {
      await voteProposal(proposalId, support);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  const handleExecute = async (proposalId) => {
    try {
      await executeProposal(proposalId);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Execute failed:", err);
    }
  };

  const formatTime = (timestamp) => {
    const d = new Date(timestamp * 1000);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const isActive = (p) => Date.now() / 1000 >= p.startTime && Date.now() / 1000 <= p.endTime;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {proposals.length === 0 && (
        <p style={{ color: "#64748b", fontWeight: 600, fontSize: "1.08rem", textAlign: "center" }}>
          No proposals to display.
        </p>
      )}
      {proposals.map((p) => {
        const userVoteType = votes[p.id] || 0; // 0=no vote, 1=like, 2=dislike

        return (
          <div
            key={p.id}
            style={{
              background: "linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)",
              borderRadius: "18px",
              boxShadow: "0 4px 24px rgba(44,62,80,0.10)",
              padding: "28px",
              border: "1px solid #e5e7eb",
              position: "relative",
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
            <div style={{ marginBottom: "10px", fontWeight: 700, color: "#2563eb", fontSize: "1.15rem" }}>
              <span role="img" aria-label="proposal" style={{ marginRight: "8px" }}>📜</span>
              {p.description}
            </div>
            {!hideProposer && (
              <div style={{ color: "#22223b", fontSize: "1.02rem", marginBottom: "6px" }}>
                <strong>Proposer:</strong> {p.proposer}
              </div>
            )}
            <div style={{ color: "#64748b", fontSize: "0.98rem", marginBottom: "6px" }}>
              <strong>Start:</strong> {formatTime(p.startTime)}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.98rem", marginBottom: "6px" }}>
              <strong>End:</strong> {formatTime(p.endTime)}
            </div>
            <div style={{ color: "#2563eb", fontWeight: 600, marginBottom: "8px" }}>
              <span style={{ marginRight: "12px" }}>👍 Yes: {p.yesVotes}</span>
              <span>👎 No: {p.noVotes}</span>
            </div>
            <div style={{ color: "#4caf50", fontWeight: 700, marginBottom: "8px" }}>
              Executed: {p.executed ? "✅ Yes" : "❌ No"}
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
              {isActive(p) && p.proposer !== userAddress && (
                <>
                  <button
                    onClick={() => handleVote(p.id, true)}
                    style={{
                      background: userVoteType === 1 ? "#16a34a" : "linear-gradient(90deg, #22c55e 0%, #38bdf8 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 22px",
                      fontWeight: 700,
                      fontSize: "1rem",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(34,197,94,0.10)",
                      transition: "background 0.2s",
                    }}
                  >
                    👍 Yes
                  </button>
                  <button
                    onClick={() => handleVote(p.id, false)}
                    style={{
                      background: userVoteType === 2 ? "#b91c1c" : "linear-gradient(90deg, #e11d48 0%, #f59e42 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 22px",
                      fontWeight: 700,
                      fontSize: "1rem",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(225,29,72,0.10)",
                      transition: "background 0.2s",
                    }}
                  >
                    👎 No
                  </button>
                </>
              )}
              {Date.now() / 1000 > p.endTime && !p.executed && (
                <button
                  onClick={() => handleExecute(p.id)}
                  style={{
                    background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(52,152,219,0.10)",
                    transition: "background 0.2s",
                  }}
                >
                  🚀 Execute
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProposalList;
