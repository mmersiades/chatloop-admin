import apiChatloopOrg from '../config/axiosConfig';
import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';
import { AxiosResponse } from 'axios';

const getPartnerQueue = async () => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    const response: AxiosResponse = await apiChatloopOrg.get('/rest/admin/partner-ranking/', requestOptions);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const invitesService = {
  getPartnerQueue,
};

export default invitesService;
