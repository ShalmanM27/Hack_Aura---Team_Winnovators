import React from "react";

const ProposalList = ({ proposals, vote }) => {
  return (
    <div>
      {proposals.map((p) => (
        <div key={p.id}>
          <p>{p.description}</p>
          <p>Yes: {p.yesVotes} No: {p.noVotes}</p>
          <button onClick={() => vote(p.id, true)}>
            Vote Yes
          </button>
          <button onClick={() => vote(p.id, false)}>
            Vote No
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProposalList;
