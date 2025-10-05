// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DAO {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
    }

    uint256 public nextProposalId;
    mapping(uint256 => Proposal) public proposals;

    // Track user vote type: 0 = no vote, 1 = like, 2 = dislike
    mapping(uint256 => mapping(address => uint8)) public userVote;

    // Track proposals by user and globally
    mapping(address => uint256[]) private userProposals;
    uint256[] private allProposals;

    // ----------------- EVENTS -----------------
    event ProposalCreated(uint256 indexed proposalId, address proposer);
    event Voted(uint256 indexed proposalId, address voter, uint8 voteType);
    event ProposalExecuted(uint256 indexed proposalId);

    // ----------------- DAO FUNCTIONS -----------------
    function createProposal(string calldata description, uint256 duration) external {
        Proposal storage p = proposals[nextProposalId];
        p.id = nextProposalId;
        p.proposer = msg.sender;
        p.description = description;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + duration;
        p.executed = false;

        // Track user's proposals
        userProposals[msg.sender].push(nextProposalId);

        // Track all proposals
        allProposals.push(nextProposalId);

        emit ProposalCreated(nextProposalId, msg.sender);
        nextProposalId++;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp <= p.endTime, "Voting closed");

        uint8 previousVote = userVote[proposalId][msg.sender];

        if (support) {
            // Like vote
            if (previousVote == 2) {
                // previously disliked
                p.noVotes--;
                p.yesVotes++;
                userVote[proposalId][msg.sender] = 1;
            } else if (previousVote == 0) {
                // first vote
                p.yesVotes++;
                userVote[proposalId][msg.sender] = 1;
            }
        } else {
            // Dislike vote
            if (previousVote == 1) {
                // previously liked
                p.yesVotes--;
                p.noVotes++;
                userVote[proposalId][msg.sender] = 2;
            } else if (previousVote == 0) {
                // first vote
                p.noVotes++;
                userVote[proposalId][msg.sender] = 2;
            }
        }

        emit Voted(proposalId, msg.sender, userVote[proposalId][msg.sender]);
    }

    function executeProposal(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp > p.endTime, "Voting not ended");
        require(!p.executed, "Already executed");

        if (p.yesVotes > p.noVotes) {
            p.executed = true;
            // Proposal execution logic can be implemented here
        }

        emit ProposalExecuted(proposalId);
    }

    // ----------------- VIEW FUNCTIONS -----------------

    // Get all proposals of a specific user (newest → oldest)
    function getUserProposals(address user) external view returns (Proposal[] memory) {
        uint256[] storage ids = userProposals[user];
        uint256 count = ids.length;
        Proposal[] memory result = new Proposal[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = proposals[ids[count - i - 1]]; // reverse order
        }
        return result;
    }

    // Get all ongoing proposals excluding a specific user (newest → oldest)
    function getOngoingProposalsExcluding(address user) external view returns (Proposal[] memory) {
        uint256 total = allProposals.length;
        uint256 liveCount = 0;

        // First pass: count live proposals not by user
        for (uint256 i = 0; i < total; i++) {
            Proposal storage p = proposals[allProposals[i]];
            if (block.timestamp <= p.endTime && p.proposer != user) {
                liveCount++;
            }
        }

        Proposal[] memory result = new Proposal[](liveCount);
        uint256 index = 0;

        // Second pass: populate in reverse order (newest → oldest)
        for (uint256 i = total; i > 0; i--) {
            Proposal storage p = proposals[allProposals[i - 1]];
            if (block.timestamp <= p.endTime && p.proposer != user) {
                result[index] = p;
                index++;
            }
        }

        return result;
    }

    // Get a single proposal by ID
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }

    // Get the vote of a user on a proposal
    function getUserVote(uint256 proposalId, address user) external view returns (uint8) {
        return userVote[proposalId][user]; // 0 = no vote, 1 = like, 2 = dislike
    }
}
