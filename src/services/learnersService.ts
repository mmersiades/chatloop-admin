import { LearnerDataDTO, PageableResponse } from '../@types/interfaces';
import { authHeader } from '../helpers/getAuthHeader';
import apiChatloopOrg from '../config/axiosConfig';
import { handleError } from '../helpers/handleError';
import { AxiosResponse } from 'axios';

export type LearnerSortProperty =
  | 'lastActiveDate'
  | 'id'
  | 'displayName'
  | 'uiLanguage'
  | 'referringOrg'
  | 'isActive'
  | 'currentActivities'
  | 'currentNewActivityRequests'
  | 'isDisadvantaged';

export interface GetLearnersArgs {
  page: number;
  size: number;
  sort: LearnerSortProperty;
  ascending: 'true' | 'false';
}

type GetLearners = (
  args: GetLearnersArgs
) => Promise<AxiosResponse<PageableResponse<LearnerDataDTO>>>;

interface LearnersService {
  getLearners: GetLearners;
}

const getLearners: GetLearners = async ({ page, size, sort, ascending }) => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
    params: { page, size, sort, ascending },
  };

  try {
    return await apiChatloopOrg.get('/rest/admin/learners', requestOptions);
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const learnersService: LearnersService = {
  getLearners,
};

export default learnersService;
