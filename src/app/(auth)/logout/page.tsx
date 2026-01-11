"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/authContext";

const Logout = () => {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <div className="min-h-screen bg-transparent px-6 py-10">
            <p className="text-lightGray text-lg">Logging out...</p>
        </div>
    );
};

export default Logout;
