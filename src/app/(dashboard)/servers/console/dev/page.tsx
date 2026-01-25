"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ServerConsole from "../ServerConsole";

export default function DevConsolePage() {
  return (
    <Suspense fallback={<div className="text-center text-white p-10">Loading Console...</div>}>
      <ServerConsole consoleType="DEV" />
    </Suspense>
  );
}
