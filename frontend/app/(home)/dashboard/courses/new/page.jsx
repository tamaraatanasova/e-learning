"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/headers/Navbar";
import { useAuth } from "@/components/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import apiClient from "@/components/lib/api";

function AddCoursePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/courses", formData);
      router.push(`/course/${response.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "An error occurred while creating the course."
      );
    } finally {
      setLoading(false);
    }
  };

  if (user && user.role !== "professor") {
    return (
      <ProtectedRoute>
        <Navbar />
        <main className="container mx-auto mt-20">
          <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow-md text-center">
            🚫 You do not have permission to view this page.
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#D6EBFF] to-[#F0F4FF] p-6 mt-10">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
            📚 Create a New Course
          </h1>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 transition-transform hover:scale-[1.01]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Course Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter a course title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Course Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Provide a short description of the course..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#D6EBFF] text-black font-semibold !rounded-xl !shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 
                          5.373 0 12h4zm2 5.291A7.962 
                          7.962 0 014 12H0c0 3.042 1.135 
                          5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Course"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

export default AddCoursePage;
