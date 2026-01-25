"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";

type ServerType = "dev" | "game";

type GameCatalog = {
  games: Array<{
    id: string;
    variants: Array<{
      id: string;
      versions: string[];
    }>;
  }>;
};

type DevCatalog = {
  runtimes: Array<{
    id: string;
    versions: string[];
  }>;
};

const CreateServerPage = () => {
  const router = useRouter();
  const [serverType, setServerType] = useState<ServerType>("dev");
  const [runtime, setRuntime] = useState("");
  const [runtimeVersion, setRuntimeVersion] = useState("");
  const [memoryMiB, setMemoryMiB] = useState(2048);
  const [game, setGame] = useState("");
  const [variant, setVariant] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [gameCatalog, setGameCatalog] = useState<GameCatalog | null>(null);
  const [devCatalog, setDevCatalog] = useState<DevCatalog | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchCatalogs = async () => {
      try {
        const [gameResponse, devResponse] = await Promise.all([
          apiClient.get("/api/catalog/game"),
          apiClient.get("/api/catalog/dev"),
        ]);
        if (mounted) {
          setGameCatalog(gameResponse.data);
          setDevCatalog(devResponse.data);
        }
      } catch {
        if (mounted) {
          setError("Failed to load catalog data.");
        }
      } finally {
        if (mounted) setCatalogLoading(false);
      }
    };

    fetchCatalogs();
    return () => {
      mounted = false;
    };
  }, []);

  const gameOptions = useMemo(() => {
    return gameCatalog?.games ?? [];
  }, [gameCatalog]);

  const variantOptions = useMemo(() => {
    const selectedGame = gameOptions.find((item) => item.id === game);
    return selectedGame?.variants ?? [];
  }, [gameOptions, game]);

  const gameVersionOptions = useMemo(() => {
    const selectedVariant = variantOptions.find((item) => item.id === variant);
    return selectedVariant?.versions ?? [];
  }, [variantOptions, variant]);

  const runtimeOptions = useMemo(() => {
    return devCatalog?.runtimes ?? [];
  }, [devCatalog]);

  const runtimeVersionOptions = useMemo(() => {
    const selectedRuntime = runtimeOptions.find((item) => item.id === runtime);
    return selectedRuntime?.versions ?? [];
  }, [runtimeOptions, runtime]);

  useEffect(() => {
    setVariant("");
    setGameVersion("");
  }, [game]);

  useEffect(() => {
    setGameVersion("");
  }, [variant]);

  useEffect(() => {
    setRuntimeVersion("");
  }, [runtime]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (serverType === "dev" && (!runtime || !runtimeVersion)) {
        setError("Select a runtime and version.");
        return;
      }
      if (serverType === "game" && (!game || !variant || !gameVersion)) {
        setError("Select a game, variant, and version.");
        return;
      }
      const payload =
        serverType === "dev"
          ? {
              customerId: "u-dev-001",
              ctype: "dev",
              runtime,
              version: runtimeVersion,
              memoryMiB,
            }
          : {
              customerId: "u-dev-001",
              ctype: "game",
              game,
              variant,
              version: gameVersion,
              memoryMiB,
            };

      await apiClient.post("/api/instances", payload);
      router.push("/servers");
    } catch (err) {
      setError("Failed to create server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-6 py-10">
      <div className="max-w-screen-md mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-heading text-electricBlue">Create Server</h1>
          <p className="mt-2 text-sm text-lightGray">
            Provision a new development or game server.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-dangerRed/40 bg-dangerRed/10 p-3 text-sm text-dangerRed">
            {error}
          </div>
        )}
        {catalogLoading && (
          <div className="rounded-md border border-white/10 bg-black/40 p-3 text-sm text-lightGray">
            Loading catalog...
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-lightGray">Server Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setServerType("dev")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  serverType === "dev"
                    ? "bg-electricBlue text-black"
                    : "border border-white/10 text-lightGray hover:border-white/30"
                }`}
              >
                Dev
              </button>
              <button
                type="button"
                onClick={() => setServerType("game")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  serverType === "game"
                    ? "bg-electricBlue text-black"
                    : "border border-white/10 text-lightGray hover:border-white/30"
                }`}
              >
                Game
              </button>
            </div>
          </div>

          {serverType === "dev" && (
            <>
              <div>
                <label className="mb-2 block text-sm text-lightGray">Runtime</label>
                <select
                  value={runtime}
                  onChange={(event) => setRuntime(event.target.value)}
                  disabled={catalogLoading || runtimeOptions.length === 0}
                  className="w-full rounded-md border border-white/10 bg-black/60 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-electricBlue"
                >
                  <option value="">Select a runtime</option>
                  {runtimeOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-lightGray">Version</label>
                <select
                  value={runtimeVersion}
                  onChange={(event) => setRuntimeVersion(event.target.value)}
                  disabled={!runtime || runtimeVersionOptions.length === 0}
                  className="w-full rounded-md border border-white/10 bg-black/60 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-electricBlue"
                >
                  <option value="">Select a version</option>
                  {[...runtimeVersionOptions].sort((a, b) => b.localeCompare(a)).map(
                    (version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    )
                  )}
                </select>
              </div>
            </>
          )}

          {serverType === "game" && (
            <>
              <div>
                <label className="mb-2 block text-sm text-lightGray">Game</label>
                <select
                  value={game}
                  onChange={(event) => setGame(event.target.value)}
                  disabled={catalogLoading || gameOptions.length === 0}
                  className="w-full rounded-md border border-white/10 bg-black/60 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-electricBlue"
                >
                  <option value="">Select a game</option>
                  {gameOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-lightGray">Variant</label>
                <select
                  value={variant}
                  onChange={(event) => setVariant(event.target.value)}
                  disabled={!game || variantOptions.length === 0}
                  className="w-full rounded-md border border-white/10 bg-black/60 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-electricBlue"
                >
                  <option value="">Select a variant</option>
                  {variantOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-lightGray">Version</label>
                <select
                  value={gameVersion}
                  onChange={(event) => setGameVersion(event.target.value)}
                  disabled={!variant || gameVersionOptions.length === 0}
                  className="w-full rounded-md border border-white/10 bg-black/60 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-electricBlue"
                >
                  <option value="">Select a version</option>
                  {[...gameVersionOptions].sort((a, b) => b.localeCompare(a)).map(
                    (version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    )
                  )}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm text-lightGray">Memory (MiB)</label>
            <input
              type="number"
              min={512}
              step={256}
              value={memoryMiB}
              onChange={(event) => setMemoryMiB(Number(event.target.value))}
              className="w-full rounded-md border border-white/10 bg-black/60 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-electricBlue"
            />
          </div>

          <button
            type="submit"
            disabled={loading || catalogLoading}
            className="rounded-md bg-electricBlue px-5 py-2 text-sm font-semibold text-black hover:bg-electricBlueLight transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Server"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateServerPage;
