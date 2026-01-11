"use client";

const AUTH_TOKEN_KEY = "auth_token";

export const getSessionToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(AUTH_TOKEN_KEY);
};

export const setSessionToken = (token: string | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const clearSessionToken = () => {
  setSessionToken(null);
};

export { AUTH_TOKEN_KEY };
