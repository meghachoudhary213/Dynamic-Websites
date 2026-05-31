"use client";

import React, { useEffect, useState } from 'react';
import AuthGuard from '../../../components/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { 
  Server, Database, Activity, Grid, LogOut, ArrowRight, 
  Cpu, Users, ShieldCheck, Terminal, HelpCircle, Layout
} from 'lucide-react';
import { API_URL } from '../../../config';

export default function SuperAdminDashboard() {
  const { user, logout, token } = useAuth();
  const [telemetry, setTelemetry] = useState({
    cpu: "42%",
    memory: "242 MB",
    threads: "3 active",
    dbMode: "Loading...",
    status: "Checking..."
  });

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const res = await fetch(`${API_URL}/api/status`);
        const data = await res.json();
        setTelemetry({
          cpu: "45%",
          memory: "258 MB",
          threads: "4 active",
          dbMode: data.database?.mode || "Local Fallback",
          status: data.status || "ONLINE"
        });
      } catch (err) {
        setTelemetry({
          cpu: "0%",
          memory: "Offline",
          threads: "0 active",
          dbMode: "Connection Refused",
          status: "OFFLINE"
        });
      }
    }

    if (token) {
      loadTelemetry();
    }
  }, [token]);

  return (
    <AuthGuard allowedRoles={['admin', 'super_admin']}>
      <div className={`min-h-screen flex flex-col relative overflow-hidden bg-[#030207] text-slate-100`}>
        {/* Glow Spots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl animate-blob-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-3xl animate-blob-medium" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-rose-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
              👑
            </div>
            <span className="font-mono font-black text-sm tracking-wider uppercase text-white">Super Admin Command Center</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase animate-pulse">
              Super Admin Mode
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 border border-white/10 hover:bg-rose-500/15 hover:text-rose-400 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6 flex flex-col justify-center">
          
          {/* Welcome Banner */}
          <div className="p-8 bg-gradient-to-r from-indigo-950/30 via-rose-950/20 to-slate-950/60 border border-white/5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-400 text-[10px] font-bold tracking-widest uppercase">
                <ShieldCheck className="w-3.5 h-3.5 animate-pulse" /> Security Clearance Granted
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white uppercase font-mono">
                Welcome back, {user?.name || 'Administrator'}!
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Centralized website engine cluster controller. Managed secure nodes.
              </p>
            </div>
            <div className="bg-slate-950/80 border border-white/5 p-4 rounded-2xl text-left font-mono text-[10px] shrink-0 self-start md:self-auto space-y-1">
              <p className="text-slate-300 font-bold">EMAIL: <span className="text-indigo-400">{user?.email}</span></p>
              <p className="text-slate-400">DATABASE: <span className="text-rose-400 font-semibold">{telemetry.dbMode}</span></p>
            </div>
          </div>

          {/* Core Telemetry Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              { label: "Core Compute Node", value: telemetry.cpu, desc: " Tilwara rack stats", icon: Cpu, color: "text-indigo-400" },
              { label: "Active Connections", value: telemetry.threads, desc: "WebSocket push active", icon: Activity, color: "text-rose-400" },
              { label: "Allocation Heap", value: telemetry.memory, desc: "Secure heap memory bounds", icon: Server, color: "text-cyan-400" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl" />
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">{stat.label}</span>
                  <p className={`text-2xl font-black font-mono tracking-tight ${stat.color}`}>{stat.value}</p>
                  <div className="w-8 h-[1px] bg-white/10 my-1" />
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium"><Icon className="w-3.5 h-3.5 shrink-0" /> {stat.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Launcher Panel Frame */}
          <div className="royal-frame w-full">
            <div className="royal-card p-8 rounded-3xl space-y-6 text-center bg-slate-900/10">
              <h3 className="text-lg font-royal royal-heading font-black tracking-wide text-white uppercase">
                Central Launcher Matrix
              </h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                As a Super Administrator, you have full clearance over the flagship swapper dashboard engine. Boot into the dynamic website command center to orchestrate multiple businesses instantly.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                <a 
                  href="/" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-mono text-xs py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-indigo-500/20"
                >
                  <Layout className="w-4 h-4 shrink-0" /> 
                  Nexus Command Center <ArrowRight className="w-4 h-4" />
                </a>

                <a 
                  href="/admin" 
                  className="border border-white/10 bg-slate-950/60 hover:bg-slate-900/60 text-slate-200 hover:text-white font-bold font-mono text-xs py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Terminal className="w-4 h-4 shrink-0" /> 
                  Standalone Admin Router
                </a>
              </div>
            </div>
          </div>

        </main>
      </div>
    </AuthGuard>
  );
}
