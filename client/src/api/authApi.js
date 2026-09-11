import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
};

export const getMe = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateNotificationPreferences = async (emailNotifications, token) => {
  const response = await axios.patch(
    `${API_BASE_URL}/preferences`,
    { emailNotifications },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};