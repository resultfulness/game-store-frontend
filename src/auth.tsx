import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext<{
  user: any,
  login: (username: string, password: string) => void,
  logout: () => void,
}>({
  user: null,
  login: () => { },
  logout: () => { },
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  function login(username: string, password: string) {
    setUser(username);
  }
  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
