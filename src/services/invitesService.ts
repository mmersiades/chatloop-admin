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

const getInvites = async () => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    const response: AxiosResponse = await apiChatloopOrg.get('/rest/admin/invites/', requestOptions);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const deleteInvite = async (id: number) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    const response: AxiosResponse = await apiChatloopOrg.delete(
      `/rest/chatInvites/delete-invite/${id}`,
      requestOptions
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};

const invitesService = {
  getPartnerQueue,
  getInvites,
  deleteInvite,
};

export default invitesService;
