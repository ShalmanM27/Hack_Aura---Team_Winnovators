import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getModules, getTopics, getProgress } from "../../api/api";

const ModuleList = ({ topicId, userAddress }) => {
  const [modules, setModules] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [completedArr, setCompletedArr] = useState([]);
  const [lockedIdx, setLockedIdx] = useState(null);
  const [showLockedMsg, setShowLockedMsg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (topicId !== undefined && topicId !== null) {
      fetchModules();
      fetchTopicTitle();
      fetchProgress();
    }
    // eslint-disable-next-line
  }, [topicId, userAddress]);

  const fetchModules = async () => {
    try {
      const modules = await getModules(topicId);
      setModules(modules);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const fetchTopicTitle = async () => {
    try {
      const topics = await getTopics();
      const topic = topics.find((t) => t.id === Number(topicId));
      setTopicTitle(topic?.title || "");
    } catch (err) {
      console.error("Error fetching topic title:", err);
    }
  };

  const fetchProgress = async () => {
    if (!userAddress) return;
    try {
      const progress = await getProgress(userAddress, topicId);
      setCompletedArr(progress.completedModules || []);
    } catch (err) {
      setCompletedArr([]);
    }
  };

  // Find the first uncompleted module index
  const firstUncompletedIdx = completedArr.findIndex((c) => !c);

  // Only allow access to completed modules and the next uncompleted module
  const isModuleAccessible = (idx) => {
    if (completedArr.length === 0) return true;
    if (completedArr[idx]) return true;
    if (idx === firstUncompletedIdx) return true;
    return false;
  };

  const handleModuleClick = (moduleId, idx) => {
    if (isModuleAccessible(idx)) {
      navigate(`/learning/topic/${topicId}/module/${moduleId}`);
    } else {
      setLockedIdx(idx);
      setShowLockedMsg(true);
    }
  };

  const handleCloseLockedMsg = () => {
    setShowLockedMsg(false);
    setLockedIdx(null);
  };

  return (
    <div
      style={{
        padding: "40px 0",
        background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
        minHeight: "600px",
        borderRadius: "28px",
        boxShadow: "0 8px 32px rgba(44,62,80,0.09)",
        maxWidth: "1100px",
        margin: "32px auto",
        animation: "fadeIn 0.8s cubic-bezier(.25,.8,.25,1)",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .completed-module {
            border: 2.5px solid #22c55e !important;
            background: linear-gradient(135deg, #bbf7d0 0%, #e0ffe0 100%) !important;
            position: relative;
            box-shadow: 0 8px 32px rgba(34,197,94,0.13);
            transition: box-shadow 0.25s, transform 0.25s;
            animation: fadeIn 0.8s cubic-bezier(.25,.8,.25,1);
          }
          .completed-check {
            position: absolute;
            top: 18px;
            left: 18px;
            background: linear-gradient(90deg, #22c55e 0%, #4ade80 100%);
            color: #fff;
            border-radius: 50%;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 1.3rem;
            box-shadow: 0 2px 12px rgba(34,197,94,0.15);
            z-index: 2;
            border: 3px solid #fff;
          }
          .completed-badge {
            position: absolute;
            bottom: 18px;
            right: 18px;
            background: linear-gradient(90deg, #22c55e 0%, #4ade80 100%);
            color: #fff;
            border-radius: 12px;
            padding: 6px 18px;
            font-weight: 700;
            font-size: 1.08rem;
            box-shadow: 0 2px 8px rgba(34,197,94,0.10);
            letter-spacing: 0.5px;
            border: 2px solid #fff;
            animation: fadeIn 0.8s cubic-bezier(.25,.8,.25,1);
          }
          .locked-module {
            opacity: 0.5;
            filter: grayscale(0.3);
          }
          .locked-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f8fafc;
            color: #2563eb;
            border: 2px solid #2563eb;
            border-radius: 16px;
            padding: 32px 38px;
            font-weight: 700;
            font-size: 1.18rem;
            box-shadow: 0 8px 32px rgba(44,62,80,0.13);
            z-index: 9999;
            text-align: center;
            animation: fadeIn 0.5s;
            min-width: 320px;
          }
          .locked-dialog button {
            margin-top: 18px;
            padding: 10px 28px;
            background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1.08rem;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(52,152,219,0.10);
          }
        `}
      </style>
      <h1
        style={{
          fontSize: "2.1rem",
          fontWeight: 800,
          marginBottom: "32px",
          color: "#2563eb",
          textAlign: "center",
          letterSpacing: "1px",
          textShadow: "0 2px 8px rgba(44,62,80,0.10)",
        }}
      >
        Modules for: {topicTitle}
      </h1>
      {modules.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontWeight: 600,
            fontSize: "1.1rem",
          }}
        >
          No modules available.
        </p>
      )}
      <div
        style={{
          display: "grid",
          gap: "32px",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          padding: "0 32px",
        }}
      >
        {modules.map((mod, idx) => {
          const isCompleted = completedArr[idx] === true;
          const accessible = isModuleAccessible(idx);
          return (
            <div
              key={mod.module_id}
              onClick={() => handleModuleClick(mod.module_id, idx)}
              className={
                isCompleted
                  ? "completed-module"
                  : !accessible
                  ? "locked-module"
                  : ""
              }
              style={{
                padding: "32px 24px",
                borderRadius: "20px",
                background: isCompleted
                  ? "linear-gradient(135deg, #bbf7d0 0%, #e0ffe0 100%)"
                  : "linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)",
                boxShadow: isCompleted
                  ? "0 8px 32px rgba(34,197,94,0.13)"
                  : "0 4px 18px rgba(52,152,219,0.10)",
                cursor: "pointer",
                transition: "box-shadow 0.25s, transform 0.25s",
                border: isCompleted ? "2.5px solid #22c55e" : "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                minHeight: "160px",
                position: "relative",
                opacity: !accessible ? 0.5 : 1,
                filter: !accessible ? "grayscale(0.3)" : "none",
              }}
              onMouseEnter={(e) => {
                if (accessible) {
                  e.currentTarget.style.boxShadow =
                    isCompleted
                      ? "0 12px 40px rgba(34,197,94,0.18)"
                      : "0 8px 32px rgba(52,152,219,0.18)";
                  e.currentTarget.style.transform = "scale(1.03)";
                }
              }}
              onMouseLeave={(e) => {
                if (accessible) {
                  e.currentTarget.style.boxShadow =
                    isCompleted
                      ? "0 8px 32px rgba(34,197,94,0.13)"
                      : "0 4px 18px rgba(52,152,219,0.10)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              {isCompleted && (
                <span className="completed-check" title="Completed">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#22c55e" />
                    <path d="M8 13.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2.5" fill="none" />
                  </svg>
                </span>
              )}
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: isCompleted ? "#22c55e" : "#2563eb",
                  marginBottom: "10px",
                  letterSpacing: "0.5px",
                  textShadow: isCompleted ? "0 2px 8px rgba(34,197,94,0.10)" : "none",
                }}
              >
                {mod.module_title}
              </h2>
              <p
                style={{
                  color: "#22223b",
                  fontSize: "1.08rem",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Questions: {mod.questionCount}
              </p>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.98rem",
                  marginTop: "auto",
                  fontWeight: 600,
                  background: isCompleted
                    ? "rgba(34,197,94,0.10)"
                    : "rgba(203,213,225,0.18)",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  alignSelf: "flex-end",
                }}
              >
                Pass Score: {mod.passScore}
              </p>
              {isCompleted && (
                <span className="completed-badge">
                  <span role="img" aria-label="trophy" style={{marginRight:"6px"}}>🏆</span>
                  Completed!
                </span>
              )}
              {!isCompleted && (
                <span
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "18px",
                    background:
                      "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    boxShadow: "0 2px 8px rgba(52,152,219,0.10)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7z" fill="#fff" />
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>
      {showLockedMsg && (
        <div className="locked-dialog">
          Complete the current module.<br />
          Control Your Eagerness, slow and steady wins the race.<br />
          <span style={{fontSize:"1.05em",color:"#64748b",fontWeight:500,display:"block",marginTop:"10px"}}>
            Why don't modules run? <br />
            Because they prefer to take it one step at a time! 🐢
          </span>
          <button onClick={handleCloseLockedMsg}>Okay, I'll go slow!</button>
        </div>
      )}
    </div>
  );
};

export default ModuleList;
