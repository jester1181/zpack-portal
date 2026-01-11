"use client";

import React, { useEffect, useState, Suspense } from "react";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";

function UpgradeServer() {
  const params = useSearchParams();
  const uuid = params.get("uuid");
  const { token } = useAuth();

  const [memory, setMemory] = useState(1024);
  const [disk, setDisk] = useState(10240);
  const [cpu, setCpu] = useState(100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uuid) return;
    const fetchServerInfo = async () => {
      try {
        const response = await api.getServer(token, uuid);
          

        const { limits } = response.data;
        setMemory(limits.memory);
        setDisk(limits.disk);
        setCpu(limits.cpu);
      } catch {
        toast.error("Failed to load server info.");
      }
    };

    fetchServerInfo();
  }, [uuid, token]);

  const handleUpgrade = async () => {
    if (!uuid) return;

    setLoading(true);
    try {
      await api.upgradeServer(token, uuid, { memory, disk, cpu });

      toast.success("Server upgraded successfully!");
    } catch {
      toast.error("Failed to upgrade server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-6 py-10">
      <div className="max-w-screen-sm mx-auto bg-gray-800 p-6 rounded shadow-subtle">
        <h1 className="text-3xl font-heading text-electricBlue mb-4 text-center">Upgrade Server</h1>

        <label className="block text-lightGray mb-2">Memory (MB):</label>
        <input
          type="number"
          value={memory}
          onChange={(e) => setMemory(Number(e.target.value))}
          className="w-full p-2 mb-4 rounded bg-black border border-electricBlue"
        />

        <label className="block text-lightGray mb-2">Disk (MB):</label>
        <input
          type="number"
          value={disk}
          onChange={(e) => setDisk(Number(e.target.value))}
          className="w-full p-2 mb-4 rounded bg-black border border-electricBlue"
        />

        <label className="block text-lightGray mb-2">CPU (%):</label>
        <input
          type="number"
          value={cpu}
          onChange={(e) => setCpu(Number(e.target.value))}
          className="w-full p-2 mb-6 rounded bg-black border border-electricBlue"
        />

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full p-3 bg-electricBlue text-black font-bold rounded hover:bg-electricBlueLight transition"
        >
          {loading ? "Upgrading..." : "Upgrade Server"}
        </button>
      </div>
    </div>
  );
}

// ✅ Wrap with Suspense to avoid Next.js 13 App Router warning
export default function UpgradeServerPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center text-white p-10">Loading Upgrade Form...</div>}>
      <UpgradeServer />
    </Suspense>
  );
}
