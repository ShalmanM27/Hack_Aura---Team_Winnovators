// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Learning
 * @notice Topics + Modules registry with user progress (progressive unlock).
 * - Admin can create/update/delete topics
 * - Admin can add/update/delete modules for topics
 * - Users can complete modules by calling completeModule (score must meet passScore)
 * - Progressive unlock: module i+1 requires module i completed
 * - Getters to list topics and modules
 */
contract Learning {

    struct Module {
        uint256 id;           // Module ID (unique per topic, starts at 0)
        uint256 topicId;      
        string title;
        string contentHash;   // offchain content pointer (IPFS / URL)
        uint8 questionCount;  // 5,10,15,20
        uint256 passScore;    // e.g., 60
        bool exists;
    }

    struct Topic {
        uint256 id;
        string title;
        string description;
        uint256 totalModules;
        uint256[] moduleIds;          // module IDs for this topic
        mapping(uint256 => Module) modulesById; // modules by local topic-specific ID
        uint256 nextModuleId;         // tracks next module ID per topic
        bool exists;
    }

    uint256 public nextTopicId;
    mapping(uint256 => Topic) private topics;

    // user => topicId => moduleId => completed
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) private userProgress;

    event TopicCreated(uint256 indexed topicId);
    event TopicUpdated(uint256 indexed topicId);
    event TopicDeleted(uint256 indexed topicId);
    event ModuleAdded(uint256 indexed moduleId, uint256 indexed topicId);
    event ModuleUpdated(uint256 indexed moduleId, uint256 indexed topicId);
    event ModuleDeleted(uint256 indexed moduleId, uint256 indexed topicId);
    event ModuleCompleted(address indexed user, uint256 indexed topicId, uint256 indexed moduleId, uint256 score);

    // ------------------------
    // Topic functions (admin)
    // ------------------------
    function createTopic(string calldata title, string calldata description) external {
        Topic storage t = topics[nextTopicId];
        t.id = nextTopicId;
        t.title = title;
        t.description = description;
        t.exists = true;
        t.nextModuleId = 0;
        nextTopicId++;
        emit TopicCreated(nextTopicId - 1);
    }

    function updateTopic(uint256 topicId, string calldata title, string calldata description) external {
        require(topics[topicId].exists, "Topic does not exist");
        Topic storage t = topics[topicId];
        t.title = title;
        t.description = description;
        emit TopicUpdated(topicId);
    }

    function deleteTopic(uint256 topicId) external {
        require(topics[topicId].exists, "Topic does not exist");
        Topic storage t = topics[topicId];
        uint256[] storage modIds = t.moduleIds;
        for (uint256 i = 0; i < modIds.length; i++) {
            emit ModuleDeleted(modIds[i], topicId);
        }
        delete topics[topicId];
        emit TopicDeleted(topicId);
    }

    // ------------------------
    // Module functions (admin)
    // ------------------------
    function addModule(
        uint256 topicId,
        string calldata title,
        string calldata contentHash,
        uint8 questionCount,
        uint256 passScore
    ) external {
        require(topics[topicId].exists, "Topic does not exist");

        Topic storage t = topics[topicId];
        uint256 modId = t.nextModuleId;

        Module storage m = t.modulesById[modId];
        m.id = modId;
        m.topicId = topicId;
        m.title = title;
        m.contentHash = contentHash;
        m.questionCount = questionCount;
        m.passScore = passScore;
        m.exists = true;

        t.moduleIds.push(modId);
        t.totalModules++;
        t.nextModuleId++;

        emit ModuleAdded(modId, topicId);
    }

    function updateModule(
        uint256 topicId,
        uint256 moduleId,
        string calldata title,
        string calldata contentHash,
        uint8 questionCount,
        uint256 passScore
    ) external {
        require(topics[topicId].exists, "Topic does not exist");
        Topic storage t = topics[topicId];
        require(t.modulesById[moduleId].exists, "Module does not exist");

        Module storage m = t.modulesById[moduleId];
        m.title = title;
        m.contentHash = contentHash;
        m.questionCount = questionCount;
        m.passScore = passScore;

        emit ModuleUpdated(moduleId, topicId);
    }

    function deleteModule(uint256 topicId, uint256 moduleId) external {
        require(topics[topicId].exists, "Topic does not exist");
        Topic storage t = topics[topicId];
        require(t.modulesById[moduleId].exists, "Module does not exist");

        // remove from moduleIds array
        uint256[] storage arr = t.moduleIds;
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == moduleId) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                t.totalModules--;
                break;
            }
        }

        delete t.modulesById[moduleId];
        emit ModuleDeleted(moduleId, topicId);
    }

    // ------------------------
    // User functions
    // ------------------------
    function completeModule(uint256 topicId, uint256 moduleId, uint256 score) external {
        require(topics[topicId].exists, "Topic does not exist");
        Topic storage t = topics[topicId];
        require(t.modulesById[moduleId].exists, "Module does not exist");
        Module storage m = t.modulesById[moduleId];
        require(score >= m.passScore, "Score below passScore");

        uint256[] storage arr = t.moduleIds;
        uint256 idx = type(uint256).max;
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == moduleId) {
                idx = i;
                break;
            }
        }
        require(idx != type(uint256).max, "Module not in topic");

        if (idx > 0) {
            uint256 prevModuleId = arr[idx - 1];
            require(userProgress[msg.sender][topicId][prevModuleId], "Previous module not completed");
        }

        userProgress[msg.sender][topicId][moduleId] = true;
        emit ModuleCompleted(msg.sender, topicId, moduleId, score);
    }

    // ------------------------
    // View/getter functions
    // ------------------------
    function getTopic(uint256 topicId) external view returns (
        uint256 id, string memory title, string memory description, uint256 totalModules, bool exists
    ) {
        require(topics[topicId].exists, "Topic does not exist");
        Topic storage t = topics[topicId];
        return (t.id, t.title, t.description, t.totalModules, t.exists);
    }

    function getModule(uint256 topicId, uint256 moduleId) external view returns (
        uint256 id,
        uint256 topicIdOut,
        string memory title,
        string memory contentHash,
        uint8 questionCount,
        uint256 passScore,
        bool exists
    ) {
        require(topics[topicId].exists, "Topic does not exist");
        Module storage m = topics[topicId].modulesById[moduleId];
        require(m.exists, "Module does not exist");
        return (m.id, m.topicId, m.title, m.contentHash, m.questionCount, m.passScore, m.exists);
    }

    function getModulesByTopic(uint256 topicId) external view returns (
        uint256[] memory ids,
        string[] memory titles,
        string[] memory contentHashes,
        uint8[] memory questionCounts,
        uint256[] memory passScores,
        bool[] memory existsArr
    ) {
        require(topics[topicId].exists, "Topic does not exist");
        Topic storage t = topics[topicId];
        uint256 n = t.moduleIds.length;

        ids = new uint256[](n);
        titles = new string[](n);
        contentHashes = new string[](n);
        questionCounts = new uint8[](n);
        passScores = new uint256[](n);
        existsArr = new bool[](n);

        for (uint256 i = 0; i < n; i++) {
            Module storage m = t.modulesById[t.moduleIds[i]];
            ids[i] = m.id;
            titles[i] = m.title;
            contentHashes[i] = m.contentHash;
            questionCounts[i] = m.questionCount;
            passScores[i] = m.passScore;
            existsArr[i] = m.exists;
        }
    }

    function getAllTopics() external view returns (
        uint256[] memory ids,
        string[] memory titles,
        string[] memory descriptions,
        uint256[] memory totalModules,
        bool[] memory existsArr
    ) {
        uint256 n = nextTopicId;
        ids = new uint256[](n);
        titles = new string[](n);
        descriptions = new string[](n);
        totalModules = new uint256[](n);
        existsArr = new bool[](n);

        for (uint256 i = 0; i < n; i++) {
            Topic storage t = topics[i];
            ids[i] = t.id;
            titles[i] = t.title;
            descriptions[i] = t.description;
            totalModules[i] = t.totalModules;
            existsArr[i] = t.exists;
        }
    }

    function isModuleCompleted(address user, uint256 topicId, uint256 moduleId) external view returns (bool) {
        return userProgress[user][topicId][moduleId];
    }

    function getUserProgress(address user, uint256 topicId) external view returns (bool[] memory completedModules) {
        require(topics[topicId].exists, "Topic does not exist");
        Topic storage t = topics[topicId];
        uint256 n = t.moduleIds.length;
        completedModules = new bool[](n);
        for (uint256 i = 0; i < n; i++) {
            completedModules[i] = userProgress[user][topicId][t.moduleIds[i]];
        }
    }
}
