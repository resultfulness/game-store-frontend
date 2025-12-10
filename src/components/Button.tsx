import "./Button.css";
import type React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, onClick, type }: ButtonProps) {
  return <button
    className="button"
    onClick={onClick}
    type={type}
  >
    {children}
  </button>;
}
