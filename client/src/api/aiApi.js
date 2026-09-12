import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const sendChatMessage = async (message, history) => {
  const response = await axios.post(`${API_BASE_URL}/chat`, { message, history });
  return response.data;
};