"use client";

import React, { useEffect, useState } from "react";

import api from "@/lib/api-client";
import { NESTS_ROUTE, EGGS_ROUTE, CREATE_SERVER_ROUTE, ALLOCATIONS_ROUTE } from "@/services/routes";

// Define types for clarity
type Nest = {
    id: number;
    name: string;
};

type Egg = {
    id: number;
    name: string;
};

type Allocation = {
    id: number;
    ip: string;
    port: number;
};

const CreateServer = () => {
    const [serverName, setServerName] = useState("");
    const [nests, setNests] = useState<Nest[]>([]);
    const [selectedNestId, setSelectedNestId] = useState<number | null>(null);
    const [eggs, setEggs] = useState<Egg[]>([]);
    const [selectedEggId, setSelectedEggId] = useState<number | null>(null);
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [selectedAllocationId, setSelectedAllocationId] = useState<number | null>(null);
    const [memory, setMemory] = useState<number>(1024);
    const [disk, setDisk] = useState<number>(10240);
    const [cpu, setCpu] = useState<number>(100);
    const [startup, setStartup] = useState("");
    const [game, setGame] = useState<string | null>(null);
    const [variant, setVariant] = useState<string | null>(null);
    const [adminPassword, setAdminPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User is not authenticated.");
                return;
            }

            try {
                const nestsResponse = await api.get<Nest[]>(NESTS_ROUTE, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNests(nestsResponse.data);

                const allocationsResponse = await api.get<{ allocations: Allocation[] }>(ALLOCATIONS_ROUTE, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAllocations(allocationsResponse.data.allocations || []);
                setSelectedAllocationId(null); // Reset allocation on reload
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError("Failed to load nests or allocations.");
            }
        };

        fetchData();
    }, []);

    const handleNestChange = async (nestId: number) => {
        setSelectedNestId(nestId);
        const selectedNest = nests.find((nest) => nest.id === nestId);
        setGame(selectedNest ? selectedNest.name : null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User is not authenticated.");
                return;
            }

            const eggsResponse = await api.get<Egg[]>(EGGS_ROUTE(nestId), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEggs(eggsResponse.data);

            if (eggsResponse.data.length > 0) {
                const firstEgg = eggsResponse.data[0];
                setSelectedEggId(firstEgg.id);
                setVariant(firstEgg.name);

                const startupResponse = await api.get(`${EGGS_ROUTE(nestId)}/${firstEgg.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStartup(startupResponse.data.startup_command || "");
            }
        } catch (error) {
            console.error("Error fetching eggs or startup command:", error);
            setError("Failed to load server types or startup command.");
        }
    };

    const handleEggChange = async (eggId: number) => {
        setSelectedEggId(eggId);
        const selectedEgg = eggs.find((egg) => egg.id === eggId);
        setVariant(selectedEgg ? selectedEgg.name : null);

        if (selectedNestId) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User is not authenticated.");
                    return;
                }

                const startupResponse = await api.get(`${EGGS_ROUTE(selectedNestId)}/${eggId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStartup(startupResponse.data.startup_command || "");
            } catch (error) {
                console.error("Error fetching startup command:", error);
                setError("Failed to load startup command.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!serverName || !selectedNestId || !selectedEggId || !selectedAllocationId || !startup || !game || !variant) {
            setError("All required fields must be filled.");
            return;
        }
    
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            const payload = {
                name: serverName,
                nestId: selectedNestId,
                eggId: selectedEggId,
                allocationId: selectedAllocationId,
                memory,
                disk,
                cpu,
                startup,
                game,
                variant,
                ...(game === "Project Zomboid" && { environment: { ADMIN_PASSWORD: adminPassword } }),
            };
    
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User is not authenticated.");
                return;
            }
    
            const response = await api.post(CREATE_SERVER_ROUTE, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.status === 201) {
                setSuccess("Server created successfully!");
                resetForm();
                // Redirect to servers page without reloading
                setTimeout(() => {
                    window.location.href = "/servers";
                }, 1000); // Optional delay
            }
            
        } catch (error) {
            console.error("Error creating server:", error);
            setError("Failed to create server. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    const resetForm = () => {
        setServerName("");
        setSelectedNestId(null);
        setSelectedEggId(null);
        setSelectedAllocationId(null);
        setMemory(1024);
        setDisk(10240);
        setCpu(100);
        setStartup("");
        setGame(null);
        setVariant(null);
        setAdminPassword("");
    };

    return (
        <>
            
            <div className="min-h-screen bg-transparent px-6 py-10">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl font-heading text-electricBlue mb-6">Create a New Server</h1>
                    {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
                    {success && (
                      <p className="mb-4 rounded bg-electricBlue/10 p-2 text-electricBlue">
                        {success}
                      </p>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-lightGray mb-1">Server Name:</label>
                            <input
                                type="text"
                                value={serverName}
                                onChange={(e) => setServerName(e.target.value)}
                                required
                                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                            />
                        </div>
                        <div>
                            <label className="block text-lightGray mb-1">Game:</label>
                            <select
                                value={selectedNestId || ""}
                                onChange={(e) => handleNestChange(Number(e.target.value))}
                                required
                                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                            >
                                <option value="">Select a game</option>
                                {nests.map((nest) => (
                                    <option key={nest.id} value={nest.id}>
                                        {nest.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedNestId && (
                            <div>
                                <label className="block text-lightGray mb-1">Server Type:</label>
                                <select
                                    value={selectedEggId || ""}
                                    onChange={(e) => handleEggChange(Number(e.target.value))}
                                    required
                                    className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                                >
                                    <option value="">Select a server type</option>
                                    {eggs.map((egg) => (
                                        <option key={egg.id} value={egg.id}>
                                            {egg.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-lightGray mb-1">Allocation:</label>
                            <select
                                value={selectedAllocationId || ""}
                                onChange={(e) => setSelectedAllocationId(Number(e.target.value))}
                                required
                                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                            >
                                <option value="">Select an allocation</option>
                                {allocations.map((allocation) => (
                                    <option key={allocation.id} value={allocation.id}>
                                        {allocation.ip}:{allocation.port}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-lightGray mb-1">Memory (MB):</label>
                            <input
                                type="number"
                                value={memory}
                                onChange={(e) => setMemory(Number(e.target.value))}
                                required
                                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                            />
                        </div>
                        <div>
                            <label className="block text-lightGray mb-1">Disk (MB):</label>
                            <input
                                type="number"
                                value={disk}
                                onChange={(e) => setDisk(Number(e.target.value))}
                                required
                                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                            />
                        </div>
                        <div>
                            <label className="block text-lightGray mb-1">CPU (%):</label>
                            <input
                                type="number"
                                value={cpu}
                                onChange={(e) => setCpu(Number(e.target.value))}
                                required
                                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                            />
                        </div>
                        <div>
                            <label className="block text-lightGray mb-1">Startup Command:</label>
                            <input
                                type="text"
                                value={startup}
                                readOnly
                                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                            />
                        </div>
                        {game === "Project Zomboid" && (
                            <div>
                                <label className="block text-lightGray mb-1">Admin Password:</label>
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    required
                                    className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full p-3 bg-electricBlue text-black font-bold rounded hover:bg-electricBlueLight transition"
                        >
                            {loading ? "Creating Server..." : "Create Server"}
                        </button>
                    </form>
                </div>
       

            </div>
        </>
    );
};

export default CreateServer;
