"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/context/AuthContext';
import Navbar from '@/components/headers/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/utility/PageLoader';
import apiClient from '@/components/lib/api';
import { UserGroupIcon, ChevronDownIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const StudentListItem = ({ student }) => (
    <div className="flex items-center p-3 border-t border-gray-200">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <UserGroupIcon className="w-6 h-6 text-gray-500" />
        </div>
        <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.email}</div>
        </div>
    </div>
);

const CourseStudents = ({ course }) => {
    const [isOpen, setIsOpen] = useState(false);
    const students = course.enrolled_students || [];

    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
            >
                <div className="flex items-center">
                    <AcademicCapIcon className="w-7 h-7 mr-4 text-blue-600"/>
                    <span className="text-lg font-semibold text-gray-800">{course.title}</span>
                </div>
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-4">
                        {students.length} Student(s)
                    </span>
                    <ChevronDownIcon
                        className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                    />
                </div>
            </button>
            {isOpen && (
                <div className="px-5 pb-5">
                    {students.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg">
                             {students.map(student => <StudentListItem key={student.id} student={student} />)}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-6">No students are currently enrolled in this course.</p>
                    )}
                </div>
            )}
        </div>
    );
};


function StudentsPage() {
    const { user } = useAuth();
    const [coursesWithStudents, setCoursesWithStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (user?.role !== 'professor') {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/professor/courses-with-students');
            setCoursesWithStudents(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load student data.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (user && user.role !== 'professor') {
        return (
            <ProtectedRoute>
                <Navbar />
                <main className="container mx-auto mt-40 text-center">
                    <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                    <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
                </main>
            </ProtectedRoute>
        );
    }
    
    const renderContent = () => {
        if (loading) return <PageLoader />;
        if (error) return <p className="text-center text-red-600">{error}</p>;
        if (coursesWithStudents.length === 0) {
            return (
                <div className="text-center py-10">
                    <h3 className="text-xl font-semibold text-gray-700">No Courses Found</h3>
                    <p className="text-gray-500 mt-2">You have not created any courses yet.</p>
                </div>
            );
        }
        return (
            <div className="space-y-4">
                {coursesWithStudents.map(course => (
                    <CourseStudents key={course.id} course={course} />
                ))}
            </div>
        );
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <main className="min-h-screen w-full py-16 px-4 md:px-8 mt-14" style={{ backgroundColor: '#D6EBFF' }}>
                <div className="container mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-800">Enrolled Students</h1>
                        <p className="mt-2 text-lg text-gray-600">View and manage students enrolled in your courses.</p>
                    </header>
                    <div className="max-w-4xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}

export default StudentsPage;