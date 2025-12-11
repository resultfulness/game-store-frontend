import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./AlertModal.css";
import Button from "./Button";
import { useScrollLock } from "@/hooks/useScrollLock";

interface AlertModalProps {
  open: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  variant?: "error" | "info" | "success";
}

export default function AlertModal({
  open,
  title,
  message,
  buttonText = "OK",
  onClose,
  variant = "info",
}: AlertModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <h2 className={`alert-modal-title alert-modal-title-${variant}`}>{title}</h2>
        <p className="alert-modal-message">{message}</p>
        <div className="alert-modal-actions">
          <Button onClick={onClose} className="alert-modal-button">
            {buttonText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
