"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/authContext";
import UserDropdownMenu from "@/components/UserDropdownMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/servers", label: "Servers" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
  { href: "/about", label: "About" },
];

const HubNavbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { token, logout, profile } = useAuth();
  const [nickname, setNickname] = useState("User");

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    if (profile?.nickname) {
      setNickname(profile.nickname);
    } else if (profile?.username) {
      setNickname(profile.username);
    } else {
      setNickname("User");
    }
  }, [profile]);

  return (
    <>
      {/* Floating Logo & Hub Icon Container */}
      <div className="fixed top-4 left-4 z-50 flex flex-col items-start space-y-2">
        {/* Logo */}
        <div className="text-electricBlue text-lg font-bold">ZeroLagHub</div>

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full bg-electricBlue p-2 text-black transition hover:bg-electricBlueLight"
          aria-label="Toggle Navigation Menu"
        >
          <Icon
            icon="mdi:hubspot"
            width="24"
            height="24"
            className={open ? "rotate-90 transition-transform duration-300" : "transition-transform duration-300"}
          />
        </button>
      </div>

      {/* Dropdown Menu – anchored below logo+button */}
      {open && (
        <div className="absolute left-4 top-[88px] z-40 w-48 rounded-md border border-white/10 bg-black/90 px-4 py-3 backdrop-blur shadow-subtle space-y-2">
          {links.map(({ href, label }) => (
            <Link
  key={href}
  href={href}
  onClick={() => setOpen(false)}
  className={`block rounded px-4 py-2 text-sm font-medium transition-colors duration-200 ${
    isActive(href)
      ? "bg-electricBlue text-black font-bold"
      : "text-lightGray hover:bg-darkGray hover:text-electricBlue"
  }`}
>
  {label}
</Link>

          ))}
        </div>
      )}

      {token && (
        <div className="fixed top-4 right-4 z-50">
          <UserDropdownMenu nickname={nickname} onLogout={logout} />
        </div>
      )}
    </>
  );
};

export default HubNavbar;
