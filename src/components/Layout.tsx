import "./Layout.css";
import { NavLink, Outlet } from "react-router";
import type React from "react";
import { useState } from "react";
import Button from "./Button";
import LoginModal from "./LoginModal";

export default function Layout() {
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

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return <div className="layout">
    <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />
    <header className="header">
      <h1 className="header-title">game store</h1>
      <nav className="header-nav">
        <A href="/">home</A>
        <A href="/about">about</A>
      </nav>
      <div className="header-actions">
        <Button
          onClick={() => setLoginModalOpen(true)}
        >
          login
        </Button>
      </div>
    </header>
    <main className="page">
      <Outlet />
    </main>
  </div>;
}
