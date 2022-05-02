import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import authService, {
  PostCredentialsBody,
  TokensPair,
} from '../services/authServices';

interface AuthState {
  loggedIn: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  loggedIn: false,
  loading: false,
};

interface AuthContext extends AuthState {
  loginWithCredentials?: (body: PostCredentialsBody) => Promise<boolean>;
  logout?: () => void;
}

const initialContext: AuthContext = { ...initialState };

// eslint-disable-next-line @typescript-eslint/no-redeclare
const AuthContext = createContext<AuthContext>(initialContext);

export const useAuth = () => useContext(AuthContext);

export const setTokens = ({ token, refreshToken }: TokensPair) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('loginToken', refreshToken);
  localStorage.setItem('tokensAddedAt', new Date().toString());
};

interface Props {}

export const AuthProvider: FC<PropsWithChildren<Props>> = ({ children }) => {
  // -------------------------- Component state ---------------------------- //
  const [loggedIn, setLoggedIn] = useState(initialState.loggedIn);
  const [loading, setLoading] = useState(initialState.loading);

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //

  // -------------------------- Component functions ------------------------ //
  const loginWithCredentials = async (
    body: PostCredentialsBody
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { status, data } = await authService.loginWithCredentials(body);
      if (status === 200) {
        setTokens(data);
        setLoggedIn(true);
        return true;
      }
      setLoading(false);
      setLoggedIn(false);
      return false;
    } catch (error) {
      console.error(error);
      setLoading(false);
      setLoggedIn(false);
      return false;
    }
  };

  const loginWithRefreshToken = useCallback(async () => {
    const token = localStorage.getItem('loginToken');

    if (token && !loading) {
      setLoading(true);
      try {
        const { status, data } = await authService.loginWithToken();

        if (status === 200) {
          setTokens(data);
          setLoggedIn(true);
          return;
        }
        setLoading(false);
        setLoggedIn(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setLoggedIn(false);
      }
    }
  }, [loading]);

  const logout = () => {
    setLoggedIn(false);
    localStorage.clear();
  };
  // -------------------------- Effects ------------------------------------ //

  useEffect(() => {
    !loading && !loggedIn && loginWithRefreshToken();
  }, [loading, loggedIn, loginWithRefreshToken]);
  // -------------------------- Render ------------------------------------- //
  return (
    <AuthContext.Provider
      value={{ loggedIn, loading, loginWithCredentials, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
