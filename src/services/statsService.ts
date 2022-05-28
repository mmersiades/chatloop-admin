import { AxiosResponse } from 'axios';

import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';
import apiChatloopOrg from '../config/axiosConfig';

/*
 * ACRONYMS
 * dau = daily active user
 * mau = monthly active user
 * tar = total active referrals
 * tcr = total cumulative referrals
 * */
// const COLOR_PRIMARY_VERY_LIGHT = '#b7e3f7';
// const COLOR_PRIMARY_LIGHT = '#64bfe9';
const COLOR_PRIMARY = '#43a5e0';
// const COLOR_PRIMARY_DARK = '#3784be';
// const COLOR_PRIMARY_VERY_DARK = '#295486';
const COLOR_ERROR = '#C51162';

const mockDateLabels: string[] = ['Sat, 21 May', 'Sun, 22 May', 'Mon, 23 May'];

const generateDataSet = (
  label: string,
  data: number[],
  backgroundColor: string
) => ({ label, data, backgroundColor });

const mockTarStatsDTO: StatsDTO = {
  labels: mockDateLabels,
  datasets: [
    generateDataSet('Total Active Referrals', [6, 2, 8], COLOR_PRIMARY),
  ],
};

const mockTcrStatsDTO: StatsDTO = {
  labels: mockDateLabels,
  datasets: [
    generateDataSet('Total Accepted Invitations', [80, 85, 86], COLOR_PRIMARY),
    generateDataSet('Total Expired Referrals', [-20, -22, -24], COLOR_ERROR),
  ],
};

const stall = async (stallTime = 3000) => {
  await new Promise((resolve) => setTimeout(resolve, stallTime));
};

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

interface OrgStatsArgs extends DateRange {
  orgIds: number[];
}

type GetStats = (params: DateRange) => Promise<AxiosResponse<StatsDTO>>;
type GetOrgStats = (args: OrgStatsArgs) => Promise<AxiosResponse<StatsDTO>>;

interface StatsService {
  getDauStats: GetStats;
  getMauStats: GetStats;
  getCumulativeActivitiesStats: GetStats;
  getActivitiesInProgressStats: GetStats;
  getMessagesStats: GetStats;
  getTarStats: GetStats;
  getTcrStats: GetStats;
}

const getDauStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('dau', startDate, endDate);

const getMauStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('mau', startDate, endDate);

const getCumulativeActivitiesStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('cumulative-activities', startDate, endDate);

const getActivitiesInProgressStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('in-progress-activities', startDate, endDate);

const getMessagesStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('messages', startDate, endDate);

const getTarStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('active-referrals', startDate, endDate);
const getTcrStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('cumulative-referrals', startDate, endDate);

const getStats = async (type: string, startDate: Date, endDate: Date) => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
  };

  if (type === 'active-referrals') {
    await stall(500);
    return { status: 200, data: mockTarStatsDTO } as AxiosResponse<StatsDTO>;
  } else if (type === 'cumulative-referrals') {
    await stall(500);
    return { status: 200, data: mockTcrStatsDTO } as AxiosResponse<StatsDTO>;
  } else {
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
  }
  return Promise.reject();
};

const statsService: StatsService = {
  getDauStats,
  getMauStats,
  getCumulativeActivitiesStats,
  getActivitiesInProgressStats,
  getMessagesStats,
  getTarStats,
  getTcrStats,
};

export default statsService;
