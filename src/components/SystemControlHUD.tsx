"use client";

import React from "react";
import { Icon } from "@iconify/react";

const SystemControlHUD: React.FC = () => {
  return (
    <div
      className="relative bg-black/50 border border-cyan-400/30 shadow-[0_0_25px_#00fff722] p-6 rounded-lg overflow-hidden"
      style={{
        clipPath:
          "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))"
      }}
    >
      {/* Animated Glow Ring */}
      <div className="absolute inset-0 rounded-lg border-2 border-cyan-300 animate-pulse opacity-10 z-0" />

      {/* Animated Background Grid (optional SVG pattern) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#00fff722_1px,transparent_1px)] bg-[size:20px_20px] opacity-5 z-0" />

      {/* Center Radar Ping */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <Icon icon="mdi:radar" fontSize={64} className="text-cyan-400 animate-pulse opacity-20" />
      </div>

      {/* HUD Content */}
      <div className="relative z-20 text-center">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 mb-1">System Control</h2>
        <p className="text-sm text-lightGray">Welcome to the central hub interface.</p>
      </div>
    </div>
  );
};

export default SystemControlHUD;
