import React, { createContext, useContext, useState } from "react";
import { api } from "./services/api";
import type { User } from "./types/user";

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
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") ?? "null")
  );

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

        api.get("/users/me").then(user => {
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
        })
      })
      .catch(e => alert(e));
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
