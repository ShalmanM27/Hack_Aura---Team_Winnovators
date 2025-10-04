import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import TopicList from "../components/Learning/TopicList";
import ModuleList from "../components/Learning/ModuleList";
import ModuleDetail from "../components/Learning/ModuleDetail";
import QuizPage from "../components/Learning/QuizPage";

const LearningPage = ({ userAddress }) => {
  return (
    <Routes>
      {/* List of topics */}
      <Route path="/" element={<TopicList />} />

      {/* List of modules for a topic */}
      <Route
        path="/topic/:topicId"
        element={<ModuleListWrapper userAddress={userAddress} />}
      />

      {/* Module details */}
      <Route
        path="/topic/:topicId/module/:moduleId"
        element={<ModuleDetail userAddress={userAddress} />}
      />

      {/* Quiz page for module */}
      <Route
        path="/topic/:topicId/module/:moduleId/quiz"
        element={<QuizPage userAddress={userAddress} />}
      />
    </Routes>
  );
};

// Wrapper to parse topicId param to number for ModuleList
const ModuleListWrapper = ({ userAddress }) => {
  const { topicId } = useParams();
  const topicIdNumber = topicId ? parseInt(topicId, 10) : null;
  return <ModuleList topicId={topicIdNumber} userAddress={userAddress} />;
};

export default LearningPage;
