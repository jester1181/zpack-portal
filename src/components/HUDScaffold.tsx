// src/components/HUDScaffold.tsx

"use client";
import React from "react";

const HUDScaffold = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-center bg-cover opacity-40 pointer-events-none"
        style={{
          backgroundImage: "url('/textures/hdsteel-bg.webp')",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HUDScaffold;
