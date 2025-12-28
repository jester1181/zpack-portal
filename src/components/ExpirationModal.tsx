"use client";

import React from "react";

type ExpirationModalProps = {
  onRefresh: () => void;
  onLogout: () => void;
};

const ExpirationModal: React.FC<ExpirationModalProps> = ({ onRefresh, onLogout }) => {
  return (
    <div className="fixed z-50 bottom-6 right-6 max-w-sm w-full rounded-xl border border-gray-200 bg-white p-4 shadow-subtle">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">
        Your session is about to expire
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        You’ll be logged out soon. Would you like to stay signed in?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onLogout}
          className="px-4 py-1.5 text-sm rounded bg-dangerRed text-white hover:bg-red-500 transition"
        >
          Log Out
        </button>
        <button
          onClick={onRefresh}
          className="px-4 py-1.5 text-sm rounded bg-electricBlue text-black hover:bg-electricBlueLight transition"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
};

export default ExpirationModal;
