"use client";

import React from "react";

type ExpirationModalProps = {
  onRefresh: () => void;
  onLogout: () => void;
};

const ExpirationModal: React.FC<ExpirationModalProps> = ({ onRefresh, onLogout }) => {
  return (
    <div className="fixed z-50 bottom-6 right-6 max-w-sm w-full bg-white border border-gray-200 shadow-lg rounded-xl p-4 animate-fade-in">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">
        Your session is about to expire
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        You’ll be logged out soon. Would you like to stay signed in?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onLogout}
          className="px-4 py-1.5 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Log Out
        </button>
        <button
          onClick={onRefresh}
          className="px-4 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
};

export default ExpirationModal;
