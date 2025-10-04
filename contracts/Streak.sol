// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Streak {
    mapping(address => uint256) public lastActionTimestamp;
    mapping(address => uint256) public streakCount;

    event StreakUpdated(address indexed user, uint256 streakCount);

    // Update streak only for productive actions
    function updateStreak(address user) external {
        uint256 lastAction = lastActionTimestamp[user];
        uint256 today = block.timestamp / 1 days;

        if (lastAction / 1 days == today) {
            // Already updated today, do nothing
            return;
        } else if (lastAction / 1 days == today - 1) {
            // Consecutive day
            streakCount[user]++;
        } else {
            // Missed days
            streakCount[user] = 1;
        }

        lastActionTimestamp[user] = block.timestamp;
        emit StreakUpdated(user, streakCount[user]);
    }

    function getStreak(address user) external view returns (uint256) {
        return streakCount[user];
    }
}
