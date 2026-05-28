"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, Sun, Moon, 
  ArrowRight, Sparkles, ShieldCheck, Check, X, ShieldAlert 
} from 'lucide-react';

export default function RegisterPage() {
  const [siteLightMode, setSiteLightMode] = useState(false);
  
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (error) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(error, 'error');
      }
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(success, 'success');
      }
    }
  }, [success]);

  // OTP generator states
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState(''); // For display/testing helper
  const [countdown, setCountdown] = useState(0);

  // Password verification states
  const isMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isAlphanumeric = hasLetter && hasNumber;
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const isPasswordValid = isMinLength && isAlphanumeric && hasSymbol;

  const playClickSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
      audio.volume = 0.12;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // Timer countdown hook
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Request simulated OTP from backend
  const handleGenerateOtp = async () => {
    playClickSound();
    setError('');
    setSuccess('');

    if (!email && !phone) {
      setError('Please provide your Email or Phone Number to request an OTP code.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), phone })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpValue(data.otp); // Save generated OTP so user knows what it is instantly!
        setCountdown(60);
        setSuccess(`🔑 Simulated verification OTP successfully sent to ${email || phone}! Code: ${data.otp}`);
      } else {
        setError(data.message || 'Failed to generate registration OTP.');
      }
    } catch (err) {
      setError('Could not connect to NextRank OTP server.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    setLoading(true);
    setError('');
    setSuccess('');

    // Strict Password validations
    if (!isPasswordValid) {
      setError('Your password does not satisfy our complexity requirements.');
      setLoading(false);
      return;
    }

    // OTP validation
    if (!otpSent) {
      setError('Please request an OTP verification code first.');
      setLoading(false);
      return;
    }

    if (!otp) {
      setError('Please input the 6-digit OTP code received.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email.toLowerCase(),
          phone,
          password,
          otp,
          role: 'student'
        })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess('🎉 Account successfully registered! Auto-logging in...');
        localStorage.setItem('userToken', data.token);

        // Redirect to homepage after success
        setTimeout(() => {
          window.location.href = '/#dynamic_modules';
        }, 1500);
      } else {
        setError(data.message || 'Registration failed. Please verify fields and OTP.');
      }
    } catch (err) {
      setLoading(false);
      setError('Could not connect to NextRank server.');
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
        <div className="glass-bubble-gold top-[7%] left-[5%] w-32 h-32 animate-float-slow" />
        <div className="glass-bubble-gold top-[48%] right-[10%] w-24 h-24 animate-float-medium" />
        <div className="glass-bubble-gold bottom-[8%] left-[12%] w-40 h-40 animate-float-slowest" />
        <div className="glass-bubble-gold top-[25%] right-[20%] w-20 h-20 animate-float-medium" />
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

      {/* Main Register Frame Card */}
      <div className="w-full max-w-lg royal-frame mt-20 z-10">
        <div className="royal-card p-8 rounded-2xl flex flex-col">
          {/* Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" /> Secure Registration Node
            </div>
            <h2 className="font-royal royal-heading text-3xl font-extrabold tracking-wide mb-2">
              Create Account
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Join Jabalpur's premier AI-powered smart glass classroom ecosystem.
            </p>
          </div>

          {/* Action Status Banners */}
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
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Split row Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                  Student Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    placeholder="9827XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                Create Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters, Alphanumeric & Symbolic"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-all"
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
            </div>

            {/* Visual Password Requirement checklist box */}
            <div className="p-3 bg-stone-900/40 border border-white/5 rounded-xl text-[10px] space-y-1.5">
              <span className="font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                Password Security Checklist:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className={`flex items-center gap-1 font-medium ${isMinLength ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {isMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} Min 6 Characters
                </span>
                <span className={`flex items-center gap-1 font-medium ${isAlphanumeric ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {isAlphanumeric ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} Letters & Numbers
                </span>
                <span className={`flex items-center gap-1 font-medium ${hasSymbol ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {hasSymbol ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} Special Symbol (@#$!)
                </span>
              </div>
            </div>

            {/* OTP verification Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                  Verify Mobile OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={!otpSent}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-all disabled:opacity-50"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateOtp}
                disabled={countdown > 0}
                className="py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:scale-[1.02] active:scale-95 disabled:opacity-75 shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                {countdown > 0 ? (
                  `Resend OTP (${countdown}s)`
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Generate OTP
                  </>
                )}
              </button>
            </div>

            {/* OTP display alert helper */}
            {otpSent && otpValue && (
              <div className="p-2 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] rounded-lg font-mono text-center flex items-center justify-center gap-2">
                🔒 Simulated Device Box: Verification OTP key is <strong className="text-white text-sm bg-black px-2 py-0.5 rounded border border-amber-500/20">{otpValue}</strong>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full py-3.5 mt-2 rounded-xl text-sm font-black tracking-widest uppercase transition-all bg-[#D4AF37] text-black hover:bg-[#C5A028] disabled:opacity-40 hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-t-2 border-black animate-spin" />
              ) : (
                <>
                  Register Student Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 pt-6 border-t border-white/5 text-xs text-slate-400">
            Already have an education account?{" "}
            <Link
              href="/login"
              className="text-[#D4AF37] font-bold hover:underline transition-all"
            >
              Sign In Here
            </Link>
          </div>
        </div>
      </div>

      {/* City stamp */}
      <div className="text-[10px] text-slate-500 font-mono tracking-widest mt-12 text-center select-none uppercase">
        NextRank Secure Node • Sanskardhani Jabalpur
      </div>
    </div>
  );
}
