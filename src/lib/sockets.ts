"use client";

type SocketConfig = {
  url: string;
  protocols?: string | string[];
};

export const createSocket = ({ url, protocols }: SocketConfig) => {
  if (typeof window === "undefined") {
    throw new Error("WebSocket can only be created in the browser.");
  }

  return new WebSocket(url, protocols);
};
