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
        "relative rounded-lg border border-white/10 bg-black/40 p-6 shadow-subtle backdrop-blur-sm",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HUDBox;
