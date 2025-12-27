"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

const SteelLayout = ({ children }: Props) => {
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      {/* Brushed Steel Background */}
      <div
        className="bg-steel-texture"
        aria-hidden="true"
      />

      {/* Optional Ambient Glow (subtle radial light effect) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,255,255,0.02), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Content Layer */}
      <main className="relative z-10">{children}</main>
    </div>
  );
};

export default SteelLayout;
