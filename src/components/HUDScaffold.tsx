// src/components/HUDScaffold.tsx

"use client";
import React from "react";

const HUDScaffold = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black text-white">

      {/* Curved Display Background */}
<div
  className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0 pointer-events-none opacity-40"
  style={{
    backgroundImage: "url('/assets/hud/slices/hud-bg-base.png')",
  }}
/>

      {/* HUD Glow Line (optional) */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%] h-2 bg-gradient-to-r from-cyan-500/20 via-cyan-300/70 to-cyan-500/20 rounded-full blur-sm animate-hudScanLine" />

      {/* Frame Ornaments (optional, can be tuned later) */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/30" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/30" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500/30" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/30" />

      {/* HUD Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HUDScaffold;
