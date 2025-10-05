// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Streak {
    struct DayStatus {
        bool completed;
        bool counted; // whether this day has been processed for streak
    }

    mapping(address => uint256) public streakCount;
    mapping(address => mapping(uint256 => DayStatus)) private userDays;
    mapping(address => uint256) private lastCheckedDay;

    event StreakUpdated(address indexed user, uint256 streakCount);
    event DayCompleted(address indexed user, uint256 dayNumber);

    uint256 constant TASK_DEADLINE = 23 * 60 * 60 + 50 * 60; // 11:50 PM in seconds

    // ----------------- USER FUNCTIONS -----------------

    // Complete today's task
    function completeTask() external {
        uint256 today = block.timestamp / 1 days;
        _updateStreak(msg.sender);

        DayStatus storage status = userDays[msg.sender][today];

        // Already completed today
        if (status.completed) return;

        // Mark as completed
        status.completed = true;
        status.counted = true;

        streakCount[msg.sender] += 1;

        emit DayCompleted(msg.sender, today);
        emit StreakUpdated(msg.sender, streakCount[msg.sender]);
    }

    // ----------------- INTERNAL LOGIC -----------------

    function _updateStreak(address user) internal {
        uint256 today = block.timestamp / 1 days;
        uint256 lastDay = lastCheckedDay[user];

        // Nothing to do if already updated today
        if (lastDay == today) return;

        // Check all days since last update
        for (uint256 day = lastDay + 1; day <= today; day++) {
            DayStatus storage status = userDays[user][day];

            // If user didn't complete the task before 11:50 PM, reset streak
            if (!status.completed) {
                streakCount[user] = 0;
                status.counted = true; // mark the day processed
            }
        }

        lastCheckedDay[user] = today;
    }

    // ----------------- VIEW FUNCTIONS -----------------

    function getStreak(address user) external returns (uint256) {
        _updateStreak(user);
        return streakCount[user];
    }

    function getLast7DaysStatus(address user) external view returns (bool[7] memory) {
        uint256 today = block.timestamp / 1 days;
        bool[7] memory history;

        for (uint i = 0; i < 7; i++) {
            uint256 day = today - i;
            history[i] = userDays[user][day].completed;
        }

        return history;
    }
}
