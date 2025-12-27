// components/FramedHUDBox.tsx
"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const FramedHUDBox = ({ title, children, className }: Props) => {
  return (
    <div className={clsx(
      "relative border border-cyan-500 bg-darkGray/80 text-white rounded-md p-5 shadow-lg",
      "before:absolute before:-top-2 before:left-4 before:h-2 before:w-6 before:bg-cyan-500",
      "after:absolute after:-bottom-2 after:right-4 after:h-2 after:w-6 after:bg-cyan-500",
      "hover:shadow-cyan-500/50 transition-all duration-300",
      className
    )}>
      {title && (
        <h2 className="text-xs uppercase tracking-wide text-cyan-400 mb-3">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default FramedHUDBox;
