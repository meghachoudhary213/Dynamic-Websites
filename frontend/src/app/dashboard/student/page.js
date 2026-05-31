"use client";

import React, { useState, useEffect } from 'react';
import AuthGuard from '../../../components/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config';
import { 
  Award, BookOpen, Calendar, Clock, LogOut, CheckCircle, 
  TrendingUp, Activity, Bell, FileText, ArrowRight, User,
  Download, Users, Search, Play, Check, ShieldAlert, CheckSquare, Edit, Save, ClipboardList, RefreshCw
} from 'lucide-react';

const MOCK_TESTS_QUESTIONS = {
  test_phy_1: [
    {
      q: "What is the electric field inside a hollow charged spherical conductor of radius R at a distance r < R?",
      options: ["Zero", "kQ/R²", "kQ/r²", "Infinite"],
      answer: 0
    },
    {
      q: "Two charges +q and -q are separated by a distance 2d. What is the electric dipole moment?",
      options: ["q*d", "2qd", "q/2d", "Zero"],
      answer: 1
    },
    {
      q: "What is the SI unit of electric permittivity (ε₀)?",
      options: ["C² N⁻¹ m⁻²", "C N m", "N m² C⁻²", "None of these"],
      answer: 0
    },
    {
      q: "The capacitance of a parallel plate capacitor does NOT depend on which of the following?",
      options: ["Area of plates", "Distance between plates", "Material of plates", "Permittivity of dielectric"],
      answer: 2
    }
  ],
  test_chem_1: [
    {
      q: "Which of the following organic carboxylic acids is the strongest?",
      options: ["CH₃COOH (Acetic)", "ClCH₂COOH (Monochloroacetic)", "Cl₂CHCOOH (Dichloroacetic)", "Cl₃CCOOH (Trichloroacetic)"],
      answer: 3
    },
    {
      q: "What is the hybridization of carbon atoms in Ethane, Ethene, and Ethyne respectively?",
      options: ["sp, sp², sp³", "sp³, sp², sp", "sp², sp³, sp", "sp³, sp, sp²"],
      answer: 1
    },
    {
      q: "Which organic nucleophilic substitution mechanism involves a carbocation intermediate?",
      options: ["SN1 reaction", "SN2 reaction", "E2 elimination", "None of these"],
      answer: 0
    }
  ],
  test_math_1: [
    {
      q: "Find the limit: lim (x -> 0) of sin(x) / x.",
      options: ["0", "1", "Infinite", "Undefined"],
      answer: 1
    },
    {
      q: "What is the derivative of ln(sin(x)) with respect to x?",
      options: ["tan(x)", "cot(x)", "-cot(x)", "1 / sin(x)"],
      answer: 1
    },
    {
      q: "Find the derivative of e^(3x²) with respect to x.",
      options: ["6x * e^(3x²)", "e^(3x²)", "3x * e^(3x²)", "6 * e^(3x²)"],
      answer: 0
    }
  ]
};

