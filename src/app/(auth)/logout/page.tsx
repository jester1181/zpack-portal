"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";

type ErrorResponse = {
    error?: string;
};

function isAxiosError(error: unknown): error is import("axios").AxiosError<ErrorResponse> {
    return typeof error === "object" && error !== null && "isAxiosError" in error;
}

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    await api.post(
                        "/auth/logout",
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                }
            } catch (err: unknown) {
                if (isAxiosError(err)) {
                    console.error("Logout error:", err.response?.data?.error || err.message);
                    alert(err.response?.data?.error || "Logout failed. Please try again.");
                } else {
                    console.error("Unexpected logout error:", err);
                    alert("An unexpected error occurred. Please try again.");
                }
            } finally {
                localStorage.removeItem("token"); // Clear the token regardless of success or failure
                router.push("/"); // Redirect to the home page
            }
        };

        handleLogout();
    }, [router]);

    return (
        <div className="min-h-screen bg-transparent px-6 py-10">
            <p className="text-lightGray text-lg">Logging out...</p>
        </div>
    );
};

export default Logout;
