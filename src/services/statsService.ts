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
  borderColor?: string;
}

export interface StatsDTO {
  labels: string[];
  datasets: DataSetDTO[];
}

export interface CapacitiesDTO {
  tutorMaxLearnerCapacity: number;
  learnerCount: number;
  partnerMaxActivityCapacity: number;
  learnerMaxActivityCapacity: number;
  activityCount: number;
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
type GetCapacityStats = () => Promise<AxiosResponse<CapacitiesDTO>>;

interface StatsService {
  getDauStats: GetStats;
  getMauStats: GetStats;
  getCaStats: GetStats;
  getAipStats: GetStats;
  getMessagesStats: GetStats;
  getLearnerFeedbackStats: GetStats;
  getTarStats: GetStats;
  getTcrStats: GetStats;
  getOrgStats: GetOrgStats;
  getCapacityStats: GetCapacityStats;
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

const getLearnerFeedbackStats: GetStats = async ({ startDate, endDate }) =>
  await getStats('learner-feedback', startDate, endDate);

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
  const requestOptions = {
    headers: { Authorization: authHeader() },
  };

  const body = { orgIds };

  return await apiChatloopOrg.post(
    `/rest/admin/stats/orgs?type=${type}&startDate=${
      startDate.toISOString().split('T')[0]
    }&endDate=${endDate.toISOString().split('T')[0]}`,
    body,
    requestOptions
  );
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

const getCapacityStats: GetCapacityStats = async () => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/admin/stats/capacities`,
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
  getLearnerFeedbackStats,
  getTarStats,
  getTcrStats,
  getOrgStats,
  getCapacityStats,
};

export default statsService;
