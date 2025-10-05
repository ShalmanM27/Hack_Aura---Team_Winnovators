import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// ----------------- FEED -----------------
export const createPost = (data) =>
  axios.post(`${API_URL}/feed/create`, data, { headers: { "Content-Type": "application/json" } });

export const updatePost = (post_id, content, media_hash = "") =>
  axios.post(
    `${API_URL}/feed/update`,
    { post_id: Number(post_id), content, media_hash },
    { headers: { "Content-Type": "application/json" } }
  );

export const deletePost = (post_id) =>
  axios.post(`${API_URL}/feed/delete`, { post_id: Number(post_id) }, { headers: { "Content-Type": "application/json" } });

export const likePost = (post_id) =>
  axios.post(`${API_URL}/feed/like`, { post_id: Number(post_id) }, { headers: { "Content-Type": "application/json" } });

export const removeLike = (post_id) =>
  axios.post(`${API_URL}/feed/removeLike`, { post_id: Number(post_id) }, { headers: { "Content-Type": "application/json" } });

export const dislikePost = (post_id) =>
  axios.post(`${API_URL}/feed/dislike`, { post_id: Number(post_id) }, { headers: { "Content-Type": "application/json" } });

export const removeDislike = (post_id) =>
  axios.post(`${API_URL}/feed/removeDislike`, { post_id: Number(post_id) }, { headers: { "Content-Type": "application/json" } });

export const getLatestPosts = async (count = 10, userAddress = null) => {
  const res = await axios.get(`${API_URL}/feed/latest/${count}`, { params: { user_address: userAddress } });
  return res.data.posts || [];
};

export const getPostById = async (post_id, userAddress = null) => {
  const res = await axios.get(`${API_URL}/feed/${post_id}`, { params: { user_address: userAddress } });
  return res.data.post || null;
};

// ----------------- COMMENT -----------------
export const createComment = (post_id, content, media_hash = "") =>
  axios.post(
    `${API_URL}/comment/create`,
    { post_id: Number(post_id), content, media_hash },
    { headers: { "Content-Type": "application/json" } }
  );

export const updateComment = (comment_id, content, media_hash = "") =>
  axios.post(
    `${API_URL}/comment/update`,
    { comment_id: Number(comment_id), content, media_hash },
    { headers: { "Content-Type": "application/json" } }
  );

export const deleteComment = (comment_id) =>
  axios.post(
    `${API_URL}/comment/delete`,
    { comment_id: Number(comment_id) },
    { headers: { "Content-Type": "application/json" } }
  );

export const getComments = async (post_id) => {
  const res = await axios.get(`${API_URL}/comment/${post_id}`);
  return (res.data.comments || []).filter(c => c.exists);
};

// ----------------- LEARNING -----------------
export const getTopics = async () => {
  const res = await axios.get(`${API_URL}/learning/topics`);
  return res.data.topics || [];
};

export const createTopic = (title, description) =>
  axios.post(`${API_URL}/learning/topics/create`, { title, description });

export const updateTopic = (topic_id, title, description) =>
  axios.post(`${API_URL}/learning/topics/update`, { topic_id, title, description });

export const deleteTopic = (topic_id) =>
  axios.post(`${API_URL}/learning/topics/delete`, { topic_id });

export const getModules = async (topic_id) => {
  const res = await axios.get(`${API_URL}/learning/modules/${topic_id}`);
  return res.data.modules || [];
};

export const addModule = (topic_id, title, content_hash = "", question_count = 5, pass_score = 60) =>
  axios.post(`${API_URL}/learning/modules/add`, { topic_id, title, content_hash, question_count, pass_score });

export const updateModule = (topic_id, module_id, title, content_hash = "", question_count = 5, pass_score = 60) =>
  axios.post(`${API_URL}/learning/modules/update`, { topic_id, module_id, title, content_hash, question_count, pass_score });

export const deleteModule = (topic_id, module_id) =>
  axios.post(`${API_URL}/learning/modules/delete`, { topic_id, module_id });

export const completeModule = (user_address, topic_id, module_id, score, question_count = null) =>
  axios.post(`${API_URL}/learning/complete`, { user_address, topic_id, module_id, score, question_count });

export const getProgress = async (user_address, topic_id) => {
  const res = await axios.get(`${API_URL}/learning/progress/${user_address}/${topic_id}`);
  return res.data.progress || { topicId: topic_id, completedModules: [] };
};

export const getModuleById = async (topic_id, module_id) => {
  const res = await axios.get(`${API_URL}/learning/module/${topic_id}/${module_id}`);
  return res.data.module || null;
};

export const generateModuleContent = (topic_id, module_title) =>
  axios.post(`${API_URL}/learning/generate`, { topic_id, title: module_title });

// ----------------- DAO -----------------
export const createProposal = (description, duration) =>
  axios.post(`${API_URL}/dao/create`, { description, duration }, { headers: { "Content-Type": "application/json" } });

export const voteProposal = (proposal_id, support) =>
  axios.post(`${API_URL}/dao/vote`, { proposal_id, support }, { headers: { "Content-Type": "application/json" } });

export const executeProposal = (proposal_id) =>
  axios.post(`${API_URL}/dao/execute`, { proposal_id }, { headers: { "Content-Type": "application/json" } });

export const getProposal = async (proposal_id) => {
  const res = await axios.get(`${API_URL}/dao/${proposal_id}`);
  return res.data.proposal || null;
};

export const getUserProposals = async (user_address) => {
  const res = await axios.get(`${API_URL}/dao/user/${user_address}`);
  return res.data.proposals || [];
};

export const getLiveProposals = async (user_address) => {
  const res = await axios.get(`${API_URL}/dao/live/${user_address}`);
  return res.data.proposals || [];
};

export const getUserVote = async (proposal_id, user_address) => {
  if (typeof proposal_id !== "number" || isNaN(proposal_id)) {
    throw new Error("Invalid proposal_id: must be a number");
  }
  const res = await axios.get(`${API_URL}/dao/vote/${proposal_id}/${user_address}`);
  return res.data.voteType || 0;
};


// ----------------- MODERATION -----------------
export const flagContent = (content_id) =>
  axios.post(`${API_URL}/moderation/flag`, { content_id });

export const resolveFlag = (content_id, remove) =>
  axios.post(`${API_URL}/moderation/resolve`, { content_id, remove });

export const getFlags = (content_id) => axios.get(`${API_URL}/moderation/${content_id}`);

// ----------------- STREAK -----------------
export const getStreak = (user_address) =>
  axios.get(`${API_URL}/streak/${user_address}`);

// ----------------- PROFILE -----------------
export const getProfile = async (address) => {
  try {
    const res = await axios.get(`${API_URL}/profile?address=${address}`);
    return res.data;
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const updateProfile = async (address, data) => {
  try {
    const res = await axios.put(`${API_URL}/profile?address=${address}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    return { success: false, error: err.message };
  }
};