"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "../../../../components/headers/Navbar";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import apiClient from "../../../../components/lib/api";
import { useAuth } from "../../../../components/context/AuthContext";
import PageLoader from "@/components/utility/PageLoader";
import EnrollmentModal from "../../../../components/modals/EnrollmentModal";
import { toast, Toaster } from "react-hot-toast";

export default function AllCoursesPage() {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/courses");
        setCourses(response.data);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCourses();
    else setLoading(false);
  }, [user]);

  const enrolledCourseIds = useMemo(() => {
    return new Set(user?.courses?.map((c) => c.id) || []);
  }, [user]);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.professor &&
        course.professor.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleEnrollSuccess = async (enrolledCourseId) => {
    toast.success("Successfully enrolled in the course!");
    handleModalClose();
    if (refreshUser) {
      await refreshUser();
    }
  };

  const renderContent = () => {
    if (loading) return <PageLoader />;
    if (error) return <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>;
    if (filteredCourses.length === 0) return <div className="bg-blue-100 text-blue-700 p-3 rounded">No courses found.</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.has(course.id);

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="p-6 flex flex-col flex-grow">
                <h5 className="text-xl font-semibold text-gray-800 mb-2">
                  {course.title}
                </h5>
                <h6 className="text-sm text-gray-500 mb-4">
                  Professor: {course.professor?.name || "N/A"}
                </h6>
                <p className="text-gray-600 flex-grow mb-4">
                  {course.description.substring(0, 100)}
                  {course.description.length > 100 ? "..." : ""}
                </p>

                {isEnrolled ? (
                  <Link
                    href={`/course/${course.id}`}
                    className="mt-auto w-full text-center bg-[#4f46e5]  text-white font-semibold py-2 px-4 !rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    View Course
                  </Link>
                ) : (
                  <button
                    onClick={() => handleEnrollClick(course)}
                    className="mt-auto w-full bg-[#4f46e5]  text-white font-semibold py-2 px-4 !rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enroll
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <Toaster position="top-center" />
      <main className="container mx-auto mt-30 px-4 pb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          All Available Courses
        </h1>

        <div className="flex justify-center mb-8">
          <div className="w-full md:w-2/3 lg:w-1/2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by course title or professor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-gray-900 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-400 focus:bg-white placeholder-gray-500 transition-colors duration-300"
              />
            </div>
          </div>
        </div>

        {renderContent()}
      </main>

      <EnrollmentModal
        show={isModalOpen}
        onClose={handleModalClose}
        course={selectedCourse}
        onSuccess={handleEnrollSuccess}
      />
    </ProtectedRoute>
  );
}