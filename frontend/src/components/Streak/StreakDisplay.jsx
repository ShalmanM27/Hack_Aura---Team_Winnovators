import React, { useEffect, useState } from "react";
import { getStreak } from "../../api/api";

const StreakDisplay = ({ userAddress }) => {
  const [streak, setStreak] = useState(0);

  const fetchStreak = async () => {
    const res = await getStreak(userAddress);
    setStreak(res.data.streak);
  };

  useEffect(() => {
    if (userAddress) fetchStreak();
  }, [userAddress]);

  return <div>Current Streak: {streak} days</div>;
};

export default StreakDisplay;
