/* eslint-disable */
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SteelLayout from "@/components/layouts/SteelLayout";
import { useAuth } from "@/context/authContext";
import api from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.login({ identifier, password });
      const token = res.data?.token;

      if (!token) {
        throw new Error("Login failed");
      }

      setToken(token);
      router.push("/dashboard");
    } catch (err: unknown) {
      let message = "Login failed";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SteelLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-darkGray rounded-lg shadow-subtle max-w-sm w-full text-center">
          <Image
            src="/images/zlhlogo_enlarged.png"
            alt="ZeroLagHub Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />

          <h1 className="text-electricBlue text-2xl font-bold mb-4">
            Login
          </h1>

          {error && (
            <div className="mb-4 text-red-500 bg-red-100 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full p-3 bg-black border border-electricBlue rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-black border border-electricBlue rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-electricBlue text-black font-bold rounded hover:bg-electricBlueLight transition"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </SteelLayout>
  );
}
