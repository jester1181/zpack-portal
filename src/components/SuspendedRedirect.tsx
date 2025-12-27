"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useEffect, useMemo } from "react";

const bypassRoutes = ["/billing", "/logout", "/account-suspended"];

export default function SuspendedRedirect({ children }: { children: React.ReactNode }) {
  const { billingStatus, suspensionDaysRemaining } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isBypassRoute = useMemo(
    () => bypassRoutes.some((route) => pathname?.startsWith(route)),
    [pathname]
  );

  useEffect(() => {
    const isSuspended = billingStatus === "suspended" && suspensionDaysRemaining === 0;
    const hasSeenRedirect = sessionStorage.getItem("seenSuspensionRedirect") === "true";

    if (isSuspended && !isBypassRoute && !hasSeenRedirect) {
      sessionStorage.setItem("seenSuspensionRedirect", "true");
      router.replace("/account-suspended");
    }
  }, [billingStatus, suspensionDaysRemaining, isBypassRoute, router]);

  return <>{children}</>;
}
