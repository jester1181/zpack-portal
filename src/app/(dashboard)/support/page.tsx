"use client";

import React, { useState } from "react";


import api from "@/lib/api-client"; // Import API utility

const Support = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setError("All fields are required.");
            return;
        }

        try {
            const response = await api.post("api/support/create", formData);
            if (response.status === 200) {
                setSuccess("Your support request has been submitted successfully.");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                throw new Error("Failed to submit support request.");
            }
        } catch (err) {
            console.error("Error submitting support request:", err);
            setError("Failed to submit your request. Please try again later.");
        }
    };

    return (
        <>
            
            <div className="min-h-screen bg-transparent px-6 py-10">
                <div className="max-w-screen-md mx-auto">
                    <h1 className="text-4xl font-heading text-electricBlue mb-6 text-center">
                        Contact Support
                    </h1>
                    {error && (
                        <p className="text-red-500 bg-red-100 p-2 rounded mb-4 text-center">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="mb-4 rounded bg-electricBlue/10 p-2 text-center text-electricBlue">
                            {success}
                        </p>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-lightGray mb-1">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
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
                            <label className="block text-lightGray mb-1">Subject:</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                            />
                        </div>
                        <div>
                            <label className="block text-lightGray mb-1">Message:</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={5}
                                required
                                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-electricBlueLight"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-3 bg-electricBlue text-black font-bold rounded hover:bg-electricBlueLight transition"
                        >
                            Submit
                        </button>
                    </form>
                </div>
        

            </div>
        </>
    );
};

export default Support;
