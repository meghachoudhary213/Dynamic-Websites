"use client";

import React, { useState } from 'react';
import AuthGuard from '../../../components/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { 
  Users, Calendar, Clock, LogOut, CheckCircle, 
  TrendingUp, BarChart2, ShieldAlert, BookOpen, 
  Plus, Edit, Trash2, Award, Zap
} from 'lucide-react';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();

  const classes = [
    { batch: "JEE Advanced Core-A", subject: "Quantum Physics & Mechanics", studentsCount: 42, timing: "08:30 AM - 10:30 AM", avgRating: 9.4 },
    { batch: "NEET Elite Biology-B", subject: "Human Physiology & Genetics", studentsCount: 38, timing: "11:00 AM - 01:00 PM", avgRating: 9.1 },
    { batch: "Class 12th Board Desk", subject: "Electromagnetic Theory", studentsCount: 56, timing: "02:00 PM - 03:30 PM", avgRating: 8.9 }
  ];

  const submissions = [
    { name: "Rahul Deshmukh", task: "Rotational Dynamics Mock 02", score: "112/120", status: "Graded", date: "Today" },
    { name: "Neha Agrawal", task: "Organic Synthesis Mock 04", score: "88/100", status: "Graded", date: "Today" },
    { name: "Vikram Rathore", task: "Genetics Diagnostic Sheets", score: "Pending", status: "Review", date: "Yesterday" }
  ];

  return (
    <AuthGuard allowedRoles={['teacher']}>
      <div className={`min-h-screen flex flex-col relative overflow-hidden bg-[#020704] text-slate-100`}>
        {/* Glow Spots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-3xl" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-amber-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
              💼
            </div>
            <span className="font-mono font-black text-sm tracking-wider uppercase text-white">NextRank Teacher Console</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase">
              Teacher Mode
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
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
          
          {/* Welcome Banner */}
          <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-stone-950/30 to-slate-950/60 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-widest block">Active Session Hub</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white">
                Welcome back, {user?.name || 'Educator Specialist'}!
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Administrative educator terminal. Manage Class rosters and dynamic examinations in Jabalpur.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left font-mono text-[10px] shrink-0 self-start md:self-auto">
              <p className="text-slate-300 font-bold">EMAIL: <span className="text-white">{user?.email}</span></p>
              <p className="text-slate-400 mt-0.5">ROLE: <span className="text-emerald-400 font-bold uppercase">{user?.role}</span></p>
            </div>
          </div>

          {/* Stats Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {[
              { label: "Active Cohorts", value: "3 Batches", desc: "136 students supervised", icon: Users, color: "text-emerald-400" },
              { label: "Average Rating", value: "9.1/10", desc: "Based on weekly student logs", icon: Award, color: "text-amber-400" },
              { label: "Lectures Taught", value: "482 Hrs", desc: "This semester track stats", icon: BookOpen, color: "text-cyan-400" },
              { label: "Performance Mean", value: "84.2%", desc: "Batch diagnostics indices", icon: TrendingUp, color: "text-indigo-400" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">{stat.label}</span>
                  <p className={`text-2xl font-black font-mono tracking-tight ${stat.color}`}>{stat.value}</p>
                  <div className="w-8 h-[1px] bg-white/10 my-1" />
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium"><Icon className="w-3.5 h-3.5 shrink-0" /> {stat.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Split Dashboard Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Active class metrics list (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/20 border border-white/5 rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-emerald-400 font-mono uppercase tracking-wider">Active Cohort Rosters</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Assigned subject boards, hours, and class feedback averages.</p>
                </div>
                <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>

              <div className="space-y-3">
                {classes.map((cls, idx) => (
                  <div key={idx} className="bg-slate-950/85 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider">{cls.batch}</span>
                      <h4 className="font-bold text-slate-200 text-sm mt-1">{cls.subject}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> {cls.timing}</p>
                    </div>

                    <div className="flex gap-4 md:text-right font-mono text-[10px]">
                      <div className="bg-white/2 border border-white/5 px-3 py-2 rounded-xl text-center min-w-16">
                        <span className="text-slate-400 uppercase text-[8px] block font-semibold">STUDENTS</span>
                        <span className="text-white font-bold text-sm block mt-0.5">{cls.studentsCount}</span>
                      </div>
                      <div className="bg-white/2 border border-white/5 px-3 py-2 rounded-xl text-center min-w-16">
                        <span className="text-slate-400 uppercase text-[8px] block font-semibold">FEEDBACK</span>
                        <span className="text-emerald-400 font-bold text-sm block mt-0.5">★ {cls.avgRating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Submissions and Exam controls (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Grading desks */}
              <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-amber-400 font-mono uppercase tracking-wider">Submissions Grading Desk</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Review mock diagnostic test scores from student portals.</p>
                  </div>
                  <BarChart2 className="w-5 h-5 text-amber-400 shrink-0" />
                </div>

                <div className="space-y-2">
                  {submissions.map((sub, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/80 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-200 block">{sub.name}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{sub.task}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold font-mono text-white text-xs block">{sub.score}</span>
                        <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded uppercase inline-block mt-0.5 ${
                          sub.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>{sub.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class actions tool box */}
              <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 text-left space-y-3">
                <h3 className="font-bold text-sm text-emerald-400 font-mono uppercase tracking-wider">Quick Lesson Tools</h3>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => alert('New test generator launched!')} className="p-3 border border-white/5 bg-slate-950/60 rounded-xl hover:border-emerald-500/30 flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-center">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold">Schedule Exam</span>
                  </button>
                  <button onClick={() => alert('Broadcast tool initialized!')} className="p-3 border border-white/5 bg-slate-950/60 rounded-xl hover:border-emerald-500/30 flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold">Broadcast Alert</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </AuthGuard>
  );
}
