/**
 * @module services
 */

/** */
import apiChatloopOrg from '../config/axiosConfig';
import { refreshHeader } from '../helpers/getAuthHeader';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const loginWithCredentials = async (username: string, password: string): Promise<{ isAuthError: boolean }> => {
  const body = {
    username: username,
    password: password
  };

  try {
    const response = await apiChatloopOrg.post('/rest/login', body);
    if (response.status === 200) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('loginToken', response.data.refreshToken);
      localStorage.setItem('tokensAddedAt', new Date().toString());
    }
    return { isAuthError: false };
  } catch (error) {
    return { isAuthError: true };
  }
};

/** Uses **axios** to log the User in using a refresh token. */
const loginWithToken = async () => {
  const requestOptions: AxiosRequestConfig = {
    headers: { authorization: refreshHeader() }
  };

  try {
    const response = await apiChatloopOrg.post('/rest/login', undefined, requestOptions);
    if (response.status === 200) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('loginToken', response.data.refreshToken);
      localStorage.setItem('tokensAddedAt', new Date().toString());
    }
    return { isAuthError: false };
  } catch (error) {
    return { isAuthError: true };
  }
};

/**
 * Uses **axios** to fetch a new refreshToken and token, using old refresh token.
 * Only fetches new tokens if previous tokens are older than 5 minutes old.
 * Saves new tokens to localStorage.
 *  */
const renewTokens = () => {
  let addedAtDate, elapsed;
  const loginToken: string | null = localStorage.getItem('loginToken');
  const tokensAddedAt: string | null = localStorage.getItem('tokensAddedAt');
  if (loginToken && tokensAddedAt) {
    addedAtDate = new Date(tokensAddedAt).getTime();
    elapsed = new Date().getTime() - addedAtDate;
  }

  const requestOptions: AxiosRequestConfig = {
    headers: { authorization: refreshHeader() }
  };

  if (elapsed && elapsed > 300000) {
    console.log('refreshing tokens');
    return apiChatloopOrg
      .post('/rest/login', undefined, requestOptions)
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('loginToken', response.data.refreshToken);
          localStorage.setItem('tokensAddedAt', new Date().toString());
        }
      })
      .catch((error: AxiosError) => {
        console.log('error', error);
      });
  } else {
    const promise = new Promise((resolve) => {
      resolve('No need for token renewal');
    });
    return promise;
  }
};

const logout = () => localStorage.clear();

/** Contains code to run just before an Axios request gets sent out */
apiChatloopOrg.interceptors.request.use((config: AxiosRequestConfig) => {
  /**
   * Checks if 5 minutes have passed since tokens last refreshed,
   * And fetches new tokens if true
   */
  if (config.url !== '/rest/login') {
    return renewTokens().then(() => {
      return config;
    });
  }
  return config;
});

const authService = {
  loginWithCredentials,
  loginWithToken,
  logout
};

export default authService;
