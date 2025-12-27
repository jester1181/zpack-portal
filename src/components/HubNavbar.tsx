"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/servers", label: "Servers" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
  { href: "/about", label: "About" },
  { href: "/profile", label: "Profile" },
];

const HubNavbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Floating Logo & Hub Icon Container */}
      <div className="fixed top-4 left-4 z-50 flex flex-col items-start space-y-2">
        {/* Logo */}
        <div className="text-electricBlue text-lg font-bold">ZeroLagHub</div>

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full bg-electricBlue text-black hover:bg-neonGreen transition shadow-md"
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
        <div className="absolute top-[88px] left-4 z-40 w-48 bg-black/90 backdrop-blur border border-electricBlue rounded-md shadow-lg py-3 px-4 space-y-2">
          {links.map(({ href, label }) => (
            <Link
  key={href}
  href={href}
  onClick={() => setOpen(false)}
  className={`block px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
    isActive(href)
      ? "bg-electricBlue text-black font-bold shadow-[0_0_10px_#1f8eff80]"
      : "text-lightGray hover:text-electricBlue hover:bg-darkGray hover:shadow-[0_0_8px_#1f8eff50]"
  }`}
>
  {label}
</Link>

          ))}
        </div>
      )}
    </>
  );
};

export default HubNavbar;
