"use client";

import { useEffect, useState } from "react";
import HubNavbar from "@/components/HubNavbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/authContext";
import { usePathname, useRouter } from "next/navigation";

const bypassRoutes = ["/billing", "/logout", "/account-suspended"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { billingStatus, suspensionDaysRemaining } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isBypassRoute = bypassRoutes.some((route) => pathname?.startsWith(route));
    const isSuspended = billingStatus === "suspended" && suspensionDaysRemaining === 0;

    if (isSuspended && !isBypassRoute) {
      console.warn("🔒 Lockdown triggered. Redirecting to /account-suspended.");
      router.replace("/account-suspended");
    }
  }, [billingStatus, suspensionDaysRemaining, pathname, mounted, router]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
  
      {/* Show HubNavbar only on /dashboard or /servers */}
      {pathname?.startsWith("/dashboard") || pathname?.startsWith("/servers") ? (
        <HubNavbar />
      ) : (
        <Navbar />
      )}
  
      <main className="flex-grow pt-16">{children}</main>
  
      <footer className="bg-darkGray text-foreground text-center py-4">
        <Footer />
      </footer>
    </>
  );
  
}
