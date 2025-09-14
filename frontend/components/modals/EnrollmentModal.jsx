"use client";

import { useState } from 'react';
import apiClient from '../lib/api';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function EnrollmentModal({ course, show, onClose, onSuccess }) {
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await apiClient.post('/enroll', {
                pin_code: pin,
            });
            onSuccess(course.id);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid PIN or enrollment failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Enroll in: <span className="text-blue-600">{course.title}</span>
                </h3>
                <p className="text-gray-600 mb-4">
                    Please enter the enrollment PIN provided by your professor.
                </p>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                        Enrollment PIN
                    </label>
                    <input
                        id="pin"
                        type="text"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoFocus
                    />
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#4f46e5] text-white font-semibold !rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Enrolling...' : 'Enroll'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}