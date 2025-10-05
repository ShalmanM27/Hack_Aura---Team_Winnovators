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
    mapping(uint256 => mapping(address => bool)) public voted;

    // New mappings to track user proposals and global proposals
    mapping(address => uint256[]) private userProposals;
    uint256[] private allProposals;

    event ProposalCreated(uint256 indexed proposalId, address proposer);
    event Voted(uint256 indexed proposalId, address voter, bool support);
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
        require(block.timestamp >= p.startTime && block.timestamp <= p.endTime, "Voting closed");
        require(!voted[proposalId][msg.sender], "Already voted");

        voted[proposalId][msg.sender] = true;
        if (support) {
            p.yesVotes++;
        } else {
            p.noVotes++;
        }

        emit Voted(proposalId, msg.sender, support);
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

    // Get all proposals of a specific user (reverse order: newest first)
    function getUserProposals(address user) external view returns (Proposal[] memory) {
        uint256[] storage ids = userProposals[user];
        uint256 count = ids.length;
        Proposal[] memory result = new Proposal[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = proposals[ids[count - i - 1]]; // reverse order
        }
        return result;
    }

    // Get all ongoing proposals excluding a specific user
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

        // Second pass: populate result
        for (uint256 i = 0; i < total; i++) {
            Proposal storage p = proposals[allProposals[i]];
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
}