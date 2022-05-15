import { AxiosResponse } from 'axios';

import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';
import apiChatloopOrg from '../config/axiosConfig';

export interface CountryDTO {
  countryCode: string;
  countryName: string;
}

type GetCountries = () => Promise<AxiosResponse<CountryDTO[]>>;

interface CountriesService {
  getCountries: GetCountries;
}

const getCountries: GetCountries = async () => {
  const requestOptions = {
    headers: { Authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get('/rest/countries', requestOptions);
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const countriesService: CountriesService = {
  getCountries,
};

export default countriesService;
