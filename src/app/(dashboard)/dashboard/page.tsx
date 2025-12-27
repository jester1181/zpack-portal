"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "@/lib/api-client";
import Link from "next/link";
import toast from "react-hot-toast";
//import { Icon } from "@iconify/react";

import "react-circular-progressbar/dist/styles.css";
import MessageBoard from "@/components/MessageBoard";
import BillingSummaryCard from "@/components/BillingSummaryCard";
import AuditLogPreview from "@/components/AuditLogPreview";
//import HudPanel from "@/components/HudPanel";
//import HUDBox from "@/components/HUDBox";
//import ServerHUDOverview from "@/components/ServerHUDOverview";
import RadialStat from "@/components/RadialStat";
//import HUDFramedPanel from "@/components/HUDFramedPanel";
//import SystemControlHUD from "@/components/SystemControlHUD";
import WelcomeCoreHUD from "@/components/WelcomeCoreHUD";
import TechFramePanel from "@/components/TechFramePanel";
//import HUDScaffold from "@/components/HUDScaffold";




type JwtPayload = { email: string };
type ServerStatus = {
  uuid: string;
  name: string;
  status: string;
  resources?: {
    memory_bytes: number;
    disk_bytes: number;
    cpu_absolute: number;
  };
};

const Dashboard = () => {
  const [username, setUsername] = useState("User");
  const [consoleUrl, setConsoleUrl] = useState("https://panel.zerolaghub.com");
  const [serverList, setServerList] = useState<ServerStatus[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [suspensionDaysRemaining, setSuspensionDaysRemaining] = useState<number | null>(null);
  const [accountStatus, setAccountStatus] = useState<string>("active");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
  });

  const selectedStats = serverList.find((s) => s.uuid === selectedServer);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [serversRes, statusRes] = await Promise.all([
        api.get("/api/environment/servers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get<{ statuses: ServerStatus[] }>("/api/environment/server-status", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const servers = serversRes.data.servers || [];
      const statuses = statusRes.data.statuses || [];

      setServerList(statuses);
      setStats({
        total: servers.length,
        online: statuses.filter((s) => s.status === "running").length,
        offline: statuses.filter((s) => s.status !== "running").length,
      });
    } catch {
      // silent fail
    }
  };

  const handlePowerAction = async (action: "start" | "stop" | "restart") => {
    const token = localStorage.getItem("token");
    const toastId = toast.loading(`${action.toUpperCase()}ING all servers...`);
    try {
      if (!token) return;
      await Promise.allSettled(
        serverList.map((s) =>
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/servers/${s.uuid}/${action}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        )
      );
      toast.success(`${action.toUpperCase()}ED all servers`, { id: toastId });
      fetchStatus();
    } catch {
      toast.error(`Failed to ${action} all servers`, { id: toastId });
    } 
  }; 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ssoToken = sessionStorage.getItem("sso_token");
    if (ssoToken) {
      setConsoleUrl(`https://panel.zerolaghub.com/login/token?access_token=${ssoToken}`);
    }
  
    const initialize = async () => {
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const fallbackName = decoded.email?.split("@")[0] || "User";
  
          const profileRes = await api.get("/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const nickname = profileRes.data.nickname;
          const suspendedAt = profileRes.data.suspended_at;
          const status = profileRes.data.billing_status;
  
          setUsername(nickname || fallbackName);
          setAccountStatus(status || "active");
  
          if (suspendedAt) {
            const suspendedDate = new Date(suspendedAt);
            const now = new Date();
            const daysElapsed = Math.floor((now.getTime() - suspendedDate.getTime()) / (1000 * 60 * 60 * 24));
            const daysLeft = 7 - daysElapsed;
            setSuspensionDaysRemaining(daysLeft > 0 ? daysLeft : 0);
          } else {
            setSuspensionDaysRemaining(null);
          }
        } catch {
          const decoded = jwtDecode<JwtPayload>(token);
          const fallbackName = decoded.email?.split("@")[0] || "User";
          setUsername(fallbackName);
        }
      }
  
      try {
        const [serversRes, statusRes] = await Promise.all([
          api.get("/api/environment/servers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get<{ statuses: ServerStatus[] }>("/api/environment/server-status", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        const servers = serversRes.data.servers || [];
        const statuses = statusRes.data.statuses || [];
  
        setServerList(statuses);
  
        // ✅ Set default selected server to first one
        if (statuses.length > 0 && !selectedServer) {
          setSelectedServer(statuses[0].uuid);
        }
  
        setStats({
          total: servers.length,
          online: statuses.filter((s) => s.status === "running").length,
          offline: statuses.filter((s) => s.status !== "running").length,
        });
      } catch {
        // silent fail
      }
  
      const interval = setInterval(fetchStatus, 10000);
      return () => clearInterval(interval);
    };
  
    initialize();
  }, [selectedServer]);
  

return (
  <div className="min-h-screen px-6 pt-24 pb-10">
    <div className="max-w-screen-xl mx-auto flex flex-col gap-10 items-center">
      {/* Welcome Header */}
      <div className="w-full max-w-xl text-center">
        <WelcomeCoreHUD username={username} />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        {/* Account + Activity */}
        <TechFramePanel title="Your Account + Recent Activity">
          <div className="space-y-6">
            <BillingSummaryCard status={accountStatus} daysRemaining={suspensionDaysRemaining ?? undefined} />
            <div>
              <h3 className="text-xs font-mono text-cyan-300 uppercase mb-2 tracking-widest">Recent Activity</h3>
              <AuditLogPreview />
            </div>
          </div>
        </TechFramePanel>

        {/* Server Stats */}
        <TechFramePanel title="Server Management">
          <div className="space-y-6">
            <label className="block text-lightGray text-sm mb-2">Select a Server</label>
            <select
              className="bg-darkGray text-white p-2 rounded w-full"
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
            >
              <option value="">-- Select a Server --</option>
              {serverList.map((s) => (
                <option key={s.uuid} value={s.uuid}>{s.name}</option>
              ))}
            </select>
            {selectedStats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <RadialStat value={selectedStats.resources?.cpu_absolute || 0} label="CPU" color="#00FF88" />
                <RadialStat value={(selectedStats.resources?.memory_bytes || 0) / 1024 / 1024} label="Memory" max={4096} color="#40CFFF" />
                <RadialStat value={(selectedStats.resources?.disk_bytes || 0) / 1024 / 1024} label="Disk" max={5120} color="#FF6B6B" />
              </div>
            )}
          </div>
        </TechFramePanel>

        {/* Message Board */}
        <TechFramePanel title="📣 Message Board">
          <p className="text-sm text-lightGray mb-2">Stay updated with announcements, system alerts, and platform updates.</p>
          <MessageBoard />
        </TechFramePanel>
      </div>

      {/* Bottom Quick Actions */}
      <div className="w-full">
        <TechFramePanel title="⚡ Quick Actions">
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <button onClick={() => handlePowerAction("start")} className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 hover:shadow-[0_0_10px_#00FF88]">Start All</button>
            <button onClick={() => handlePowerAction("stop")} className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 hover:shadow-[0_0_10px_#FFD700]">Stop All</button>
            <button onClick={() => handlePowerAction("restart")} className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600 hover:shadow-[0_0_10px_#40CFFF]">Restart All</button>
            <Link href="/servers/create" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">Create Server</Link>
            <a href={consoleUrl} target="_blank" className="bg-electricBlue text-black px-4 py-2 rounded hover:bg-blue-600">Go to Console</a>
          </div>
        </TechFramePanel>
      </div>
    </div>
  </div>
);


};
  
  export default Dashboard;
  