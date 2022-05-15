import { AxiosResponse } from 'axios';

import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';
import apiChatloopOrg from '../config/axiosConfig';

export interface RegionDTO {
  code: string;
  countryCode: string;
  subdivisionName: string;
}

type GetRegionsByCountry = (
  countryCode: string
) => Promise<AxiosResponse<RegionDTO[]>>;

interface RegionsService {
  getRegionsByCountry: GetRegionsByCountry;
}

const getRegionsByCountry: GetRegionsByCountry = async (countryCode) => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/regions?country=${countryCode}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const regionsService: RegionsService = {
  getRegionsByCountry,
};

export default regionsService;
