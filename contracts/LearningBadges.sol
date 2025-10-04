// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LearningBadges is ERC1155, Ownable {
    uint256 public nextBadgeId;
    mapping(uint256 => string) public badgeURI; // badgeId -> metadata

    constructor(string memory _baseURI) ERC1155(_baseURI) Ownable(msg.sender) {
        // msg.sender becomes the owner
    }

    /**
     * @dev Admin creates a new badge type.
     * @param _badgeURI The metadata URI for this badge.
     * @return badgeId The ID of the newly created badge.
     */
    function createBadge(string calldata _badgeURI) external onlyOwner returns (uint256 badgeId) {
        badgeId = nextBadgeId;
        badgeURI[badgeId] = _badgeURI;
        nextBadgeId++;
    }

    /**
     * @dev Mint badge tokens to a user.
     */
    function mint(address user, uint256 badgeId, uint256 amount) external onlyOwner {
        require(badgeId < nextBadgeId, "Badge does not exist");
        _mint(user, badgeId, amount, "");
    }

    /**
     * @dev Burn badge tokens from a user.
     */
    function burn(address user, uint256 badgeId, uint256 amount) external onlyOwner {
        _burn(user, badgeId, amount);
    }

    /**
     * @dev Override uri function to return metadata URI for a badgeId
     */
    function uri(uint256 badgeId) public view override returns (string memory) {
        require(badgeId < nextBadgeId, "Badge does not exist");
        return badgeURI[badgeId];
    }
}
