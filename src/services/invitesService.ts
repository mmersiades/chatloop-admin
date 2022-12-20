import apiChatloopOrg from '../config/axiosConfig';
import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';
import { AxiosResponse } from 'axios';

const getPartnerQueue = async (
  page: number,
  size: number,
  activity: string
) => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
  };

  try {
    const response: AxiosResponse = await apiChatloopOrg.get(
      `/rest/admin/partner-ranking/${activity}?page=${page}&size=${size}`,
      requestOptions
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const getInvites = async () => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
  };

  try {
    const response: AxiosResponse = await apiChatloopOrg.get(
      '/rest/admin/invites/',
      requestOptions
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const deleteInvite = async (id: number) => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
  };

  try {
    const response: AxiosResponse = await apiChatloopOrg.delete(
      `/rest/activity-invites/delete-activity-request/${id}`,
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
