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
    <div className="rounded border border-white/10 bg-black/60 px-4 py-3 text-center shadow-subtle">
      <h3 className="mb-1 text-[10px] font-mono uppercase tracking-widest text-electricBlueLight">
        {label}
      </h3>
      <div className={`text-3xl font-bold`} style={{ color }}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <StatBlock label="Total Servers" value={total} color="#1F8EFF" />
      <StatBlock label="Online" value={online} color="#4DA3FF" />
      <StatBlock label="Offline" value={offline} color="#FF5E5E" />
    </div>
  );
};

export default ServerHUDOverview;
