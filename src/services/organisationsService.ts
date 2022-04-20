import apiChatloopOrg from '../config/axiosConfig';
import { AxiosResponse } from 'axios';
import { Organisation } from '../@types/interfaces';
import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';

interface PostOrgBody {
  officialName: string;
  shortName?: string;
  premise?: string;
  subpremise?: string;
  streetAddress?: string;
  administrativeArea?: string;
  locality?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
  operationalCountries?: string[];
  operationalRegions?: string[];
  onlineOrg?: boolean;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
}

interface PutOrgBody extends PostOrgBody {}

type GetOrgs = () => Promise<AxiosResponse<Organisation[]>>;
type GetOrg = (orgId: number) => Promise<AxiosResponse<Organisation>>;
type PostOrg = (body: PostOrgBody) => Promise<AxiosResponse<Organisation[]>>;
type PutOrg = ({
  body,
  orgId,
}: {
  body: PutOrgBody;
  orgId: number;
}) => Promise<AxiosResponse<Organisation[]>>;
type DeleteOrg = (orgId: number) => Promise<AxiosResponse<Organisation[]>>;

interface OrganisationsService {
  getOrgs: GetOrgs;
  getOrg: GetOrg;
  postOrg: PostOrg;
  putOrg: PutOrg;
  deleteOrg: DeleteOrg;
}

const getOrgs: GetOrgs = async () => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get('/rest/user/organisation', requestOptions);
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const getOrg: GetOrg = async (orgId) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.get(
      `/rest/user/organisation/${orgId}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const postOrg: PostOrg = async (body) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.post(
      `/rest/user/organisation/`,
      body,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const putOrg: PutOrg = async ({ body, orgId }) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.put(
      `/rest/user/organisation/${orgId}`,
      body,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const deleteOrg: DeleteOrg = async (orgId) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  try {
    return await apiChatloopOrg.delete(
      `/rest/user/organisation/${orgId}`,
      requestOptions
    );
  } catch (error) {
    handleError(error);
  }
  return Promise.reject();
};

const organisationsService: OrganisationsService = {
  getOrgs,
  getOrg,
  postOrg,
  putOrg,
  deleteOrg,
};

export default organisationsService;
