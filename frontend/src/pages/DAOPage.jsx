import React, { useEffect, useState } from "react";
import ProposalList from "../components/DAO/ProposalList";
import CreateProposal from "../components/DAO/CreateProposal";
import { getProposals, voteProposal } from "../api/api";

const DAOPage = ({ userAddress }) => {
  const [proposals, setProposals] = useState([]);

  const fetchProposals = async () => {
    const res = await getProposals();
    setProposals(res.data.proposals || []);
  };

  const handleVote = async (proposalId, support) => {
    await voteProposal({ proposal_id: proposalId, support });
    fetchProposals();
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div>
      <h2>DAO</h2>
      <CreateProposal refresh={fetchProposals} />
      <ProposalList proposals={proposals} vote={handleVote} />
    </div>
  );
};

export default DAOPage;
