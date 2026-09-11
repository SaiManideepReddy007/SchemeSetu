import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const matchSchemes = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/match`, formData);
  return response.data;
};

export const getAllSchemes = async (searchTerm = '') => {
  const url = searchTerm
    ? `${API_BASE_URL}/schemes?search=${encodeURIComponent(searchTerm)}`
    : `${API_BASE_URL}/schemes`;
  const response = await axios.get(url);
  return response.data;
};

export const smartMatch = async (freeText) => {
  const response = await axios.post(`${API_BASE_URL}/smart-match`, { freeText });
  return response.data;
};

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getBookmarks = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/bookmarks`, authHeader(token));
  return response.data;
};

export const addBookmark = async (schemeId, token) => {
  const response = await axios.post(`${API_BASE_URL}/bookmarks`, { schemeId }, authHeader(token));
  return response.data;
};

export const removeBookmark = async (schemeId, token) => {
  const response = await axios.delete(`${API_BASE_URL}/bookmarks/${schemeId}`, authHeader(token));
  return response.data;
};

export const getHistory = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/history`, authHeader(token));
  return response.data;
};

export const recordView = async (schemeId, token) => {
  const response = await axios.post(`${API_BASE_URL}/history`, { schemeId }, authHeader(token));
  return response.data;
};

export const getDocumentProgress = async (schemeId, token) => {
  const response = await axios.get(`${API_BASE_URL}/documents/${schemeId}`, authHeader(token));
  return response.data;
};

export const updateDocumentProgress = async (schemeId, checkedDocuments, token) => {
  const response = await axios.put(`${API_BASE_URL}/documents/${schemeId}`, { checkedDocuments }, authHeader(token));
  return response.data;
};

export const getNearMisses = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/near-miss`, formData);
  return response.data;
};

export const getApplications = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/applications`, authHeader(token));
  return response.data;
};

export const addApplication = async (schemeId, token) => {
  const response = await axios.post(`${API_BASE_URL}/applications`, { schemeId }, authHeader(token));
  return response.data;
};

export const updateApplicationStatus = async (applicationId, status, token) => {
  const response = await axios.patch(
    `${API_BASE_URL}/applications/${applicationId}/status`,
    { status },
    authHeader(token)
  );
  return response.data;
};

export const removeFromHistory = async (schemeId, token) => {
  const response = await axios.delete(`${API_BASE_URL}/history/${schemeId}`, authHeader(token));
  return response.data;
};

export const clearHistory = async (token) => {
  const response = await axios.delete(`${API_BASE_URL}/history`, authHeader(token));
  return response.data;
};

export const submitFeedback = async (data, token) => {
  const response = await axios.post(`${API_BASE_URL}/feedback`, data, authHeader(token));
  return response.data;
};

export const getSchemeImage = async (query) => {
  const response = await axios.get(`${API_BASE_URL}/scheme-image`, { params: { query } });
  return response.data;
};