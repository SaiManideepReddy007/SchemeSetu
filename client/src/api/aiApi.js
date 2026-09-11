import axios from 'axios';

const AI_SERVICE_URL = 'http://localhost:8000/api';

export const sendChatMessage = async (message, history) => {
  const response = await axios.post(`${AI_SERVICE_URL}/chat`, { message, history });
  return response.data;
};