"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";

type BillingStatus = "active" | "inactive" | "past_due" | "canceled" | null;

type UserProfile = {
  billing_status: BillingStatus;
  plan_name: string | null;
  plan_price: number | null;
};

export default function BillingPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleOpenPortal = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/api/billing/portal", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Error opening portal:", err);
      alert("Error opening portal.");
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/api/billing/checkout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        alert("Could not start checkout session.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout session failed.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-6 py-10">
      <div className="bg-gray-800 p-8 rounded shadow max-w-md w-full text-center">
        <h1 className="text-3xl text-electricBlue font-heading mb-4">Billing</h1>

        {loading ? (
          <p className="text-lightGray">Loading...</p>
        ) : profile?.billing_status === "active" ? (
          <>
            <p className="text-green-400 mb-2 font-medium">
              ✅ Your account is in good standing.
            </p>
            <p className="text-lightGray mb-6">
              You&apos;re subscribed to{" "}
              <strong>{profile.plan_name || "ZerolagHub Basic"}</strong> – $
              {(profile.plan_price ?? 10).toFixed(2)} / month
            </p>
            <button
              onClick={handleOpenPortal}
              className="bg-neonGreen hover:bg-electricBlue transition text-black font-semibold px-5 py-2 rounded"
            >
              Manage Subscription
            </button>
          </>
        ) : (
          <>
            <p className="text-yellow-400 font-semibold mb-2">
              ⚠️ Your account is not active.
            </p>
            <p className="text-lightGray mb-4">
              Subscribe to activate your hosting plan.
            </p>
            <button
              onClick={handleCheckout}
              className="bg-electricBlue text-black font-semibold px-5 py-2 rounded hover:bg-neonGreen transition"
            >
              Subscribe Now – $10/month
            </button>
          </>
        )}
      </div>
    </div>
  );
}
