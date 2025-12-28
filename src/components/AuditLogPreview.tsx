"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";

type LogItem = {
  id: number;
  action: string;
  timestamp: string;
  created_at: string;
};

const AuditLogPreview = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/api/audit"); 
        setLogs(res.data.logs || []);
      } catch (err) {
        console.error("Failed to load audit logs", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-darkGray p-4 rounded shadow-subtle">
      <h3 className="text-lg font-bold text-white mb-2">📜 Recent Activity</h3>
      {logs.length === 0 ? (
        <p className="text-lightGray text-sm">No recent activity found.</p>
      ) : (
        <ul className="text-sm text-lightGray space-y-1">
          {logs.slice(0, 5).map((log) => (
            <li key={log.id}>
              • {log.action} <span className="text-xs text-gray-400">({new Date(log.created_at).toLocaleString()})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuditLogPreview;
