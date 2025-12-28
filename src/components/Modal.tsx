"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Your session is about to expire.",
  confirmText = "Stay Logged In",
  cancelText = "Logout",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-darkGray p-6 rounded-lg shadow-subtle text-center w-full max-w-sm border border-electricBlue">
        <h2 className="text-lg font-bold text-electricBlue mb-4">{title}</h2>
        <p className="text-foreground mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-electricBlueLight text-black font-bold hover:bg-electricBlue transition"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
