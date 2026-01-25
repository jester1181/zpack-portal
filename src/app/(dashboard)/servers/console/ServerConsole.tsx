"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TerminalView from "@/components/terminal/TerminalView";
import api from "@/lib/api";
import apiClient from "@/lib/api-client";
import axios from "axios";

type ServerConsoleProps = {
  consoleType?: "DEV" | "GAME";
};

export default function ServerConsole({ consoleType = "DEV" }: ServerConsoleProps) {
  const searchParams = useSearchParams();
  const [isStreaming, setIsStreaming] = useState(false);
  const serverId = searchParams.get("serverId");
  const [serverIp, setServerIp] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<"online" | "offline" | "unknown">(
    "unknown"
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const sendRef = useRef<((data: string) => void) | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "open" | "closed" | "error"
  >("idle");
  const [statusState, setStatusState] = useState<string>("unknown");
  const [installStep, setInstallStep] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const handleSendRef = useCallback((sender: ((data: string) => void) | null) => {
    sendRef.current = sender;
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadServer = async () => {
      if (!serverId) {
        setLoadError("Missing server id.");
        return;
      }
      try {
        const [serversResponse, instancesResponse] = await Promise.all([
          api.listServers(),
          api.listInstances(),
        ]);
        const servers = serversResponse?.data?.servers ?? serversResponse?.data ?? [];
        const instances =
          instancesResponse?.data?.rows ?? instancesResponse?.data ?? [];
        const match = Array.isArray(servers)
          ? servers.find((server: { id?: string }) => server.id === serverId)
          : null;
        if (!match) {
          if (mounted) setLoadError("Server not found.");
          return;
        }
        const instanceMatch = Array.isArray(instances)
          ? instances.find((instance: { vmid?: number | string }) => {
              if (instance.vmid === undefined || instance.vmid === null) return false;
              return String(instance.vmid) === String(serverId);
            })
          : null;
        if (mounted) {
          setServerIp(
            typeof match.ip === "string"
              ? match.ip
              : typeof instanceMatch?.ip === "string"
                ? instanceMatch.ip
                : null
          );
          setAgentStatus(
            match.agentStatus === "online"
              ? "online"
              : match.agentStatus === "offline"
                ? "offline"
                : "unknown"
          );
          setLoadError(null);
        }
      } catch {
        if (mounted) setLoadError("Failed to load server details.");
      }
    };

    loadServer();
    return () => {
      mounted = false;
    };
  }, [serverId]);

  const resolvedUrl = useMemo(() => {
    if (!serverIp) return null;
    const wsProtocol =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "wss"
        : "ws";
    const baseUrl = `${wsProtocol}://${serverIp}:18888/console/stream`;
    return serverId ? `${baseUrl}?serverId=${encodeURIComponent(serverId)}` : baseUrl;
  }, [serverId, serverIp]);
  const agentBaseUrl = useMemo(() => {
    if (!serverIp) return null;
    return `//${serverIp}:18888`;
  }, [serverIp]);
  const canConnect = Boolean(resolvedUrl && agentStatus === "online");
  const canSend = isStreaming && connectionStatus === "open" && canConnect;

  useEffect(() => {
    let mounted = true;
    if (consoleType !== "GAME") {
      return () => {
        mounted = false;
      };
    }

    const fetchStatus = async () => {
      try {
        const response = await api.listServers();
        const servers = response?.data?.servers ?? response?.data ?? [];
        const match = Array.isArray(servers)
          ? servers.find((server: { id?: string }) => server.id === serverId)
          : null;
        if (!match) {
          throw new Error("Server not found.");
        }
        if (mounted) {
          setStatusState(typeof match.status === "string" ? match.status : "unknown");
          setInstallStep(
            typeof match.installStep === "string" ? match.installStep : null
          );
          setStatusError(null);
        }
      } catch (error) {
        if (mounted) {
          const message =
            error instanceof Error ? error.message : "Unable to fetch status.";
          setStatusError(message);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [consoleType, serverId]);

  const handleAction = async (action: "start" | "stop" | "restart") => {
    if (!serverId) return;
    try {
      setActionLoading(true);
      await apiClient.post(`/api/servers/${serverId}/game/${action}`);
      setStatusError(null);
      if (consoleType === "GAME") {
        setStatusState("starting");
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data
          ? typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.error || "Action failed."
          : "Action failed.";
      setStatusError(message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="rounded-md bg-black p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-lightGray">
          {consoleType === "GAME" ? "Game Console" : "Dev Console"}
        </p>
        <button
          type="button"
          onClick={() => {
            setIsStreaming(true);
            setConnectionStatus("connecting");
          }}
          disabled={isStreaming || !canConnect}
          className="rounded-md bg-electricBlue px-3 py-1.5 text-xs font-semibold text-black hover:bg-electricBlueLight transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {connectionStatus === "open"
            ? "Connected"
            : isStreaming
              ? "Connecting..."
              : "Open Console"}
        </button>
      </div>
      {loadError && (
        <p className="mb-3 text-xs text-dangerRed">
          {loadError}
        </p>
      )}
      {!loadError && !serverIp && (
        <p className="mb-3 text-xs text-dangerRed">Server IP not available.</p>
      )}
      {!loadError && agentStatus === "offline" && (
        <p className="mb-3 text-xs text-dangerRed">
          Host offline. Console unavailable.
        </p>
      )}
      {!loadError && agentStatus === "online" && !resolvedUrl && (
        <p className="mb-3 text-xs text-dangerRed">Server IP not available.</p>
      )}
      {consoleType === "GAME" && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/10 bg-black/40 px-4 py-3 text-xs text-lightGray">
          <div className="flex flex-wrap items-center gap-3">
            <span className="uppercase tracking-widest">State: {statusState}</span>
            {installStep && <span>Install: {installStep}</span>}
            {statusError && <span className="text-dangerRed">{statusError}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAction("start")}
              disabled={actionLoading || agentStatus !== "online"}
              className="rounded-md bg-electricBlue px-3 py-1.5 text-xs font-semibold text-black hover:bg-electricBlueLight transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {actionLoading ? "Starting..." : "Start"}
            </button>
            <button
              type="button"
              onClick={() => handleAction("restart")}
              disabled={actionLoading || agentStatus !== "online"}
              className="rounded-md border border-electricBlue px-3 py-1.5 text-xs font-semibold text-electricBlue hover:border-electricBlueLight hover:text-electricBlueLight transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Restart
            </button>
            <button
              type="button"
              onClick={() => handleAction("stop")}
              disabled={actionLoading || agentStatus !== "online"}
              className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-lightGray hover:border-white/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Stop
            </button>
          </div>
        </div>
      )}
      <div className="h-[320px] rounded-md bg-black/70 p-2">
        <TerminalView
          wsUrl={isStreaming && resolvedUrl ? resolvedUrl : undefined}
          welcomeMessage="Console ready. Click Open Console to connect."
          enableInput={false}
          onSend={handleSendRef}
          onStatus={setConnectionStatus}
        />
      </div>
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = inputValue.trim();
          if (!trimmed || !sendRef.current) return;
          sendRef.current(`${trimmed}\n`);
          setInputValue("");
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Type a command and press Enter"
          className="flex-1 rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-lightGray focus:outline-none focus:ring-1 focus:ring-electricBlue"
          disabled={!canSend}
        />
        <button
          type="submit"
          className="rounded-md bg-electricBlue px-3 py-2 text-xs font-semibold text-black hover:bg-electricBlueLight transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!canSend}
        >
          Send
        </button>
      </form>
    </div>
  );
}
