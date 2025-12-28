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
        "relative rounded-2xl border border-white/10 bg-black/30 p-6 shadow-subtle backdrop-blur-md",
        className
      )}
    >
      {/* Title Section */}
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4 relative z-10">
          {icon && <span className="text-xl text-electricBlue">{icon}</span>}
          {title && (
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-electricBlue">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

    </div>
  );
};

export default HudPanel;
