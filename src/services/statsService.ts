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
 * or = organisation referrer
 * ooa = organisation org admin
 * ca = cumulative activities
 * aip = activities in progress
 * oar = org active referrals
 * oer = org expired referrals
 * oai = org accepted invitations
 * */
const COLOR_PRIMARY_VERY_LIGHT = '#b7e3f7';
const COLOR_PRIMARY_LIGHT = '#64bfe9';
const COLOR_PRIMARY = '#43a5e0';
const COLOR_PRIMARY_DARK = '#3784be';
const COLOR_PRIMARY_VERY_DARK = '#295486';

const mockDateLabels: string[] = ['Sat, 21 May', 'Sun, 22 May', 'Mon, 23 May'];

const generateDataSet = (
  label: string,
  data: number[],
  backgroundColor: string
) => ({ label, data, backgroundColor });

const mockOoaStats: StatsDTO = {
  labels: mockDateLabels,
  datasets: [
    generateDataSet('Organisation 1', [1, 1, 2], COLOR_PRIMARY_VERY_DARK),
    generateDataSet('Organisation 2', [1, 1, 1], COLOR_PRIMARY_DARK),
    generateDataSet('Organisation 3', [2, 2, 3], COLOR_PRIMARY),
    generateDataSet('Organisation 4', [0, 0, 1], COLOR_PRIMARY_LIGHT),
    generateDataSet('Organisation 5', [1, 1, 1], COLOR_PRIMARY_VERY_LIGHT),
  ],
};

const mockOrStats: StatsDTO = {
  labels: mockDateLabels,
  datasets: [
    generateDataSet('Organisation 1', [5, 5, 5], COLOR_PRIMARY_VERY_DARK),
    generateDataSet('Organisation 2', [10, 11, 12], COLOR_PRIMARY_DARK),
    generateDataSet('Organisation 3', [25, 25, 30], COLOR_PRIMARY),
    generateDataSet('Organisation 4', [1, 1, 0], COLOR_PRIMARY_LIGHT),
    generateDataSet('Organisation 5', [15, 15, 15], COLOR_PRIMARY_VERY_LIGHT),
  ],
};

const mockOarStats: StatsDTO = {
  labels: mockDateLabels,
  datasets: [
    generateDataSet('Organisation 1', [3, 2, 3], COLOR_PRIMARY_VERY_DARK),
    generateDataSet('Organisation 2', [5, 4, 3], COLOR_PRIMARY_DARK),
    generateDataSet('Organisation 3', [0, 1, 1], COLOR_PRIMARY),
    generateDataSet('Organisation 4', [1, 1, 2], COLOR_PRIMARY_LIGHT),
    generateDataSet('Organisation 5', [4, 4, 4], COLOR_PRIMARY_VERY_LIGHT),
  ],
};

const mockOerStats: StatsDTO = {
  labels: mockDateLabels,
  datasets: [
    generateDataSet('Organisation 1', [10, 10, 10], COLOR_PRIMARY_VERY_DARK),
    generateDataSet('Organisation 2', [16, 16, 17], COLOR_PRIMARY_DARK),
    generateDataSet('Organisation 3', [5, 6, 6], COLOR_PRIMARY),
    generateDataSet('Organisation 4', [1, 1, 1], COLOR_PRIMARY_LIGHT),
    generateDataSet('Organisation 5', [3, 4, 5], COLOR_PRIMARY_VERY_LIGHT),
  ],
};

const mockOaiStats: StatsDTO = {
  labels: mockDateLabels,
  datasets: [
    generateDataSet('Organisation 1', [13, 14, 14], COLOR_PRIMARY_VERY_DARK),
    generateDataSet('Organisation 2', [21, 21, 21], COLOR_PRIMARY_DARK),
    generateDataSet('Organisation 3', [7, 7, 8], COLOR_PRIMARY),
    generateDataSet('Organisation 4', [3, 5, 7], COLOR_PRIMARY_LIGHT),
    generateDataSet('Organisation 5', [6, 6, 6], COLOR_PRIMARY_VERY_LIGHT),
  ],
};

const stall = async (stallTime = 3000) => {
  await new Promise((resolve) => setTimeout(resolve, stallTime));
};

type OrgStatType =
  | 'referrers'
  | 'org-admins'
  | 'active-referrals'
  | 'accepted-invitations'
  | 'expired-referrals';

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
  type: OrgStatType;
  orgIds: number[];
}

type GetStats = (params: DateRange) => Promise<AxiosResponse<StatsDTO>>;
type GetOrgStats = (args: OrgStatsArgs) => Promise<AxiosResponse<StatsDTO>>;

interface StatsService {
  getDauStats: GetStats;
  getMauStats: GetStats;
  getCaStats: GetStats;
  getAipStats: GetStats;
  getMessagesStats: GetStats;
  getTarStats: GetStats;
  getTcrStats: GetStats;
  getOrgStats: GetOrgStats;
}

const getDauStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('dau', startDate, endDate);

const getMauStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('mau', startDate, endDate);

const getCaStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('cumulative-activities', startDate, endDate);

const getAipStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('in-progress-activities', startDate, endDate);

const getMessagesStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('messages', startDate, endDate);

const getTarStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('active-referrals', startDate, endDate);

const getTcrStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('cumulative-referrals', startDate, endDate);

const getOrgStats: GetOrgStats = async ({
  type,
  orgIds,
  startDate,
  endDate,
}: OrgStatsArgs) => {
  // TODO: implement endpoints
  switch (type) {
    case 'referrers':
      await stall(500);
      return { status: 200, data: mockOrStats } as AxiosResponse<StatsDTO>;
    case 'org-admins':
      await stall(500);
      return { status: 200, data: mockOoaStats } as AxiosResponse<StatsDTO>;
    case 'accepted-invitations':
      await stall(500);
      return { status: 200, data: mockOaiStats } as AxiosResponse<StatsDTO>;
    case 'active-referrals':
      await stall(500);
      return { status: 200, data: mockOarStats } as AxiosResponse<StatsDTO>;
    case 'expired-referrals':
      await stall(500);
      return { status: 200, data: mockOerStats } as AxiosResponse<StatsDTO>;
    default:
      throw new Error('Invalid OrgStatType');
  }
};

const getStats = async (type: string, startDate: Date, endDate: Date) => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
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
  getCaStats,
  getAipStats,
  getMessagesStats,
  getTarStats,
  getTcrStats,
  getOrgStats,
};

export default statsService;
