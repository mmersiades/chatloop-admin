/**
 * @module helpers
 */

/**
 * Gets the JWT from localStorage, converts it to an auth header for HTTP requests
 */
export const authHeader = (): string => {
  const token: string | null = localStorage.getItem('authToken');
  if (token) {
    return `Bearer ${token}`;
  } else {
    return '';
  }
};

export const refreshHeader = (): string => {
  const refreshToken: string | null = localStorage.getItem('loginToken');

  if (refreshToken) {
    return `Bearer ${refreshToken}`;
  } else {
    return '';
  }
};
