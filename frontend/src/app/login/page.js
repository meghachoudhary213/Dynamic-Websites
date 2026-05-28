"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Sun, Moon, ArrowRight, Sparkles, Award } from 'lucide-react';

export default function LoginPage() {
  const [siteLightMode, setSiteLightMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const playClickSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
      audio.volume = 0.12;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all email and password credentials.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess('🎉 Welcome back to NextRank! Authorization granted.');
        localStorage.setItem('userToken', data.token);
        
        // Redirect to landing page with auto scroll to dashboard
        setTimeout(() => {
          window.location.href = '/#dynamic_modules';
        }, 1200);
      } else {
        setError(data.message || 'Incorrect email address or password combination.');
      }
    } catch (err) {
      setLoading(false);
      setError('Could not connect to NextRank auth server.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden transition-all duration-1000 matte-gold-theme ${siteLightMode ? 'light-site' : ''}`}>
      {/* 3D Glass & Glow Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="glow-spot-gold top-[-10%] left-[-10%] w-[500px] h-[500px] animate-blob-slow" />
        <div className="glow-spot-gold bottom-[-10%] right-[-10%] w-[500px] h-[500px] animate-blob-medium" />
        <div className="glow-spot-gold top-[40%] left-[30%] w-[600px] h-[600px] animate-blob-slow" />
        
        {/* Float 3D Bubbles */}
        <div className="glass-bubble-gold top-[10%] left-[8%] w-32 h-32 animate-float-slow" />
        <div className="glass-bubble-gold top-[55%] right-[12%] w-24 h-24 animate-float-medium" />
        <div className="glass-bubble-gold bottom-[12%] left-[15%] w-40 h-40 animate-float-slowest" />
        <div className="glass-bubble-gold top-[30%] right-[25%] w-20 h-20 animate-float-medium" />
      </div>

      {/* Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none -z-10" />

      {/* Top Header Controls */}
      <div className="absolute top-6 max-w-7xl w-full px-6 flex justify-between items-center z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center shadow-lg font-royal font-bold text-black text-lg border border-amber-500/30">
            N
          </div>
          <span className="font-royal royal-heading text-lg font-bold tracking-wider text-white select-none">
            NextRank Institute
          </span>
        </Link>

        {/* Light/Dark Toggle */}
        <button
          onClick={() => { playClickSound(); setSiteLightMode(!siteLightMode); }}
          className="p-2.5 rounded-full border border-amber-500/25 bg-amber-500/5 text-amber-500 hover:scale-105 active:scale-95 transition-transform"
          title="Toggle Page Theme"
        >
          {siteLightMode ? <Moon className="w-4 h-4 text-stone-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Main Login Frame Card */}
      <div className="w-full max-w-md royal-frame mt-12 z-10">
        <div className="royal-card p-8 rounded-2xl flex flex-col">
          {/* Logo & Headings */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3 h-3 animate-spin" /> Smart Portal Node
            </div>
            <h2 className="font-royal royal-heading text-3xl font-extrabold tracking-wide mb-2">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Access your Class 6th-12th & JEE/NEET diagnostics desk.
            </p>
          </div>

          {/* Action Status Banner */}
          {error && (
            <div className="p-3 mb-5 border border-red-500/30 bg-red-500/10 text-red-400 text-xs rounded-xl font-medium animate-pulse text-center">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="p-3 mb-5 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs rounded-xl font-medium text-center">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 tracking-wide block">
                Password Key
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm font-medium focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#D4AF37] hover:text-[#c5a028] font-bold transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Remember me toggle checkbox */}
            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded accent-[#D4AF37] cursor-pointer"
                defaultChecked
              />
              <label htmlFor="remember" className="text-[11px] text-slate-300 select-none cursor-pointer font-medium">
                Keep my portal session active (24 hours)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-black tracking-widest uppercase transition-all bg-[#D4AF37] text-black hover:bg-[#C5A028] disabled:opacity-50 hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-t-2 border-black animate-spin" />
              ) : (
                <>
                  Unlock Console <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 pt-6 border-t border-white/5 text-xs text-slate-400">
            Don't have an education account?{" "}
            <Link
              href="/register"
              className="text-[#D4AF37] font-bold hover:underline transition-all"
            >
              Register Here
            </Link>
          </div>
        </div>
      </div>

      {/* City footer stamp */}
      <div className="text-[10px] text-slate-500 font-mono tracking-widest mt-12 text-center select-none uppercase">
        NextRank Secure Node • Sanskardhani Jabalpur
      </div>
    </div>
  );
}
