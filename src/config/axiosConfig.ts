import axios, { AxiosInstance } from "axios";
import baseURL from "../serverUrls";

const apiChatloopOrg: AxiosInstance = axios.create({
  baseURL
});

export default apiChatloopOrg;
