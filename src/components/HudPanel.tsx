"use client";

import React from "react";
import clsx from "clsx";

interface HudPanelProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const HudPanel: React.FC<HudPanelProps> = ({ title, icon, children, className }) => {
  return (
    <div
      className={clsx(
        "relative bg-black/30 rounded-2xl p-6 border border-cyan-500/20 backdrop-blur-md overflow-hidden",
        "shadow-[0_0_20px_#00fff722]",
        className
      )}
    >
      {/* Animated Glow Border */}
      <div className="absolute inset-0 rounded-2xl border border-cyan-400/10 animate-borderFlow z-0" />

      {/* Signal Dot */}
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping z-10" />

      {/* Title Section */}
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4 relative z-10">
          {icon && <span className="text-xl text-electricBlue">{icon}</span>}
          {title && (
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-cyan-300">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Keyframe Styles */}
      <style jsx>{`
        @keyframes borderFlow {
          0% {
            box-shadow: 0 0 6px rgba(0, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 12px rgba(0, 255, 255, 0.25);
          }
          100% {
            box-shadow: 0 0 6px rgba(0, 255, 255, 0.1);
          }
        }
        .animate-borderFlow {
          animation: borderFlow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HudPanel;
