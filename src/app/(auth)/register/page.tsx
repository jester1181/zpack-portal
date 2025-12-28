"use client";

import React, { useState } from "react";
import api from "@/lib/api-client";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await api.post("/auth/register", formData);
            setSuccess(true);
            alert("Registration successful! You can now log in.");
            window.location.href = "/login";
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.error || "Registration failed. Please try again.");
            } else {
                console.error("Unexpected registration error:", err);
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    function isAxiosError(error: unknown): error is import("axios").AxiosError<{ error?: string }> {
        return typeof error === "object" && error !== null && "isAxiosError" in error;
    }

    return (
        <div className="min-h-screen bg-transparent px-6 py-10">
            <div className="p-8 bg-darkGray rounded-lg shadow-subtle max-w-md w-full">
                <h1 className="text-3xl font-heading text-electricBlue mb-6 text-center">
                    Create an Account
                </h1>
                {error && (
                    <p className="text-red-500 bg-red-100 p-2 rounded mb-4">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="mb-4 rounded bg-electricBlue/10 p-2 text-electricBlue">
                        Registration successful!
                    </p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lightGray mb-1">First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                        />
                    </div>
                    <div>
                        <label className="block text-lightGray mb-1">Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                        />
                    </div>
                    <div>
                        <label className="block text-lightGray mb-1">Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                        />
                    </div>
                    <div>
                        <label className="block text-lightGray mb-1">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                        />
                    </div>
                    <div>
                        <label className="block text-lightGray mb-1">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                        />
                    </div>
                    <div>
                        <label className="block text-lightGray mb-1">Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-electricBlue text-black font-bold rounded hover:bg-electricBlueLight transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        

        </div>
    );
};

export default Register;
