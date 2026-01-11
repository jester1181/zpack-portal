"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";

type ProfileForm = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
};

type ApiMeUser = {
  id?: string;
  email?: string;
  username?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
};

const Profile = () => {
  const { token } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    displayName: "",
  });

  const [original, setOriginal] = useState<ProfileForm>(form);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch user data
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await api.getMe(token);
        const user: ApiMeUser = res.data?.user ?? {};

        const clean: ProfileForm = {
          email: user.email ?? "",
          username: user.username ?? "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          displayName: user.displayName ?? "",
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
  }, [token]);

  // ✏️ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Save handler
  const handleSave = async () => {
    if (!token) return;

    // ✅ Sanitize values
    const trimmed = {
      firstName: form.firstName?.trim() || "User",
      lastName: form.lastName?.trim() || "Updated",
      displayName: form.displayName?.trim() || "",
    };

    // ✅ Prevent whitespace-only names
    if (!trimmed.firstName.trim() || !trimmed.lastName.trim()) {
      return toast.error("First and last name cannot be empty.");
    }

    try {
      toast.dismiss();
      await api.updateProfile(token, trimmed);
      toast.success("Profile updated!");
      setOriginal({
        email: form.email,
        username: form.username,
        firstName: trimmed.firstName,
        lastName: trimmed.lastName,
        displayName: trimmed.displayName,
      });
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
                  className="w-full p-2 bg-darkGray text-white rounded"
                />
              </div>

              {/* FIRST NAME */}
              <div>
                <label className="block text-lightGray mb-1 font-bold">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full p-2 bg-darkGray text-white rounded"
                />
              </div>

              {/* LAST NAME */}
              <div>
                <label className="block text-lightGray mb-1 font-bold">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full p-2 bg-darkGray text-white rounded"
                />
              </div>

              {/* NICKNAME */}
              <div className="md:col-span-2">
                <label className="block text-lightGray mb-1 font-bold">Nickname (Display Name)</label>
                <input
                  type="text"
                  name="displayName"
                  value={form.displayName}
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
