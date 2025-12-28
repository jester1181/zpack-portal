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
    <div
      className={clsx(
        "relative rounded-md border border-white/10 bg-darkGray/80 p-5 text-white shadow-subtle",
        className
      )}
    >
      {title && (
        <h2 className="mb-3 text-xs uppercase tracking-wide text-electricBlue">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default FramedHUDBox;
