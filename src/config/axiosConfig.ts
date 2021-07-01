import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.REACT_APP_MONOLITH_BASE_URL;

const apiChatloopOrg: AxiosInstance = axios.create({
  baseURL,
});

export default apiChatloopOrg;
