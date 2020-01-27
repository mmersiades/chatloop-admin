/**
 * @module helpers
 */

/**
 * Gets the JWT from localStorage, converts it to an auth header for HTTP requests
 */
const getAuthHeader = (): string => {
  const token: string | null = localStorage.getItem("token");

  if (token) {
    return `Bearer ${token}`;
  } else {
    return "";
  }
};

export default getAuthHeader;
