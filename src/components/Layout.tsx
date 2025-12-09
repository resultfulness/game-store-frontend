import "./Layout.css";
import { NavLink, Outlet } from "react-router";
import type React from "react";

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

  return <div className="layout">
    <header className="header">
      <h1 className="header-title">game store</h1>
      <nav className="header-nav">
        <A href="/">home</A>
        <A href="/about">about</A>
      </nav>
      <div className="header-actions">
        <button className="header-actions-button">login</button>
      </div>
    </header>
    <main className="page">
      <Outlet />
    </main>
  </div>;
}
