import { AxiosResponse } from 'axios';

import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';
import apiChatloopOrg from '../config/axiosConfig';

interface DataSetDTO {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface UsageStatsDTO {
  activeUsersToday: number;
  activeUsersMonthToDate: number;
}

export interface DauStatsDTO {
  labels: string[];
  datasets: DataSetDTO[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

type GetUsageStats = () => Promise<AxiosResponse<UsageStatsDTO>>;
type GetDauStats = (params: DateRange) => Promise<AxiosResponse<DauStatsDTO>>;

interface StatsService {
  getUsageStats: GetUsageStats;
  getDauStats: GetDauStats;
}

const getUsageStats: GetUsageStats = async () => {
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

const getDauStats: GetDauStats = async ({ startDate, endDate }) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/admin/stats/dao?startDate=${
        startDate.toISOString().split('T')[0]
      }&endDate=${endDate.toISOString().split('T')[0]}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const statsService: StatsService = {
  getUsageStats,
  getDauStats,
};

export default statsService;
