"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/headers/Navbar';
import apiClient from '@/components/lib/api'; 
import PageLoader from '@/components/utility/PageLoader';
import { BookOpenIcon, PlusIcon } from '@heroicons/react/24/outline';


function MYCourses() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/my-courses');
      setCourses(response.data);
    } catch (err) {
      console.error("Failed to fetch my courses:", err);
      setError("Could not load your courses. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyCourses();
    }
  }, [user, fetchMyCourses]);


  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center pt-24"><PageLoader /></div>;
    }

    if (error) {
      return (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      );
    }

    if (courses.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="p-6 flex flex-col flex-grow">
                <h5 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h5>
                <p className="text-gray-600 text-sm mb-4">
                  Professor: {course.professor?.name || 'N/A'}
                </p>
                <p className="text-gray-700 flex-grow mb-6">
                  {course.description.substring(0, 100)}
                  {course.description.length > 100 ? '...' : ''}
                </p>
                <Link
                  href={`/dashboard/courses/course/${course.id}`}
                  className="mt-auto block text-center w-full bg-[#4f46e5] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Course
                </Link>
              </div>
              {user?.role === 'professor' && (
                <div className="bg-gray-50 text-gray-700 text-sm p-3 text-center border-t border-gray-200">
                  Enrollment PIN: <strong className="font-mono bg-gray-200 px-2 py-1 rounded">{course.pin_code}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200">
        <BookOpenIcon className="mx-auto h-12 w-12 text-blue-400" />
        <h3 className="mt-4 text-xl font-semibold text-gray-800">No Courses Found</h3>
        {user?.role === 'professor' ? (
          <p className="mt-2 text-gray-600">
            You haven't created any courses yet. Click "Create New" to get started.
          </p>
        ) : (
          <p className="mt-2 text-gray-600">
            You are not enrolled in any courses. Go to "All Courses" to find a course to enroll in.
          </p>
        )}
      </div>
    );
  };


  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen w-full py-16 px-4 md:px-8 mt-14" style={{ backgroundColor: '#D6EBFF' }}>
        <div className="container mx-auto">
          <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800">
              My Courses
            </h1>
            {user?.role === 'professor' && (
              <Link
                href="/dashboard/courses/new"
                className="sm:mt-0 inline-flex items-center justify-center gap-2 bg-[#4f46e5] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5" />
                Create New Course
              </Link>
            )}
          </header>

          {renderContent()}
        </div>
      </main>
    </ProtectedRoute>
  );
}

export default MYCourses;