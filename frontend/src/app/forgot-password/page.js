"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Mail, Phone, Lock, Eye, EyeOff, Sun, Moon, 
  ArrowRight, Sparkles, ShieldCheck, Check, X, ShieldAlert 
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [siteLightMode, setSiteLightMode] = useState(false);
  
  // Inputs
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(0);

  // New Password complexity validations
  const isMinLength = newPassword.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isAlphanumeric = hasLetter && hasNumber;
  const hasSymbol = /[^a-zA-Z0-9]/.test(newPassword);
  const isPasswordValid = isMinLength && isAlphanumeric && hasSymbol;
  const isMatching = newPassword && newPassword === confirmPassword;

  const playClickSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
      audio.volume = 0.12;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // Timer countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Request Reset OTP code
  const handleGenerateOtp = async () => {
    playClickSound();
    setError('');
    setSuccess('');

    if (!email || !phone) {
      setError('Please provide both your registered Email and Mobile Number.');
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
        setOtpValue(data.otp);
        setCountdown(60);
        setSuccess(`🔑 Simulated Reset OTP successfully generated! Code: ${data.otp}`);
      } else {
        setError(data.message || 'Failed to generate reset OTP code.');
      }
    } catch (err) {
      setError('Could not connect to NextRank OTP engine.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!isPasswordValid) {
      setError('Your new password does not satisfy our complexity requirements.');
      setLoading(false);
      return;
    }

    if (!isMatching) {
      setError('Passwords do not match. Please verify confirmation field.');
      setLoading(false);
      return;
    }

    if (!otpSent) {
      setError('Request OTP verification code before resetting password.');
      setLoading(false);
      return;
    }

    if (!otp) {
      setError('Enter verification OTP to authorize credentials change.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          phone,
          otp,
          newPassword
        })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess('🎉 Password successfully updated! Redirecting to login desk...');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1800);
      } else {
        setError(data.message || 'Reset failed. Verify email and input fields.');
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to reach backend reset service.');
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
        <div className="glass-bubble-gold top-[5%] left-[8%] w-32 h-32 animate-float-slow" />
        <div className="glass-bubble-gold top-[52%] right-[12%] w-24 h-24 animate-float-medium" />
        <div className="glass-bubble-gold bottom-[10%] left-[15%] w-40 h-40 animate-float-slowest" />
        <div className="glass-bubble-gold top-[25%] right-[22%] w-20 h-20 animate-float-medium" />
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

      {/* Main Forgot Password Frame Card */}
      <div className="w-full max-w-lg royal-frame mt-20 z-10">
        <div className="royal-card p-8 rounded-2xl flex flex-col">
          {/* Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37] animate-bounce" /> Account Recovery Node
            </div>
            <h2 className="font-royal royal-heading text-3xl font-extrabold tracking-wide mb-2">
              Reset Password
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Recover student portal locks with Email and Mobile OTP authorization codes.
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
          <form onSubmit={handleResetSubmit} className="space-y-4">
            
            {/* Row Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                  Registered Email
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

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                  Registered Mobile
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

            {/* OTP Generator row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                  Verify Recovery OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP Code"
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

            {/* OTP simulated display box */}
            {otpSent && otpValue && (
              <div className="p-2 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] rounded-lg font-mono text-center flex items-center justify-center gap-2 animate-bounce">
                🔒 Simulated SMS: Reset verification OTP is <strong className="text-white text-sm bg-black px-2 py-0.5 rounded border border-amber-500/20">{otpValue}</strong>
              </div>
            )}

            {/* Split row Create New Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                  Create New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 alphanumeric/symbol"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 tracking-wide block">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Match new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Toggle show/hide password buttons */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] text-slate-400 hover:text-white font-semibold transition-colors"
              >
                {showPassword ? "Hide Passwords Key" : "Reveal Passwords Key"}
              </button>
            </div>

            {/* Visual Checklist Container */}
            <div className="p-3 bg-stone-900/40 border border-white/5 rounded-xl text-[10px] space-y-2">
              <span className="font-semibold text-slate-400 uppercase tracking-widest block">
                Verification Guidelines:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <span className={`flex items-center gap-1 font-medium ${isMinLength ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {isMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} Min 6 Characters
                </span>
                <span className={`flex items-center gap-1 font-medium ${isAlphanumeric ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {isAlphanumeric ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} Alphanumeric (a-z, 0-9)
                </span>
                <span className={`flex items-center gap-1 font-medium ${hasSymbol ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {hasSymbol ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} Alphanumeric Symbol (@#$!)
                </span>
                <span className={`flex items-center gap-1 font-medium ${isMatching ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {isMatching ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} Passwords Matching
                </span>
              </div>
            </div>

            {/* Submit Reset Button */}
            <button
              type="submit"
              disabled={loading || !isPasswordValid || !isMatching}
              className="w-full py-3.5 rounded-xl text-sm font-black tracking-widest uppercase transition-all bg-[#D4AF37] text-black hover:bg-[#C5A028] disabled:opacity-40 hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-t-2 border-black animate-spin" />
              ) : (
                <>
                  Authorize Password Reset <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 pt-6 border-t border-white/5 text-xs text-slate-400">
            Back to account locks?{" "}
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
