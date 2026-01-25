"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import SteelLayout from "@/components/layouts/SteelLayout";
import api from "@/lib/api";
import apiClient from "@/lib/api-client";
type Server = {
  id: string;
  name: string;
  type: "GAME" | "DEV";
  status: "Running" | "Stopped" | "Provisioning" | "Offline" | "Host Offline";
  runtime: string;
  flavor: string;
  version: string;
  agentStatus: "online" | "offline" | "unknown";
  agentIp?: string;
  hostStatus: "Online" | "Offline";
};

const ServersPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Server | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hostMenuId, setHostMenuId] = useState<string | null>(null);
  const [hostActionId, setHostActionId] = useState<string | null>(null);

  const normalizeType = (value: unknown): Server["type"] => {
    if (typeof value === "string") {
      const upper = value.toUpperCase();
      if (upper === "GAME" || upper === "DEV") {
        return upper as Server["type"];
      }
    }
    return "GAME";
  };

  const normalizeAgentStatus = (value: unknown): Server["agentStatus"] => {
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (lower === "online") return "online";
      if (lower === "offline") return "offline";
    }
    return "unknown";
  };

  const normalizeServer = (server: Record<string, unknown>): Server => {
    const id =
      (server.id as string) ||
      (server.uuid as string) ||
      (server._id as string) ||
      (server.name as string) ||
      "unknown";
    const name =
      (typeof server.name === "string" && server.name) ||
      (typeof server.displayName === "string" && server.displayName) ||
      "Unnamed Server";
    const type = normalizeType(server.type ?? server.kind ?? server.category);
    const statusRaw =
      server.status ?? server.state ?? server.powerState ?? server.health;
    const hostStatusRaw = server.hostStatus ?? server.host_status;
    const agentStatusRaw =
      server.agentStatus ??
      server.agent_status ??
      (server.agent && (server.agent as { status?: string }).status);
    const agentStatus = normalizeAgentStatus(agentStatusRaw);
    const hostStatusValue =
      typeof hostStatusRaw === "string" ? hostStatusRaw.toLowerCase() : "";
    const hostStatus =
      hostStatusValue === "online" || hostStatusValue === "up"
        ? "Online"
        : hostStatusValue === "offline" || hostStatusValue === "down"
          ? "Offline"
          : agentStatus === "online"
            ? "Online"
            : "Offline";
    const statusValue = typeof statusRaw === "string" ? statusRaw.toLowerCase() : "";
    const status =
      typeof statusRaw === "string" && statusValue.length > 0
        ? statusValue === "running"
          ? "Running"
          : statusValue === "installing"
            ? "Provisioning"
            : statusValue === "idle" || statusValue === "stopped"
              ? "Stopped"
              : statusValue === "offline"
                ? "Offline"
                : statusValue === "host offline"
                  ? "Host Offline"
                  : "Stopped"
        : type === "DEV"
          ? agentStatus === "online"
            ? "Running"
            : "Offline"
          : agentStatus === "offline"
            ? "Host Offline"
            : "Stopped";

    return {
      id,
      name,
      type,
      status,
      runtime: (server.runtime as string) || "Unknown",
      flavor: (server.flavor as string) || "Unknown",
      version: (server.version as string) || "Unknown",
      agentStatus,
      agentIp:
        (server.agentIp as string) ||
        (server.agent_ip as string) ||
        (server.hostIp as string) ||
        (server.host_ip as string) ||
        (server.ip as string) ||
        (server.nodeIp as string) ||
        (server.node_ip as string) ||
        undefined,
      hostStatus,
    };
  };

  useEffect(() => {
    let mounted = true;

    const loadServers = async () => {
      try {
        const response = await api.listServers();
        const payload = response?.data?.servers ?? response?.data ?? [];
        const normalized = Array.isArray(payload)
          ? payload.map((server: Record<string, unknown>) => normalizeServer(server))
          : [];
        if (mounted) {
          setServers(normalized);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError("Failed to load servers.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadServers();
    const handleFocus = () => {
      loadServers();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      mounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, []);


  const groupedServers = useMemo(() => {
    return {
      GAME: servers.filter((server) => server.type === "GAME"),
      DEV: servers.filter((server) => server.type === "DEV"),
    };
  }, [servers]);

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleHostAction = async (server: Server, action: "start" | "stop" | "restart") => {
    try {
      setHostActionId(server.id);
      setError(null);
      await apiClient.post(`/api/servers/${server.id}/host/${action}`);
    } catch {
      setError("Failed to update host state.");
    } finally {
      setHostActionId(null);
      setHostMenuId(null);
    }
  };

  const iconForServer = (server: Server) => {
    if (server.type === "GAME") {
      return "mdi:minecraft";
    }
    return "mdi:code-tags";
  };

  return (
    <SteelLayout>
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-heading text-electricBlue">Servers</h1>
          <p className="text-sm text-lightGray">
            Read-only overview of server contexts. Operational actions live in System View.
          </p>
        </div>

        <div className="space-y-10">
          {isLoading && (
            <div className="rounded-lg border border-white/10 bg-black/30 p-6 text-sm text-lightGray">
              Loading servers...
            </div>
          )}
          {!isLoading && error && (
            <div className="rounded-lg border border-dangerRed/40 bg-dangerRed/10 p-6 text-sm text-dangerRed">
              {error}
            </div>
          )}
          {(["GAME", "DEV"] as const).map((group) => (
            <section key={group} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {group === "GAME" ? "Game Servers" : "Development Servers"}
                </h2>
                <span className="text-xs uppercase tracking-widest text-lightGray">
                  {group}
                </span>
              </div>

              <div className="space-y-4">
                {!isLoading && !error && groupedServers[group].length === 0 && (
                  <div className="rounded-lg border border-white/10 bg-black/20 p-5 text-sm text-lightGray">
                    No servers in this group yet.
                  </div>
                )}
                {groupedServers[group].map((server) => {
                  const isExpanded = expandedId === server.id;
                  return (
                    <div
                      key={server.id}
                      className="rounded-lg border border-white/10 bg-black/30 p-5 shadow-subtle"
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpanded(server.id)}
                        className="flex w-full items-center justify-between gap-4 text-left bg-transparent p-0 hover:bg-white/5 rounded-md transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-darkGray text-electricBlue">
                            <Icon icon={iconForServer(server)} width="26" height="26" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-white">{server.name}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-lightGray">
                              <span className="rounded-full border border-white/10 px-2 py-0.5 uppercase">
                                {server.type}
                              </span>
                              <span>Status: {server.status}</span>
                              <span>Host: {server.hostStatus}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-lightGray">
                          <Icon
                            icon="mdi:chevron-down"
                            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            width="20"
                            height="20"
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-lightGray">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-lightGray">
                                {server.type === "GAME" ? "Game" : "Runtime"}
                              </p>
                              <p className="text-white">{server.runtime}</p>
                            </div>
                            {server.type !== "DEV" && (
                              <div>
                                <p className="text-xs uppercase tracking-widest text-lightGray">
                                  Flavor
                                </p>
                                <p className="text-white">{server.flavor}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs uppercase tracking-widest text-lightGray">
                                Version
                              </p>
                              <p className="text-white">{server.version}</p>
                            </div>
                          </div>
                          <div className="mt-5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => toggleExpanded(server.id)}
                                className="text-xs uppercase tracking-widest text-lightGray hover:text-electricBlue transition"
                              >
                                Collapse
                              </button>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setHostMenuId((current) =>
                                      current === server.id ? null : server.id
                                    )
                                  }
                                  className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-lightGray hover:border-white/40 transition"
                                >
                                  Host
                                </button>
                                {hostMenuId === server.id && (
                                  <div className="absolute left-0 top-[110%] z-10 min-w-[200px] rounded-lg border border-white/10 bg-black/90 p-2 shadow-subtle">
                                    <button
                                      type="button"
                                      onClick={() => handleHostAction(server, "start")}
                                      disabled={hostActionId === server.id}
                                      className="w-full rounded-md px-3 py-2 text-left text-sm text-lightGray hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                      Start Host
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleHostAction(server, "stop")}
                                      disabled={hostActionId === server.id}
                                      className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-lightGray hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                      Stop Host
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleHostAction(server, "restart")}
                                      disabled={hostActionId === server.id}
                                      className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-lightGray hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                      Restart Host
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeleteTarget(server)}
                                      className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-dangerRed hover:bg-white/10 transition"
                                    >
                                      Delete Server
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Link
                              href={{
                                pathname:
                                  server.type === "GAME"
                                    ? "/servers/console/game"
                                    : "/servers/console/dev",
                                query: { serverId: server.id },
                              }}
                              className="rounded-md bg-electricBlue px-4 py-2 text-sm font-semibold text-black hover:bg-electricBlueLight transition"
                            >
                              Open Console
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-darkGray p-6 shadow-subtle">
            <h2 className="text-lg font-semibold text-white">Delete server?</h2>
            <p className="mt-2 text-sm text-lightGray">
              This will permanently delete{" "}
              <span className="text-white">{deleteTarget.name}</span>. Are you sure?
            </p>
            {error && (
              <p className="mt-3 text-sm text-dangerRed">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-lightGray hover:border-white/30 transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsDeleting(true);
                  setError(null);
                  try {
                    await apiClient.delete(`/api/containers/${deleteTarget.id}`);
                    setServers((current) =>
                      current.filter((server) => server.id !== deleteTarget.id)
                    );
                    setDeleteTarget(null);
                  } catch {
                    setError("Failed to delete server.");
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="rounded-md bg-dangerRed px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SteelLayout>
  );
};

export default ServersPage;
