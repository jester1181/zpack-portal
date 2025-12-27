"use client";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface RadialStatProps {
  value: number;
  label: string;
  color?: string;
  max?: number;
}

const RadialStat: React.FC<RadialStatProps> = ({ value, label, color = "#00FFF7", max = 100 }) => {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="relative text-center">
      {/* Outer glow ring */}
      <div className="absolute inset-0 z-0 rounded-full shadow-[0_0_20px_4px_rgba(0,255,247,0.2)]" />

      {/* Ring meter */}
      <div className="relative z-10">
        <CircularProgressbar
          value={percent}
          text={`${Math.round(value)}${max === 100 ? "%" : " MB"}`}
          styles={buildStyles({
            pathColor: color,
            trailColor: "#222",
            textColor: "#fff",
            textSize: "16px"
          })}
        />
      </div>

      <p className="text-xs mt-2 uppercase tracking-wide text-cyan-300 font-mono">{label}</p>
    </div>
  );
};

export default RadialStat;
