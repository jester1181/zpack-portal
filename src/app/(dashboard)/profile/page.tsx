"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    nickname: "",
  });

  const [original, setOriginal] = useState({ ...form });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Decode JWT to check is_admin
    const decoded = jwtDecode<{ is_admin: number }>(token);
    setIsAdmin(decoded?.is_admin === 1);

    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Normalize nulls to empty strings
        const clean = {
          email: res.data.email || "",
          username: res.data.username || "",
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          nickname: res.data.nickname || "",
        };

        setForm(clean);
        setOriginal(clean);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✏️ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Save handler
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // ✅ Sanitize values
    const trimmed = {
      ...form,
      first_name: form.first_name?.trim() || "User",
      last_name: form.last_name?.trim() || "Updated",
      nickname: form.nickname?.trim() || "",
    };

    // ✅ Prevent whitespace-only names
    if (!trimmed.first_name.trim() || !trimmed.last_name.trim()) {
      return toast.error("First and last name cannot be empty.");
    }

    try {
      toast.dismiss();
      await api.put("/api/users/profile", trimmed, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated!");
      setOriginal(trimmed);
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(original);

  return (
    <div className="min-h-screen bg-transparent px-6 py-10">
      <div className="max-w-screen-md mx-auto bg-gray-800 p-6 rounded shadow-subtle">
        <h1 className="text-3xl text-electricBlue font-heading mb-6">👤 Profile</h1>

        {loading ? (
          <p className="text-lightGray">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* EMAIL */}
              <div>
                <label className="block text-lightGray mb-1 font-bold">Email</label>
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!isAdmin}
                  className="w-full p-2 bg-darkGray text-white rounded"
                />
              </div>

              {/* USERNAME */}
              <div>
                <label className="block text-lightGray mb-1 font-bold">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={!isAdmin}
                  className="w-full p-2 bg-darkGray text-white rounded"
                />
              </div>

              {/* FIRST NAME */}
              <div>
                <label className="block text-lightGray mb-1 font-bold">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="w-full p-2 bg-darkGray text-white rounded"
                />
              </div>

              {/* LAST NAME */}
              <div>
                <label className="block text-lightGray mb-1 font-bold">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="w-full p-2 bg-darkGray text-white rounded"
                />
              </div>

              {/* NICKNAME */}
              <div className="md:col-span-2">
                <label className="block text-lightGray mb-1 font-bold">Nickname (Display Name)</label>
                <input
                  type="text"
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  className="w-full p-2 bg-darkGray text-white rounded"
                />
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`px-4 py-2 rounded transition font-semibold ${
                  hasChanges
                    ? "bg-electricBlue text-black hover:bg-electricBlueLight"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
