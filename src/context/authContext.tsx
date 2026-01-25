"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "@/lib/api";
import { getSessionToken, setSessionToken } from "@/lib/auth/session";

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [billingStatus, setBillingStatus] = useState<string | null>(null);
  const [suspensionDaysRemaining, setSuspensionDaysRemaining] = useState<number | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load token from sessionStorage on initial mount
  useEffect(() => {
    const storedToken = getSessionToken();
    if (storedToken) {
      setTokenState(storedToken);
    }
    setTokenRestored(true);
    setIsReady(true);
  }, []);

  const setToken = (newToken: string | null) => {
    setSessionToken(newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    setToken(null);
    setProfile(null);
    setBillingStatus(null);
    setSuspensionDaysRemaining(null);
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
        const response = await api.getMe(token);
        const user = response.data?.user ?? {};

        console.log("✅ Profile fetched:", user);

        setProfile({
          email: user.email ?? "",
          username: user.username ?? "",
          first_name: user.firstName ?? "",
          last_name: user.lastName ?? "",
          nickname: user.displayName ?? "",
        });
        setBillingStatus(user.billing_status ?? null);

        if (user.suspended_at) {
          const suspendedAt = new Date(user.suspended_at);
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
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          return;
        }
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
