"use client";

import React from "react";
import clsx from "clsx";

interface HUDFramedPanelProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const HUDFramedPanel: React.FC<HUDFramedPanelProps> = ({ title, icon, children, className }) => {
  return (
    <div
      className={clsx(
        "relative bg-black/50 rounded-lg overflow-hidden p-6 border border-cyan-400/20 shadow-[0_0_15px_#00fff733] backdrop-blur-sm",
        "before:absolute before:inset-0 before:rounded-lg before:border before:border-cyan-300/10 before:blur-sm before:pointer-events-none",
        "after:absolute after:-top-2 after:-left-2 after:w-6 after:h-6 after:border-t-2 after:border-l-2 after:border-cyan-500",
        "after:content-[''] before:z-0 z-10",
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4 z-10 relative">
          {icon && <span className="text-xl text-electricBlue">{icon}</span>}
          {title && (
            <h2 className="text-[10px] tracking-widest uppercase text-cyan-300 font-mono">
              {title}
            </h2>
          )}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HUDFramedPanel;
