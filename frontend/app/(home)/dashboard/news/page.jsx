"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/headers/Navbar';
import { useAuth } from '@/components/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/utility/PageLoader';
import apiClient from '@/components/lib/api';
import {
  BellSnoozeIcon,
  BookOpenIcon,
  UserIcon,
  CalendarDaysIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';


const NewsItem = ({ item }) => (
  <article className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          {item.title}
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <CalendarDaysIcon className="h-5 w-5 mr-2" />
          <time dateTime={item.created_at}>
            {new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-5 border-b border-gray-200 pb-4">
        <div className="flex items-center">
          <BookOpenIcon className="h-5 w-5 mr-2 text-blue-500" />
          <span>Course: <span className="font-semibold text-gray-800">{item.courseTitle}</span></span>
        </div>
        <div className="flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
          <span>By: <span className="font-semibold text-gray-800">{item.user?.name || 'N/A'}</span></span>
        </div>
      </div>

      <div className="prose prose-blue max-w-none">
        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
          {item.content}
        </p>
      </div>
    </div>

    {item.tags && item.tags.length > 0 && (
      <footer className="bg-gray-50 px-6 sm:px-8 py-3">
        <div className="flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <span key={tag.id} className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
      </footer>
    )}
  </article>
);


function NewsPage() {
  const { user } = useAuth();
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/announcements');
      setNewsItems(response.data);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError("Could not load the latest announcements. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user, fetchNews]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center pt-24"><PageLoader /></div>;
    }

    if (error) {
      return (
        <div className="text-center bg-red-100/70 backdrop-blur-sm p-8 rounded-xl shadow-md border border-red-200">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-xl font-semibold text-red-800">An Error Occurred</h3>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      );
    }

    if (newsItems.length === 0) {
      return (
        <div className="text-center bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200">
          <BellSnoozeIcon className="mx-auto h-12 w-12 text-blue-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">All Quiet for Now</h3>
          <p className="mt-2 text-gray-600">
            There are no news announcements for your courses at the moment.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {newsItems.map(item => (
          <NewsItem key={item.id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen w-full mt-14">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800">
              News & Notifications
            </h1>
            {user?.role === 'professor' && (
              <Link
                href="/dashboard/news/new"
                className="bg-[#4f46e5] text-white font-bold py-2 px-6 rounded-lg 
               shadow-inner hover:shadow-lg text-md
               transition-all duration-200 transform hover:-translate-y-1 hover:scale-105
               active:shadow-inner active:translate-y-0"              >
                + Post New Announcement
              </Link>
            )}
          </header>

          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

export default NewsPage;