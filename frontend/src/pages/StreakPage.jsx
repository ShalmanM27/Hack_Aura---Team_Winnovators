import React from "react";
import StreakDisplay from "../components/Streak/StreakDisplay";

const StreakPage = ({ userAddress }) => {
  return (
    <div>
      <h2>Productive Streak</h2>
      <StreakDisplay userAddress={userAddress} />
    </div>
  );
};

export default StreakPage;
