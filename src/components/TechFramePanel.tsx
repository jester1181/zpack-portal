// src/components/TechFramePanel.tsx
import React from "react";
import clsx from "clsx";

interface Props {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const TechFramePanel = ({ title, children, className }: Props) => {
  return (
    <div
className={clsx(
  "relative p-5 text-white bg-gradient-to-br from-[#0f1114] to-[#0b0d11]",
  "border border-cyan-400/20 shadow-[0_0_20px_#00ffff33]",
  "backdrop-blur-md overflow-hidden",
  "clip-bevel-frame",
  "transform-gpu rotate-x-[3deg] hover:scale-[1.02] perspective-[1200px]",
  className
)}

    >
      {/* 🔷 Curved Holographic Illusion */}
      <div className="absolute inset-0 z-0 curved-holo-backdrop" />

      {/* Glow Frame Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none before:absolute before:inset-0 before:rounded-md before:border-2 before:border-cyan-400/10 before:shadow-[inset_0_0_30px_#00ffff22] before:content-['']" />

      {/* Bevel Edge */}
      <div className="absolute inset-0 z-0 pointer-events-none after:absolute after:inset-1 after:border-t after:border-l after:border-cyan-500/10 after:rounded-md after:content-['']" />

      {/* Optional Scanning Line */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-scanStripe" />

      {/* Content */}
      <div className="relative z-10">
        {title && (
          <h3 className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-3">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default TechFramePanel;
