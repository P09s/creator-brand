const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    return stored.state?.token;
  } catch {
    return null;
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Server error');
  }
  return response.json();
};

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token || getToken()}`,
});

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = async (email, password) =>
  handleResponse(await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }));

export const register = async (name, email, password, userType) =>
  handleResponse(await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, userType }),
  }));

export const getProfile = async (token) =>
  handleResponse(await fetch(`${API_URL}/profile`, {
    headers: authHeaders(token),
  }));

// ── Campaigns ─────────────────────────────────────────────────────────────────

export const getCampaigns = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return handleResponse(await fetch(`${API_URL}/campaigns?${params}`, {
    headers: authHeaders(),
  }));
};

export const getMyCampaigns = async () =>
  handleResponse(await fetch(`${API_URL}/campaigns/mine`, {
    headers: authHeaders(),
  }));

export const getAppliedCampaigns = async () =>
  handleResponse(await fetch(`${API_URL}/campaigns/applied`, {
    headers: authHeaders(),
  }));

export const createCampaign = async (data) =>
  handleResponse(await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }));

export const applyToCampaign = async (campaignId) =>
  handleResponse(await fetch(`${API_URL}/campaigns/${campaignId}/apply`, {
    method: 'POST',
    headers: authHeaders(),
  }));

export const updateCampaign = async (id, data) =>
  handleResponse(await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }));

export const deleteCampaign = async (id) =>
  handleResponse(await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }));

// ── Messages ──────────────────────────────────────────────────────────────────

export const getConversations = async () =>
  handleResponse(await fetch(`${API_URL}/messages/conversations`, {
    headers: authHeaders(),
  }));

export const getMessagesWithUser = async (userId) =>
  handleResponse(await fetch(`${API_URL}/messages/${userId}`, {
    headers: authHeaders(),
  }));

export const sendMessage = async (receiverId, content) =>
  handleResponse(await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ receiverId, content }),
  }));

// ── Profiles ──────────────────────────────────────────────────────────────────

export const getMyProfile = async () =>
  handleResponse(await fetch(`${API_URL}/profiles/me`, {
    headers: authHeaders(),
  }));

export const updateMyProfile = async (data) =>
  handleResponse(await fetch(`${API_URL}/profiles/me`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }));

export const getInfluencers = async () =>
  handleResponse(await fetch(`${API_URL}/profiles/influencers`, {
    headers: authHeaders(),
  }));

export const getBrands = async () =>
  handleResponse(await fetch(`${API_URL}/profiles/brands`, {
    headers: authHeaders(),
  }));

export const addPortfolioItem = async (data) =>
  handleResponse(await fetch(`${API_URL}/profiles/me/portfolio`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }));

// ── AI Features ───────────────────────────────────────────────────────────────

export const getMatchScore = async (campaignId, creatorId) =>
  handleResponse(await fetch(`${API_URL}/ai/match`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ campaignId, creatorId }),
  }));

export const generateCampaignBrief = async (data) =>
  handleResponse(await fetch(`${API_URL}/ai/brief`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }));

export const getContentSuggestions = async (campaignDescription) =>
  handleResponse(await fetch(`${API_URL}/ai/suggestions`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ campaignDescription }),
  }));

export const getAnalyticsInsight = async (stats) =>
  handleResponse(await fetch(`${API_URL}/ai/analytics-insight`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(stats),
  }));

// ── Phase 2 — Campaigns (accept/reject/applicants) ────────────────────────────

export const getApplicants = async (campaignId) =>
  handleResponse(await fetch(`${API_URL}/campaigns/${campaignId}/applicants`, {
    headers: authHeaders(),
  }));

export const acceptCreator = async (campaignId, creatorId) =>
  handleResponse(await fetch(`${API_URL}/campaigns/${campaignId}/accept/${creatorId}`, {
    method: 'POST', headers: authHeaders(),
  }));

export const rejectCreator = async (campaignId, creatorId) =>
  handleResponse(await fetch(`${API_URL}/campaigns/${campaignId}/reject/${creatorId}`, {
    method: 'POST', headers: authHeaders(),
  }));

export const getAcceptedCampaigns = async () =>
  handleResponse(await fetch(`${API_URL}/campaigns/accepted-campaigns`, {
    headers: authHeaders(),
  }));

// ── Phase 2 — Milestones ──────────────────────────────────────────────────────

export const getMilestones = async (campaignId) =>
  handleResponse(await fetch(`${API_URL}/milestones/campaign/${campaignId}`, {
    headers: authHeaders(),
  }));

export const createMilestone = async (data) =>
  handleResponse(await fetch(`${API_URL}/milestones`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
  }));

export const submitMilestone = async (milestoneId, data) =>
  handleResponse(await fetch(`${API_URL}/milestones/${milestoneId}/submit`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
  }));

export const approveMilestone = async (milestoneId) =>
  handleResponse(await fetch(`${API_URL}/milestones/${milestoneId}/approve`, {
    method: 'POST', headers: authHeaders(),
  }));

export const rejectMilestone = async (milestoneId, reason) =>
  handleResponse(await fetch(`${API_URL}/milestones/${milestoneId}/reject`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify({ reason }),
  }));

export const deleteMilestone = async (milestoneId) =>
  handleResponse(await fetch(`${API_URL}/milestones/${milestoneId}`, {
    method: 'DELETE', headers: authHeaders(),
  }));

// ── Phase 2 — Reviews + Trust Score ──────────────────────────────────────────

export const submitReview = async (data) =>
  handleResponse(await fetch(`${API_URL}/reviews`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
  }));

export const getTrustScore = async (userId) =>
  handleResponse(await fetch(`${API_URL}/reviews/trust/${userId}`, {
    headers: authHeaders(),
  }));

export const getUserReviews = async (userId) =>
  handleResponse(await fetch(`${API_URL}/reviews/user/${userId}`, {
    headers: authHeaders(),
  }));
// ── Phase 3 — Profile completion + post metrics ───────────────────────────────

export const submitPostMetrics = async (campaignId, data) =>
  handleResponse(await fetch(`${API_URL}/campaigns/${campaignId}/metrics`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
  }));

export const recordProfileView = async (userId) =>
  handleResponse(await fetch(`${API_URL}/profiles/view/${userId}`, {
    method: 'POST', headers: authHeaders(),
  }));

export const deletePortfolioItem = async (itemId) =>
  handleResponse(await fetch(`${API_URL}/profiles/me/portfolio/${itemId}`, {
    method: 'DELETE', headers: authHeaders(),
  }));

// ── Auth account actions ──────────────────────────────────────────────────────
export const changePassword = async (currentPassword, newPassword) =>
  handleResponse(await fetch(`${API_URL}/password`, {
    method: 'PUT', headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  }));

export const updateDisplayName = async (name) =>
  handleResponse(await fetch(`${API_URL}/name`, {
    method: 'PUT', headers: authHeaders(),
    body: JSON.stringify({ name }),
  }));
// ── Avatar upload ─────────────────────────────────────────────────────────────
export const uploadAvatar = async (base64Image) =>
  handleResponse(await fetch(`${API_URL}/profiles/me`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ avatar: base64Image }),
  }));