"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import SteelLayout from "@/components/layouts/SteelLayout";
import api from "@/lib/api";
type Server = {
  id: string;
  name: string;
  type: "GAME" | "DEV";
  status: "Running" | "Stopped" | "Provisioning";
  uptime: string;
  runtime: string;
  flavor: string;
  version: string;
  hostStatus: "Online" | "Offline";
};

const ServersPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeType = (value: unknown): Server["type"] => {
    if (typeof value === "string") {
      const upper = value.toUpperCase();
      if (upper === "GAME" || upper === "DEV") {
        return upper as Server["type"];
      }
    }
    return "GAME";
  };

  const normalizeStatus = (value: unknown): Server["status"] => {
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (lower === "running") return "Running";
      if (lower === "stopped" || lower === "offline") return "Stopped";
      if (lower === "provisioning" || lower === "starting" || lower === "deploying") {
        return "Provisioning";
      }
    }
    return "Provisioning";
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
      server.status ?? server.state ?? server.powerState ?? server.uptime ?? server.health;
    let status = normalizeStatus(statusRaw);
    const agentStatusRaw =
      server.agentStatus ??
      server.agent_status ??
      (server.agent && (server.agent as { status?: string }).status);
    const agentStatusValue =
      typeof agentStatusRaw === "string" ? agentStatusRaw.toLowerCase() : "";
    const hostStatus =
      agentStatusValue === "online" ||
      agentStatusValue === "connected" ||
      agentStatusValue === "healthy" ||
      agentStatusValue === "ok"
        ? "Online"
        : "Offline";
    const uptime =
      (typeof server.uptime === "string" && server.uptime) ||
      (status === "Running" ? "Online" : "Stopped");
    if (status === "Provisioning" && typeof uptime === "string") {
      const uptimeLower = uptime.toLowerCase();
      if (uptimeLower.includes("stopped") || uptimeLower.includes("offline")) {
        status = "Stopped";
      }
    }

    return {
      id,
      name,
      type,
      status,
      uptime,
      runtime: (server.runtime as string) || "Unknown",
      flavor: (server.flavor as string) || "Unknown",
      version: (server.version as string) || "Unknown",
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
    return () => {
      mounted = false;
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
                              {server.uptime &&
                                server.uptime.toLowerCase() !==
                                  server.status.toLowerCase() &&
                                server.uptime.toLowerCase() !==
                                  server.status.toLowerCase().replace("running", "online") && (
                                  <span>{server.uptime}</span>
                                )}
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
                            <button
                              type="button"
                              onClick={() => toggleExpanded(server.id)}
                              className="text-xs uppercase tracking-widest text-lightGray hover:text-electricBlue transition"
                            >
                              Collapse
                            </button>
                            <Link
                              href={`/servers/${server.id}`}
                              className="rounded-md bg-electricBlue px-4 py-2 text-sm font-semibold text-black hover:bg-electricBlueLight transition"
                            >
                              System View
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
    </SteelLayout>
  );
};

export default ServersPage;
