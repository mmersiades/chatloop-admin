import { AxiosResponse } from 'axios';

import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';
import apiChatloopOrg from '../config/axiosConfig';

interface DataSetDTO {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface StatsDTO {
  labels: string[];
  datasets: DataSetDTO[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

type GetDauStats = (params: DateRange) => Promise<AxiosResponse<StatsDTO>>;
type GetMauStats = (params: DateRange) => Promise<AxiosResponse<StatsDTO>>;
type GetTopicTextStats = (
  params: DateRange
) => Promise<AxiosResponse<StatsDTO>>;
type GetMessagesStats = (params: DateRange) => Promise<AxiosResponse<StatsDTO>>;

interface StatsService {
  getDauStats: GetDauStats;
  getMauStats: GetMauStats;
  getTopicTextStats: GetTopicTextStats;
  getMessagesStats: GetMessagesStats;
}

const getDauStats: GetDauStats = async ({ startDate, endDate }) =>
  await getStats('dau', startDate, endDate);

const getMauStats: GetMauStats = async ({ startDate, endDate }) =>
  await getStats('mau', startDate, endDate);

const getTopicTextStats: GetTopicTextStats = async ({ startDate, endDate }) =>
  await getStats('topictexts', startDate, endDate);

const getMessagesStats: GetMessagesStats = async ({ startDate, endDate }) =>
  await getStats('messages', startDate, endDate);

const getStats = async (type: string, startDate: Date, endDate: Date) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/admin/stats/${type}?startDate=${
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
  getDauStats,
  getMauStats,
  getTopicTextStats,
  getMessagesStats,
};

export default statsService;
