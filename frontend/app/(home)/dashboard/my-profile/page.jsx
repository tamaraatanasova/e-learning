"use client";

import { useState, useEffect, useReducer } from "react";
import Navbar from "@/components/headers/Navbar";
import { useAuth } from "@/components/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import apiClient from "@/components/lib/api";
import FaceRegistrationModal from "@/components/modals/FaceRegistrationModal";
import {
  PencilSquareIcon,
  CheckCircleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { toast, Toaster } from "react-hot-toast";

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_USER_DATA":
      return { ...state, name: action.payload.name, email: action.payload.email };
    case "RESET_PASSWORD_FIELDS":
      return { ...state, password: "", password_confirmation: "" };
    default:
      return state;
  }
};

export default function MyProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, dispatch] = useReducer(formReducer, {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (user) {
      dispatch({
        type: "SET_USER_DATA",
        payload: { name: user.name || "", email: user.email || "" },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.password_confirmation) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);

    const dataToSubmit = { name: formData.name };
    if (formData.password) {
      dataToSubmit.password = formData.password;
      dataToSubmit.password_confirmation = formData.password_confirmation;
    }

    try {
      await apiClient.put("/user/update", dataToSubmit);
      refreshUser && (await refreshUser());
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      dispatch({ type: "RESET_PASSWORD_FIELDS" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = async () => {
    toast.success("Face ID registered successfully!");
    refreshUser && (await refreshUser());
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (isEditing && user) {
      dispatch({ type: "SET_USER_DATA", payload: { name: user.name, email: user.email } });
      dispatch({ type: "RESET_PASSWORD_FIELDS" });
    }
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <Navbar />
        <main className="flex justify-center items-center h-screen" style={{ backgroundColor: "#f9fafb" }}>
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-4"
            style={{ borderColor: "#3b82f6 transparent transparent transparent" }}
          ></div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="container mx-auto mt-25 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3" style={{ color: "#111827" }}>
              <Cog6ToothIcon className="h-10 w-10" style={{ color: "#3b82f6" }} />
              Account Settings
            </h1>
            <p className="mt-2 text-lg" style={{ color: "#4b5563" }}>
              Manage your profile, password, and biometric settings.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="md:col-span-1">
              <div className="p-6 rounded-xl shadow-lg text-center" style={{ backgroundColor: "#ffffff" }}>
                <div className="relative inline-block mb-4">
                  <UserCircleIcon className="h-24 w-24" style={{ color: "#d1d5db" }} />
                  <span
                    className="absolute bottom-0 right-0 block h-5 w-5 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: user.face_embedding ? "#4ade80" : "#9ca3af" }}
                  />
                </div>
                <h2 className="text-xl font-semibold" style={{ color: "#111827" }}>
                  {user.name}
                </h2>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  {user.email}
                </p>
              </div>
            </aside>

            <div className="md:col-span-2 space-y-8">
              <section className="p-6 rounded-xl shadow-lg space-y-6" style={{ backgroundColor: "#ffffff" }}>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: "#111827" }}>
                    <UserCircleIcon className="h-7 w-7" style={{ color: "#3b82f6" }} />
                    Profile Information
                  </h2>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-1 text-sm font-medium transition"
                    style={{ color: "#2563eb" }}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium" style={{ color: "#111827" }}>
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                      style={{
                        backgroundColor: isEditing ? "#ffffff" : "#f3f4f6",
                        borderColor: "#d1d5db",
                        color: "#111827",
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium" style={{ color: "#111827" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                      style={{ backgroundColor: "#f3f4f6", borderColor: "#d1d5db", color: "#111827" }}
                    />
                  </div>

                  {isEditing && (
                    <>
                      <hr className="border-gray-300" />
                      <div className="space-y-4">
                        <p className="text-sm" style={{ color: "#6b7280" }}>
                          Update your password (optional).
                        </p>
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium" style={{ color: "#111827" }}>
                            New Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                            style={{ borderColor: "#d1d5db", color: "#111827", backgroundColor: "#ffffff" }}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="password_confirmation"
                            className="block text-sm font-medium"
                            style={{ color: "#111827" }}
                          >
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                            style={{ borderColor: "#d1d5db", color: "#111827", backgroundColor: "#ffffff" }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 rounded-md shadow"
                          style={{
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            opacity: loading ? 0.6 : 1,
                          }}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </section>

              <section className="p-6 rounded-xl shadow-lg space-y-4" style={{ backgroundColor: "#ffffff" }}>
                <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: "#111827" }}>
                  <ShieldCheckIcon className="h-7 w-7" style={{ color: "#3b82f6" }} />
                  Biometric Authentication
                </h2>

                {user.face_embedding ? (
                  <div className="flex items-center gap-2" style={{ color: "#16a34a" }}>
                    <CheckCircleIcon className="h-6 w-6" />
                    <p>Your Face ID is registered and active.</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-gray-600" style={{ color: "#4b5563" }}>
                      You have not registered your face for biometric login.
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 rounded-md shadow flex items-center gap-2"
                      style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
                    >
                      <FaceSmileIcon className="h-5 w-5" />
                      Register Face ID
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <FaceRegistrationModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </ProtectedRoute>
  );
}
