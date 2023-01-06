import { createContext, useState } from "react";

type UserData = {
  email: string;
  name: string;
  sub: string;
};

type UserContextType = {
  setUser: (user: UserData) => void;
  user: UserData | null;
};

export const UserContext = createContext<UserContextType>({
  setUser: (user) => {},
  user: null,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  return <UserContext.Provider value={{ setUser, user }}>{children}</UserContext.Provider>;
};
