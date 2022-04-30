import { AxiosResponse } from 'axios';

import { Organisation } from '../@types/interfaces';
import { LogoType, Orientation } from '../@types/enums';
import { authHeader } from '../helpers/getAuthHeader';
import { handleError } from '../helpers/handleError';
import apiChatloopOrg from '../config/axiosConfig';

export interface PostOrgBody {
  officialName: string;
  operationalCountries: string[];
  operationalRegions: string[];
  onlineOrg: boolean;
  shortName: string | null;
  premise: string | null;
  subpremise: string | null;
  streetAddress: string | null;
  administrativeArea: string | null;
  locality: string | null;
  country: string | null;
  countryCode: string | null;
  postalCode: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  websiteUrl: string | null;
  adminIds: number[];
}

export interface PutOrgBody extends PostOrgBody {}

export interface PostLogoArgs {
  files: File[];
  type: LogoType;
  orientation: Orientation;
  orgId: number;
}

export interface DeleteLogoArgs {
  type: LogoType;
  orgId: number;
}

type PostLogo = (args: PostLogoArgs) => Promise<AxiosResponse<Organisation>>;
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
type DeleteLogo = (
  args: DeleteLogoArgs
) => Promise<AxiosResponse<Organisation>>;

interface OrganisationsService {
  getOrgs: GetOrgs;
  getOrg: GetOrg;
  postOrg: PostOrg;
  putOrg: PutOrg;
  deleteOrg: DeleteOrg;
  postLogo: PostLogo;
  deleteLogo: DeleteLogo;
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

const postLogo: PostLogo = async ({ orgId, orientation, type, files }) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  const formData = new FormData();
  formData.append('file', files[0], `${type.toLowerCase()}.png`);
  formData.append('type', type);
  formData.append('orientation', orientation);

  return apiChatloopOrg.post(
    `rest/user/organisation/${orgId}/logo`,
    formData,
    requestOptions
  );
};

const deleteLogo: DeleteLogo = ({ orgId, type }) => {
  const requestOptions = {
    headers: { authorization: authHeader() },
  };

  return apiChatloopOrg.delete(
    `rest/user/organisation/${orgId}/logo?type=${type}`,
    requestOptions
  );
};

const organisationsService: OrganisationsService = {
  getOrgs,
  getOrg,
  postOrg,
  putOrg,
  deleteOrg,
  postLogo,
  deleteLogo,
};

export default organisationsService;
