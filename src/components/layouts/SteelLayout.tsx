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

      {/* Content Layer */}
      <main className="relative z-10">{children}</main>
    </div>
  );
};

export default SteelLayout;
