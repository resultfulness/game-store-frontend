import React, { createContext, useContext, useState } from "react";
import { api } from "./services/api";
import type { User } from "./types/user";

const AuthContext = createContext<{
  user: User | null,
  login: (username: string, password: string) => Promise<void>,
  logout: () => void,
}>({
  user: null,
  login: async () => { },
  logout: () => { },
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") ?? "null")
  );

  async function login(username: string, password: string) {
    const { access_token } = await api.fetch("/auth/login", {
      method: "POST",
      body: new URLSearchParams({ username, password }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    localStorage.setItem("token", access_token);

    const user = await api.get("/users/me");
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
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
