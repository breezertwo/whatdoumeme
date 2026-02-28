import { createContext, PropsWithChildren, useContext, useState } from 'react';
import Cookies from 'js-cookie';

const UsernameContext = createContext<{
  username: string | null;
  setUsername: (username: string | null) => void;
}>(null);

export const UsernameProvider = ({ children }: PropsWithChildren) => {
  const [username, setUsername] = useState<string>(Cookies.get('userName'));

  return <UsernameContext.Provider value={{ username, setUsername }}>{children}</UsernameContext.Provider>;
};

export const useSetUsername = () => {
  const { setUsername } = useContext(UsernameContext);
  return setUsername;
};

export const useUsername = () => {
  const { username } = useContext(UsernameContext);
  return username;
};
