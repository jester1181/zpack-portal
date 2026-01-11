"use client";

import apiClient from "@/lib/api-client";
import {
  NESTS_ROUTE,
  EGGS_ROUTE,
  CREATE_SERVER_ROUTE,
  ALLOCATIONS_ROUTE,
} from "@/services/routes";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://10.60.0.245:4000";

export const getApiHealth = async () => {
  // TODO(APIv2): Replace legacy health check path when v2 exposes health.
  const res = await fetch(`${apiBaseUrl}/api/health`, { cache: "no-store" });
  return res.json();
};


export const login = async (payload: { identifier: string; password: string }) => {
  return apiClient.post("/api/auth/login", payload);
};

export const getMe = async (token: string | null) => {
  return apiClient.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const registerAccount = async (payload: Record<string, unknown>) => {
  return apiClient.post("/api/auth/register", payload);
};

export const getProfile = async (token: string | null) => {
  // TODO(APIv2): Replace legacy profile model when v2 ships.
  return apiClient.get("/api/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProfile = async (token: string | null, payload: Record<string, unknown>) => {
  return apiClient.patch("/api/auth/me", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getBillingPortal = async (token: string | null) => {
  // TODO(APIv2): Replace legacy billing portal endpoint when v2 ships.
  return apiClient.post("/api/billing/portal", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getBillingCheckout = async (token: string | null) => {
  // TODO(APIv2): Replace legacy billing checkout endpoint when v2 ships.
  return apiClient.post("/api/billing/checkout", null, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const submitSupportRequest = async (payload: Record<string, unknown>) => {
  // TODO(APIv2): Replace legacy support endpoint when v2 ships.
  return apiClient.post("api/support/create", payload);
};

export const listAnnouncements = async () => {
  // TODO(APIv2): Replace announcements endpoint when v2 ships.
  return apiClient.get("/api/announcements");
};

export const listAuditLogs = async () => {
  // TODO(APIv2): Replace audit log endpoint when v2 ships.
  return apiClient.get("/api/audit");
};

export const listServers = async (token?: string | null) => {
  // TODO(APIv2): Align server listing response shape once v2 schema is finalized.
  return apiClient.get("/api/servers", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const listServerStatuses = async (token: string | null) => {
  // TODO(APIv2): Replace Pterodactyl status endpoint with v2 resources.
  return apiClient.get("/api/environment/server-status", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const runServerAction = async (
  token: string | null,
  uuid: string,
  action: string
) => {
  // TODO(APIv2): Replace Pterodactyl power action with v2 control plane.
  return fetch(`${apiBaseUrl}/servers/${uuid}/${action}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getServer = async (token: string | null, uuid: string) => {
  // TODO(APIv2): Replace Pterodactyl server details with v2 resources.
  return apiClient.get(`/api/servers/${uuid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const upgradeServer = async (
  token: string | null,
  uuid: string,
  payload: Record<string, number>
) => {
  // TODO(APIv2): Replace Pterodactyl upgrade endpoint with v2 resources.
  return apiClient.put(`/api/servers/${uuid}/upgrade`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listNests = async (token: string | null) => {
  // TODO(APIv2): Replace Pterodactyl nests with v2 game catalog.
  return apiClient.get(NESTS_ROUTE, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listEggs = async (token: string | null, nestId: number) => {
  // TODO(APIv2): Replace Pterodactyl eggs with v2 templates.
  return apiClient.get(EGGS_ROUTE(nestId), {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getEggDetails = async (
  token: string | null,
  nestId: number,
  eggId: number
) => {
  // TODO(APIv2): Replace Pterodactyl egg details with v2 templates.
  return apiClient.get(`${EGGS_ROUTE(nestId)}/${eggId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listAllocations = async (token: string | null) => {
  // TODO(APIv2): Replace Pterodactyl allocations with v2 network configs.
  return apiClient.get(ALLOCATIONS_ROUTE, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createServer = async (token: string | null, payload: Record<string, unknown>) => {
  // TODO(APIv2): Replace Pterodactyl server create with v2 resources.
  return apiClient.post(CREATE_SERVER_ROUTE, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
