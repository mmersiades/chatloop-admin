import { AxiosResponse } from 'axios';

import { UserRole } from '../@types/enums';
import {
  ExtendedReferral,
  PageableResponse,
  Referral,
} from '../@types/interfaces';
import { handleError } from '../helpers/handleError';
import { authHeader } from '../helpers/getAuthHeader';
import apiChatloopOrg from '../config/axiosConfig';

export interface PostReferralBody {
  refereeName: string;
  role: UserRole;
  firstLanguage: string; // eg 'eng', 'ara', 'prs' ISO-639-3
  refereeEmail?: string;
  refereePhone?: string;
}

export interface PutReferralBody extends PostReferralBody {}

type PostReferral = ({
  body,
  page,
  size,
}: {
  body: PostReferralBody;
  page: number;
  size: number;
}) => Promise<AxiosResponse<PageableResponse<Referral>>>;

type PutReferral = ({
  referralId,
  body,
  page,
  size,
}: {
  referralId: number;
  body: PutReferralBody;
  page: number;
  size: number;
}) => Promise<AxiosResponse<PageableResponse<Referral>>>;

type GetReferrals = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => Promise<AxiosResponse<PageableResponse<Referral>>>;

type GetReferralById = ({
  referralId,
}: {
  referralId: number;
}) => Promise<AxiosResponse<ExtendedReferral>>;

type DeleteReferral = ({
  referralId,
  page,
  size,
}: {
  referralId: number;
  page: number;
  size: number;
}) => Promise<AxiosResponse<PageableResponse<Referral>>>;

interface ReferralsService {
  postReferral: PostReferral;
  putReferral: PutReferral;
  getReferrals: GetReferrals;
  getReferralById: GetReferralById;
  deleteReferral: DeleteReferral;
}

export const postReferral: PostReferral = async ({ body, size, page }) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.post(
      `/rest/referrals?page=${page}&size=${size}`,
      body,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

export const putReferral: PutReferral = async ({
  referralId,
  body,
  size,
  page,
}) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.put(
      `/rest/referrals/${referralId}?page=${page}&size=${size}`,
      body,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

export const getReferrals: GetReferrals = async ({ size, page }) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/referrals?page=${page}&size=${size}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

export const getReferralById: GetReferralById = async ({ referralId }) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/referrals/${referralId}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

export const deleteReferral: DeleteReferral = async ({
  referralId,
  size,
  page,
}) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.delete(
      `/rest/referrals/${referralId}?page=${page}&size=${size}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const referralsService: ReferralsService = {
  postReferral,
  putReferral,
  getReferralById,
  getReferrals,
  deleteReferral,
};

export default referralsService;
