"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

type TerminalViewProps = {
  welcomeMessage?: string;
};

export default function TerminalView({
  welcomeMessage = "Terminal ready. Awaiting connection...",
}: TerminalViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const terminal = new Terminal({
      cursorBlink: true,
      scrollback: 2000,
      fontSize: 13,
    });
    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);
    fitAddon.fit();
    terminal.writeln(welcomeMessage);

    terminalRef.current = terminal;

    return () => {
      terminalRef.current?.dispose();
      terminalRef.current = null;
    };
  }, [welcomeMessage]);

  return <div ref={containerRef} className="h-full w-full" />;
}
