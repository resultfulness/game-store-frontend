import type { ChangeEvent } from "react";
import "./Input.css";
import type React from "react";

interface InputProps {
  type: React.HTMLInputTypeAttribute;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string;
}

export default function Input({
  type,
  name,
  label,
  value,
  onChange,
  error,
}: InputProps) {
  return <label className="input-group">
    <span>{label}</span>
    <input
      type={type}
      name={name}
      className={`input ${error ? "input-error" : ""}`}
      value={value}
      onChange={onChange}
    />
    {error && <span className="input-group-error">{error}</span>}
  </label>;
}
