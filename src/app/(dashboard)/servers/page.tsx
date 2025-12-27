"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api-client";
import GroupedServerList from "@/components/GroupedServerList";
import SteelLayout from "@/components/layouts/SteelLayout";


export type Server = {
  uuid: string;
  name: string;
  game: string;
  variant?: string;
  status?: string;
};

const ServersPage = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [grouped, setGrouped] = useState(true);
  const router = useRouter();

  const actionLabels: Record<string, string> = {
    start: "Starting",
    stop: "Stopping",
    restart: "Restarting",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchAndMergeServers = async () => {
      try {
        const [serverRes, statusRes] = await Promise.all([
          api.get<{ servers: Server[] }>("/api/environment/servers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get<{ statuses: { uuid: string; status: string }[] }>(
            "/api/environment/server-status",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        const rawServers = serverRes.data.servers || [];
        const statuses = statusRes.data.statuses || [];

        const merged = rawServers.map((server) => {
          const match = statuses.find((s) => s.uuid === server.uuid);
          return {
            ...server,
            status: match?.status || "unknown",
          };
        });

        setServers(merged);
      } catch {
        toast.error("Failed to update server status.");
      }
    };

    fetchAndMergeServers();
    const interval = setInterval(fetchAndMergeServers, 10000);
    return () => clearInterval(interval);
  }, [router]);

  const handleConsole = (uuid: string) => {
    const token = sessionStorage.getItem("sso_token");
    if (!token) return toast.error("SSO token missing");

    const url = `https://panel.zerolaghub.com/login/token?access_token=${token}&redirect=/server/${uuid}`;
    window.open(url, "_blank");
  };

  const handleUpgrade = (uuid: string) => {
    router.push(`/servers/upgrade?uuid=${uuid}`);
  };

  const handleAction = async (uuid: string, action: string) => {
    const toastId = toast.loading(`${actionLabels[action]}...`);
    try {
      const token = localStorage.getItem("token");
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/servers/${uuid}/${action}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast.success(`${actionLabels[action]} succeeded`, { id: toastId });
      } else {
        const data = await res.json();
        toast.error(data?.error || "Failed", { id: toastId });
      }
    } catch {
      toast.error("Unexpected error", { id: toastId });
    }
  };

  return (
    <SteelLayout>
      <div className="max-w-screen-lg mx-auto px-6 py-10">
        <h1 className="text-4xl font-heading text-electricBlue mb-6 text-center">
          Your Servers
        </h1>

        {/* Toggle View */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold rounded-l ${
              grouped
                ? "bg-electricBlue text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={() => setGrouped(true)}
          >
            Group by Game
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-r ${
              !grouped
                ? "bg-electricBlue text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={() => setGrouped(false)}
          >
            Flat View
          </button>
        </div>

        {servers.length > 0 ? (
          grouped ? (
            <GroupedServerList
              servers={servers}
              onAction={handleAction}
              onConsole={handleConsole}
              onUpgrade={handleUpgrade}
            />
          ) : (
            <ul className="space-y-4">
              {servers.map((server) => (
                <li
                  key={server.uuid}
                  className="bg-darkGray p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-bold">{server.name}</p>
                    <p className="text-sm text-gray-400">{server.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-electricBlue text-black rounded hover:bg-neonGreen transition"
                      onClick={() => handleConsole(server.uuid)}
                    >
                      Go to Console
                    </button>
                    <button
                      className="px-3 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-600 transition"
                      onClick={() => handleUpgrade(server.uuid)}
                    >
                      Upgrade
                    </button>
                    {["start", "stop", "restart"].map((action) => (
                      <button
                        key={action}
                        onClick={() => handleAction(server.uuid, action)}
                        className="px-3 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                      >
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : (
          <p className="text-center text-lightGray text-lg">No servers found.</p>
        )}

        <div className="text-center mt-10">
          <button
            className="px-6 py-3 bg-electricBlue text-black font-bold rounded hover:bg-neonGreen transition"
            onClick={() => router.push("/servers/create")}
          >
            Create Server
          </button>
        </div>
      </div>
    </SteelLayout>
  );
};

export default ServersPage;
