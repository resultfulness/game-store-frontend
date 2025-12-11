import "./Button.css";
import type React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  className?: string
}

export default function Button({ children, onClick, type, className }: ButtonProps) {
  return <button
    className={`button ${className ? className : ""}`}
    onClick={onClick}
    type={type}
  >
    {children}
  </button>;
}
