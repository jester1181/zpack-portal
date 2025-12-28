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
        "relative rounded-lg border border-white/10 bg-black/50 p-6 shadow-subtle backdrop-blur-sm",
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4 z-10 relative">
          {icon && <span className="text-xl text-electricBlue">{icon}</span>}
          {title && (
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-electricBlue">
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
