import React, { createContext, useContext, useState } from "react";
import { api } from "./services/api";

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
  const [user, setUser] = useState<string | null>(localStorage.getItem("username"));

  function login(username: string, password: string) {
    api.fetch("/auth/login", {
      method: "POST",
      body: new URLSearchParams({ username, password }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(({ access_token }) => {
        localStorage.setItem("token", access_token);
        localStorage.setItem("username", username);
        setUser(username);
      })
      .catch(e => alert(e));
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
