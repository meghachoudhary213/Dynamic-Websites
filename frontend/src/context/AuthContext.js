"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-verify session on mount
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('userToken');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        const res = await fetch(`${API_URL}/api/auth/user/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        const data = await res.json();
        
        if (data.success && data.user) {
          // Recover full profile if saved in localStorage or use lightweight verify data
          const savedProfile = localStorage.getItem('userProfile');
          const fullProfile = savedProfile ? JSON.parse(savedProfile) : data.user;
          setUser({ ...data.user, ...fullProfile });
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Failed to verify session:', err);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password })
      });
      const data = await res.json();

      if (data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        
        if (data.role === 'admin' || data.role === 'super_admin') {
          localStorage.setItem('admin_token', data.token);
        }
      }
      return data;
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Could not connect to authentication server.' };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();

      if (data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        
        if (data.role === 'admin' || data.role === 'super_admin') {
          localStorage.setItem('admin_token', data.token);
        }
      }
      return data;
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, message: 'Could not connect to registration server.' };
    }
  };

  // Reset password helper
  const resetPassword = async (email, phone, otp, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          phone,
          otp,
          newPassword
        })
      });
      return await res.json();
    } catch (err) {
      console.error('Password reset error:', err);
      return { success: false, message: 'Failed to reach backend reset service.' };
    }
  };

  // Generate OTP helper
  const generateOtp = async (email, phone) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), phone })
      });
      return await res.json();
    } catch (err) {
      console.error('Generate OTP error:', err);
      return { success: false, message: 'Could not connect to OTP verification engine.' };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token,
      login,
      register,
      resetPassword,
      generateOtp,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
