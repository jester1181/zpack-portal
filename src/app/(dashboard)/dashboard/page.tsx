"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/authContext";

const Dashboard = () => {
  const { profile } = useAuth();
  const [apiHealth, setApiHealth] = useState<"ok" | "down">("down");
  const [noticesHeader, setNoticesHeader] = useState("Since your last login");
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [hasLiveUpdate, setHasLiveUpdate] = useState(false);

  const displayName = useMemo(() => {
    return profile?.nickname || profile?.username || "User";
  }, [profile]);

  const notices = useMemo(
    () => [
      {
        id: "notice-maintenance",
        type: "System Notice",
        title: "Scheduled maintenance window",
        body: "Platform updates planned for 02:00–03:00 UTC. No action required.",
        detail:
          "Rolling updates will be applied to the orchestration layer. Existing servers remain online, but provisioning actions may be delayed during the window.",
      },
      {
        id: "notice-billing",
        type: "Warning",
        title: "Billing verification pending",
        body: "Verify your billing profile to avoid provisioning delays.",
        detail:
          "Billing verification is required before any new server allocations are finalized. Update your billing profile to clear the pending status.",
      },
      {
        id: "notice-community",
        type: "Announcement",
        title: "New community templates available",
        body: "Browse the latest curated templates in the server catalog.",
        detail:
          "Community templates now include curated modpacks for Valheim, Rust, and Minecraft. Visit the server catalog to review details.",
      },
    ],
    []
  );

  const [healthStatus] = useState<"healthy" | "degraded" | "issue">("healthy");

  const healthConfig = useMemo(() => {
    if (healthStatus === "issue") {
      return {
        bars: 1,
        color: "bg-dangerRed",
        label: "Critical issues detected",
      };
    }
    if (healthStatus === "degraded") {
      return {
        bars: 3,
        color: "bg-yellow-400",
        label: "Some services degraded",
      };
    }
    return {
      bars: 4,
      color: "bg-emerald-500",
      label: "All systems operational",
    };
  }, [healthStatus]);

  const resources = useMemo(
    () => [
      { id: "srv-101", name: "Valheim - Core", type: "Game", status: "Online" },
      { id: "srv-204", name: "Rust - Staging", type: "Game", status: "Provisioning" },
      { id: "dev-01", name: "Dev Sandbox", type: "Dev", status: "Offline" },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    const checkHealth = async () => {
      try {
        const data = await api.getApiHealth();
        if (mounted && data?.status === "ok") {
          setApiHealth("ok");
        } else {
          setApiHealth("down");
        }
      } catch {
        if (mounted) setApiHealth("down");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const headerTimer = setTimeout(() => {
      setNoticesHeader("Recent notices");
    }, 12000);

    const liveTimer = setTimeout(() => {
      setHasLiveUpdate(true);
      setNoticesHeader("Updated just now");
    }, 22000);

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(liveTimer);
    };
  }, []);

  return (
    <div className="min-h-screen px-6 pt-24 pb-10">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-10">
        <section className="w-full rounded-lg border border-white/10 bg-black/40 px-16 md:px-24 py-6 shadow-subtle">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-2xl font-heading text-white">
              Welcome back, <span className="text-electricBlue">{displayName}</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.3em] text-lightGray">
                System Health
              </span>
              <div className="flex items-end gap-1" title={healthConfig.label}>
                {[1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className={`w-1.5 rounded-sm ${
                      bar <= healthConfig.bars ? healthConfig.color : "bg-white/10"
                    }`}
                    style={{ height: `${6 + bar * 3}px` }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-lg border border-white/10 bg-black/30 p-6 shadow-subtle">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-electricBlue">Notices</h2>
              <span className="text-xs text-lightGray">{noticesHeader}</span>
            </div>
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`rounded-md border border-white/10 bg-darkGray/70 p-4 ${
                    hasLiveUpdate ? "ring-1 ring-electricBlue/40" : ""
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-lightGray">
                    {notice.type}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {notice.title}
                  </p>
                  <p className="mt-2 text-sm text-lightGray">{notice.body}</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setExpandedNoticeId(notice.id)}
                      className="rounded border border-white/10 px-3 py-1 text-[11px] uppercase tracking-widest text-lightGray hover:border-electricBlue hover:text-electricBlue transition"
                    >
                      Expand
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 p-6 shadow-subtle">
            <h2 className="text-lg font-semibold text-electricBlue">Primary Actions</h2>
            <p className="mt-2 text-sm text-lightGray">
              Create a new server when you are ready. Operational actions live in the Servers view.
            </p>
            <Link
              href="/servers/create"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-electricBlue px-4 py-2 text-sm font-semibold text-black hover:bg-electricBlueLight transition"
            >
              Create Server
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-black/30 p-6 shadow-subtle">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-electricBlue">Resource Overview</h2>
            <span className="text-xs text-lightGray">Summary</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-md border border-white/10 bg-darkGray/70 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{resource.name}</p>
                  <span className="text-[11px] uppercase tracking-widest text-lightGray">
                    {resource.type}
                  </span>
                </div>
                <p className="mt-2 text-xs text-lightGray">Status: {resource.status}</p>
                <Link
                  href={`/servers/${resource.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-electricBlue text-electricBlue text-xs font-semibold py-2 hover:bg-electricBlue hover:text-black transition"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {expandedNoticeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 py-10">
          <div className="max-w-2xl w-full rounded-lg border border-white/10 bg-darkGray p-6 shadow-subtle">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-electricBlue">
                Notice Details
              </h3>
              <button
                type="button"
                onClick={() => setExpandedNoticeId(null)}
                className="rounded border border-white/10 px-3 py-1 text-xs uppercase tracking-widest text-lightGray hover:border-electricBlue hover:text-electricBlue transition"
              >
                Close
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {notices
                .filter((notice) => notice.id === expandedNoticeId)
                .map((notice) => (
                  <div
                    key={`${notice.id}-full`}
                    className="rounded-md border border-white/10 bg-black/40 p-4 ring-1 ring-electricBlue/50"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-lightGray">
                      {notice.type}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {notice.title}
                    </p>
                    <p className="mt-2 text-sm text-lightGray">{notice.detail}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
