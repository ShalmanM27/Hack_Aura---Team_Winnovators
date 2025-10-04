// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Feed {
    uint256 public nextPostId;

    struct Post {
        uint256 id;
        address author;
        string content;
        string mediaHash;
        uint256 timestamp;
        uint256 likeCount;
        uint256 dislikeCount;
        mapping(address => bool) likedBy;
        mapping(address => bool) dislikedBy;
        bool exists;
    }

    mapping(uint256 => Post) private posts;

    // Events
    event PostCreated(uint256 indexed postId, address indexed author);
    event PostUpdated(uint256 indexed postId);
    event PostDeleted(uint256 indexed postId);
    event PostLiked(uint256 indexed postId, address indexed user);
    event PostDisliked(uint256 indexed postId, address indexed user);
    event LikeRemoved(uint256 indexed postId, address indexed user);
    event DislikeRemoved(uint256 indexed postId, address indexed user);

    // Create a post
    function createPost(string calldata content, string calldata mediaHash) external {
        Post storage p = posts[nextPostId];
        p.id = nextPostId;
        p.author = msg.sender;
        p.content = content;
        p.mediaHash = mediaHash;
        p.timestamp = block.timestamp;
        p.exists = true;

        emit PostCreated(nextPostId, msg.sender);
        nextPostId++;
    }

    // Update a post
    function updatePost(uint256 postId, string calldata content, string calldata mediaHash) external {
        Post storage p = posts[postId];
        require(p.exists, "Post does not exist");
        require(p.author == msg.sender, "Not author");

        p.content = content;
        p.mediaHash = mediaHash;

        emit PostUpdated(postId);
    }

    // Delete a post
    function deletePost(uint256 postId) external {
        Post storage p = posts[postId];
        require(p.exists, "Post does not exist");
        require(p.author == msg.sender, "Not author");

        p.exists = false;
        emit PostDeleted(postId);
    }

    // Like a post
    function likePost(uint256 postId) external {
        Post storage p = posts[postId];
        require(p.exists, "Post does not exist");
        require(!p.likedBy[msg.sender], "Already liked");

        p.likedBy[msg.sender] = true;
        p.likeCount++;

        emit PostLiked(postId, msg.sender);
    }

    // Remove like
    function removeLike(uint256 postId) external {
        Post storage p = posts[postId];
        require(p.exists, "Post does not exist");
        require(p.likedBy[msg.sender], "You did not like");

        p.likedBy[msg.sender] = false;
        p.likeCount--;

        emit LikeRemoved(postId, msg.sender);
    }

    // Dislike a post
    function dislikePost(uint256 postId) external {
        Post storage p = posts[postId];
        require(p.exists, "Post does not exist");
        require(!p.dislikedBy[msg.sender], "Already disliked");

        p.dislikedBy[msg.sender] = true;
        p.dislikeCount++;

        emit PostDisliked(postId, msg.sender);
    }

    // Remove dislike
    function removeDislike(uint256 postId) external {
        Post storage p = posts[postId];
        require(p.exists, "Post does not exist");
        require(p.dislikedBy[msg.sender], "You did not dislike");

        p.dislikedBy[msg.sender] = false;
        p.dislikeCount--;

        emit DislikeRemoved(postId, msg.sender);
    }

    // Read a single post
    function getPost(uint256 postId) external view returns (
        uint256 id,
        address author,
        string memory content,
        string memory mediaHash,
        uint256 timestamp,
        uint256 likeCount,
        uint256 dislikeCount,
        bool exists
    ) {
        Post storage p = posts[postId];
        return (p.id, p.author, p.content, p.mediaHash, p.timestamp, p.likeCount, p.dislikeCount, p.exists);
    }

    // Read latest N posts (default 10)
    function getLatestPosts(uint256 count) external view returns (
        uint256[] memory ids,
        address[] memory authors,
        string[] memory contents,
        string[] memory mediaHashes,
        uint256[] memory timestamps,
        uint256[] memory likeCounts,
        uint256[] memory dislikeCounts
    ) {
        uint256 latest = nextPostId;
        if (count > latest) {
            count = latest;
        }

        ids = new uint256[](count);
        authors = new address[](count);
        contents = new string[](count);
        mediaHashes = new string[](count);
        timestamps = new uint256[](count);
        likeCounts = new uint256[](count);
        dislikeCounts = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 pid = latest - i - 1; // latest posts first
            Post storage p = posts[pid];
            ids[i] = p.id;
            authors[i] = p.author;
            contents[i] = p.content;
            mediaHashes[i] = p.mediaHash;
            timestamps[i] = p.timestamp;
            likeCounts[i] = p.likeCount;
            dislikeCounts[i] = p.dislikeCount;
        }
    }

    function likedBy(uint256 postId, address user) external view returns (bool) {
    return posts[postId].likedBy[user];
}

function dislikedBy(uint256 postId, address user) external view returns (bool) {
    return posts[postId].dislikedBy[user];
}

}
