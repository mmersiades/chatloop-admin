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

export interface StatsDTO {
  labels: string[];
  datasets: DataSetDTO[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

type GetUsageStats = () => Promise<AxiosResponse<UsageStatsDTO>>;
type GetDauStats = (params: DateRange) => Promise<AxiosResponse<StatsDTO>>;
type GetMauStats = (params: DateRange) => Promise<AxiosResponse<StatsDTO>>;
type GetTopicTextStats = (
  params: DateRange
) => Promise<AxiosResponse<StatsDTO>>;

interface StatsService {
  getUsageStats: GetUsageStats;
  getDauStats: GetDauStats;
  getMauStats: GetMauStats;
  getTopicTextStats: GetTopicTextStats;
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
      `/rest/admin/stats/dau?startDate=${
        startDate.toISOString().split('T')[0]
      }&endDate=${endDate.toISOString().split('T')[0]}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const getMauStats: GetMauStats = async ({ startDate, endDate }) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/admin/stats/mau?startDate=${
        startDate.toISOString().split('T')[0]
      }&endDate=${endDate.toISOString().split('T')[0]}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const getTopicTextStats: GetTopicTextStats = async ({ startDate, endDate }) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/admin/stats/topictexts?startDate=${
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
  getMauStats,
  getTopicTextStats,
};

export default statsService;
