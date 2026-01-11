"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";
import SuspensionBanner from "@/components/SuspensionBanner";
import UserDropdownMenu from "@/components/UserDropdownMenu";

const Navbar: React.FC = () => {
  const {
    token,
    logout,
    profile,
    suspensionDaysRemaining,
  } = useAuth();

  const [nickname, setNickname] = useState("User");
  const pathname = usePathname();

  useEffect(() => {
    if (profile?.nickname) {
      setNickname(profile.nickname);
    } else {
      setNickname("User");
    }
  }, [profile]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <SuspensionBanner daysRemaining={suspensionDaysRemaining} />

      <nav className="bg-black/80 backdrop-blur-sm border-b border-electricBlue text-foreground flex items-center justify-between px-6 py-3 sticky top-0 z-50 shadow-subtle">
        {/* Logo */}
        <Link
          href="/"
          className="text-electricBlue text-xl font-bold hover:text-electricBlueLight transition"
        >
          ZeroLagHub
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-4 text-sm">
          {[
            { href: "/", label: "Home" },
            { href: "/features", label: "Features" },
            { href: "/pricing", label: "Pricing" },
            ...(token
              ? [
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/servers", label: "Servers" },
                ]
              : []),
            { href: "/faq", label: "FAQ" },
            { href: "/support", label: "Support" },
            { href: "/about", label: "About" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 py-1 rounded-md transition 
                ${
                  isActive(link.href)
                    ? "text-electricBlue font-bold border-b-2 border-electricBlueLight"
                    : "text-lightGray font-medium hover:text-electricBlue hover:bg-darkGray"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons or User Menu */}
        {token ? (
          <UserDropdownMenu nickname={nickname} onLogout={logout} />
        ) : (
          <div className="hidden md:flex gap-2">
            <Link
              href="/login"
              className="px-3 py-1 rounded-md bg-darkGray text-lightGray font-semibold hover:bg-gray-700 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-3 py-1 rounded-md bg-electricBlue text-black font-semibold hover:bg-electricBlueLight transition"
            >
              Register
            </Link>
          </div>
        )}
      </nav>

      {/* Session Modal */}
    </>
  );
};

export default Navbar;
