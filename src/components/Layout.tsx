import "./Layout.css";
import { NavLink, Outlet } from "react-router";
import type React from "react";
import { useState } from "react";
import Button from "./Button";
import LoginModal from "./LoginModal";
import { useAuth } from "@/auth";

function A({ href, children }: { href: string, children: React.ReactNode }) {
  return <NavLink
    to={href}
    className={({ isActive }) => {
      return `header-nav-link ${isActive ? "header-nav-link-active" : ""}`;
    }}
  >
    {children}
  </NavLink>;
}

export default function Layout() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { user, logout } = useAuth();

  return <div className="layout">
    <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
    <header className="header">
      <h1 className="header-title">game store</h1>
      <nav className="header-nav">
        <A href="/">home</A>
        <A href="/games">games</A>
        {user && <A href="/account">{user}</A>}
      </nav>
      <div className="header-actions">
        {!user
          ? <Button onClick={() => setLoginModalOpen(true)}>login</Button>
          : <Button onClick={() => logout()}>logout</Button>
        }
      </div>
    </header>
    <main className="page">
      <Outlet />
    </main>
  </div>;
}
