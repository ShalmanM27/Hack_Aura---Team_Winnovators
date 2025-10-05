import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import TopicList from "../components/Learning/TopicList";
import ModuleList from "../components/Learning/ModuleList";
import ModuleDetail from "../components/Learning/ModuleDetail";
import QuizPage from "../components/Learning/QuizPage";

const LearningPage = ({ userAddress }) => {
  return (
    <Routes>
      <Route path="/" element={<TopicList userAddress={userAddress} />} />
      <Route path="/topic/:topicId" element={<ModuleListWrapper userAddress={userAddress} />} />
      <Route path="/topic/:topicId/module/:moduleId" element={<ModuleDetail userAddress={userAddress} />} />
      <Route path="/topic/:topicId/module/:moduleId/quiz" element={<QuizPage userAddress={userAddress} />} />
    </Routes>
  );
};

const ModuleListWrapper = ({ userAddress }) => {
  const { topicId } = useParams();
  const topicIdNumber = topicId ? parseInt(topicId, 10) : null;
  return <ModuleList topicId={topicIdNumber} userAddress={userAddress} />;
};

export default LearningPage;
