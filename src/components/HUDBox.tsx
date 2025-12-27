// src/components/HUDBox.tsx
"use client";

import React from "react";
import clsx from "clsx";

interface HUDBoxProps {
  children: React.ReactNode;
  className?: string;
}

const HUDBox: React.FC<HUDBoxProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "relative bg-black/40 p-6 rounded-lg overflow-hidden border border-cyan-400/20 shadow-[0_0_20px_#00fff733] backdrop-blur-sm",
        className
      )}
    >
      {/* Outer ring glow layer */}
      <div className="absolute inset-0 rounded-lg border border-cyan-500/10 blur-sm z-0 pointer-events-none" />
      {/* Optional additional framing layer */}
      <div className="absolute inset-1 rounded-lg border border-cyan-300/10 z-0 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HUDBox;
