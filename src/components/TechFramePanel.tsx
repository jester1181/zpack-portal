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
        "relative rounded-lg border border-white/10 bg-gradient-to-br from-[#0f1114] to-[#0b0d11]",
        "p-5 text-white shadow-subtle backdrop-blur-md",
        className
      )}
    >
      <div className="relative z-10">
        {title && (
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-electricBlue">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default TechFramePanel;
