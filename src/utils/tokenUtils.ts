// src/utils/tokenUtils.ts
"use client";

import axios from "axios";

const isBrowser = typeof window !== "undefined";

export const getAccessToken = async (): Promise<string | null> => {
  if (!isBrowser) {
    return null;
  }

  const storedToken = window.localStorage.getItem("token");
  if (!storedToken) return null;

  try {
    // Optional: validate token here
    return storedToken;
  } catch (err) {
    console.error("Failed to validate token:", err);
    return null;
  }
};

export const refreshAccessToken = async (): Promise<string | null> => {
  if (!isBrowser) {
    return null;
  }

  try {
    const res = await axios.post("https://api.zerolaghub.com/oauth/token", {
      grant_type: "refresh_token",
      refresh_token: window.localStorage.getItem("refresh_token"),
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    });

    const { access_token, refresh_token } = res.data;
    window.localStorage.setItem("token", access_token);
    window.localStorage.setItem("refresh_token", refresh_token);
    return access_token;
  } catch (err) {
    console.error("❌ Failed to refresh token:", err);
    return null;
  }
};
