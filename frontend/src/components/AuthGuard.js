"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export default function AuthGuard({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        window.location.href = '/login';
      } else if (allowedRoles.length > 0 && !allowedRoles.map(r => r.toLowerCase()).includes((user?.role || '').toLowerCase())) {
        // Logged in but unauthorized role
        window.location.href = '/login'; // Redirect back or send to home
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        {/* Glow Spots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="glow-spot-gold top-[25%] left-[25%] w-[400px] h-[400px] animate-blob-slow" />
          <div className="glow-spot-gold bottom-[25%] right-[25%] w-[400px] h-[400px] animate-blob-medium" />
        </div>

        {/* Cinematic Premium Glassmorphic Loader */}
        <div className="royal-frame max-w-xs w-full">
          <div className="royal-card p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative flex items-center justify-center">
              <RefreshCw className="w-10 h-10 text-[#D4AF37] animate-spin" />
              <ShieldCheck className="w-5 h-5 text-white absolute" />
            </div>
            <div className="space-y-1">
              <h3 className="font-royal royal-heading text-lg font-bold text-white tracking-wide">
                Security Shield
              </h3>
              <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                Verifying Authorizations
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not loading, check if authenticated and role is allowed
  const hasAccess = isAuthenticated && (allowedRoles.length === 0 || allowedRoles.map(r => r.toLowerCase()).includes((user?.role || '').toLowerCase()));

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center font-mono">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
