import axios from 'axios';
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import type { AccountRepositoryCurrentUserResponseUser } from 'instagram-private-api';
import { IgSession, LoginResponseDTO } from '../common/DTO';

interface IgSessionContext {
  isLoggedIn: boolean
  login: (username: string, password: string, rmbMe: boolean) => Promise<LoginResponseDTO>
  provideMFA(code: string, rmbMe: boolean, trustThisDevice: boolean): Promise<{ session: IgSession }>
  getMe: () => Promise<AccountRepositoryCurrentUserResponseUser>
  logout: () => Promise<void>
}

const igSessionContext = createContext<IgSessionContext>(null);

export const useIgSession = () => useContext(igSessionContext);

interface Props {
  children: React.ReactNode
}

export function IgSessionContextProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingIn, setLoggingIn] = useState(true);

  const loginSuccessHandler = useCallback(
    async (username: string, igSession: IgSession, rmbMe: boolean) => {
      if (rmbMe) {
        sessionStorage.setItem('igSession', JSON.stringify(igSession));
        sessionStorage.setItem('username', username);
      }
      setIsLoggedIn(true);
    },
    [],
  );

  useEffect(() => {
    const igSession = sessionStorage.getItem('igSession');
    const username = sessionStorage.getItem('username');
    if (igSession && username) {
      setLoggingIn(true);
      axios.post('/api/loginWithSession', { igSession: JSON.parse(igSession), username })
        .then(({ data }) => loginSuccessHandler(username, data.session, true))
        .catch(() => {
          sessionStorage.removeItem('igSession');
          sessionStorage.removeItem('username');
        })
        .finally(() => setLoggingIn(false));
    } else {
      setLoggingIn(false);
    }
  }, [loginSuccessHandler]);

  const contextValue: IgSessionContext = useMemo(() => ({
    isLoggedIn,
    async login(username, password, rmbMe) {
      const { data } = await axios.post('./api/login', { username, password });
      if (!data.mfa) {
        loginSuccessHandler(username, data.session, rmbMe);
      }
      return data;
    },
    async provideMFA(code, rmbMe, trustThisDevice) {
      const { data } = await axios.post('./api/provideMFA', { code, trustThisDevice });
      loginSuccessHandler(data.username, data.session, rmbMe);
      return data;
    },
    async getMe() {
      return (await axios.get('./api/my/self')).data;
    },
    async logout() {
      await axios.post('./api/logout');
      sessionStorage.removeItem('igSession');
      sessionStorage.removeItem('username');
      setIsLoggedIn(false);
    },
  }), [isLoggedIn, loginSuccessHandler]);

  if (loggingIn) {
    return 'loggin in';
  }

  return (
    <igSessionContext.Provider value={contextValue}>
      {
        children
      }
    </igSessionContext.Provider>
  );
}
