import axios from 'axios';
import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { LoginResponseDTO } from '../common/DTO';

interface IgSessionContext {
  login: (username: string, password: string, rmbMe?: boolean) => Promise<LoginResponseDTO>
  provideMFA: (code: string) => Promise<{ session: string }>
  getMe: () => Promise<unknown>

}

const igSessionContext = createContext<IgSessionContext>(null);

export const useIgSession = () => useContext(igSessionContext);

interface Props {
  children: React.ReactNode
}

export function IgSessionContextProvider({ children }: Props) {
  useEffect(() => {
    const igSession = sessionStorage.getItem('igSession');
    const username = sessionStorage.getItem('username');
    if (igSession && username) {
      axios.post('/api/loginWithSession', { igSession: JSON.parse(igSession), username }).then(console.log);
    }
  }, []);

  const contextValue: IgSessionContext = useMemo(() => ({
    async login(username, password, rmbMe = false) {
      const { data } = await axios.post('./api/login', { username, password });
      if (rmbMe) {
        sessionStorage.setItem('igSession', JSON.stringify(data.session));
        sessionStorage.setItem('username', username);
      }
      return data;
    },
    async provideMFA(code) {
      return (await axios.post('./api/provideMFA', { code })).data;
    },
    async getMe() {
      return (await axios.get('./api/me')).data;
    },
  }), []);

  return (
    <igSessionContext.Provider value={contextValue}>
      {children}
    </igSessionContext.Provider>
  );
}