export default function StudentDashboard() {
  const { user, token, logout, login } = useAuth();
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('overview'); // overview | courses | notes | tests | profile
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  
  // Course search / enrollment status
  const [enrollLoading, setEnrollLoading] = useState(false);
  
  // Notes search state
  const [notesSearch, setNotesSearch] = useState('');
  const [downloadingNote, setDownloadingNote] = useState(null);
  
  // Mock Quiz taking states
  const [activeQuiz, setActiveQuiz] = useState(null); // active quiz object
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { qIndex: optionIndex }
  const [quizScoreCard, setQuizScoreCard] = useState(null);
  
  // Profile Editor states
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Audio chimes helper
  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  };

  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  useEffect(() => {
    if (!user?.email) return;
    loadStudentDashboardTelemetry();
  }, [user]);

  const loadStudentDashboardTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/website/student-dashboard/${user.email}`);
      const data = await res.json();
      if (data.success) {
        setDashboardData(data);
        setProfileName(data.student?.name || user?.name || '');
        setProfilePhone(data.student?.phone || user?.phone || '');
      }
    } catch (err) {
      console.error('Failed to load student portal dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Dynamic Course Enrollment Handler
  const handleEnrollCourse = async (courseId) => {
    playClickSound();
    setEnrollLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/website/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, courseId })
      });
      const result = await res.json();
      if (result.success) {
        playChimeSound();
        alert('🎉 Successfully enrolled in NextRank Course milestone! Tracking pace progress now.');
        await loadStudentDashboardTelemetry();
      } else {
        alert(result.message || 'Enrollment failed.');
      }
    } catch (err) {
      alert('Could not connect to NextRank Enrollment server.');
    } finally {
      setEnrollLoading(false);
    }
  };

  // 2. Interactive Mock Quiz submission
  const handleStartQuiz = (quiz) => {
    playClickSound();
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizScoreCard(null);
  };

  const handleSelectAnswer = (optIndex) => {
    playClickSound();
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optIndex
    }));
  };

  const handleNextQuestion = () => {
    playClickSound();
    if (currentQuestionIndex < MOCK_TESTS_QUESTIONS[activeQuiz.id].length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    playClickSound();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    playChimeSound();
    const questions = MOCK_TESTS_QUESTIONS[activeQuiz.id];
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });

    try {
      const res = await fetch(`${API_URL}/api/website/submit-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          testId: activeQuiz.id,
          score,
          answers: selectedAnswers,
          totalQuestions: questions.length
        })
      });
      const result = await res.json();
      if (result.success) {
        setQuizScoreCard({
          score,
          total: questions.length,
          mockRank: result.mockRank
        });
        await loadStudentDashboardTelemetry();
      }
    } catch (err) {
      console.error(err);
      alert('Could not submit mock test to server.');
    }
  };

  // 3. Dynamic Profile updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    playChimeSound();
    setProfileSaving(true);
    setProfileMessage('');

    try {
      const res = await fetch(`${API_URL}/api/website/student-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: profileName,
          phone: profilePhone
        })
      });
      const result = await res.json();
      if (result.success) {
        setProfileMessage('✓ Profile credentials successfully synced to database!');
        await loadStudentDashboardTelemetry();
      } else {
        setProfileMessage(result.message || 'Error updating profile.');
      }
    } catch (err) {
      setProfileMessage('Error connecting to updates engine.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Simulated Note Downloads
  const handleDownloadNote = (note) => {
    playClickSound();
    setDownloadingNote(note.title);
    setTimeout(() => {
      playChimeSound();
      setDownloadingNote(null);
      alert(`📥 Conceptual revision PDF "${note.title}" downloaded securely!`);
    }, 1500);
  };

  if (loading || !dashboardData) {
    return (
      <AuthGuard allowedRoles={['student']}>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020512] text-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-4 bg-slate-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-md shadow-2xl max-w-sm w-full mx-4">
            <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-2" />
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-sm tracking-wider uppercase font-mono text-white">NextRank Secure Gateway</h3>
              <p className="text-[10px] text-slate-400 font-medium">Connecting to Jabalpur SmartCity education grid nodes...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const { student, courses, tests, notes, faculty } = dashboardData;

  const stats = [
    { 
      label: "Biometric Attendance", 
      value: student.attendance ? `${student.attendance}%` : "94.2%", 
      desc: "182/194 lectures complete", 
      color: "text-emerald-400" 
    },
    { 
      label: "JEE/NEET Mock Rank", 
      value: student.mockRank || "AIR 142", 
      desc: "Performance metric sync active", 
      color: "text-amber-400" 
    },
    { 
      label: "Diagnosed Study Hours", 
      value: student.diagnosedHours ? `${student.diagnosedHours} Hrs` : "248 Hrs", 
      desc: "Interactive telemetry tracks", 
      color: "text-blue-400" 
    },
    { 
      label: "Milestones Syllabus Track", 
      value: student.syllabusTrack ? `${student.syllabusTrack}%` : "76.4%", 
      desc: "Pacing milestone completed", 
      color: "text-indigo-400" 
    }
  ];

  // Notes filtering
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(notesSearch.toLowerCase()));

  return (
    <AuthGuard allowedRoles={['student']}>
      <div className="min-h-screen bg-[#030616] text-slate-100 font-sans flex flex-col relative overflow-hidden">
        {/* Immersive Glassmorphism Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-60">
          <div className="absolute top-[5%] left-[5%] w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-3xl animate-blob-slow" />
          <div className="absolute bottom-[8%] right-[8%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl animate-blob-medium" />
          <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-cyan-600/5 blur-3xl" />
        </div>

        {/* Global Matrix cyber grids */}
        <div className="absolute inset-0 bg-image-grid opacity-[0.02] pointer-events-none -z-10" />

        {/* Standalone Header */}
        <header className="sticky top-0 z-40 bg-slate-950/45 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-md font-black shadow-lg shadow-blue-500/10">
              🎓
            </div>
            <div className="text-left">
              <span className="font-mono font-black text-sm tracking-widest uppercase text-white block">NextRank</span>
              <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase block">Premium Student Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase animate-pulse">
              Jabalpur Node active
            </span>
            <button
              onClick={() => { playClickSound(); logout(); }}
              className="flex items-center gap-1.5 border border-white/10 hover:bg-rose-500/15 hover:text-rose-400 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer font-mono uppercase"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </header>

        {/* Sidebar + Main workspace grid */}
        <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 min-h-[calc(100vh-68px)]">
          
          {/* Glassmorphic Side Navigation (3 cols) */}
          <aside className="lg:col-span-3 flex flex-col gap-2 bg-slate-950/40 backdrop-blur-2xl border border-white/5 p-4 rounded-3xl self-start w-full font-mono text-xs">
            <div className="p-3 bg-white/2 border border-white/5 rounded-2xl flex items-center gap-3 mb-4 text-left">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 font-bold uppercase text-md">
                {student.name ? student.name[0] : 'S'}
              </div>
              <div className="min-w-0">
                <span className="font-sans font-bold text-white block truncate text-[13px]">{student.name}</span>
                <span className="text-[8px] text-slate-400 block truncate font-mono uppercase">{student.email}</span>
              </div>
            </div>

            {[
              { id: 'overview', label: 'Overview Desk', icon: Activity },
              { id: 'courses', label: 'Coaching Batches', icon: BookOpen },
              { id: 'notes', label: 'Conceptual Vault', icon: FileText },
              { id: 'tests', label: 'Mock Exam Sim', icon: Award },
              { id: 'profile', label: 'Profile Manager', icon: User }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { playClickSound(); setActiveTab(tab.id); }}
                  className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10 border border-blue-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </aside>

          {/* Glassmorphic Workspace Frame (9 cols) */}
          <section className="lg:col-span-9 flex flex-col gap-6">

            {/* TAB 1: OVERVIEW DESK */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Welcome Banner */}
                <div className="p-6 bg-gradient-to-r from-blue-950/20 via-indigo-950/15 to-slate-950/40 border border-white/5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-400 font-mono uppercase tracking-widest block">Operational Node: Sanskardhani</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white">
                      Welcome, {student.name}!
                    </h2>
                    <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                      Sanskardhani Jabalpur education grid link successfully established. View dynamic mock testing performance scores, biometric gates attendance tracking, and study pacing guides.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 shrink-0 self-start md:self-auto font-mono text-[9px]">
                    <div className="text-left space-y-1">
                      <p className="text-slate-400">BATCH: <span className="text-white font-bold uppercase">{student.websiteId === 'nextrank' ? 'IIT-JEE ELITE' : 'NEET ASPIRANT'}</span></p>
                      <p className="text-slate-400">PHONE: <span className="text-white">{student.phone}</span></p>
                      <p className="text-slate-400">UID: <span className="text-white">{student.studentId}</span></p>
                    </div>
                  </div>
                </div>

                {/* Telemetry Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-950/30 border border-white/5 p-5 rounded-2xl space-y-2 relative overflow-hidden backdrop-blur-xl">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">{stat.label}</span>
                      <p className={`text-2xl font-black font-mono tracking-tight ${stat.color}`}>{stat.value}</p>
                      <div className="w-8 h-[1px] bg-white/10 my-1" />
                      <p className="text-[9px] text-slate-400 font-medium">{stat.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Split Row: Pacing Coursework + RFID Timelines */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                  
                  {/* Pacing course milestones (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-950/20 border border-white/5 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-blue-400 font-mono uppercase tracking-wider">Milestone Pacing</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Enrolled batch coursework, pacing schedules, and progress guides.</p>
                      </div>
                      <BookOpen className="w-5 h-5 text-blue-400 shrink-0" />
                    </div>

                    <div className="space-y-3">
                      {courses.filter(c => c.isEnrolled).map((course, idx) => (
                        <div key={idx} className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold uppercase tracking-widest">{course.target}</span>
                              <h4 className="font-bold text-slate-200 text-sm mt-1">{course.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Faculty Lead: <span className="text-blue-400 font-semibold">{course.faculty}</span></p>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-400 shrink-0">{course.duration}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                              <span>Pacing Progress</span>
                              <span className="text-blue-400 font-bold">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: `${course.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                      {courses.filter(c => c.isEnrolled).length === 0 && (
                        <div className="text-center py-8 text-slate-500 border border-dashed border-white/10 rounded-2xl text-xs">
                          No enrolled milestone courses. Go to the Batch Catalog tab to register!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Biometric RFID Timelines (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-950/20 border border-white/5 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-indigo-400 font-mono uppercase tracking-wider">RFID Gates Log</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Biometric Parent-RFID check-in logs updated dynamically.</p>
                      </div>
                      <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                    </div>

                    <div className="space-y-3 font-mono">
                      {student.attendanceLogs.map((log, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/60 border border-white/5 rounded-2xl flex items-center justify-between text-[10px]">
                          <div className="text-left space-y-1">
                            <span className="text-slate-300 font-bold block">{log.name}</span>
                            <span className="text-[8px] text-slate-500 block">{log.method}</span>
                          </div>
                          <div className="text-right space-y-1">
                            <span className="text-indigo-400 font-bold block">{log.timestamp}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                              log.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>{log.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Conceptual Smart Broadcast Announcement */}
                <div className="p-4.5 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-3.5 text-left">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Bell className="w-5 h-5 animate-swing" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">📢 SMART BROADCAST ANNOUNCEMENT</h4>
                    <p className="text-xs text-slate-300 leading-normal max-w-2xl">
                      Advanced Mechanics live interactive diagnostics boot camp scheduled tomorrow at 10:00 AM with Dr. H.C. Verma. Ensure conceptual revision notebooks are downloaded from the Vault!
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: COACHING BATCHES (COURSE CATALOG) */}
            {activeTab === 'courses' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="font-bold text-sm text-blue-400 font-mono uppercase tracking-wider">NextRank Batch Catalog</h3>
                  <p className="text-[10px] text-slate-400">Available expert coaching batches in Jabalpur Sanskardhani. Register to tracking pacing milestones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <div key={course.courseId} className="bg-slate-950/30 border border-white/5 p-6 rounded-3xl flex flex-col justify-between hover:border-blue-500/20 hover:scale-[1.01] transition-all relative overflow-hidden">
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold uppercase tracking-widest">
                            {course.target}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                            {course.duration}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-[15px] leading-snug">{course.name}</h4>
                        
                        <div className="space-y-1.5 font-mono text-[10px] text-slate-400 pt-1">
                          <p>Faculty Leader: <span className="text-blue-400 font-bold font-sans">{course.faculty}</span></p>
                          <p>Target Goal: <span className="text-slate-300 font-bold">{course.target}</span></p>
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between">
                        <span className="text-md font-bold text-white font-mono">{course.fees}</span>
                        {course.isEnrolled ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl uppercase">
                            <Check className="w-3.5 h-3.5" /> Enrolled
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEnrollCourse(course.courseId)}
                            disabled={enrollLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-4.5 py-2 rounded-xl transition-all cursor-pointer shadow uppercase tracking-wider font-mono"
                          >
                            {enrollLoading ? 'Enrolling...' : 'Enroll Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CONCEPTUAL VAULT (NOTES LIBRARY) */}
            {activeTab === 'notes' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-blue-400 font-mono uppercase tracking-wider">Notes & Revision Vault</h3>
                    <p className="text-[10px] text-slate-400">Download highly optimized conceptual lecture Rev PDFs and cheat-sheets.</p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative max-w-xs w-full shrink-0">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input 
                      type="text"
                      placeholder="Search note files..."
                      value={notesSearch}
                      onChange={(e) => setNotesSearch(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/10 text-xs pl-9 pr-4 py-2 rounded-xl text-white focus:outline-none focus:border-blue-500/50 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredNotes.map((note, idx) => (
                    <div key={idx} className="bg-slate-950/30 border border-white/5 p-4.5 rounded-2xl flex items-center justify-between hover:border-blue-500/20 hover:bg-slate-950/50 transition-all">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="font-bold text-slate-200 text-[13px] truncate">{note.title}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Author: <span className="text-blue-400 font-sans font-semibold">{note.author}</span> • Size: <span className="text-slate-300">{note.size}</span> • Date: <span className="text-slate-500">{note.date}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadNote(note)}
                        disabled={downloadingNote !== null}
                        className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/5 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shrink-0 font-mono"
                        title="Download Note File"
                      >
                        {downloadingNote === note.title ? (
                          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                  {filteredNotes.length === 0 && (
                    <div className="text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-2xl text-xs">
                      No conceptual revision notes matched your search query.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: MOCK EXAM SIM (TEST CENTER) */}
            {activeTab === 'tests' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                
                {/* 4a. Standalone quiz active taker */}
                {activeQuiz ? (
                  <div className="bg-slate-950/45 border border-white/10 rounded-3xl p-6 space-y-6 relative overflow-hidden backdrop-blur-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold uppercase tracking-widest">{activeQuiz.subject}</span>
                        <h4 className="font-bold text-white text-md mt-1">{activeQuiz.title}</h4>
                      </div>
                      <button 
                        onClick={() => { playClickSound(); setActiveQuiz(null); }}
                        className="text-[10px] font-mono border border-white/10 px-3 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 uppercase"
                      >
                        Quit Sim
                      </button>
                    </div>

                    {!quizScoreCard ? (
                      <div className="space-y-6">
                        {/* Question Console */}
                        <div className="space-y-3.5 text-left">
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                            <span>QUESTION {currentQuestionIndex + 1} OF {MOCK_TESTS_QUESTIONS[activeQuiz.id].length}</span>
                            <span>PROGRESS: {Math.floor(((currentQuestionIndex + 1) / MOCK_TESTS_QUESTIONS[activeQuiz.id].length) * 100)}%</span>
                          </div>
                          
                          <p className="text-white text-sm font-semibold leading-relaxed">
                            {MOCK_TESTS_QUESTIONS[activeQuiz.id][currentQuestionIndex].q}
                          </p>
                        </div>

                        {/* Options Select Grid */}
                        <div className="grid grid-cols-1 gap-2.5 text-left">
                          {MOCK_TESTS_QUESTIONS[activeQuiz.id][currentQuestionIndex].options.map((opt, idx) => {
                            const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSelectAnswer(idx)}
                                className={`w-full p-4 rounded-xl border text-left text-xs transition-all relative flex items-center gap-3.5 ${
                                  isSelected 
                                    ? 'border-blue-500 bg-blue-600/15 text-white' 
                                    : 'border-white/5 bg-slate-900/30 hover:border-white/10 text-slate-300'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-lg flex items-center justify-center border font-mono font-bold text-[9px] shrink-0 ${
                                  isSelected ? 'border-blue-400 bg-blue-500 text-white' : 'border-white/10 bg-slate-950 text-slate-500'
                                }`}>
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="font-medium">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Pager controllers */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <button
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="bg-white/5 border border-white/5 disabled:opacity-40 hover:bg-white/10 px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-colors shrink-0 text-slate-300 cursor-pointer"
                          >
                            Back
                          </button>
                          
                          {currentQuestionIndex === MOCK_TESTS_QUESTIONS[activeQuiz.id].length - 1 ? (
                            <button
                              onClick={handleSubmitQuiz}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-transform hover:scale-[1.02] cursor-pointer"
                            >
                              Submit Mock Exam
                            </button>
                          ) : (
                            <button
                              onClick={handleNextQuestion}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Next Question
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Quiz Scorecard Settlement Frame
                      <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 text-2xl animate-bounce">
                          🏆
                        </div>
                        
                        <div className="space-y-1.5">
                          <h4 className="text-emerald-400 font-bold font-mono text-sm uppercase tracking-widest">Mock Test Scorecard Generated</h4>
                          <h2 className="text-4xl font-black font-mono text-white tracking-tight">{quizScoreCard.score} / {quizScoreCard.total}</h2>
                          <p className="text-xs text-slate-400">Scorecard registered successfully in MERN Education Oracle.</p>
                        </div>

                        <div className="max-w-xs mx-auto p-4 bg-slate-900 border border-white/5 rounded-2xl font-mono text-[10px] text-left space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-500">DYNAMIC AIR RANK:</span>
                            <span className="text-amber-400 font-bold">{quizScoreCard.mockRank}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">STATUS:</span>
                            <span className="text-emerald-400 font-bold uppercase">{quizScoreCard.score >= 2 ? 'PASSED' : 'RE-ATTEMPT REQUIRED'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">VIRTUAL MARKS:</span>
                            <span className="text-white font-bold">{Math.floor((quizScoreCard.score / quizScoreCard.total) * 100)}% Accuracy</span>
                          </div>
                        </div>

                        <button
                          onClick={() => { playClickSound(); setActiveQuiz(null); }}
                          className="bg-white/5 border border-white/5 px-6 py-2.5 rounded-xl text-[10px] font-mono font-bold text-slate-300 hover:text-white uppercase transition-colors"
                        >
                          Return to Exams list
                        </button>
                      </div>
                    )}

                  </div>
                ) : (
                  // 4b. Standard dynamic list of tests
                  <div className="space-y-6">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="font-bold text-sm text-indigo-400 font-mono uppercase tracking-wider">Mock Exam Sim Center</h3>
                      <p className="text-[10px] text-slate-400">Answer dynamic conceptual multiple-choice questions to update All India Batch Ranks.</p>
                    </div>

                    <div className="space-y-3">
                      {tests.map((test) => (
                        <div key={test.id} className="bg-slate-950/30 border border-white/5 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="text-left space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold uppercase tracking-widest">{test.subject}</span>
                              <span className="text-[9px] text-slate-500 font-mono">{test.duration} • {test.qCount} Questions</span>
                            </div>
                            <h4 className="font-bold text-white text-[13px] leading-snug truncate">{test.title}</h4>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] self-start md:self-auto">
                            <div className="text-right space-y-1 border-r border-white/10 pr-4">
                              <span className="text-slate-500 block">LAST SCORE:</span>
                              <span className="text-indigo-400 font-bold text-sm block">{test.score}</span>
                            </div>
                            <div className="text-right space-y-1 pr-1.5">
                              <span className="text-slate-500 block">METRIC:</span>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase block w-fit ml-auto ${
                                test.rank === 'EXCELLENT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                test.rank === 'PASSED' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border border-white/10'
                              }`}>{test.rank}</span>
                            </div>
                            
                            <button
                              onClick={() => handleStartQuiz(test)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-4.5 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer shadow active:scale-95 transition-all"
                            >
                              {test.attempted ? 'Re-Attempt' : 'Attempt Sim'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 5: PROFILE MANAGER */}
            {activeTab === 'profile' && (
              <div className="bg-slate-950/20 border border-white/5 rounded-3xl p-6 space-y-6 text-left animate-in fade-in duration-300">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="font-bold text-sm text-blue-400 font-mono uppercase tracking-wider">Profile & Batch Manager</h3>
                  <p className="text-[10px] text-slate-400">Edit student details and verify local Sanskardhani credentials.</p>
                </div>

                {profileMessage && (
                  <div className={`p-3 rounded-xl border text-xs font-mono animate-pulse ${
                    profileMessage.startsWith('✓') 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {profileMessage}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Student Full Name</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      required
                      className="w-full bg-slate-950 border border-white/10 text-xs px-3.5 py-3 rounded-xl text-white focus:outline-none focus:border-blue-500/50 font-sans" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Contact Phone Number</label>
                    <input 
                      type="text" 
                      value={profilePhone} 
                      onChange={(e) => setProfilePhone(e.target.value)} 
                      required
                      className="w-full bg-slate-950 border border-white/10 text-xs px-3.5 py-3 rounded-xl text-white focus:outline-none focus:border-blue-500/50 font-sans" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Portal Session Email (Read-Only)</label>
                    <input 
                      type="email" 
                      value={student.email} 
                      disabled
                      className="w-full bg-slate-900 border border-white/5 text-xs px-3.5 py-3 rounded-xl text-slate-500 font-sans cursor-not-allowed" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                    <div className="p-3 bg-slate-950 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-slate-500">MOCK TESTING AIR RANK</span>
                      <p className="text-sm font-bold text-amber-400">{student.mockRank || 'AIR 142'}</p>
                    </div>
                    <div className="p-3 bg-slate-950 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-slate-500">PACING STUDY PROGRESS</span>
                      <p className="text-sm font-bold text-indigo-400">{student.syllabusTrack || '76.4'}%</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-6 py-3 rounded-xl uppercase tracking-widest transition-transform hover:scale-[1.01] active:scale-95 cursor-pointer shadow flex items-center justify-center gap-1.5 font-mono"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

          </section>

        </div>
      </div>
    </AuthGuard>
  );
}
