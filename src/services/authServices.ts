import apiChatloopOrg from "../config/axionConfig";

const login = async (
  username: string,
  password: string
): Promise<{ isAuthError: boolean }> => {
  const body = {
    username: username,
    password: password
  };

  try {
    const response = await apiChatloopOrg.post("/rest/login", body);
    localStorage.setItem("token", response.data.token);
    return { isAuthError: false };
  } catch (error) {
    return { isAuthError: true };
  }
};

const logout = () => localStorage.clear();

const authService = {
  login,
  logout
};

export default authService;
