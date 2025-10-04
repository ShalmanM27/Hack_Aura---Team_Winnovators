// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Feed.sol";
import "./Comment.sol";

contract Moderation {
    Feed feed;
    Comment comment;
    address public admin;

    constructor(address _feed, address _comment) {
        feed = Feed(_feed);
        comment = Comment(_comment);
        admin = msg.sender;
    }

    struct Flag {
        uint256 contentId;
        address flagger;
        bool resolved;
    }

    mapping(uint256 => Flag[]) public contentFlags; // postId or commentId

    event ContentFlagged(uint256 contentId, address flagger);
    event FlagResolved(uint256 contentId, bool removed);

    function flagContent(uint256 contentId) external {
        contentFlags[contentId].push(Flag(contentId, msg.sender, false));
        emit ContentFlagged(contentId, msg.sender);
    }

    function resolveFlag(uint256 contentId, bool remove) external {
        require(msg.sender == admin, "Not admin");
        Flag[] storage flags = contentFlags[contentId];
        for (uint256 i = 0; i < flags.length; i++) {
            flags[i].resolved = true;
        }

        if (remove) {
            // Try delete post first
            try feed.deletePost(contentId) {} catch {}
            // Try delete comment
            try comment.deleteComment(contentId) {} catch {}
        }

        emit FlagResolved(contentId, remove);
    }

    function getFlags(uint256 contentId) external view returns (Flag[] memory) {
        return contentFlags[contentId];
    }
}
