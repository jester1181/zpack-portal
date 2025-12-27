"use client";

import TerminalView from "@/components/terminal/TerminalView";

export default function ServerConsole() {
  return (
    <div className="h-[600px] rounded-md bg-black p-2">
      <TerminalView />
    </div>
  );
}
