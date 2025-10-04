// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Profile
 * @notice Simple on-chain profile registry. Each address can create/update/delete their profile.
 *         Usernames are enforced unique (case-sensitive) via usernameHash => owner mapping.
 */
contract Profile {
    struct ProfileData {
        address owner;
        string username;
        string avatarURI;
        string bio;
        uint256 updatedAt;
        bool exists;
    }

    // address -> profile
    mapping(address => ProfileData) private profiles;

    // keccak256(username) -> address (owner) for uniqueness
    mapping(bytes32 => address) private usernameOwner;

    event ProfileCreated(address indexed owner, string username, string avatarURI, string bio);
    event ProfileUpdated(address indexed owner, string username, string avatarURI, string bio);
    event ProfileDeleted(address indexed owner);

    /**
     * @notice Create or update caller's profile.
     * @param username chosen username (must not be used by another address)
     * @param avatarURI link (IPFS/HTTP) for avatar image; use empty string if none
     * @param bio short bio text
     */
    function setProfile(string calldata username, string calldata avatarURI, string calldata bio) external {
        bytes32 unameHash = keccak256(abi.encodePacked(username));
        address currentOwner = usernameOwner[unameHash];

        // If username occupied by someone else -> revert
        if (currentOwner != address(0) && currentOwner != msg.sender) {
            revert("Username already taken");
        }

        // If caller already has a profile and had a different username, free old username mapping
        if (profiles[msg.sender].exists) {
            string memory oldUsername = profiles[msg.sender].username;
            bytes32 oldHash = keccak256(abi.encodePacked(oldUsername));
            if (oldHash != unameHash) {
                // free previous owner mapping
                usernameOwner[oldHash] = address(0);
            }
        }

        // assign username owner mapping
        usernameOwner[unameHash] = msg.sender;

        // set profile struct
        profiles[msg.sender] = ProfileData({
            owner: msg.sender,
            username: username,
            avatarURI: avatarURI,
            bio: bio,
            updatedAt: block.timestamp,
            exists: true
        });

        // Emit created or updated
        emit ProfileUpdated(msg.sender, username, avatarURI, bio);
    }

    /**
     * @notice Delete caller's profile and free their username.
     */
    function deleteProfile() external {
        require(profiles[msg.sender].exists, "Profile does not exist");
        // free username mapping
        bytes32 oldHash = keccak256(abi.encodePacked(profiles[msg.sender].username));
        usernameOwner[oldHash] = address(0);

        // delete profile
        delete profiles[msg.sender];

        emit ProfileDeleted(msg.sender);
    }

    /**
     * @notice Get profile by address.
     */
    function getProfile(address user) external view returns (
        address owner,
        string memory username,
        string memory avatarURI,
        string memory bio,
        uint256 updatedAt,
        bool exists
    ) {
        ProfileData storage p = profiles[user];
        return (p.owner, p.username, p.avatarURI, p.bio, p.updatedAt, p.exists);
    }

    /**
     * @notice Check username owner (address(0) if free).
     */
    function getUsernameOwner(string calldata username) external view returns (address) {
        bytes32 unameHash = keccak256(abi.encodePacked(username));
        return usernameOwner[unameHash];
    }
}
