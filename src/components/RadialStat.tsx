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

const RadialStat: React.FC<RadialStatProps> = ({
  value,
  label,
  color = "#1F8EFF",
  max = 100,
}) => {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="relative text-center">
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

      <p className="mt-2 text-xs font-mono uppercase tracking-wide text-electricBlue">
        {label}
      </p>
    </div>
  );
};

export default RadialStat;
