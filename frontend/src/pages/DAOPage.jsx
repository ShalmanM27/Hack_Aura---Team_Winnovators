import React, { useEffect, useState } from "react";
import CreateProposal from "../components/DAO/CreateProposal";
import ProposalList from "../components/DAO/ProposalList";
import { getUserProposals, getLiveProposals } from "../api/api";

const DAOPage = ({ currentUserAddress }) => {
  const [myProposals, setMyProposals] = useState([]);
  const [liveProposals, setLiveProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProposals = async () => {
    if (!currentUserAddress) return;
    setLoading(true);
    try {
      const userProps = await getUserProposals(currentUserAddress);
      const liveProps = await getLiveProposals(currentUserAddress);
      setMyProposals(userProps);
      setLiveProposals(liveProps);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, [currentUserAddress]);

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
        borderRadius: "28px",
        boxShadow: "0 8px 32px rgba(44,62,80,0.09)",
        padding: "40px",
        maxWidth: "900px",
        margin: "48px auto",
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
      <h2
        style={{
          fontSize: "2.2rem",
          fontWeight: 900,
          color: "#2563eb",
          marginBottom: "32px",
          letterSpacing: "1px",
          textShadow: "0 2px 8px rgba(44,62,80,0.10)",
          textAlign: "center",
        }}
      >
        DAO Dashboard
      </h2>

      <CreateProposal onProposalCreated={fetchProposals} />

      <div style={{ marginBottom: "40px" }}>
        <h3
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "#2563eb",
            marginBottom: "18px",
            letterSpacing: "1px",
          }}
        >
          My Proposals
        </h3>
        {loading ? (
          <p style={{ color: "#64748b", fontWeight: 600 }}>Loading...</p>
        ) : (
          <ProposalList
            proposals={myProposals}
            userAddress={currentUserAddress}
            onUpdated={fetchProposals}
            hideProposer={true}
          />
        )}
      </div>

      <div>
        <h3
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "#2563eb",
            marginBottom: "18px",
            letterSpacing: "1px",
          }}
        >
          Live Proposals (General)
        </h3>
        {loading ? (
          <p style={{ color: "#64748b", fontWeight: 600 }}>Loading...</p>
        ) : (
          <ProposalList proposals={liveProposals} userAddress={currentUserAddress} onUpdated={fetchProposals} />
        )}
      </div>
    </div>
  );
};

export default DAOPage;
