"use client";

import React from "react";
import { Icon } from "@iconify/react";

const SystemControlHUD: React.FC = () => {
  return (
    <div
      className="relative rounded-lg border border-white/10 bg-black/50 p-6 shadow-subtle"
    >
      <div className="text-center">
        <Icon icon="mdi:radar" fontSize={44} className="mb-3 text-electricBlue/60" />
        <h2 className="mb-1 text-[10px] font-mono uppercase tracking-widest text-electricBlue">
          System Control
        </h2>
        <p className="text-sm text-lightGray">Welcome to the central hub interface.</p>
      </div>
    </div>
  );
};

export default SystemControlHUD;
