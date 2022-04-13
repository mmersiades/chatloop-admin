import { AxiosResponse } from 'axios';

import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';
import apiChatloopOrg from '../config/axiosConfig';

export interface UsageStatsDTO {
  activeUsersToday: number;
  activeUsersMonthToDate: number;
}

type GetUsageStats = () => Promise<AxiosResponse<UsageStatsDTO>>;

interface StatsService {
  getUsageStats: GetUsageStats;
}

const getUsageStats = async () => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(`/rest/admin/usage-stats`, requestOptions);
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const statsService: StatsService = {
  getUsageStats,
};

export default statsService;
