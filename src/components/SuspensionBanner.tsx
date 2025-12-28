// components/SuspensionBanner.tsx

"use client";

import React from "react";

interface Props {
  daysRemaining: number | null;
}

const SuspensionBanner: React.FC<Props> = ({ daysRemaining }) => {
  if (daysRemaining === null || daysRemaining <= 0) return null;

  return (
    <div className="w-full bg-dangerRed text-white text-center py-2 font-semibold">
      ⚠️ Account suspension in {daysRemaining} day{daysRemaining > 1 ? "s" : ""}
    </div>
  );
};

export default SuspensionBanner;
