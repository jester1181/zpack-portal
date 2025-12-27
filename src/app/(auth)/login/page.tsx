/* eslint-disable */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "@/context/authContext";
import SteelLayout from "@/components/layouts/SteelLayout"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const router = useRouter();
  const { setToken } = useAuth();

  const fetchCsrfToken = async () => {
    try {
      let csrfToken = Cookies.get("XSRF-TOKEN");

      if (!csrfToken) {
        console.log("⚠️ CSRF Token missing. Fetching a new one...");

        const response = await axios.get("https://api.zerolaghub.com/auth/csrf", {
          withCredentials: true,
        });

        csrfToken = response.data.csrfToken;
        console.log("✅ CSRF Token Retrieved:", csrfToken);
      }

      return csrfToken;
    } catch (error) {
      console.error("❌ Failed to fetch CSRF Token:", error);
      setError("CSRF Token could not be retrieved.");
      return null;
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    try {
      let csrfToken = Cookies.get("XSRF-TOKEN") || await fetchCsrfToken();
      if (!csrfToken) throw new Error("CSRF token missing.");
  
      console.log("✅ Using CSRF Token for Login:", csrfToken);
  
      const response = await axios.post(
        "https://api.zerolaghub.com/auth/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json"
          }
        }
      );
  
      console.log("✅ Login successful!", response.data);
      const token = response.data.token;

      setToken(token);
      sessionStorage.setItem("sso_token", token);

      router.push("/dashboard");

    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        console.warn("⚠️ CSRF Token possibly expired. Retrying login...");
        const newCsrfToken = await fetchCsrfToken();
        if (newCsrfToken) {
          return handleLogin(e);
        }
      }

      console.error("❌ Login failed:", err);
      setError("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("✅ Logging out...");
      await axios.post("https://api.zerolaghub.com/auth/logout", {}, { withCredentials: true });

      console.log("✅ Logged out successfully, clearing CSRF token...");
      Cookies.remove("XSRF-TOKEN", { path: "/" });

      await fetchCsrfToken();
      router.push("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <SteelLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-darkGray rounded-lg shadow-lg max-w-sm text-center">
          <Image
            src="/images/zlhlogo_enlarged.png"
            alt="ZeroLagHub Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h1 className="text-electricBlue text-2xl font-bold mb-4">Login</h1>
          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-lightGray text-left mb-1">Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-neonGreen"
              />
            </div>
            <div>
              <label className="block text-lightGray text-left mb-1">Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-black border border-electricBlue rounded focus:outline-none focus:border-neonGreen"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-electricBlue text-black font-bold rounded hover:bg-neonGreen transition"
            >
              Login
            </button>
          </form>
          </div>
      </div>
    </SteelLayout>
  );
};

export default Login;
