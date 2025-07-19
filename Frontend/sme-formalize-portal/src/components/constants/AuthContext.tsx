// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import API_ENDPOINTS from './apiEndpoints'; // Adjust path as needed
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate(); // Get navigate hook for redirection
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Initialize tokens from localStorage, assuming they are stored correctly
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);

    // Use useMemo to create a stable authAxios instance that only re-initializes
    // if the base URL fundamentally changes (which it shouldn't in most apps).
    // Interceptors will handle token updates.
    const authAxios = useMemo(() => {
      
        const instance = axios.create({
            baseURL: API_ENDPOINTS.BASE_URL.URL, // Assuming you define a BASE_API_URL in apiEndpoints.js
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request Interceptor: Attach current access token
        instance.interceptors.request.use(
            (config) => {
                const currentAccessToken = localStorage.getItem('accessToken'); // Get latest token
                if (currentAccessToken) {
                    config.headers.Authorization = `Bearer ${currentAccessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor: Handle token refresh on 401
        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                // If it's a 401 and not a retry already (to prevent infinite loops)
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true; // Mark as retried
                    const currentRefreshToken = localStorage.getItem('refreshToken');

                    if (!currentRefreshToken) {
                        // No refresh token, or refresh token already invalid, force logout
                        handleLogout(); // This will navigate to login
                        return Promise.reject(error);
                    }

                    try {
                        const refreshResponse = await axios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
                            refresh: currentRefreshToken,
                        });

                        const { access: newAccessToken, refresh: newRefreshToken } = refreshResponse.data;

                        // Store new tokens
                        localStorage.setItem('accessToken', newAccessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);
                        
                        // Update state (will trigger dependent effects like fetchUser)
                        setAccessToken(newAccessToken);
                        setRefreshToken(newRefreshToken);

                        // Retry the original failed request with the new access token
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return instance(originalRequest); // Use the same authAxios instance
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        handleLogout(); // Force logout on refresh failure
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [navigate]); // navigate is a dependency if used inside useMemo


    // Logout function
    const handleLogout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        navigate('/login'); // Use navigate for cleaner routing
    }, [navigate]); // Dependency on navigate

    // Function to fetch user data
    const fetchUser = useCallback(async () => {
        setIsLoading(true); // Start loading before fetching user
        const currentAccessToken = localStorage.getItem('accessToken'); // Get the latest token from localStorage

        if (!currentAccessToken) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            // Use the authAxios instance to fetch user data
            const response = await authAxios.get(API_ENDPOINTS.USERS.CURRENT_USER); // Use your /me endpoint
            console.log("Fetched user data:", response.data);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setUser(null);
            // If fetching user fails due to invalid token, it's caught by interceptor or handled here
            // If it's a 401, the interceptor should trigger a refresh/logout.
            // If it's another error, you might want to specifically handle it or just let the user be null.
        } finally {
            setIsLoading(false);
        }
    }, [authAxios]); // fetchUser depends on authAxios

    // Effect to run once on component mount or when access token changes
    useEffect(() => {
        // Initial fetch of user data
        fetchUser();
    }, [accessToken, fetchUser]); // Dependency on accessToken ensures re-fetch if token changes

    // Login function
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
            const { access, refresh } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            setAccessToken(access); // This will trigger the fetchUser useEffect
            setRefreshToken(refresh);
            // fetchUser will be called by the useEffect due to accessToken change
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            setUser(null);
            setIsLoading(false);
            throw error; // Re-throw to allow component to handle login errors
        }
    };

    // Context value provided to consumers
    const value = {
        user,
        isLoading,
        login,
        logout: handleLogout,
        fetchUser,
        accessToken,
        authAxios, // <--- EXPOSE authAxios HERE! This was the main issue.
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};