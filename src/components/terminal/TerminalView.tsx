"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

type TerminalViewProps = {
  welcomeMessage?: string;
  wsUrl?: string;
  enableInput?: boolean;
  onSend?: ((send: ((data: string) => void) | null) => void) | null;
  onStatus?: ((status: "idle" | "connecting" | "open" | "closed" | "error") => void) | null;
};

export default function TerminalView({
  welcomeMessage = "Terminal ready. Awaiting connection...",
  wsUrl,
  enableInput = false,
  onSend = null,
  onStatus = null,
}: TerminalViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const onSendRef = useRef<typeof onSend>(onSend);
  const onStatusRef = useRef<typeof onStatus>(onStatus);

  useEffect(() => {
    onSendRef.current = onSend;
  }, [onSend]);

  useEffect(() => {
    onStatusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const terminal = new Terminal({
      cursorBlink: false,
      scrollback: 2000,
      fontSize: 13,
      disableStdin: !enableInput,
    });
    const fitAddon = new FitAddon();
    const inputDisposable = enableInput
      ? terminal.onData((data) => {
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(data);
          }
        })
      : null;

    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);
    fitAddon.fit();
    terminal.writeln(welcomeMessage);

    terminalRef.current = terminal;

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (inputDisposable) {
        inputDisposable.dispose();
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (onSendRef.current) onSendRef.current(null);
      terminalRef.current?.dispose();
      terminalRef.current = null;
    };
  }, [welcomeMessage, enableInput]);

  useEffect(() => {
    if (!wsUrl || !terminalRef.current || socketRef.current) {
      if (!wsUrl && onSendRef.current) onSendRef.current(null);
      if (!wsUrl && onStatusRef.current) onStatusRef.current("idle");
      return;
    }

    if (onStatusRef.current) onStatusRef.current("connecting");
    terminalRef.current.writeln("Connecting to stream...");
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    const send = (data: string) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(data);
      }
    };
    if (onSendRef.current) onSendRef.current(send);

    socket.addEventListener("message", (event) => {
      terminalRef.current?.writeln(String(event.data));
    });

    socket.addEventListener("open", () => {
      terminalRef.current?.writeln("Connected.");
      if (onStatusRef.current) onStatusRef.current("open");
    });

    socket.addEventListener("close", () => {
      terminalRef.current?.writeln("Connection closed.");
      if (onSendRef.current) onSendRef.current(null);
      if (onStatusRef.current) onStatusRef.current("closed");
    });

    socket.addEventListener("error", () => {
      terminalRef.current?.writeln("Connection error.");
      if (onStatusRef.current) onStatusRef.current("error");
    });
  }, [wsUrl]);

  return <div ref={containerRef} className="h-full w-full" />;
}
