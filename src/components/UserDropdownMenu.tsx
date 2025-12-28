// components/UserDropdownMenu.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Props {
  nickname: string;
  onLogout: () => void;
}

const UserDropdownMenu: React.FC<Props> = ({ nickname, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-electricBlue text-black font-bold text-sm hover:bg-electricBlueLight transition"
      >
        {nickname.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-darkGray text-lightGray rounded shadow-subtle w-40">
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-electricBlue hover:text-black"
          >
            Profile
          </Link>
          <Link
            href="/billing"
            className="block px-4 py-2 hover:bg-electricBlue hover:text-black"
          >
            Billing
          </Link>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 hover:bg-electricBlue hover:text-black"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdownMenu;
