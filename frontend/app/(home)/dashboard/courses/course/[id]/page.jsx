"use client";

import { useState, useEffect, useCallback, Fragment } from 'react';
import { useAuth } from '@/components/context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import apiClient from '@/components/lib/api';
import Navbar from '@/components/headers/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/utility/PageLoader';
import {
    PencilIcon, TrashIcon, KeyIcon, ArrowDownTrayIcon, PlusIcon,
    UserCircleIcon, BookOpenIcon, FolderIcon, DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const MaterialItem = ({ material, isProfessorOwner, onDelete, onDownload }) => (
    <li className="flex items-center justify-between p-3 transition-colors duration-200 bg-gray-50 rounded-lg hover:bg-gray-100">
        <div className="flex items-center min-w-0">
            <BookOpenIcon className="w-6 h-6 mr-3 text-blue-500 flex-shrink-0" />
            <span className="text-gray-800 font-medium truncate">{material.file_name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <button
                onClick={() => onDownload(material)}
                className="p-2 text-gray-500 rounded-full hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Download"
            >
                <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            {isProfessorOwner && (
                <button
                    onClick={() => onDelete(material.id)}
                    className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Delete"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            )}
        </div>
    </li>
);

function CourseDetailPage({ params }) {
    const { user } = useAuth();
    const { id } = params;

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const isProfessorOwner = user && course && user.id === course.user_id;

    const fetchCourseDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/courses/${id}`);
            setCourse(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load course details. It might not exist or you don't have permission.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCourseDetails();
    }, [fetchCourseDetails]);

    const handlePinChange = async () => {
        if (!confirm('Are you sure you want to generate a new PIN for this course?')) return;

        const toastId = toast.loading('Generating new PIN...');
        try {
            await apiClient.post(`/courses/${id}/change-pin`);
            await fetchCourseDetails(); 
            toast.success('New PIN generated successfully!', { id: toastId });
        } catch (err) {
            toast.error('Failed to change PIN.', { id: toastId });
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('course_id', id);

        setIsUploading(true);
        const toastId = toast.loading('Uploading material...');
        try {
            await apiClient.post('/materials', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchCourseDetails();
            toast.success('Material uploaded successfully!', { id: toastId });
        } catch (err) {
            const message = err.response?.data?.message || 'Upload failed. Please try again.';
            toast.error(message, { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteMaterial = async (materialId) => {
        if (!confirm('Are you sure you want to delete this material?')) return;

        try {
            await apiClient.delete(`/materials/${materialId}`);
            toast.success('Material deleted successfully!');
            setCourse(prev => ({
                ...prev,
                materials: prev.materials.filter(m => m.id !== materialId)
            }));
        } catch (err) {
            toast.error('Failed to delete material.');
        }
    };

    const handleDownloadMaterial = (material) => {
        window.location.href = `${apiClient.defaults.baseURL}/materials/${material.id}/download`;
    };


    if (loading) return <ProtectedRoute><PageLoader /></ProtectedRoute>;
    if (error) return <ProtectedRoute><div className="container mx-auto mt-40 text-center text-red-600">{error}</div></ProtectedRoute>;

    return (
        <ProtectedRoute>
            <Navbar />
            <Toaster position="top-center" />
            <main className="min-h-screen w-full py-16 px-4 md:px-8 mt-14" style={{ backgroundColor: '#D6EBFF' }}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow-lg rounded-xl p-8">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{course.title}</h1>
                                <div className="flex items-center mt-4 text-lg text-gray-600">
                                    <UserCircleIcon className="w-6 h-6 mr-2" />
                                    <span>Professor: {course.professor?.name || 'N/A'}</span>
                                </div>
                                <article className="prose max-w-none mt-6 text-gray-700">
                                    <p>{course.description}</p>
                                </article>

                                {isProfessorOwner && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-800">Professor Actions</h3>
                                        <div className="mt-4 flex flex-wrap gap-4">
                                            <button className="btn-secondary"> <PencilIcon className="w-5 h-5 mr-2" /> Edit Course </button>
                                            <button onClick={handlePinChange} className="btn-secondary"> <KeyIcon className="w-5 h-5 mr-2" /> Change PIN </button>
                                            <button className="btn-danger"> <TrashIcon className="w-5 h-5 mr-2" /> Delete Course </button>
                                        </div>
                                        {course.pin_code && (
                                            <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                                                <p className="text-sm text-gray-700">Current Enrollment PIN: <strong className="font-mono bg-gray-200 px-2 py-1 rounded">{course.pin_code}</strong></p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white shadow-lg rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                        <FolderIcon className="w-7 h-7 mr-2 text-blue-600" />
                                        Materials
                                    </h2>
                                    {isProfessorOwner && (
                                        <label htmlFor="file-upload" className={`btn-primary-small ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <PlusIcon className="w-5 h-5 mr-1" />
                                            Add
                                            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                                        </label>
                                    )}
                                </div>
                                {course.materials && course.materials.length > 0 ? (
                                    <ul className="space-y-3">
                                        {course.materials.map(material => (
                                            <MaterialItem
                                                key={material.id}
                                                material={material}
                                                isProfessorOwner={isProfessorOwner}
                                                onDelete={handleDeleteMaterial}
                                                onDownload={handleDownloadMaterial}
                                            />
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                                        <DocumentDuplicateIcon className="mx-auto h-10 w-10 text-gray-300" />
                                        <p className="mt-2 text-sm text-gray-500">No materials have been uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}

export default CourseDetailPage;