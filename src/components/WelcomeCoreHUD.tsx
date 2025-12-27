"use client";

import React from "react";
import { Icon } from "@iconify/react";

const WelcomeCoreHUD: React.FC<{ username: string }> = ({ username }) => {
  return (
    <div className="relative rounded-2xl p-6 border border-cyan-500/20 bg-black/30 shadow-[0_0_20px_#00fff722] backdrop-blur-md overflow-hidden">

      {/* Border Flow Animation Layer */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-0">
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/20 animate-borderFlow" />
      </div>

      {/* HUD Content */}
      <div className="relative z-10 text-center">
        <div className="flex justify-center items-center gap-2 mb-1">
          <Icon icon="mdi:account-circle-outline" fontSize={28} className="text-cyan-300" />
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-cyan-200">Welcome Back</h2>
        </div>
        <h3 className="text-xl font-bold text-electricBlue drop-shadow-[0_0_4px_#1f9fff88]">
          {username}
        </h3>
        <p className="text-sm text-lightGray mt-1">Your hub is connected and stable.</p>
      </div>

      {/* Keyframe style */}
      <style jsx>{`
        @keyframes borderFlow {
          0% {
            box-shadow: 0 0 8px rgba(0, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 12px rgba(0, 255, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 8px rgba(0, 255, 255, 0.1);
          }
        }
        .animate-borderFlow {
          animation: borderFlow 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomeCoreHUD;
