"use client";

import React from "react";
import { Icon } from "@iconify/react";

const WelcomeCoreHUD: React.FC<{ username: string }> = ({ username }) => {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-black/30 p-6 shadow-subtle backdrop-blur-md">
      <div className="text-center">
        <div className="mb-1 flex items-center justify-center gap-2">
          <Icon icon="mdi:account-circle-outline" fontSize={28} className="text-electricBlue" />
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-electricBlueLight">
            Welcome Back
          </h2>
        </div>
        <h3 className="text-xl font-bold text-electricBlue">{username}</h3>
        <p className="mt-1 text-sm text-lightGray">Your hub is connected and stable.</p>
      </div>
    </div>
  );
};

export default WelcomeCoreHUD;
