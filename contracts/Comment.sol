// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Comment {
    uint256 public nextCommentId;

    struct CommentStruct {
        uint256 id;
        uint256 postId;
        address author;
        string content;
        string mediaHash;
        uint256 timestamp;
        bool exists;
    }

    mapping(uint256 => CommentStruct) private comments;
    mapping(uint256 => uint256[]) private postComments; // postId => array of commentIds

    // Events
    event CommentCreated(uint256 indexed commentId, uint256 indexed postId, address indexed author);
    event CommentUpdated(uint256 indexed commentId);
    event CommentDeleted(uint256 indexed commentId);

    function createComment(uint256 postId, string calldata content, string calldata mediaHash) external {
        CommentStruct storage c = comments[nextCommentId];
        c.id = nextCommentId;
        c.postId = postId;
        c.author = msg.sender;
        c.content = content;
        c.mediaHash = mediaHash;
        c.timestamp = block.timestamp;
        c.exists = true;

        postComments[postId].push(nextCommentId);

        emit CommentCreated(nextCommentId, postId, msg.sender);
        nextCommentId++;
    }

    function updateComment(uint256 commentId, string calldata content, string calldata mediaHash) external {
        CommentStruct storage c = comments[commentId];
        require(c.exists, "Comment does not exist");
        require(c.author == msg.sender, "Not author");

        c.content = content;
        c.mediaHash = mediaHash;

        emit CommentUpdated(commentId);
    }

    function deleteComment(uint256 commentId) external {
        CommentStruct storage c = comments[commentId];
        require(c.exists, "Comment does not exist");
        require(c.author == msg.sender, "Not author");

        c.exists = false;
        emit CommentDeleted(commentId);
    }

    function getComments(uint256 postId) external view returns (CommentStruct[] memory) {
        uint256[] memory ids = postComments[postId];
        CommentStruct[] memory result = new CommentStruct[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = comments[ids[i]];
        }
        return result;
    }
}
