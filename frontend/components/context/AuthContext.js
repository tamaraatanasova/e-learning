"use client";
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setUser(null);
            return;
        }

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const response = await apiClient.get('/user');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to refresh user:", error);
            setUser(null);
            localStorage.removeItem('authToken');
            delete apiClient.defaults.headers.common['Authorization'];
            router.push('/signin');
        }
    }, [router]);

    useEffect(() => {
        setLoading(true);
        refreshUser().finally(() => {
            setLoading(false);
        });
    }, [refreshUser]);

    const login = async (credentials) => {
        const response = await apiClient.post('/login', credentials);
        const { access_token, user } = response.data;
        localStorage.setItem('authToken', access_token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser(user);
        router.push('/dashboard');
    };

    const logout = () => {
        apiClient.post('/logout').finally(() => {
            setUser(null);
            localStorage.removeItem('authToken');
            delete apiClient.defaults.headers.common['Authorization'];
            router.push('/signin');
        });
    };


    const contextValue = {
        user,
        setUser,
        loading,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);