import {AxiosResponse} from "axios";

import {UserRole} from '../@types/enums';
import {ExtendedReferral, PageableResponse, Referral} from '../@types/interfaces';
import {handleError} from "../helpers/handleError";
import {authHeader} from "../helpers/getAuthHeader";
import apiChatloopOrg from "../config/axiosConfig";

export interface PostReferralBody {
  refereeName: string;
  refereeEmail: string;
  role: UserRole;
  firstLanguage: string; // eg 'eng', 'ara', 'prs' ISO-639-3
}

type PostReferral = ({
                       body,
                       page,
                       size
                     }: {
  body: PostReferralBody,
  page: number,
  size: number
}) => Promise<AxiosResponse<PageableResponse<Referral>>>

type GetReferrals = ({
                       page,
                       size
                     }: {
  page: number,
  size: number
}) => Promise<AxiosResponse<PageableResponse<Referral>>>

type GetReferralById = ({
                          referralId,

                        }: {
  referralId: number
}) => Promise<AxiosResponse<ExtendedReferral>>

interface ReferralsService {
  postReferral: PostReferral
  getReferrals: GetReferrals
  getReferralById: GetReferralById
}

export const postReferral: PostReferral = async (
  {body, size, page}
) => {
  console.log("service.postReferral")
  const requestOptions = {
    headers: {authorization: authHeader()},
  };

  try {
    return await apiChatloopOrg.post(
      `/rest/referrals?page=${page}&size=${size}`, body,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

export const getReferrals: GetReferrals = async (
  {size, page}
) => {
  const requestOptions = {
    headers: {authorization: authHeader()},
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

export const getReferralById: GetReferralById = async (
  {referralId}
) => {
  const requestOptions = {
    headers: {authorization: authHeader()},
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

const referralsService: ReferralsService = {
  postReferral,
  getReferralById,
  getReferrals
}

export default referralsService
