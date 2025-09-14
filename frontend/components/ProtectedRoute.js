"use client";

import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PageLoader from './utility/PageLoader';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        }
    }, [user, loading, router]);

    return children;
};

export default ProtectedRoute;