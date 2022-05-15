import { AxiosResponse } from 'axios';
import apiChatloopOrg from '../config/axiosConfig';
import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';

export const getLanguages = async (): Promise<AxiosResponse> => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(`/rest/language`, requestOptions);
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};
