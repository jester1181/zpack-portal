"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  billing_status?: string;
  suspended_at?: string | null;
}

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  isReady: boolean;
  tokenRestored: boolean;
  showModal: boolean;
  refreshToken: () => void;
  logout: () => void;
  profile: UserProfile | null;
  billingStatus: string | null;
  suspensionDaysRemaining: number | null;
  isLoadingProfile: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [tokenRestored, setTokenRestored] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [billingStatus, setBillingStatus] = useState<string | null>(null);
  const [suspensionDaysRemaining, setSuspensionDaysRemaining] = useState<number | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load token from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setTokenState(storedToken);
    }
    setTokenRestored(true);
    setIsReady(true);
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(newToken);
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      console.log("🔁 Token refreshed:", data.token);
      setToken(data.token);
      setShowModal(false);
    } catch (err) {
      console.error("🔒 Refresh failed:", err);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setProfile(null);
    setBillingStatus(null);
    setSuspensionDaysRemaining(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Profile Fetch & Suspension Countdown
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.warn("⚠️ No token set for profile fetch.");
        setIsLoadingProfile(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("✅ Profile fetched:", data);

        setProfile(data);
        setBillingStatus(data.billing_status || null);

        if (data.suspended_at) {
          const suspendedAt = new Date(data.suspended_at);
          const now = new Date();
        
          const diffMs = now.getTime() - suspendedAt.getTime();
          const elapsedDays = diffMs / (1000 * 60 * 60 * 24); // days as float
          const daysRemaining = Math.max(0, Math.floor(7 - elapsedDays));
        
          console.log("📆 suspended_at:", suspendedAt.toISOString());
          console.log("⏳ suspensionDaysRemaining (floor):", daysRemaining);
        
          setSuspensionDaysRemaining(daysRemaining);
        } else {
          console.log("ℹ️ No suspended_at value found.");
          setSuspensionDaysRemaining(null);
        }
        
      } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
        setProfile(null);
        setBillingStatus(null);
        setSuspensionDaysRemaining(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (tokenRestored && token) {
      fetchProfile();
    }
  }, [tokenRestored, token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isReady,
        tokenRestored,
        showModal,
        refreshToken,
        logout,
        profile,
        billingStatus,
        suspensionDaysRemaining,
        isLoadingProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
