"use client";

import axios, { AxiosInstance } from "axios";
import { getSessionToken } from "@/lib/auth/session";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.60.0.245:4000";

const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
