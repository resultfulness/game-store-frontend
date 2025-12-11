import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./ConfirmModal.css";
import Button from "./Button";
import { useScrollLock } from "@/hooks/useScrollLock";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onCancel();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-modal-overlay" onClick={(e) => {
      e.stopPropagation();
      onCancel();
    }}>
      <div className="confirm-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <Button onClick={onCancel} className="confirm-modal-cancel">
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`confirm-modal-confirm ${variant === "danger" ? "confirm-modal-confirm-danger" : ""}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

