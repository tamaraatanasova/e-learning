"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/headers/Navbar';
import { useAuth } from '@/components/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import apiClient from '@/components/lib/api';

function CreateNewsPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        course_id: '',
    });
    const [selectedTags, setSelectedTags] = useState([]);

    const [availableTags, setAvailableTags] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await apiClient.get('/tags');
                setAvailableTags(response.data);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
                setError("Could not load tags. Please try refreshing the page.");
            }
        };

        if (user?.role === 'teacher') {
            fetchTags();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleTagChange = (tagId) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tagId)
                ? prevTags.filter(id => id !== tagId)
                : [...prevTags, tagId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.course_id) {
            setError("Please select a course.");
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            tags: selectedTags,
        };

        try {
            await apiClient.post('/news', payload);
            router.push('/news');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while posting the announcement.');
        } finally {
            setLoading(false);
        }
    };

    if (user && user.role !== 'professor') {
        return (
            <ProtectedRoute>
                <Navbar />
                <main className="container mt-5">
                    <div className="alert alert-danger">You do not have permission to access this page.</div>
                </main>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Navbar />
            <main className="container mt-35 mb-4">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <h1 className="mb-4 text-center">Post a New Announcement</h1>
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title" name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="course_id" className="form-label">Course</label>
                                        <select
                                            className="form-select"
                                            id="course_id" name="course_id"
                                            value={formData.course_id}
                                            onChange={handleChange}
                                            required disabled={loading}
                                        >
                                            <option value="" disabled>-- Select a course --</option>
                                            {user?.courses?.map(course => (
                                                <option key={course.id} value={course.id}>{course.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="content" className="form-label">Content</label>
                                        <textarea
                                            className="form-control"
                                            id="content" name="content"
                                            rows="8"
                                            value={formData.content}
                                            onChange={handleChange}
                                            required disabled={loading}
                                        ></textarea>
                                    </div>

                                    {availableTags.length > 0 && (
                                        <div className="mb-4">
                                            <label className="form-label">Tags</label>
                                            <div>
                                                {availableTags.map(tag => (
                                                    <div key={tag.id} className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`tag-${tag.id}`}
                                                            value={tag.id}
                                                            checked={selectedTags.includes(tag.id)}
                                                            onChange={() => handleTagChange(tag.id)}
                                                            disabled={loading}
                                                        />
                                                        <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                                                            {tag.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="bg-[#4f46e5] text-white font-bold py-2 px-6 !rounded-lg 
               !shadow-inner !hover:shadow-lg !text-md
               transition-all duration-200 transform hover:-translate-y-1 hover:scale-105
               active:shadow-inner active:translate-y-0"
                                            disabled={loading}>
                                            {loading ? 'Posting...' : 'Post Announcement'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}

export default CreateNewsPage;