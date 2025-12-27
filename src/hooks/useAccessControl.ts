// src/hooks/useAccessControl.ts

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import api from "@/lib/api-client"; // ✅ Using Axios instead of fetch

export const useAccessControl = (options = { autoRedirect: false }) => {
  const { token } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState<"unknown" | "active" | "suspended" | "past_due">("unknown");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setStatus(data.billing_status ?? "active"); // fallback to active if missing
      } catch (err) {
        console.error("❌ Failed to fetch billing status:", err);
      }
    };

    if (token) fetchStatus();
  }, [token]);

  useEffect(() => {
    if (options.autoRedirect && status === "suspended") {
      router.push("/billing-issue");
    }
  }, [status, options.autoRedirect, router]);

  return {
    billingStatus: status,
    isSuspended: status === "suspended",
    isActive: status === "active",
  };
};
