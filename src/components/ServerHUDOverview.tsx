// src/components/ServerHUDOverview.tsx
"use client";

import React from "react";

interface Props {
  total: number;
  online: number;
  offline: number;
}

const ServerHUDOverview: React.FC<Props> = ({ total, online, offline }) => {
  const StatBlock = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="text-center px-4 py-3 bg-black/60 rounded border border-cyan-400/10 shadow-inner">
      <h3 className="text-[10px] text-cyan-200 tracking-widest uppercase font-mono mb-1">{label}</h3>
      <div className={`text-3xl font-bold`} style={{ color }}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <StatBlock label="Total Servers" value={total} color="#1f9fff" />
      <StatBlock label="Online" value={online} color="#00ff88" />
      <StatBlock label="Offline" value={offline} color="#ff4d4d" />
    </div>
  );
};

export default ServerHUDOverview;
