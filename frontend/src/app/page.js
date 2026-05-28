"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, BookOpen, Calendar, CheckCircle, Clock, Cpu, 
  DollarSign, Dumbbell, FileText, Heart, HelpCircle, Layers, 
  MapPin, Phone, Shield, Sparkles, Star, TrendingUp, 
  Users, Utensils, Video, Volume2, Zap, AlertTriangle, Send, Mail, Lock,
  Bookmark, ShoppingBag, Eye, Trash, ShieldCheck, UserCheck, 
  Briefcase, Search, UploadCloud, ChevronRight, BarChart2, Sun, Moon
} from 'lucide-react';
import { io } from 'socket.io-client';
import MarbleRocksCanvas from '../components/MarbleRocksCanvas';
import DynamicChatbot from '../components/DynamicChatbot';
import { API_URL } from '../config';

export default function Home() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dynamic Global states
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [siteLightMode, setSiteLightMode] = useState(false);

  // User Auth & Enrollment States
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authError) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(authError, 'error');
      }
    }
  }, [authError]);

  useEffect(() => {
    if (authSuccess) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(authSuccess, 'success');
      }
    }
  }, [authSuccess]);

  // Premium Payment Gateway Simulation states
  const [showPayModal, setShowPayModal] = useState(false);
  const [payPlanName, setPayPlanName] = useState('');
  const [payPrice, setPayPrice] = useState('');
  const [cardNumber, setCardNumber] = useState('4582 9182 1202 8593');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvv, setCardCvv] = useState('182');
  const [payingState, setPayingState] = useState('idle'); // idle | paying | success
  const [payTab, setPayTab] = useState('card'); // 'card' | 'scanner' | 'bank'
  const [payTransactionId, setPayTransactionId] = useState('');

  // NextRank Smart Modules & AI States
  const [coachingTab, setCoachingTab] = useState('student_portal'); // student_portal | students | faculty | courses | tests | attendance | notes | fees | admissions | analytics
  const [coachingStudents, setCoachingStudents] = useState([
    { roll: 'NR-101', name: 'Aarav Sharma', class: 'Class 12', batch: 'JEE Elite', performance: '94%' },
    { roll: 'NR-102', name: 'Ananya Patel', class: 'Class 12', batch: 'NEET Star', performance: '98%' },
    { roll: 'NR-103', name: 'Rohan Gupta', class: 'Class 11', batch: 'JEE Main', performance: '88%' },
    { roll: 'NR-104', name: 'Sneha Verma', class: 'Class 10', batch: 'Foundation', performance: '91%' }
  ]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Class 12');
  const [newStudentBatch, setNewStudentBatch] = useState('JEE Elite');

  const [coachingFaculty, setCoachingFaculty] = useState([
    { name: 'Dr. S. K. Verma', subject: 'Physics', exp: '15 Yrs', qual: 'Ph.D. IIT Kanpur', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400' },
    { name: 'Prof. Ritu Kapoor', subject: 'Chemistry', exp: '12 Yrs', qual: 'M.Sc. BITS Pilani', img: 'https://images.unsplash.com/photo-1580894732444-8fecef2271da?q=80&w=400' },
    { name: 'Er. Amit Agrawal', subject: 'Mathematics', exp: '10 Yrs', qual: 'B.Tech. IIT Delhi', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400' },
    { name: 'Dr. Priya Nair', subject: 'Biology', exp: '8 Yrs', qual: 'MD AIIMS Delhi', img: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400' }
  ]);
  const [newFacName, setNewFacName] = useState('');
  const [newFacSubject, setNewFacSubject] = useState('Physics');
  const [newFacQual, setNewFacQual] = useState('Ph.D. / M.Sc.');

  const [coachingCourses, setCoachingCourses] = useState([
    { id: 'fnd', name: 'Foundation Batch', duration: '1 Year', fees: '₹45,000', faculty: 'Dr. Priya Nair', target: 'Class 6-8/9-10' },
    { id: 'c10', name: 'Class 9–10 Board', duration: '1 Year', fees: '₹55,000', faculty: 'Prof. Ritu Kapoor', target: 'Class 9-10' },
    { id: 'c12', name: 'Class 11–12 Advanced', duration: '2 Years', fees: '₹85,000', faculty: 'Dr. S. K. Verma', target: 'Class 11-12' },
    { id: 'jee', name: 'JEE Preparation', duration: '2 Years', fees: '₹1,25,000', faculty: 'Er. Amit Agrawal', target: 'JEE Aspirants' },
    { id: 'neet', name: 'NEET Preparation', duration: '2 Years', fees: '₹1,20,000', faculty: 'Dr. Priya Nair', target: 'NEET Aspirants' }
  ]);

  const [coachingTests, setCoachingTests] = useState([
    { id: 'T-101', name: 'JEE Grand Test 4', subject: 'Mathematics', duration: '180 mins', date: 'May 28, 2026' },
    { id: 'T-102', name: 'NEET Biology Sprint 9', subject: 'Biology', duration: '180 mins', date: 'May 30, 2026' },
    { id: 'T-103', name: 'Physics Electrostatics MCQ', subject: 'Physics', duration: '45 mins', date: 'Just now' }
  ]);
  const [newTestName, setNewTestName] = useState('');
  const [newTestSubject, setNewTestSubject] = useState('Physics');

  const [attendanceLogs, setAttendanceLogs] = useState([
    { name: 'Aarav Sharma', timestamp: '08:02 AM', status: 'PRESENT', method: 'RFID' },
    { name: 'Ananya Patel', timestamp: '07:58 AM', status: 'PRESENT', method: 'Biometric' },
    { name: 'Sneha Verma', timestamp: '08:15 AM', status: 'LATE', method: 'RFID' },
    { name: 'Rohan Gupta', timestamp: '--:--', status: 'ABSENT', method: '--' }
  ]);

  const [feesInvoices, setFeesInvoices] = useState([
    { name: 'Aarav Sharma', course: 'JEE Prep', paid: '₹85,000', status: 'PARTIAL', due: '₹40,000' },
    { name: 'Ananya Patel', course: 'NEET Prep', paid: '₹1,20,000', status: 'PAID', due: '₹0' },
    { name: 'Rohan Gupta', course: 'Class 11-12', paid: '₹45,000', status: 'PARTIAL', due: '₹40,000' }
  ]);

  const [admissionLeads, setAdmissionLeads] = useState([
    { name: 'Kabir Mehta', phone: '9827012345', email: 'kabir@gmail.com', target: 'JEE', status: 'Inquiry' },
    { name: 'Diya Sen', phone: '7389145678', email: 'diya@yahoo.com', target: 'NEET', status: 'Demo Booked' },
    { name: 'Yash Vardhan', phone: '9425078901', email: 'yash@hotmail.com', target: 'Class 10', status: 'Enrolled' }
  ]);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadTarget, setNewLeadTarget] = useState('JEE');

  // AI interactive states
  const [predictedRankPercentile, setPredictedRankPercentile] = useState('');
  const [predictedRank, setPredictedRank] = useState('');
  const [rankMockScore, setRankMockScore] = useState(240);

  const [aiDoubtPrompt, setAiDoubtPrompt] = useState('');
  const [aiDoubtResult, setAiDoubtResult] = useState('');

  const [aiStudyPlannerHours, setAiStudyPlannerHours] = useState(8);
  const [aiStudyPlan, setAiStudyPlan] = useState(null);

  const [selectedVideo, setSelectedVideo] = useState('https://www.w3schools.com/html/mov_bbb.mp4');

  // 1. NextRank Institute States
  const [uploadedNotes, setUploadedNotes] = useState([
    { id: 1, title: 'Physics_Ch3_Electromagnetism.pdf', date: 'May 25, 2026' },
    { id: 2, title: 'Chemistry_Organic_Synthesis.pdf', date: 'May 22, 2026' }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [activeQuizIndex, setActiveQuizIndex] = useState(-1);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState({});
  const [quizScoreReport, setQuizScoreReport] = useState('');

  // 2. Libaas (E-Commerce) States
  const [selectedSize, setSelectedSize] = useState('M');
  const [aiSuggestSelection, setAiSuggestSelection] = useState('Traditional');
  const [cartTotal, setCartTotal] = useState(0);

  // 3. AashiyanaX (Real Estate) States
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [virtualTourActive, setVirtualTourActive] = useState(false);
  const [selectedBookingTime, setSelectedBookingTime] = useState('');

  // 4. AarogyaCare (Hospital) States
  const [activeSupportSiren, setActiveSupportSiren] = useState(false);
  const [bookingDept, setBookingDept] = useState('Cardiology');
  const [patientName, setPatientName] = useState('');

  // 5. Cafe Aura (Cafe & Restaurant) States
  const [tableSeats, setTableSeats] = useState(2);
  const [tableDate, setTableDate] = useState('2026-05-28');
  const [orderCart, setOrderCart] = useState([]);

  // 6. NexaTech Hub (Tech Hub/Startup) States
  const [aiSandboxPrompt, setAiSandboxPrompt] = useState('Create custom HSL visual background');
  const [aiSandboxOutput, setAiSandboxOutput] = useState('');
  const [cpuUsage, setCpuUsage] = useState(42);

  // 7. FlexArena (Gym & Fitness) States
  const [bmiWeight, setBmiWeight] = useState(70);
  const [bmiHeight, setBmiHeight] = useState(175);
  const [bmiResult, setBmiResult] = useState(null);

  // 8. ExploreAura (Travel & Trip Planner) States
  const [tripLocation, setTripLocation] = useState('Bhedaghat');
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [budgetTransit, setBudgetTransit] = useState(1200);
  const [budgetDays, setBudgetDays] = useState(3);

  // 9. ThreatZero (Cyber Security Awareness) States
  const [simulatedAttackLogs, setSimulatedAttackLogs] = useState([
    { time: '10:32:01', source: 'IP 182.12.82.9', payload: 'Mock SQL injection parsed', action: 'BLOCK' },
    { time: '10:34:42', source: 'IP 42.122.92.1', payload: 'Mock SSH scan detected', action: 'MITIGATED' }
  ]);
  const [secQuizIndex, setSecQuizIndex] = useState(0);
  const [secQuizScore, setSecQuizScore] = useState(0);
  const [secQuizFinished, setSecQuizFinished] = useState(false);

  // 10. JobSphere (Career & Job Portal) States
  const [resumeTextInput, setResumeTextInput] = useState('');
  const [resumeRating, setResumeRating] = useState(null);
  const [mockInterviewQIndex, setMockInterviewQIndex] = useState(-1);
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState('');

  const playClickSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
      audio.volume = 0.12;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // Authenticated Student Check
  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/auth/user/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          localStorage.removeItem('userToken');
        }
      } catch (err) {
        console.error('Error checking logged in user:', err);
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAuthError('');
    setAuthSuccess('');

    // Format Requirement Complexity Check (as requested in user images)
    const hasLetter = /[a-zA-Z]/.test(authPassword);
    const hasNumber = /[0-9]/.test(authPassword);
    const hasSymbol = /[^a-zA-Z0-9]/.test(authPassword);
    const isLongEnough = authPassword.length >= 8;

    if (!isLongEnough || !hasLetter || !hasNumber || !hasSymbol) {
      setAuthError('Password must be at least 8 characters long and contain letters, numbers, and symbols.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authEmail.toLowerCase(),
          password: authPassword,
          role: 'student'
        })
      });
      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setAuthSuccess('🎉 Registration successful! Auto-logging in...');
        localStorage.setItem('userToken', data.token);
        setCurrentUser(data.user);
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthEmail('');
          setAuthPassword('');
          setAuthSuccess('');
          // Smooth scroll to the dashboard command desk
          const element = document.getElementById('dynamic_modules');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 1500);
      } else {
        setAuthError(data.message || 'Registration failed. Try again.');
      }
    } catch (err) {
      setSubmitting(false);
      setAuthError('Connection error to auth server.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authEmail.toLowerCase(),
          password: authPassword
        })
      });
      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setAuthSuccess('🚀 Welcome back! Prime analytics deck loaded.');
        localStorage.setItem('userToken', data.token);
        setCurrentUser(data.user);
        
        // If user is a student, set their default tab to student portal
        if (data.user.role === 'student') {
          setCoachingTab('student_portal');
        }
        
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthEmail('');
          setAuthPassword('');
          setAuthSuccess('');
          // Smooth scroll to the dashboard command desk
          const element = document.getElementById('dynamic_modules');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 1500);
      } else {
        setAuthError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setSubmitting(false);
      setAuthError('Connection error to login server.');
    }
  };

  // Load Active Config
  const loadActiveConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/api/website/active`);
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
        applyThemeVariables(data.config.theme);
      } else {
        setError('Failed to fetch valid website configuration.');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading active config:', err);
      setError(`Connection failed. Please verify that the Express backend is running on ${API_URL}.`);
      setLoading(false);
    }
  };

  // Bind CSS Theme custom properties
  const applyThemeVariables = (theme) => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary || '#6366f1');
    root.style.setProperty('--secondary', theme.secondary || '#a855f7');
    root.style.setProperty('--accent', theme.accent || '#f43f5e');
    root.style.setProperty('--bg-custom', theme.background || '#0b0f19');
    root.style.setProperty('--text-custom', theme.textColor || '#f3f4f6');
    root.style.setProperty('--radius-custom', 
      theme.borderRadius === 'xl' ? '12px' : 
      theme.borderRadius === '2xl' ? '16px' : 
      theme.borderRadius === '3xl' ? '24px' : '8px'
    );
  };

  useEffect(() => {
    loadActiveConfig();
    checkLoggedInUser();

    // Listen to real-time socket config swaps
    const socket = io(API_URL);
    
    socket.on('config-updated', (updatedConfig) => {
      console.log('🔌 Real-time config update received:', updatedConfig);
      setConfig(updatedConfig);
      applyThemeVariables(updatedConfig.theme);
    });

    socket.on('payment-success', (payload) => {
      alert(`💳 [REAL-TIME GATEWAY ALERT] Payment received!\nPlan: ${payload.planName}\nAmount: ₹${payload.amount}\nUser: ${payload.userName}\nTransaction ID: ${payload.transactionId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Live attack log updates for cybersecurity
  useEffect(() => {
    const category = config?.category || (config?.businessType && config.businessType.includes('_') ? config.businessType.split('_')[0] : config?.businessType);
    if (category !== 'cybersecurity') return;
    const interval = setInterval(() => {
      const mockIPs = ['103.11.23.4', '192.168.1.102', '45.82.91.82'];
      const mockPayloads = ['Mock Cross-site script tag parsed', 'Mock password brute-force attempt blocked', 'Mock memory overflow filter active'];
      const mockActions = ['MITIGATED', 'BLOCKED', 'FILTERED'];
      
      const newLog = {
        time: new Date().toLocaleTimeString(),
        source: `IP ${mockIPs[Math.floor(Math.random() * mockIPs.length)]}`,
        payload: mockPayloads[Math.floor(Math.random() * mockPayloads.length)],
        action: mockActions[Math.floor(Math.random() * mockActions.length)]
      };
      
      setSimulatedAttackLogs(prev => [newLog, ...prev.slice(0, 4)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [config]);

  // Live NexaTech statistics simulator
  useEffect(() => {
    const category = config?.category || (config?.businessType && config.businessType.includes('_') ? config.businessType.split('_')[0] : config?.businessType);
    if (category !== 'startup') return;
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const nextVal = prev + (Math.random() - 0.5) * 10;
        return Math.min(Math.max(Math.round(nextVal), 15), 90);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [config]);

  const triggerMockSubmit = (e, message) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMsg('');
    
    setTimeout(() => {
      setSubmitting(false);
      setFeedbackMsg(message || 'Inquiry successfully registered! Our executive will contact you shortly.');
      setPatientName('');
    }, 1200);
  };

  const triggerRazorpaySimulation = (planName, price) => {
    playClickSound();
    setPayPlanName(planName);
    setPayPrice(price);
    setPayingState('idle');
    setPayTransactionId('');
    setShowPayModal(true);
  };

  const executePaymentCall = async () => {
    playClickSound();
    setPayingState('paying');
    
    // Simulate 3D secure payment gateway loading
    setTimeout(async () => {
      try {
        const cleanPrice = typeof payPrice === 'string' ? parseInt(payPrice.replace(/[^0-9]/g, '')) : payPrice;
        
        const res = await fetch(`${API_URL}/api/website/simulate-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: cleanPrice || 5000,
            userName: currentUser ? currentUser.email.split('@')[0] : 'Visitor of Sanskardhani',
            planName: payPlanName
          })
        });
        const data = await res.json();
        if (data.success) {
          setPayTransactionId(data.transactionId);
          setPayingState('success');
          
          // Append invoice dynamically to student fees sheet
          if (currentUser) {
            setFeesInvoices(prev => [
              { name: currentUser.email.split('@')[0], course: payPlanName, paid: `₹${cleanPrice.toLocaleString()}`, status: 'PAID', due: '₹0' },
              ...prev
            ]);
          }
        } else {
          setPayingState('idle');
          alert('Gateway simulation refused payment.');
        }
      } catch (err) {
        console.error('Simulated payment error:', err);
        setPayingState('idle');
        alert('Could not reach backend simulated payment ledger.');
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-white h-screen">
        <div className="w-16 h-16 rounded-full border-t-2 border-indigo-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold tracking-wide animate-pulse">Initializing Jabalpur SmartEngine...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-white p-6 max-w-lg mx-auto text-center h-screen">
        <AlertTriangle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2">Backend Connection Offline</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => { setLoading(true); setError(null); loadActiveConfig(); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
        >
          Retry System Connection
        </button>
      </div>
    );
  }

  if (!config) return null;

  const { theme, hero, navigation, sections, footer } = config;
  const businessType = config.category || (config.businessType && config.businessType.includes('_') ? config.businessType.split('_')[0] : config.businessType) || 'coaching';

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-1000 relative overflow-hidden ${businessType === 'coaching' ? 'matte-gold-theme' : ''} ${siteLightMode ? 'light-site' : ''}`} style={{ backgroundColor: businessType === 'coaching' ? undefined : (siteLightMode ? '#fdfbf7' : theme.background) }}>
      {/* Dynamic Animated Glass & Glow Bubbles for Matte Gold Theme */}
      {businessType === 'coaching' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Animated Ambient Glow spots */}
          <div className="glow-spot-gold top-[-5%] left-[-5%] w-[600px] h-[600px] animate-blob-slow" />
          <div className="glow-spot-gold top-[25%] right-[-10%] w-[550px] h-[550px] animate-blob-medium" />
          <div className="glow-spot-gold top-[50%] left-[-10%] w-[650px] h-[650px] animate-blob-slow" />
          <div className="glow-spot-gold top-[75%] right-[-5%] w-[500px] h-[500px] animate-blob-medium" />
          <div className="glow-spot-gold bottom-[-5%] left-[10%] w-[600px] h-[600px] animate-blob-slow" />
          
          {/* Realistic 3D Glassmorphic Floating Bubbles with Gold outlines (distributed through scroll depth) */}
          {/* Top Area (Hero & Navigation) */}
          <div className="glass-bubble-gold top-[5%] left-[3%] w-28 h-28 animate-float-slow" />
          <div className="glass-bubble-gold top-[14%] right-[5%] w-36 h-36 animate-float-medium" />
          
          {/* Mid Area 1 (Features & Stats) */}
          <div className="glass-bubble-gold top-[28%] left-[8%] w-24 h-24 animate-float-slowest" />
          <div className="glass-bubble-gold top-[42%] right-[10%] w-40 h-40 animate-float-slow" />
          
          {/* Mid Area 2 (About & Mission) */}
          <div className="glass-bubble-gold top-[58%] left-[4%] w-32 h-32 animate-float-medium" />
          <div className="glass-bubble-gold top-[70%] right-[8%] w-20 h-20 animate-float-slowest" />
          
          {/* Bottom Area (Dashboard Console & Footer) */}
          <div className="glass-bubble-gold top-[83%] left-[10%] w-44 h-44 animate-float-slow" />
          <div className="glass-bubble-gold top-[94%] right-[4%] w-28 h-28 animate-float-medium" />
        </div>
      )}
      {/* Ambient background light blobs */}
      <div 
        style={{ 
          background: `radial-gradient(circle at 10% 20%, ${theme.primary}1f, transparent 40%)` 
        }} 
        className="fixed top-0 left-0 w-[550px] h-[550px] pointer-events-none -z-10 blur-[130px]" 
      />
      <div 
        style={{ 
          background: `radial-gradient(circle at 90% 80%, ${theme.secondary}14, transparent 40%)` 
        }} 
        className="fixed bottom-0 right-0 w-[550px] h-[550px] pointer-events-none -z-10 blur-[130px]" 
      />

      {/* Background Interactive canvas */}
      <MarbleRocksCanvas effect={hero.jabalpurBranding.interactiveEffect} colors={theme} />

      {/* Floating Chat Assistant */}
      <DynamicChatbot businessType={businessType} colors={theme} />

      {/* Dynamic Header Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-lg font-royal font-bold text-white text-lg border border-amber-500/30">
              {navigation.logoText.substring(0,1)}
            </div>
            <span className="font-royal royal-heading text-xl font-bold tracking-wider text-[var(--text-custom)]">
              {navigation.logoText}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navigation.links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Display Cart/Wishlist totals for Libaas */}
            {businessType === 'ecommerce' && (
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full font-mono">
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> {wishlist.length}</span>
                <span className="flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5 text-amber-500" /> {cart.length}</span>
              </div>
            )}
            {/* Inner Website Light/Dark mode switcher */}
            <button
              onClick={() => setSiteLightMode(!siteLightMode)}
              className="p-2.5 rounded-full border border-amber-500/25 bg-amber-500/5 text-amber-500 hover:scale-105 active:scale-95 transition-transform"
              title="Toggle Website Theme Mode"
            >
              {siteLightMode ? <Moon className="w-4 h-4 text-stone-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            {businessType === 'coaching' && (
              currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[var(--accent)] font-bold hidden sm:inline-block">
                    🎓 {currentUser.email.split('@')[0]}
                  </span>
                  <button
                    onClick={() => {
                      playClickSound();
                      const element = document.getElementById('dynamic_modules');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-[10px] border border-amber-500/30 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-3.5 py-1.5 rounded-full font-black transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    Dashboard Portal 🚀
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      localStorage.removeItem('userToken');
                      setCurrentUser(null);
                      setCoachingTab('student_portal');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[10px] border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-full font-bold transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    playClickSound();
                    if (businessType === 'coaching') {
                      window.location.href = '/login';
                    } else {
                      setAuthTab('login');
                      setAuthError('');
                      setAuthSuccess('');
                      setShowAuthModal(true);
                    }
                  }}
                  className="text-[10px] border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/20 text-white px-4 py-1.5 rounded-full font-bold transition-all active:scale-95 shadow-inner"
                >
                  Login
                </button>
              )
            )}
            <a 
              href="#contact"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              className="text-xs font-semibold px-4.5 py-2.5 rounded-full text-white shadow-lg shadow-indigo-500/10 hover:scale-105 active:scale-95 transition-all animate-pulse"
            >
              Consult Now
            </a>
          </div>
        </div>
      </header>

      {/* Emergency support visual siren overlay for AarogyaCare */}
      {activeSupportSiren && (
        <div className="fixed inset-0 z-50 pointer-events-none border-[12px] border-rose-600/30 animate-pulse bg-rose-950/20 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-slate-950 border border-rose-600 p-6 rounded-2xl pointer-events-auto text-center space-y-4 max-w-sm shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
            <h3 className="text-white font-bold text-sm">EMERGENCY SHEILD ACTIVE</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Simulating WebSocket distress webhook transmission across AarogyaCare medical coordinates. Dispatching Rapid EMT unit...</p>
            <button 
              onClick={() => setActiveSupportSiren(false)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-transform active:scale-95"
            >
              Mute Dispatch Alert
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <section id="home" className="relative pt-24 pb-20 md:pt-36 md:pb-32 px-6 overflow-hidden max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700 ${businessType === 'coaching' ? 'lg:col-span-12 flex flex-col items-center text-center' : 'lg:col-span-7'}`}>
          
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1.5 px-3.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-[var(--accent)]">
              {theme.name} ACTIVE
            </span>
          </div>

          <h1 className={`text-4xl md:text-5xl lg:text-7xl font-royal royal-heading tracking-wide leading-[1.12] text-[var(--text-custom)] text-glow ${businessType === 'coaching' ? 'text-center max-w-4xl font-bold not-italic' : 'font-normal italic'}`}>
            {hero.title}
          </h1>

          <p className={`text-slate-300 text-sm md:text-base leading-relaxed font-sans tracking-wide ${businessType === 'coaching' ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'}`}>
            {hero.subtitle}
          </p>

          <div className={`flex items-center gap-2 text-[10px] text-slate-400 font-mono tracking-wider bg-white/5 border border-white/5 w-fit rounded-lg p-2 ${businessType === 'coaching' ? 'mx-auto' : ''}`}>
            <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
            JABALPUR BRANDING ACTIVE: <span className="font-bold text-[var(--primary)] uppercase">{hero.jabalpurBranding.landmark} EFFECT</span>
          </div>

          <div className={`flex flex-wrap items-center gap-4 pt-3 ${businessType === 'coaching' ? 'justify-center' : ''}`}>
            <a
              href={businessType === 'coaching' && !currentUser ? undefined : "#dynamic_modules"}
              onClick={(e) => {
                if (businessType === 'coaching') {
                  e.preventDefault();
                  playClickSound();
                  if (!currentUser) {
                    window.location.href = '/login';
                  } else {
                    const element = document.getElementById('dynamic_modules');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }
              }}
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              className="px-8 py-3.5 rounded-full font-semibold text-white shadow-xl hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
            >
              {businessType === 'coaching' && currentUser ? "Go to Dashboard" : hero.ctaText}
            </a>
            <a
              href="#about"
              className="bg-white/5 border border-white/10 px-8 py-3.5 rounded-full font-semibold text-slate-200 hover:bg-white/10 transition-all text-sm"
            >
              Explore Mission
            </a>
          </div>
        </div>

        <div className={`relative flex animate-in fade-in slide-in-from-right-5 duration-700 delay-200 ${businessType === 'coaching' ? 'lg:col-span-12 justify-center mx-auto mt-6' : 'lg:col-span-5 justify-center lg:justify-end'}`}>
          <div className="w-[320px] h-[340px] md:w-[380px] md:h-[400px] rounded-3xl overflow-hidden royal-frame relative group shadow-2xl">
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              <img 
                src={hero.bgImage} 
                alt="Dynamic visual representation" 
                className="w-full h-full object-cover opacity-85 group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-custom)] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 glass-panel border border-amber-500/20 rounded-2xl p-4 animate-float">
                <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider block mb-1 font-sans">
                  Jabalpur Smart Engine OS
                </span>
                <p className="text-white font-royal royal-heading font-medium text-xs leading-snug">
                  Fully functional no-code dynamic layout swapper active. Switch themes instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Sections Loop */}
      {sections.map((section) => {
        if (!section.visible) return null;

        return (
          <section 
            key={section.id} 
            id={section.id} 
            className="py-16 md:py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/5"
          >
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-royal royal-heading font-semibold tracking-wide text-[var(--text-custom)]">
                {section.title}
              </h2>
              {/* Centered Royal Crown Divider */}
              <div className="flex items-center justify-center gap-3 my-2 opacity-80 pointer-events-none">
                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/50"></span>
                <span className="text-amber-500/70 text-[10px] tracking-widest font-sans">✦ ♛ ✦</span>
                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/50"></span>
              </div>
              <p className="text-slate-400 text-xs md:text-sm font-sans tracking-wide">
                {section.subtitle}
              </p>
            </div>

            {section.type === 'features' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.content.map((feat, fIdx) => (
                  <div key={fIdx} className="royal-card rounded-[var(--radius-custom)] p-8 space-y-4 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                    <div 
                      style={{ background: `${theme.primary}12`, borderColor: 'rgba(251,191,36,0.2)' }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner border text-glow"
                    >
                      {feat.icon}
                    </div>
                    <h3 className="text-lg font-royal royal-heading font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.content.map((stat, sIdx) => (
                  <div key={sIdx} className="royal-card rounded-[var(--radius-custom)] p-8 text-center space-y-2 relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                    <p className="text-4xl md:text-5xl font-royal royal-heading font-bold text-glow" style={{ color: theme.accent || '#fbbf24' }}>
                      {stat.number}
                    </p>
                    <div className="w-8 h-[1px] bg-amber-500/30 mx-auto my-2" />
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-sans">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <p className="text-slate-300 text-sm leading-relaxed font-sans tracking-wide">
                    {section.content.text}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span className="text-xs text-slate-300 font-semibold font-sans">ISO 9001:2026 Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[var(--primary)]" />
                      <span className="text-xs text-slate-300 font-semibold font-sans">Verified Command</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <div className="royal-frame rounded-3xl shadow-2xl relative max-w-md mx-auto overflow-hidden">
                    <div className="rounded-2xl overflow-hidden aspect-video relative">
                      <img 
                        src={section.content.image} 
                        alt="Core vision graphic" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/20 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* ========================================================
          DYNAMIC BUSINESS MODULES HUB
          Completely rewritten to fulfill the user's exact parameters
          ======================================================== */}
      {((businessType !== 'coaching') || currentUser) && (
        <section id="dynamic_modules" className="py-20 md:py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/5 relative">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-block bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-[10px] tracking-widest px-3 py-1 rounded-full uppercase font-sans">
            Active Operating System Module
          </div>
          <h2 className="text-3xl md:text-4xl font-royal royal-heading font-semibold tracking-wide text-[var(--text-custom)]">
            Smart Interactive Command Desk
          </h2>
          {/* Centered Royal Crown Divider */}
          <div className="flex items-center justify-center gap-3 my-2 opacity-80 pointer-events-none">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/50"></span>
            <span className="text-amber-500/70 text-[10px] tracking-widest font-sans">✦ ♛ ✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/50"></span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm font-sans tracking-wide">
            Experience the custom interactive widgets programmed for **{theme.name}** ({theme.themeIdea || businessType.toUpperCase()}).
          </p>
        </div>

        {feedbackMsg && (
          <div className="max-w-2xl mx-auto mb-8 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-300 text-xs text-center animate-pulse">
            {feedbackMsg}
          </div>
        )}

        {/* 1. NextRank Institute (Coaching up to 12th) */}
        {businessType === 'coaching' && (
          <div className="space-y-16 animate-in fade-in duration-1000 font-poppins">
            
            {/* Live Stats Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Students Enrolled", value: "12,500+", color: "from-blue-600 to-indigo-600", icon: "👥" },
                { label: "AIR Selections", value: "42+", color: "from-amber-500 to-orange-600", icon: "🏆" },
                { label: "Mock Tests Conducted", value: "1,250+", color: "from-cyan-500 to-teal-500", icon: "📝" },
                { label: "Expert Faculty", value: "80+", color: "from-purple-500 to-indigo-500", icon: "👨‍🏫" }
              ].map((stat, sIdx) => (
                <div key={sIdx} className="royal-card p-6 text-center space-y-2 relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(79,70,229,0.08)] bg-white/[0.04]">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-full blur-lg" />
                  <span className="text-3xl block">{stat.icon}</span>
                  <p className="text-3xl font-extrabold text-glow font-poppins text-white">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Courses Section */}
            <div id="courses" className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-royal royal-heading font-bold text-white text-glow">Our Premium Learning Tracks</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">Explore high-fidelity digital classrooms designed to bridge students towards competitive success.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {coachingCourses.map((course) => (
                  <div key={course.id} className="royal-card p-5 flex flex-col justify-between h-[290px] rounded-2xl relative border border-white/5 hover:border-[var(--accent)]/30 transition-all group overflow-hidden bg-white/[0.04]">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--primary)]/10 rounded-full blur-xl group-hover:bg-[var(--accent)]/20 transition-all" />
                    <div>
                      <span className="text-[9px] bg-[var(--primary)]/20 text-indigo-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{course.target}</span>
                      <h4 className="font-poppins font-bold text-sm text-white mt-3 group-hover:text-[var(--accent)] transition-all">{course.name}</h4>
                      <p className="text-slate-400 text-[10px] mt-2">Duration: <strong className="text-slate-200">{course.duration}</strong></p>
                      <p className="text-slate-400 text-[10px]">Faculty: <strong className="text-slate-200">{course.faculty}</strong></p>
                    </div>
                    <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-emerald-400">{course.fees}</span>
                      <button 
                        onClick={() => {
                          if (!currentUser) {
                            playClickSound();
                            setAuthTab('login');
                            setAuthError('');
                            setAuthSuccess('');
                            setShowAuthModal(true);
                          } else {
                            triggerRazorpaySimulation(`${course.name} Enrollment`, course.fees);
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] px-3 py-1.5 rounded-lg transition-transform active:scale-95 shadow"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Features Grid */}
            <div id="features" className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-royal royal-heading font-bold text-white text-glow">Smart Glass Education Features</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">AI-powered analytics and attendance systems configured to maximize retention.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "AI Rank Predictor", desc: "Input mock scores to forecast competitive IIT-JEE and NEET national percentiles instantly.", icon: "🤖" },
                  { title: "Smart Attendance", desc: "Live biometric RFID tracking grids logged straight to parent nodes with microsecond latency.", icon: "📅" },
                  { title: "Online Mock Tests", desc: "Adaptive MCQ equation diagnostic series mapping conceptual weaknesses dynamically.", icon: "📝" },
                  { title: "AI Study Planner", desc: "Calculate targeted revision routines and study hour timetables personalized to weak areas.", icon: "🧠" },
                  { title: "Weak Subject Analyzer", desc: "Heatmap performance algorithms identifying physics or chemistry deficit nodes.", icon: "📊" },
                  { title: "Performance Heatmaps", desc: "Visual rating analytics tracking attendance curves and comparative state rank trends.", icon: "🔥" }
                ].map((feat, idx) => (
                  <div key={idx} className="royal-card p-6 rounded-2xl border border-white/5 space-y-3 relative overflow-hidden group hover:border-[var(--accent)]/30 bg-white/[0.04]">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-full blur-md" />
                    <span className="text-3xl block group-hover:scale-110 transition-transform">{feat.icon}</span>
                    <h4 className="font-poppins font-bold text-sm text-white">{feat.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Demo Section */}
            <div id="video_demo" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-white/5 pt-12">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block font-mono">Lecture Preview Sandbox</span>
                <h3 className="text-2xl font-royal royal-heading font-bold text-white text-glow">Interactive Video Lecture Classroom</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">
                  Savor full high-fidelity visual preview lectures loaded straight from our physics, chemistry, and mathematics databases. Click on alternate tracks to preview syllabus components immediately!
                </p>
                <div className="space-y-2 pt-2">
                  {[
                    { label: "Physics - Electromagnetism Class 12", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
                    { label: "Chemistry - Organic Benzene Synthesis", url: "https://www.w3schools.com/html/movie.mp4" }
                  ].map((vid, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVideo(vid.url)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                        selectedVideo === vid.url 
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white' 
                          : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      🎥 {vid.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="royal-frame rounded-2xl overflow-hidden shadow-2xl relative">
                  <video 
                    src={selectedVideo} 
                    controls 
                    className="w-full rounded-xl opacity-90 hover:opacity-100 transition-opacity aspect-video object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/80 border border-white/10 rounded-lg px-3 py-1 text-[10px] text-[var(--accent)] font-mono tracking-wider font-bold">
                    NextRank Glass Player
                  </div>
                </div>
              </div>
            </div>

            {/* Faculty Section */}
            <div id="faculty" className="space-y-6 border-t border-white/5 pt-12">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-royal royal-heading font-bold text-white text-glow">Sanskardhani's Elite Mentors</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">Learn from board-certified engineering and medical educators guiding competitive prep nodes.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {coachingFaculty.map((fac, idx) => (
                  <div key={idx} className="royal-card rounded-2xl overflow-hidden border border-white/5 relative group shadow-lg text-center p-6 space-y-4 bg-white/[0.04]">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-amber-500/30 group-hover:border-amber-500/60 transition-all shadow-lg relative">
                      <img src={fac.img} alt={fac.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-poppins font-bold text-sm text-white">{fac.name}</h4>
                      <p className="text-[10px] text-[var(--accent)] font-bold tracking-widest font-mono uppercase">{fac.subject} specialist</p>
                      <p className="text-[9px] text-slate-400">Exp: <strong className="text-slate-300">{fac.exp}</strong> | Qual: <strong className="text-slate-300">{fac.qual}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Leaderboard Results Section */}
            <div id="results" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-white/5 pt-12">
              {/* Leaderboard */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="font-royal royal-heading font-bold text-lg text-white flex items-center gap-2 text-glow">
                  🏆 NextRank AIR National Leaderboard UI
                </h4>
                <p className="text-slate-400 text-xs font-sans">Active ranking scores tracked from real-time database mocks.</p>
                <div className="space-y-2">
                  {[
                    { rank: "AIR 12", name: "Rahul Deshmukh (JEE Advanced)", percentile: "99.98%", score: "342/360" },
                    { rank: "AIR 28", name: "Kritika Soni (NEET Medical)", percentile: "99.95%", score: "708/720" },
                    { rank: "AIR 84", name: "Divyansh Patel (JEE Main)", percentile: "99.88%", score: "312/360" }
                  ].map((res, rIdx) => (
                    <div key={rIdx} className="bg-white/[0.04] border border-white/5 p-4 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-12 text-center bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded font-mono">{res.rank}</span>
                        <span className="font-poppins font-semibold text-white">{res.name}</span>
                      </div>
                      <div className="flex gap-4 font-mono text-[10px]">
                        <span className="text-[var(--accent)]">Percentile: <strong>{res.percentile}</strong></span>
                        <span className="text-emerald-400">Score: <strong>{res.score}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="font-royal royal-heading font-bold text-lg text-white text-glow">🌟 Parent & Student Testimonials</h4>
                <div className="royal-card p-6 rounded-2xl border border-white/5 relative overflow-hidden space-y-4 bg-white/[0.04]">
                  <div className="absolute top-4 right-4 text-5xl text-white/5 font-serif select-none pointer-events-none">“</div>
                  <p className="text-slate-300 text-xs italic leading-relaxed font-sans">
                    "NextRank Institute has completely changed my son's approach to JEE preparations. The smart rank predictors and immediate doubt assistances solved equations within minutes. Jabalpur is proud to have such a futuristic educational ecosystem."
                  </p>
                  <div className="border-t border-white/5 pt-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">V</div>
                    <div>
                      <p className="font-poppins font-bold text-xs text-white">Vijay Patel</p>
                      <p className="text-[9px] text-slate-500">Parent of Aarav Patel, Class 12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                NEXUS SMART INTERACTIVE COMMAND DESK
                Features 9 operational management modules & 4 AI systems
                ======================================================== */}
            <div className="border-t border-white/5 pt-12 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Smart Command Dashboard
                </span>
                <h3 className="text-2xl font-royal royal-heading font-bold text-white text-glow">Smart Interactive Command Desk</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  Administrate NextRank operations dynamically. Choose from 9 operational modules and utilize advanced local AI features!
                </p>
              </div>

              {/* Tab Navigation for 9 Modules */}
              <div className="flex bg-slate-900/40 border border-white/5 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-none whitespace-nowrap">
                {[
                  { id: 'student_portal', label: '🎓 Student Deck' },
                  { id: 'students', label: 'Students Admin' },
                  { id: 'faculty', label: 'Faculty' },
                  { id: 'courses', label: 'Courses' },
                  { id: 'tests', label: 'Test Builder' },
                  { id: 'attendance', label: 'RFID Log' },
                  { id: 'notes', label: 'Notes Library' },
                  { id: 'fees', label: 'Fees Manager' },
                  { id: 'admissions', label: 'Admissions' },
                  { id: 'analytics', label: 'AI Analytics' }
                ].filter(tab => {
                  if (!currentUser) return true; // Show all if not logged in
                  if (currentUser.role === 'admin') return true; // Show all to admin
                  // For student, restrict to learning modules only
                  return ['student_portal', 'courses', 'notes', 'faculty', 'analytics'].includes(tab.id);
                }).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { playClickSound(); setCoachingTab(tab.id); }}
                    className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      coachingTab === tab.id 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content area */}
              <div className="royal-card p-6 rounded-2xl border border-white/5 min-h-[300px] animate-in fade-in duration-300 bg-white/[0.04]">
                
                {/* 0. STUDENT DECK PORTAL */}
                {coachingTab === 'student_portal' && (
                  <div>
                    {!currentUser ? (
                      /* Beautiful Locked Glassmorphism Dashboard Preview */
                      <div className="max-w-2xl mx-auto bg-[#0d0d0d]/80 border border-amber-500/20 rounded-3xl p-8 space-y-6 backdrop-blur-md text-center relative overflow-hidden min-h-[340px] flex flex-col justify-center items-center shadow-2xl">
                        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl mb-2 animate-float">
                          🔒
                        </div>
                        <div className="space-y-2 max-w-md">
                          <h4 className="text-xl font-bold text-white font-poppins tracking-wide">NextRank Student Deck Locked</h4>
                          <p className="text-slate-400 text-xs font-sans leading-relaxed">
                            Milestone Portal is currently locked. Please use the <strong className="text-amber-400">"Login"</strong> option in the top navbar to authenticate and unlock your personalized AI studies metrics, interactive mock series, and RFID gate attendance logs.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            playClickSound();
                            setAuthTab('login');
                            setAuthError('');
                            setAuthSuccess('');
                            setShowAuthModal(true);
                          }}
                          className="mt-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-wider"
                        >
                          Authenticate Portal
                        </button>
                      </div>
                    ) : (
                      /* Active Student Dashboard Portal */
                      <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Welcome Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
                          <div>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-2">
                              🎓 Active Student Console
                            </span>
                            <h4 className="text-lg font-bold text-white font-poppins">Namaste, {currentUser.email.split('@')[0]}!</h4>
                            <p className="text-xs text-slate-400 font-sans mt-0.5">Your personalized learning benchmarks and AI test models are loaded.</p>
                          </div>
                          <div className="text-left md:text-right font-mono text-xs">
                            <span className="text-slate-500 block">Digital Student ID:</span>
                            <span className="font-bold text-[var(--accent)] text-xs tracking-wider">NR-2026-{(currentUser._id || '902').substring(0,6).toUpperCase()}</span>
                          </div>
                        </div>

                        {/* Performance Scorecards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            { label: "Overall Attendance", value: "96.4%", desc: "RFID Gate Registered", color: "text-emerald-400" },
                            { label: "Mock Diagnostic Score", value: quizScoreReport ? quizScoreReport : "Pending", desc: "Adaptive MCQ diagnostic", color: "text-[var(--accent)]" },
                            { label: "Course Coverage", value: "72.8%", desc: "Units 1-4 syllabus completed", color: "text-indigo-400" }
                          ].map((stat, idx) => (
                            <div key={idx} className="bg-slate-900/20 border border-white/5 rounded-xl p-5 space-y-2 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-8 h-8 bg-white/5 rounded-full blur-md" />
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-sans">{stat.label}</span>
                              <p className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</p>
                              <span className="text-[9px] text-slate-500 font-sans block">{stat.desc}</span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Quiz / Mock Sandbox */}
                        <div className="bg-slate-900/30 border border-white/5 p-6 rounded-2xl space-y-4">
                          <div>
                            <span className="text-[9px] text-[var(--accent)] font-bold tracking-widest uppercase block font-mono">Adaptive Diagnostic sandbox</span>
                            <h5 className="text-sm font-bold text-white font-poppins">NextRank Mini Board & JEE MCQ Diagnostic Quiz</h5>
                            <p className="text-slate-400 text-xs">Simulate board physics & chemistry questions to calculate conceptual strengths and evaluate your ranking percentile.</p>
                          </div>

                          {activeQuizIndex === -1 ? (
                            <button
                              onClick={() => { playClickSound(); setActiveQuizIndex(0); setSelectedQuizAnswers({}); setQuizScoreReport(''); }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow active:scale-95 animate-pulse"
                            >
                              ⚡ Start Mock Quiz (3 Questions)
                            </button>
                          ) : activeQuizIndex < 3 ? (
                            <div className="space-y-4 border border-white/10 p-5 rounded-xl bg-slate-950/60">
                              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono border-b border-white/5 pb-2">
                                <span>MCQ QUESTION {activeQuizIndex + 1} OF 3</span>
                                <span>TOPIC: {activeQuizIndex === 0 ? 'Electromagnetism (Physics)' : activeQuizIndex === 1 ? 'Organic Chemistry' : 'Modern Physics'}</span>
                              </div>
                              
                              <p className="text-white text-xs font-semibold font-poppins">
                                {activeQuizIndex === 0 && "Q1: The unit of electric potential difference is:"}
                                {activeQuizIndex === 1 && "Q2: Which compound is known as Laughing Gas (has nitrous oxide)?"}
                                {activeQuizIndex === 2 && "Q3: Lenz's Law is a consequence of the law of conservation of:"}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                {(activeQuizIndex === 0 ? ['Ohm', 'Ampere', 'Volt', 'Watt'] : 
                                  activeQuizIndex === 1 ? ['Nitric Oxide', 'Nitrous Oxide', 'Nitrogen Dioxide', 'Nitrogen Pentoxide'] :
                                  ['Charge', 'Mass', 'Momentum', 'Energy']
                                ).map((opt, oIdx) => (
                                  <button
                                    key={oIdx}
                                    onClick={() => {
                                      playClickSound();
                                      setSelectedQuizAnswers(prev => ({ ...prev, [activeQuizIndex]: opt }));
                                    }}
                                    className={`text-left text-xs p-3 rounded-xl border transition-all ${
                                      selectedQuizAnswers[activeQuizIndex] === opt 
                                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white font-bold' 
                                        : 'border-white/5 bg-slate-900/60 text-slate-400 hover:bg-white/5'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + oIdx)}. {opt}
                                  </button>
                                ))}
                              </div>

                              <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
                                <button
                                  onClick={() => {
                                    playClickSound();
                                    if (activeQuizIndex === 2) {
                                      // Score quiz
                                      let correct = 0;
                                      if (selectedQuizAnswers[0] === 'Volt') correct++;
                                      if (selectedQuizAnswers[1] === 'Nitrous Oxide') correct++;
                                      if (selectedQuizAnswers[2] === 'Energy') correct++;
                                      setQuizScoreReport(`${correct}/3 Correct`);
                                      setActiveQuizIndex(3); // Completed
                                    } else {
                                      setActiveQuizIndex(activeQuizIndex + 1);
                                    }
                                  }}
                                  disabled={!selectedQuizAnswers[activeQuizIndex]}
                                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow"
                                >
                                  {activeQuizIndex === 2 ? 'Compile Results' : 'Next Question'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="border border-emerald-500/20 p-5 rounded-xl bg-emerald-500/5 text-center space-y-3">
                              <span className="text-3xl">🏆</span>
                              <h6 className="font-bold text-white text-sm font-poppins">Diagnostic Finished! Your concepts are verified.</h6>
                              <p className="text-slate-300 text-xs">Score: <strong className="text-emerald-400 text-sm font-mono">{quizScoreReport}</strong> | Calculated Percentile: <strong className="text-[var(--accent)] text-sm font-mono">{quizScoreReport.startsWith('3') ? '99.88%' : quizScoreReport.startsWith('2') ? '98.42%' : '88.15%'}</strong></p>
                              <button
                                onClick={() => { playClickSound(); setActiveQuizIndex(-1); }}
                                className="bg-white/5 border border-white/10 text-slate-300 text-xs px-4 py-2 rounded-lg hover:bg-white/10"
                              >
                                Re-take Diagnostic
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 1. STUDENT MANAGEMENT */}
                {coachingTab === 'students' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h4 className="font-poppins font-bold text-sm text-white">Student Directory Logs</h4>
                      <span className="text-[10px] font-mono text-slate-500">Total Active: {coachingStudents.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white/5 p-4 rounded-xl border border-white/5">
                      <input 
                        type="text" 
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="Student Full Name"
                        className="bg-transparent border border-white/10 text-xs p-2 rounded-lg text-white placeholder-slate-600 focus:outline-none" 
                      />
                      <select
                        value={newStudentClass}
                        onChange={(e) => setNewStudentClass(e.target.value)}
                        className="bg-slate-950 border border-white/10 text-xs p-2 rounded-lg text-white"
                      >
                        <option value="Class 12">Class 12</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 6-8">Class 6-8 (Foundation)</option>
                      </select>
                      <button
                        onClick={() => {
                          if (!newStudentName) return;
                          setCoachingStudents(prev => [
                            ...prev,
                            { roll: `NR-${101 + prev.length}`, name: newStudentName, class: newStudentClass, batch: 'JEE Main', performance: '100%' }
                          ]);
                          setNewStudentName('');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg"
                      >
                        + Enroll Student
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-300">
                        <thead className="bg-white/5 text-[9px] uppercase font-bold tracking-wider text-slate-400">
                          <tr>
                            <th className="p-3">Roll Node</th>
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Classroom Level</th>
                            <th className="p-3">Target Batch</th>
                            <th className="p-3">Mock Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {coachingStudents.map((stud, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="p-3 font-mono text-[var(--accent)] font-bold">{stud.roll}</td>
                              <td className="p-3 font-semibold text-white">{stud.name}</td>
                              <td className="p-3">{stud.class}</td>
                              <td className="p-3"><span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">{stud.batch}</span></td>
                              <td className="p-3 text-emerald-400 font-bold font-mono">{stud.performance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. FACULTY MANAGEMENT */}
                {coachingTab === 'faculty' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-poppins font-bold text-sm text-white">Faculty Rosters</h4>
                      <span className="text-[10px] font-mono text-slate-500">Expert Staff: {coachingFaculty.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white/5 p-4 rounded-xl border border-white/5">
                      <input 
                        type="text" 
                        value={newFacName}
                        onChange={(e) => setNewFacName(e.target.value)}
                        placeholder="Faculty Full Name"
                        className="bg-transparent border border-white/10 text-xs p-2 rounded-lg text-white placeholder-slate-600 focus:outline-none" 
                      />
                      <select
                        value={newFacSubject}
                        onChange={(e) => setNewFacSubject(e.target.value)}
                        className="bg-slate-950 border border-white/10 text-xs p-2 rounded-lg text-white"
                      >
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Biology">Biology</option>
                      </select>
                      <button
                        onClick={() => {
                          if (!newFacName) return;
                          setCoachingFaculty(prev => [
                            ...prev,
                            { name: newFacName, subject: newFacSubject, exp: '10 Yrs', qual: newFacQual, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400' }
                          ]);
                          setNewFacName('');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg"
                      >
                        + Add Faculty Member
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {coachingFaculty.map((fac, idx) => (
                        <div key={idx} className="bg-slate-950 border border-white/5 p-4 rounded-xl flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-amber-500/20">
                            <img src={fac.img} alt={fac.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-poppins font-bold text-xs text-white">{fac.name}</p>
                            <p className="text-[10px] text-indigo-400 font-bold">{fac.subject} | {fac.qual}</p>
                            <p className="text-[9px] text-slate-500">Exp: {fac.exp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. COURSE MANAGEMENT */}
                {coachingTab === 'courses' && (
                  <div className="space-y-4">
                    <h4 className="font-poppins font-bold text-sm text-white">Course Curriculum Nodes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {coachingCourses.map((course, idx) => (
                        <div key={idx} className="bg-slate-950 border border-white/5 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="bg-indigo-500/10 text-indigo-400 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{course.id}</span>
                            <span className="font-mono text-xs font-black text-emerald-400">{course.fees}</span>
                          </div>
                          <h5 className="font-poppins font-bold text-xs text-white">{course.name}</h5>
                          <p className="text-[10px] text-slate-400">Instructed by: <strong>{course.faculty}</strong> | Duration: <strong>{course.duration}</strong></p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. TEST MANAGEMENT */}
                {coachingTab === 'tests' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-poppins font-bold text-sm text-white">Test Builder Console</h4>
                      <span className="text-[10px] font-mono text-slate-500">Scheduled tests: {coachingTests.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white/5 p-4 rounded-xl border border-white/5">
                      <input 
                        type="text" 
                        value={newTestName}
                        onChange={(e) => setNewTestName(e.target.value)}
                        placeholder="e.g. JEE Mock Test 5"
                        className="bg-transparent border border-white/10 text-xs p-2 rounded-lg text-white placeholder-slate-600 focus:outline-none" 
                      />
                      <select
                        value={newTestSubject}
                        onChange={(e) => setNewTestSubject(e.target.value)}
                        className="bg-slate-950 border border-white/10 text-xs p-2 rounded-lg text-white"
                      >
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Biology">Biology</option>
                      </select>
                      <button
                        onClick={() => {
                          if (!newTestName) return;
                          setCoachingTests(prev => [
                            ...prev,
                            { id: `T-${101 + prev.length}`, name: newTestName, subject: newTestSubject, duration: '180 mins', date: 'Tomorrow' }
                          ]);
                          setNewTestName('');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg"
                      >
                        + Schedule Mock Equation
                      </button>
                    </div>

                    <div className="space-y-2">
                      {coachingTests.map((t, idx) => (
                        <div key={idx} className="bg-slate-950 border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono text-slate-500 text-[10px] uppercase font-bold block">{t.id}</span>
                            <span className="font-poppins font-bold text-white">{t.name}</span>
                          </div>
                          <div className="flex gap-4 font-mono text-[9px] text-slate-400">
                            <span>Subject: <strong className="text-white">{t.subject}</strong></span>
                            <span>Time: <strong className="text-white">{t.duration}</strong></span>
                            <span>Date: <strong className="text-[var(--accent)]">{t.date}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. ATTENDANCE SYSTEM */}
                {coachingTab === 'attendance' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-poppins font-bold text-sm text-white">RFID Biometric Logs</h4>
                      <button
                        onClick={() => {
                          const names = ['Aarav Sharma', 'Ananya Patel', 'Rohan Gupta', 'Sneha Verma'];
                          const selected = names[Math.floor(Math.random() * names.length)];
                          const hour = String(Math.floor(Math.random() * 2) + 7).padStart(2, '0');
                          const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');
                          const randTime = `${hour}:${min} AM`;
                          setAttendanceLogs(prev => [
                            { name: selected, timestamp: randTime, status: hour === '07' ? 'PRESENT' : 'LATE', method: 'RFID Gate' },
                            ...prev
                          ]);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                      >
                        ⚡ Simulate Gate scan
                      </button>
                    </div>

                    <div className="space-y-2 h-[180px] overflow-y-auto pr-1">
                      {attendanceLogs.map((log, idx) => (
                        <div key={idx} className="bg-slate-950 border border-white/5 p-3 rounded-xl flex items-center justify-between text-[10px]">
                          <div>
                            <span className="font-poppins font-bold text-white block">{log.name}</span>
                            <span className="text-slate-500 text-[9px] font-mono">Scanner: {log.method}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-slate-400">{log.timestamp}</span>
                            <span className={`font-bold px-2 py-0.5 rounded-full text-[8px] tracking-wider ${
                              log.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400' :
                              log.status === 'LATE' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. NOTES LIBRARY */}
                {coachingTab === 'notes' && (
                  <div className="space-y-4">
                    <h4 className="font-poppins font-bold text-sm text-white">Study Notes Repository</h4>
                    
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newNoteTitle) return;
                        setUploadedNotes(prev => [
                          { id: Date.now(), title: newNoteTitle.endsWith('.pdf') ? newNoteTitle : newNoteTitle + '.pdf', date: 'Just now' },
                          ...prev
                        ]);
                        setNewNoteTitle('');
                      }}
                      className="flex gap-2"
                    >
                      <input 
                        type="text" required 
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        placeholder="e.g. Physics_Ch4_Quantum.pdf" 
                        className="flex-1 bg-transparent border border-white/10 text-xs px-3 py-2 rounded-xl text-white placeholder-slate-600 focus:outline-none" 
                      />
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 rounded-xl">
                        + Upload Notes PDF
                      </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {uploadedNotes.map(note => (
                        <div key={note.id} className="bg-slate-950 border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-200">📂 {note.title}</span>
                          <span className="text-slate-500 text-[9px]">{note.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. FEES MANAGEMENT */}
                {coachingTab === 'fees' && (
                  <div className="space-y-4">
                    <h4 className="font-poppins font-bold text-sm text-white">Tuition Fees Ledgers</h4>
                    <div className="space-y-2">
                      {feesInvoices.map((inv, idx) => (
                        <div key={idx} className="bg-slate-950 border border-white/5 p-4 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-poppins font-bold text-white block">{inv.name}</span>
                            <span className="text-slate-500 text-[9px]">Course: {inv.course}</span>
                          </div>
                          <div className="flex gap-6 font-mono text-[10px] items-center">
                            <span className="text-emerald-400">Paid: {inv.paid}</span>
                            <span className="text-rose-500">Due: {inv.due}</span>
                            <span className={`font-bold px-2 py-0.5 rounded text-[8px] uppercase ${
                              inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {inv.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. ADMISSION MANAGEMENT */}
                {coachingTab === 'admissions' && (
                  <div className="space-y-4">
                    <h4 className="font-poppins font-bold text-sm text-white">Admission Prospect Leads</h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-white/5 p-4 rounded-xl border border-white/5">
                      <input 
                        type="text" 
                        value={newLeadName}
                        onChange={(e) => setNewLeadName(e.target.value)}
                        placeholder="Lead Name"
                        className="bg-transparent border border-white/10 text-xs p-2 rounded-lg text-white placeholder-slate-600 focus:outline-none" 
                      />
                      <input 
                        type="text" 
                        value={newLeadPhone}
                        onChange={(e) => setNewLeadPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="bg-transparent border border-white/10 text-xs p-2 rounded-lg text-white placeholder-slate-600 focus:outline-none" 
                      />
                      <select
                        value={newLeadTarget}
                        onChange={(e) => setNewLeadTarget(e.target.value)}
                        className="bg-slate-950 border border-white/10 text-xs p-2 rounded-lg text-white"
                      >
                        <option value="JEE">JEE</option>
                        <option value="NEET">NEET</option>
                        <option value="Class 10">Class 10</option>
                      </select>
                      <button
                        onClick={() => {
                          if (!newLeadName) return;
                          setAdmissionLeads(prev => [
                            ...prev,
                            { name: newLeadName, phone: newLeadPhone, email: 'lead@inquiry.com', target: newLeadTarget, status: 'Inquiry' }
                          ]);
                          setNewLeadName('');
                          setNewLeadPhone('');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg"
                      >
                        + Add Lead
                      </button>
                    </div>

                    <div className="space-y-2">
                      {admissionLeads.map((l, idx) => (
                        <div key={idx} className="bg-slate-950 border border-white/5 p-3 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-poppins font-bold text-white block">{l.name}</span>
                            <span className="text-slate-500 text-[10px]">Contact: {l.phone}</span>
                          </div>
                          <div className="flex gap-4 font-mono text-[9px] items-center">
                            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">{l.target}</span>
                            <span className="text-amber-400 uppercase font-bold">{l.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. ANALYTICS DASHBOARD */}
                {coachingTab === 'analytics' && (
                  <div className="space-y-6">
                    <h4 className="font-poppins font-bold text-sm text-white">Smart Engine Analytics Telemetry</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Attendance curves */}
                      <div className="bg-slate-950 border border-white/5 p-4 rounded-xl space-y-3">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Monthly Attendance distribution</span>
                        <div className="h-[120px] flex items-end justify-between pt-6 font-mono text-[9px] text-slate-500">
                          {[
                            { month: 'Jan', val: '84%', h: '84%' },
                            { month: 'Feb', val: '92%', h: '92%' },
                            { month: 'Mar', val: '98%', h: '98%' },
                            { month: 'Apr', val: '96%', h: '96%' },
                            { month: 'May', val: '97.8%', h: '97.8%' }
                          ].map((bar, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 group">
                              <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{bar.val}</span>
                              <div style={{ height: bar.h }} className="w-8 bg-gradient-to-t from-indigo-600/20 to-indigo-500 rounded-t shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all group-hover:scale-y-105" />
                              <span>{bar.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance analytics */}
                      <div className="bg-slate-950 border border-white/5 p-4 rounded-xl space-y-3">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Core Syllabus Heatmap</span>
                        <div className="space-y-2">
                          {[
                            { subject: 'Physics (Electromagnetism)', rating: 91, color: 'bg-emerald-500' },
                            { subject: 'Chemistry (Organic)', rating: 78, color: 'bg-amber-500' },
                            { subject: 'Mathematics (Calculus)', rating: 88, color: 'bg-indigo-500' },
                            { subject: 'Biology (Cell Biology)', rating: 94, color: 'bg-emerald-500' }
                          ].map((sub, idx) => (
                            <div key={idx} className="space-y-1 text-[10px]">
                              <div className="flex justify-between text-slate-300">
                                <span>{sub.subject}</span>
                                <span className="font-mono font-bold text-white">{sub.rating}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div style={{ width: `${sub.rating}%` }} className={`h-full ${sub.color}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* ========================================================
                AI ECOSYSTEM INTEGRATIONS
                Rank Predictor, Doubt solver, and Study planners
                ======================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-white/5 pt-12">
              
              {/* 1. AI Rank Predictor */}
              <div className="royal-card p-6 rounded-2xl border border-white/5 space-y-4 relative overflow-hidden bg-white/[0.04] shadow-[0_0_25px_rgba(0,229,255,0.05)]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--accent)]/5 rounded-full blur-xl" />
                <h4 className="font-poppins font-bold text-sm text-white flex items-center gap-1.5 text-glow">
                  🤖 NextRank AI Rank Predictor
                </h4>
                <p className="text-slate-400 text-xs">Enter your simulated JEE Main marks (0-360) to predict target percentiles & ranks instantly.</p>
                
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Mock Marks Score</span>
                    <span className="text-white font-bold">{rankMockScore}/360</span>
                  </div>
                  <input 
                    type="range" min="0" max="360"
                    value={rankMockScore}
                    onChange={(e) => {
                      const score = parseInt(e.target.value);
                      setRankMockScore(score);
                      
                      // Calculate mock percentiles
                      const pct = Math.min(100, Math.max(10, 10 + (score / 360) * 89.99)).toFixed(2);
                      const rk = Math.max(1, Math.round(1000000 * (1 - pct / 100)));
                      setPredictedRankPercentile(`${pct}% Percentile`);
                      setPredictedRank(`Predicted Rank: AIR ${rk}`);
                    }}
                    className="w-full accent-[var(--accent)] h-1 rounded-full cursor-pointer bg-white/10" 
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const pct = Math.min(100, Math.max(10, 10 + (rankMockScore / 360) * 89.99)).toFixed(2);
                        const rk = Math.max(1, Math.round(1000000 * (1 - pct / 100)));
                        setPredictedRankPercentile(`${pct}% Percentile`);
                        setPredictedRank(`Predicted Rank: AIR ${rk}`);
                      }}
                      className="w-full bg-[var(--accent)] hover:opacity-90 text-slate-950 font-bold text-xs py-2 rounded-lg transition-transform active:scale-95"
                    >
                      Calculate AI Projection
                    </button>
                  </div>
                </div>

                {predictedRankPercentile && (
                  <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 p-3 rounded-xl text-center space-y-1 animate-in zoom-in-95 duration-200">
                    <p className="font-mono text-sm font-black text-[var(--accent)]">{predictedRankPercentile}</p>
                    <p className="font-poppins text-xs font-semibold text-white">{predictedRank}</p>
                  </div>
                )}
              </div>

              {/* 2. AI Doubt Solver */}
              <div className="royal-card p-6 rounded-2xl border border-white/5 space-y-4 relative overflow-hidden bg-white/[0.04]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl" />
                <h4 className="font-poppins font-bold text-sm text-white flex items-center gap-1.5 text-glow">
                  💡 AI Doubt Solver Assistant
                </h4>
                <p className="text-slate-400 text-xs">Write your physics equations or chemistry doubts to receive instant local conceptual explanations.</p>
                
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={aiDoubtPrompt}
                    onChange={(e) => setAiDoubtPrompt(e.target.value)}
                    placeholder="e.g. What is Lenz's law?" 
                    className="w-full bg-slate-950 border border-white/10 text-xs px-3 py-2.5 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50" 
                  />
                  <button 
                    onClick={() => {
                      if (!aiDoubtPrompt) return;
                      setAiDoubtResult('Analyzing equations telemetry...');
                      setTimeout(() => {
                        if (aiDoubtPrompt.toLowerCase().includes('lenz')) {
                          setAiDoubtResult("💡 Lenz's Law: The direction of the induced current is such that it opposes the change in magnetic flux that produced it. Formulated by Emil Lenz in 1834. Equation: E = -dΦ/dt (The negative sign denotes Lenz's law opposing effect).");
                        } else if (aiDoubtPrompt.toLowerCase().includes('ohm')) {
                          setAiDoubtResult("💡 Ohm's Law: The current flowing through a conductor is directly proportional to the potential difference across its ends, provided temperature remains constant. Equation: V = IR.");
                        } else {
                          setAiDoubtResult(`💡 Analysis response generated for: "${aiDoubtPrompt}". Standard physics laws applied. Induced emf opposes flux change, matching Newton's third law concept bounds.`);
                        }
                      }, 1000);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-lg"
                  >
                    Solve Doubt Instantly
                  </button>
                </div>

                {aiDoubtResult && (
                  <div className="bg-slate-950 border border-white/5 p-3 rounded-xl text-[10px] text-slate-300 leading-relaxed max-h-[120px] overflow-y-auto pr-1">
                    {aiDoubtResult}
                  </div>
                )}
              </div>

              {/* 3. AI Study Planner */}
              <div className="royal-card p-6 rounded-2xl border border-white/5 space-y-4 relative overflow-hidden bg-white/[0.04]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
                <h4 className="font-poppins font-bold text-sm text-white flex items-center gap-1.5 text-glow">
                  🧠 AI Customized Study Planner
                </h4>
                <p className="text-slate-400 text-xs">Set your targeted daily study hours to construct a personalized syllabus timetable instantly.</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Target Study Hours</span>
                    <span className="text-white font-bold">{aiStudyPlannerHours} Hrs/Day</span>
                  </div>
                  <input 
                    type="range" min="4" max="16"
                    value={aiStudyPlannerHours}
                    onChange={(e) => setAiStudyPlannerHours(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 h-1 rounded-full cursor-pointer bg-white/10" 
                  />
                  <button 
                    onClick={() => {
                      const hours = aiStudyPlannerHours;
                      setAiStudyPlan({
                        slot1: `📚 Physics Core: ${Math.round(hours * 0.4)} hrs (Electromagnetism MCQ revisions)`,
                        slot2: `🔬 Chemistry Organic: ${Math.round(hours * 0.3)} hrs (Benzene rings synthesis practice)`,
                        slot3: `📐 Mathematics Calculus: ${Math.round(hours * 0.3)} hrs (Differential equations exercises)`
                      });
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-lg"
                  >
                    Generate AI Timetable
                  </button>
                </div>

                {aiStudyPlan && (
                  <div className="bg-slate-950 border border-white/5 p-3 rounded-xl space-y-1.5 text-[9px] text-slate-300 font-mono leading-tight">
                    <p className="text-emerald-400 font-bold border-b border-white/5 pb-1">TIMETABLE GENERATED:</p>
                    <p>{aiStudyPlan.slot1}</p>
                    <p>{aiStudyPlan.slot2}</p>
                    <p>{aiStudyPlan.slot3}</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* 2. Libaas (E-Commerce) */}
        {businessType === 'ecommerce' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[var(--primary)]" />
                Luxury Liquid Couture Catalog
              </h3>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI RECOMMENDATIONS:</span>
                <select 
                  value={aiSuggestSelection} 
                  onChange={(e) => setAiSuggestSelection(e.target.value)}
                  className="bg-slate-900 border border-white/10 text-xs p-2 rounded-lg text-white font-semibold"
                >
                  <option value="Traditional">Royal Traditional Feasts</option>
                  <option value="Modern">Contemporary Silk Duplex</option>
                  <option value="Fusion">Indo-Western Liquid Gold</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { id: 1, name: 'Royal Silk Sherwani', category: 'Traditional', price: '₹45,000', img: 'https://images.unsplash.com/photo-1597983073492-bc24058bf377?q=80&w=400' },
                { id: 2, name: 'Linen Saffron Kurta', category: 'Traditional', price: '₹12,500', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400' },
                { id: 3, name: 'Liquid Sateen Tuxedo', category: 'Modern', price: '₹65,000', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400' },
                { id: 4, name: 'Organza Gold Lehenga', category: 'Fusion', price: '₹85,000', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400' }
              ].map((prod) => {
                const isSuggested = prod.category === aiSuggestSelection;
                const inWish = wishlist.includes(prod.id);

                return (
                  <div 
                    key={prod.id} 
                    style={{ borderColor: isSuggested ? `${theme.primary}50` : 'rgba(255,255,255,0.05)' }}
                    className="glass-card rounded-2xl overflow-hidden border relative group shadow-lg"
                  >
                    {isSuggested && (
                      <span className="absolute top-3 left-3 z-10 bg-[var(--primary)] text-white text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI RECOMMENDED STYLE
                      </span>
                    )}

                    <button 
                      onClick={() => {
                        playClickSound();
                        setWishlist(prev => inWish ? prev.filter(id => id !== prod.id) : [...prev, prod.id]);
                      }}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/60 border border-white/5 text-white hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWish ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                    </button>

                    <div className="h-56 overflow-hidden relative">
                      <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500" />
                    </div>

                    <div className="p-5 space-y-3">
                      <h4 className="font-bold text-xs text-slate-100">{prod.name}</h4>
                      
                      <div className="flex gap-1.5">
                        {['S', 'M', 'L'].map(size => (
                          <button 
                            key={size} 
                            onClick={() => setSelectedSize(size)}
                            className={`w-6 h-6 border rounded-lg text-[9px] font-bold ${
                              selectedSize === size ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/5 text-slate-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="font-mono text-xs font-black text-[var(--primary)]">{prod.price}</span>
                        
                        <button
                          onClick={() => {
                            setCart(prev => [...prev, prod.id]);
                            triggerRazorpaySimulation(prod.name, prod.price);
                          }}
                          className="bg-white/5 hover:bg-[var(--accent)] border border-white/10 hover:border-transparent text-white px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. AashiyanaX (Real Estate Website) */}
        {businessType === 'real_estate' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--primary)]" />
                Luxury Property Glass UI Portal
              </h3>

              {/* Property filters */}
              <div className="flex gap-2">
                {['All', 'Villas', 'Plots', 'Duplexes'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPropertyFilter(cat)}
                    className={`text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all ${
                      propertyFilter === cat ? 'bg-[var(--primary)] text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {virtualTourActive ? (
              <div className="w-full h-[320px] rounded-2xl bg-black border border-white/10 relative overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl flex items-center justify-center">
                {/* 3D simulated panorama */}
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200" 
                  alt="3D Panorama Tour" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 animate-pulse blur-[1px]" 
                />
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button 
                    onClick={() => setVirtualTourActive(false)}
                    className="bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg"
                  >
                    Exit 3D Blueprints
                  </button>
                </div>
                <div className="relative text-center space-y-2 p-6 glass-panel border border-white/10 max-w-sm rounded-2xl animate-float">
                  <Eye className="w-8 h-8 text-[var(--accent)] mx-auto animate-pulse" />
                  <h4 className="text-white font-bold text-xs">Simulated 3D Spatial Blueprints</h4>
                  <p className="text-slate-400 text-[10px]">Use key-drag elements to interact with the interior structures of the Villa. Multi-channel lighting parameters active.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'The Aashiyana Duplex', type: 'Duplexes', location: 'Vijay Nagar Prime', price: '₹1.8 Crores', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600' },
                  { title: 'Riverfront Crest Villa', type: 'Villas', location: 'Tilwara Ghat Road', price: '₹2.6 Crores', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=600' },
                  { title: 'Glass Canopy Plots', type: 'Plots', location: 'Bhedaghat Bypass', price: '₹95 Lakhs', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600' }
                ].filter(p => propertyFilter === 'All' || p.type === propertyFilter).map((prop, idx) => (
                  <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--primary)]/30 group">
                    <div className="h-44 overflow-hidden relative">
                      <img src={prop.img} alt={prop.title} className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-[var(--accent)] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {prop.type}
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <h4 className="font-bold text-xs text-white">{prop.title}</h4>
                      <p className="text-slate-400 text-[10px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {prop.location}
                      </p>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { playClickSound(); setVirtualTourActive(true); }}
                          className="bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[9px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-indigo-400" />
                          Launch 3D Tour
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="font-mono text-xs font-black text-[var(--primary)]">{prop.price}</span>
                        <button 
                          onClick={() => triggerRazorpaySimulation(prop.title, prop.price)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all"
                        >
                          Book Agent
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. AarogyaCare (Hospital & Clinic Website) */}
        {businessType === 'hospital' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-[var(--primary)]" />
                Active Diagnostic Specialist Profiles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Dr. Alok Mishra (MD)', dept: 'Cardiology Support', wait: '15 min', status: 'AVAILABLE' },
                  { name: 'Dr. Ritu Verma (DM)', dept: 'Brain Neuro-Sciences', wait: '10 min', status: 'AVAILABLE' }
                ].map((doc, idx) => (
                  <div key={idx} className="glass-card rounded-xl p-4 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-white">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{doc.dept}</p>
                      <span className="text-[8px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block">
                        WAIT TIME: {doc.wait}
                      </span>
                    </div>
                    <span className="text-[8px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Health reports section */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-[var(--accent)]" />
                  AarogyaCare Patient Health Reports Vault
                </h4>
                <p className="text-slate-400 text-xs">Access secure clinical test diagnostics and blood telemetry sheets directly.</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => triggerRazorpaySimulation('Blood Diagnostics Report Download', 200)}
                    className="bg-white/5 hover:bg-slate-800 border border-white/10 text-slate-200 text-[10px] font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Download Blood Report (₹200)
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">Book Clinic Consultation</h4>
                <button 
                  onClick={() => { playClickSound(); setActiveSupportSiren(true); }}
                  className="bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 font-bold text-[8px] px-2 py-1 rounded-lg uppercase tracking-wider"
                >
                  Emergency Support
                </button>
              </div>

              <form onSubmit={(e) => triggerMockSubmit(e, 'AarogyaCare appointment confirmed! Clinic seat token has been issued.')} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Patient Full Name</label>
                  <input 
                    type="text" required 
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Anjali Verma" 
                    className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded-lg text-white placeholder-slate-600 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Clinic Department</label>
                  <select 
                    value={bookingDept} 
                    onChange={(e) => setBookingDept(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 text-xs p-3 rounded-lg text-white"
                  >
                    <option>Cardiology (Heart Care)</option>
                    <option>Neuro-Sciences (Brain/Stroke)</option>
                    <option>Emergency Diagnostics</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                  className="w-full text-xs font-semibold py-3 rounded-lg text-white shadow-lg transition-transform active:scale-95"
                >
                  {submitting ? 'Connecting Clinic...' : 'Book Consult Seat'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 5. Cafe Aura (Cafe & Restaurant) */}
        {businessType === 'cafe' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[var(--primary)]" />
                Cafe Aura Coffee Glass Lounge Menu
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 1, name: 'Aura Espresso Roast', price: '₹180', desc: 'Micro-roasted single-origin dark coffee brew.', category: 'Coffee' },
                  { name: 'Saffron Cream Frappe', price: '₹260', desc: 'Blended cold frappe with organic honey saffron.', category: 'Special' },
                  { name: 'Warm Marble Brownie', price: '₹220', desc: 'Chocolaty soft brownie baked inside cream white shell.', category: 'Dessert' }
                ].map((item, idx) => (
                  <div key={idx} className="glass-card rounded-xl p-4 border border-white/5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[8px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-1">{item.category}</span>
                      <h4 className="font-bold text-xs text-white">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end shrink-0">
                      <span className="font-mono text-xs font-bold text-[var(--primary)]">{item.price}</span>
                      <button 
                        onClick={() => {
                          setOrderCart(prev => [...prev, item.name]);
                          triggerRazorpaySimulation(item.name, item.price);
                        }}
                        className="bg-white/5 hover:bg-[var(--accent)] border border-white/10 hover:border-transparent text-white px-2 py-1 rounded-lg text-[9px] transition-all"
                      >
                        Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live music schedules calendar */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Volume2 className="w-4.5 h-4.5 text-[var(--accent)]" />
                  Cafe Aura Unplugged Live Music Schedules
                </h4>
                <p className="text-slate-400 text-xs">Join our coffee lounge unplugged sessions every weekend featuring local Sanskardhani acoustic singer bands.</p>
                <div className="bg-slate-900 border border-white/5 px-3 py-2 rounded-xl text-[10px] font-mono text-slate-300">
                  ⚡ NEXT EVENT: Friday 8:00 PM | Local Acoustic Fusion Band | Reserved Seats Available
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/5">
              <h4 className="font-bold text-sm mb-4 text-white">Reserve Lounge Coffee Table</h4>
              <form onSubmit={(e) => triggerMockSubmit(e, `Lounge table reserved on ${tableDate} for ${tableSeats} guests!`)} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Number of Seats</label>
                  <select 
                    value={tableSeats} 
                    onChange={(e) => setTableSeats(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 text-xs p-3 rounded-lg text-white font-semibold"
                  >
                    <option value="1">1 Lounge Seat</option>
                    <option value="2">2 Seats (Date Corner)</option>
                    <option value="4">4 Seats (Group Lounge)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Select Coffee Date</label>
                  <input 
                    type="date" 
                    value={tableDate} 
                    onChange={(e) => setTableDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded-lg text-white" 
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                  className="w-full text-xs font-semibold py-3 rounded-lg text-white shadow-lg transition-transform active:scale-95"
                >
                  {submitting ? 'Confirming reservation...' : 'Reserve Lounge Table'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 6. NexaTech Hub (Tech Hub / Startup Website) */}
        {businessType === 'startup' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              {/* Interactive AI sandbox console */}
              <div id="ai-console" className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[var(--primary)]" />
                  NexaTech Hub Interactive AI Integrations Sandbox
                </h3>
                <p className="text-slate-400 text-xs">Run mock AI compile scripts to see the Future Tech Glass model in execution.</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={aiSandboxPrompt}
                    onChange={(e) => setAiSandboxPrompt(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 text-xs px-3 rounded-xl text-white placeholder-slate-600 focus:outline-none" 
                  />
                  <button 
                    onClick={() => {
                      playClickSound();
                      setAiSandboxOutput(`// NexaTech AI compiling prompt: "${aiSandboxPrompt}"...\n[SUCCESS] Response parsed: suggested HSL styling variables compiled successfully.\nContainer node speed: 18ms`);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4.5 py-2 rounded-xl transition-all"
                  >
                    Compile AI Script
                  </button>
                </div>

                {aiSandboxOutput && (
                  <pre className="bg-black border border-white/5 p-4 rounded-xl font-mono text-[9px] text-emerald-400 overflow-x-auto">
                    {aiSandboxOutput}
                  </pre>
                )}
              </div>

              {/* Team Showcase */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white">NexaTech Core Research Team</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'Karan Sen', role: 'AI Operator', campus: 'Ex-IIT' },
                    { name: 'Ritu Verma', role: 'Security Architect', campus: 'Ex-IISc' },
                    { name: 'Alok Mishra', role: 'Full Stack Dev', campus: 'Sanskardhani' }
                  ].map((member, idx) => (
                    <div key={idx} className="bg-slate-900 border border-white/5 p-3 rounded-xl text-center">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto text-xs font-bold text-white mb-2">
                        {member.name.substring(0,1)}
                      </div>
                      <h5 className="font-bold text-[10px] text-slate-200">{member.name}</h5>
                      <p className="text-[8px] text-slate-500 mt-0.5">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live stats and products */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                <h4 className="font-bold text-xs text-white">Live Server Statistics (Green Hydropower Grid)</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-slate-400 mb-1">
                      <span>Server Capacity load ratio</span>
                      <span className="text-[var(--primary)] font-bold">{cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div style={{ width: `${cpuUsage}%`, backgroundColor: theme.primary }} className="h-full rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-white/5 px-3 py-2 rounded-xl text-[10px] leading-relaxed text-slate-400">
                    ⚡ Bargi Dam Hydro Edge nodes: <strong className="text-emerald-400">ONLINE (Excellent AQI)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. FlexArena (Gym & Fitness Website) */}
        {businessType === 'gym' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[var(--primary)]" />
                FlexArena Power Glass Fitness Memberships
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Alpha Sprint Gym Pass', price: '₹2,500', duration: '1 Month' },
                  { name: 'Iron Hulk Program', price: '₹11,000', duration: '6 Months' },
                  { name: 'Gladiator Elite Pack', price: '₹18,000', duration: '12 Months' }
                ].map((pack, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-44 hover:border-[var(--primary)]/30">
                    <div>
                      <h4 className="font-bold text-xs text-white leading-tight">{pack.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{pack.duration} access</p>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
                      <span className="font-mono text-xs font-black text-[var(--primary)]">{pack.price}</span>
                      <button 
                        onClick={() => triggerRazorpaySimulation(pack.name, pack.price)}
                        className="bg-white/5 hover:bg-[var(--accent)] border border-white/10 hover:border-transparent text-white py-1.5 rounded-lg text-[9px] font-bold transition-all text-center"
                      >
                        Enlist Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Targeted Workout Plans */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white">Targeted Workout Plans Showcase</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-white/5 p-3.5 rounded-xl space-y-1">
                    <h5 className="font-bold text-xs text-white">Hypertrophy Power Pack</h5>
                    <p className="text-[10px] text-slate-400">4 days/wk barbell lift focuses + biometric telemetry logging.</p>
                  </div>
                  <div className="bg-slate-900 border border-white/5 p-3.5 rounded-xl space-y-1">
                    <h5 className="font-bold text-xs text-white">Conditioning fat-burn Sprint</h5>
                    <p className="text-[10px] text-slate-400">High-density HIIT runs adjusting telemetry deck speeds automatically.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: BMI Tracker */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h4 id="bmi-planner" className="font-bold text-sm text-white">Interactive BMI & Calorie Target Tracker</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Body Weight (kg)</label>
                  <input 
                    type="number" 
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(parseFloat(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white text-xs focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Body Height (cm)</label>
                  <input 
                    type="number" 
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(parseFloat(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white text-xs focus:outline-none" 
                  />
                </div>
                <button 
                  onClick={() => {
                    playClickSound();
                    const heightM = bmiHeight / 100;
                    const bVal = bmiWeight / (heightM * heightM);
                    setBmiResult(bVal.toFixed(1));
                  }}
                  style={{ background: theme.primary }}
                  className="w-full text-xs font-semibold py-2.5 rounded-lg text-white transition-transform active:scale-95"
                >
                  Calculate BMI Parameters
                </button>

                {bmiResult && (
                  <div className="bg-slate-900 border border-white/5 rounded-xl p-3.5 flex justify-between items-center animate-in fade-in duration-300">
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Computed BMI Score</p>
                      <p className="font-mono text-sm font-black text-white">{bmiResult}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Daily Target Calorie</p>
                      <p className="font-mono text-sm font-black text-[var(--accent)]">{Math.round(bmiWeight * 22 * 1.5)} Kcal</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 8. ExploreAura (Travel & Trip Planner Website) */}
        {businessType === 'tourism' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              {/* Dynamic AI travel Itinerary */}
              <div id="itinerary" className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-[var(--primary)]" />
                  ExploreAura Smart AI Itinerary Generator
                </h3>
                <p className="text-slate-400 text-xs">Enter your target tourist spot in Jabalpur and generate an optimized digital travel timeline.</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tripLocation}
                    onChange={(e) => setTripLocation(e.target.value)}
                    placeholder="e.g. Bhedaghat Marble Rocks" 
                    className="flex-1 bg-white/5 border border-white/10 text-xs px-3 rounded-xl text-white placeholder-slate-600 focus:outline-none" 
                  />
                  <button 
                    onClick={() => {
                      playClickSound();
                      setGeneratedItinerary(`🗺️ Dynamic 3-Day Plan for "${tripLocation}":\n• Day 1: 04:00 PM Dhuandhar water spray walk -> Moonlight Bhedaghat cruise (08:00 PM).\n• Day 2: Gond Rani Durgavati museum check -> Madan Mahal Fort scaling.\n• Day 3: Tilwara Ghat bypass cycle tour -> sunset riverside dinner.`);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4.5 py-2 rounded-xl transition-all"
                  >
                    Generate Travel Timeline
                  </button>
                </div>

                {generatedItinerary && (
                  <pre className="bg-slate-950 border border-white/5 p-4 rounded-xl font-mono text-[9px] text-indigo-400 overflow-x-auto whitespace-pre-line leading-relaxed">
                    {generatedItinerary}
                  </pre>
                )}
              </div>

              {/* Hotel booking cards */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white">Premium Stays Booking Engine</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Narmada Gorges Eco-Resort', rate: '₹4,500/night', loc: 'Bhedaghat view' },
                    { name: 'Tilwara Riverfront Cottages', rate: '₹3,200/night', loc: 'Tilwara shoreline' }
                  ].map((hotel, idx) => (
                    <div key={idx} className="bg-slate-900 border border-white/5 p-3.5 rounded-xl flex flex-col justify-between h-28">
                      <div>
                        <h5 className="font-bold text-[10px] text-white leading-tight">{hotel.name}</h5>
                        <p className="text-[8px] text-slate-500 mt-1">{hotel.loc}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <span className="font-mono text-[10px] text-[var(--accent)] font-semibold">{hotel.rate}</span>
                        <button 
                          onClick={() => triggerRazorpaySimulation(hotel.name, hotel.rate)}
                          className="bg-white/5 hover:bg-[var(--primary)] text-white font-bold text-[8px] px-2 py-1 rounded-lg"
                        >
                          Book Stay
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Travel Budget calculator */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h4 className="font-bold text-sm text-white">SkyGlass Travel Budget Planner</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-400 mb-1">
                    <span>Expected Stay Duration</span>
                    <span className="text-[var(--accent)] font-bold">{budgetDays} Days</span>
                  </div>
                  <input 
                    type="range" min="1" max="7" 
                    value={budgetDays} 
                    onChange={(e) => setBudgetDays(parseInt(e.target.value))}
                    className="w-full accent-[var(--primary)]" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Transit Preference</label>
                  <select 
                    value={budgetTransit} 
                    onChange={(e) => setBudgetTransit(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded-lg text-white text-xs font-semibold"
                  >
                    <option value="1200">Municipal Electric Shuttle (₹1,200 total)</option>
                    <option value="3500">Private SUV Guided Rental (₹3,500 total)</option>
                  </select>
                </div>
                <div className="bg-white/2 border border-white/5 rounded-xl p-3 flex justify-between items-center mt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Total Budget</span>
                  <span className="font-mono text-sm font-bold text-[var(--primary)]">
                    ₹{(budgetDays * 4500 + budgetTransit).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. ThreatZero (Cyber Security Awareness Website) */}
        {businessType === 'cybersecurity' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Live threat monitor attacks */}
            <div className="lg:col-span-7 space-y-6">
              <div id="security-hub" className="glass-card rounded-2xl p-6 border border-white/5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
                  ThreatZero Live Simulated Network Attack Monitor
                </h3>
                <p className="text-slate-400 text-xs">Simulating live firewall detections caught across central India edge-nodes. Ticking in real-time:</p>
                
                <div className="bg-black border border-white/5 p-4 rounded-xl font-mono text-[9px] text-emerald-400 overflow-x-auto space-y-2 h-[180px] shadow-inner">
                  {simulatedAttackLogs.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-2 hover:bg-white/2 p-1 rounded">
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className="text-amber-400 font-bold shrink-0">{log.source}</span>
                      <span className="text-slate-300 truncate flex-1">{log.payload}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        log.action === 'BLOCK' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {log.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable security tips */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-white">Crucial Cyber Security Matrix Tips</h4>
                <ul className="text-[10px] text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-1"><span className="text-emerald-500 shrink-0">•</span> <strong>MFA Enforcement:</strong> Enforce multi-factor verification on all developer pipelines to reject brute force scanning.</li>
                  <li className="flex items-start gap-1"><span className="text-emerald-500 shrink-0">•</span> <strong>Hash Salts:</strong> Always store passwords using secure hashing algorithms (like `bcrypt`) with a minimum factor of 10.</li>
                </ul>
              </div>
            </div>

            {/* Right: Security quiz */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h4 className="font-bold text-sm text-white">Interactive Cyber Quiz Sandbox</h4>
              
              {!secQuizFinished ? (
                <div className="space-y-4 text-xs">
                  {secQuizIndex === 0 && (
                    <div className="space-y-3">
                      <p className="font-semibold text-slate-200">Q1. What denotes a Zero-Trust security network?</p>
                      {['Trust but verify everything', 'Never trust, always verify', 'Firewall blocks all traffic'].map((opt) => (
                        <button 
                          key={opt}
                          onClick={() => {
                            playClickSound();
                            if (opt === 'Never trust, always verify') setSecQuizScore(prev => prev + 1);
                            setSecQuizIndex(1);
                          }}
                          className="w-full text-left bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-300 p-3 rounded-xl transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  {secQuizIndex === 1 && (
                    <div className="space-y-3">
                      <p className="font-semibold text-slate-200">Q2. Which hashing parameter represents secure salts?</p>
                      {['MD5', 'SHA-1', 'Bcrypt'].map((opt) => (
                        <button 
                          key={opt}
                          onClick={() => {
                            playClickSound();
                            if (opt === 'Bcrypt') setSecQuizScore(prev => prev + 1);
                            setSecQuizFinished(true);
                          }}
                          className="w-full text-left bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-300 p-3 rounded-xl transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-center py-4">
                  <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                  <h5 className="font-bold text-xs text-white">Cyber Assessment Completed</h5>
                  <p className="text-slate-400 text-[10px]">Your Firewall understanding score is logged: <strong>{secQuizScore}/2</strong></p>
                  <button 
                    onClick={() => { setSecQuizIndex(0); setSecQuizScore(0); setSecQuizFinished(false); }}
                    style={{ background: theme.primary }}
                    className="text-xs font-semibold px-4 py-2 rounded-lg text-white transition-transform active:scale-95"
                  >
                    Retake Quiz Sandbox
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 10. JobSphere (Career & Job Portal) */}
        {businessType === 'career' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              {/* Smart Resume analyzer */}
              <div id="career-sandbox" className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[var(--primary)]" />
                  JobSphere Smart Resume Parser & Rating Analyzer
                </h3>
                <p className="text-slate-400 text-xs">Paste or write your resume bio text below. The AI will output an optimization rating scoring and detailed keyword analytics.</p>
                <div className="space-y-3">
                  <textarea 
                    value={resumeTextInput}
                    onChange={(e) => setResumeTextInput(e.target.value)}
                    placeholder="e.g. Coder with ex-IIT mentoring credentials, specialized in Next.js web application structures and HSL styles..." 
                    className="w-full bg-white/5 border border-white/10 text-xs p-3 rounded-xl text-white h-20 placeholder-slate-600 focus:outline-none" 
                  />
                  <button 
                    onClick={() => {
                      playClickSound();
                      if (!resumeTextInput) return;
                      const hasIIT = resumeTextInput.toLowerCase().includes('iit');
                      const hasNext = resumeTextInput.toLowerCase().includes('next');
                      let score = 55;
                      if (hasIIT) score += 25;
                      if (hasNext) score += 15;
                      setResumeRating({
                        score,
                        feedback: score > 80 ? 'Excellent startup posture! Optimized keyword density verified.' : 'Suboptimal keyword density. Include tags like Next.js, MERN stack, or developer credentials.'
                      });
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4.5 py-2.5 rounded-xl transition-all"
                  >
                    Analyze Resume Profile
                  </button>
                </div>

                {resumeRating && (
                  <div className="bg-slate-900 border border-white/5 p-4 rounded-xl text-xs space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-400">Resume Quality Score</span>
                      <span className="font-mono text-sm font-black text-[var(--primary)]">{resumeRating.score}/100</span>
                    </div>
                    <p className="text-slate-300 text-[10px] leading-relaxed">{resumeRating.feedback}</p>
                  </div>
                )}
              </div>

              {/* Internship finder search bar */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Search className="w-4.5 h-4.5 text-[var(--accent)]" />
                  JobSphere Regional Internship Finder
                </h4>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. MERN Developer" className="flex-1 bg-white/5 border border-white/10 text-xs px-3.5 py-2.5 rounded-xl text-white focus:outline-none" />
                  <button className="bg-white/5 hover:bg-slate-800 text-white text-xs px-4 py-2.5 rounded-xl border border-white/10">Search</button>
                </div>
                <div className="bg-slate-900 border border-white/5 px-3 py-2 rounded-xl text-[10px] leading-normal text-slate-400">
                  ✔ 3 Active remote startup internships logged for central India coders. Apply direct.
                </div>
              </div>
            </div>

            {/* Right: AI Mock Interview Q&A console */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h4 className="font-bold text-sm text-white">AI FutureHire Conversational Mock Interview</h4>
              {mockInterviewQIndex === -1 ? (
                <div className="space-y-3">
                  <p className="text-slate-400 text-xs">Simulate a high-premium startup technical interview. Receive instant feedback scores.</p>
                  <button 
                    onClick={() => { setMockInterviewQIndex(0); setInterviewFeedback(''); setInterviewAnswer(''); }}
                    style={{ background: theme.primary }}
                    className="w-full text-xs font-semibold py-2.5 rounded-lg text-white transition-transform active:scale-95"
                  >
                    Start AI Mock Interview
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-900 border border-white/5 p-3.5 rounded-xl text-slate-300 leading-relaxed font-mono text-[10px]">
                    {mockInterviewQIndex === 0 ? 'Q1. Explain the difference between Server Components and Client Components in Next.js?' : 'Q2. How does standard JWT auth structure encrypt user data payload safely?'}
                  </div>
                  <input 
                    type="text" 
                    value={interviewAnswer}
                    onChange={(e) => setInterviewAnswer(e.target.value)}
                    placeholder="Write your brief technical response..."
                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white text-xs focus:outline-none" 
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        playClickSound();
                        if (mockInterviewQIndex === 0) {
                          setInterviewFeedback('✔ Feedback: Perfect response outlining that server components render on the host, saving client-side asset sizes. Proceed.');
                          setMockInterviewQIndex(1);
                          setInterviewAnswer('');
                        } else {
                          setInterviewFeedback('🎉 Interview Completed! Performance rating: 92%. Resume parameters optimized.');
                          setMockInterviewQIndex(-1);
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg"
                    >
                      Submit Response
                    </button>
                  </div>
                </div>
              )}

              {interviewFeedback && (
                <p className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 p-3.5 rounded-xl text-[10px] font-mono leading-relaxed">{interviewFeedback}</p>
              )}
            </div>
          </div>
        )}

      </section>
      )}

      {/* Interactive Contact Form (Global) */}
      <section id="contact" className="py-20 md:py-24 px-6 max-w-lg mx-auto w-full">
        <div className="glass-card rounded-[var(--radius-custom)] border border-white/5 p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-outfit font-black text-white">Get in Touch</h2>
            <p className="text-xs text-slate-400 font-mono text-[var(--primary)] uppercase tracking-widest font-semibold">{theme.name} Desk</p>
          </div>

          <form onSubmit={(e) => triggerMockSubmit(e, 'Message successfully delivered. Thank you for reaching out!')} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Email Address</label>
              <input type="email" required placeholder="name@domain.com" className="w-full bg-white/5 border border-white/10 text-xs p-3.5 rounded-xl text-white placeholder-slate-600 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Message Content</label>
              <textarea required placeholder="Write your inquiry here..." className="w-full bg-white/5 border border-white/10 text-xs p-3.5 rounded-xl text-white h-24 placeholder-slate-600 focus:outline-none" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              className="w-full text-xs font-semibold py-3 rounded-xl text-white shadow-lg shadow-indigo-500/10 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Dispatching Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Dynamic Footer */}
      <footer className="mt-auto border-t border-white/5 py-12 px-6 bg-black/40 backdrop-blur-md text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--primary)] flex items-center justify-center font-bold text-white text-[10px]">
              {navigation.logoText.substring(0,1)}
            </div>
            <span className="font-outfit font-black text-slate-300">
              {navigation.logoText}
            </span>
          </div>

          <p className="text-center md:text-left">
            {footer.text}
          </p>

          <div className="flex gap-4">
            {footer.socials.map((soc, idx) => (
              <a 
                key={idx} 
                href={soc.url}
                className="hover:text-[var(--accent)] transition-colors uppercase tracking-wider text-[10px] font-bold"
              >
                {soc.platform}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* 🔑 Full Screen Overlay Login/Register Modal (Skill Square Design) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          
          {/* Format Requirement Alert Pop-up inside the screen */}
          {authError && (
            <div className="fixed top-6 right-6 z-[60] max-w-sm w-full bg-[#1c1212] border border-rose-500/30 p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-5 duration-300">
              <div className="w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold shrink-0 text-xs">
                ✕
              </div>
              <div className="flex-1 space-y-1 text-left">
                <h5 className="font-sans font-bold text-rose-400 text-xs tracking-wide">Format Requirement</h5>
                <p className="text-[10px] text-slate-400 leading-normal">{authError}</p>
              </div>
              <button 
                onClick={() => setAuthError('')}
                className="text-slate-500 hover:text-slate-300 font-mono text-[9px] font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {authSuccess && (
            <div className="fixed top-6 right-6 z-[60] max-w-sm w-full bg-[#121c15] border border-emerald-500/30 p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-5 duration-300">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-xs">
                ✓
              </div>
              <div className="flex-1 space-y-1 text-left">
                <h5 className="font-sans font-bold text-emerald-400 text-xs tracking-wide">Success</h5>
                <p className="text-[10px] text-slate-400 leading-normal">{authSuccess}</p>
              </div>
              <button 
                onClick={() => setAuthSuccess('')}
                className="text-slate-500 hover:text-slate-300 font-mono text-[9px] font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Modal Container */}
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#0c0a09] border border-amber-500/20 rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 min-h-[460px]">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white transition-colors text-xs font-bold font-mono bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            {/* Left Side: Brand Panel */}
            <div className="bg-[#050505] p-10 flex flex-col justify-center items-center text-center relative overflow-hidden border-r border-white/5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-6 max-w-xs relative z-10">
                <h2 className="text-4xl md:text-5xl font-black tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent font-poppins drop-shadow-lg">
                  NextRank
                </h2>
                <div className="w-12 h-1 bg-amber-500/30 mx-auto rounded-full" />
                <p className="text-slate-400 text-xs leading-relaxed font-sans tracking-wide">
                  Learn skills for your future career with industry level board prep training.
                </p>
              </div>
            </div>

            {/* Right Side: Form Panel */}
            <div className="p-10 flex flex-col justify-center relative bg-[#0a0a0a] text-left">
              <div className="space-y-6 max-w-sm w-full mx-auto">
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 font-poppins tracking-wide">
                    {authTab === 'login' ? 'Welcome Back' : 'Welcome to NextRank'}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 font-sans">
                    {authTab === 'login' ? 'Login to continue learning' : 'Create credentials to start learning'}
                  </p>
                </div>

                <form onSubmit={authTab === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
                  {/* Email Field with Envelope icon on the right */}
                  <div className="space-y-1">
                    <div className="relative flex items-center">
                      <input
                        type="email" required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="Enter Email"
                        className="w-full bg-[#0d0d0d] border border-white/15 rounded-xl pl-4 pr-11 py-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-all font-mono"
                      />
                      <span className="absolute right-4 text-slate-500"><Mail className="w-4 h-4 text-slate-500" /></span>
                    </div>
                  </div>
                  
                  {/* Password Field with Eye icon on the right */}
                  <div className="space-y-1">
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"} required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full bg-[#0d0d0d] border border-white/15 rounded-xl pl-4 pr-11 py-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-slate-500 hover:text-slate-300"
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {authTab === 'login' && (
                    <div className="text-right">
                      <button 
                        type="button"
                        onClick={() => alert("Please consult NextRank Admission Desk to reset your credentials.")}
                        className="text-[10px] text-amber-500 hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button - Gold Gradient */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold text-black text-xs uppercase bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center gap-2 tracking-widest font-sans font-bold"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 rounded-full border-t-2 border-black animate-spin" />
                    ) : authTab === 'login' ? 'LOGIN' : 'REGISTER'}
                  </button>
                </form>

                {/* Switcher link */}
                <div className="text-center pt-2">
                  <p className="text-slate-400 text-xs">
                    {authTab === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => {
                        playClickSound();
                        setAuthTab(authTab === 'login' ? 'register' : 'login');
                        setAuthError('');
                        setAuthSuccess('');
                      }}
                      className="text-amber-500 font-bold hover:underline"
                    >
                      {authTab === 'login' ? 'Register' : 'Login'}
                    </button>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 💳 Premium Razorpay simulated Gateway Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Header */}
            <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">💳</span>
                <span className="font-poppins font-black text-white text-xs tracking-wider">RAZORPAY SECURE GATEWAY</span>
              </div>
              <button 
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-white transition-colors text-xs font-bold font-mono"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Content Switcher based on State */}
            {payingState === 'idle' && (
              <div className="p-6 space-y-6">
                {/* Plan Information */}
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex justify-between items-center text-xs text-left">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Service Roster</span>
                    <strong className="text-slate-200 font-poppins">{payPlanName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Payable Total</span>
                    <strong className="text-emerald-400 font-mono text-sm font-extrabold">{payPrice}</strong>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-white/10 text-[9px] font-bold uppercase tracking-wider pb-2 gap-2 text-left">
                  {[
                    { id: 'card', label: 'Credit Card' },
                    { id: 'scanner', label: 'UPI / QR Scanner' },
                    { id: 'bank', label: 'Bank Transfer' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => { playClickSound(); setPayTab(tab.id); }}
                      className={`flex-1 py-2 rounded-lg transition-all text-center border font-black tracking-widest cursor-pointer ${
                        payTab === tab.id 
                          ? 'bg-blue-600/10 text-blue-400 border-blue-500/40 shadow-inner' 
                          : 'text-slate-400 border-transparent hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {payTab === 'card' && (
                  <>
                    {/* Physical Glass Credit Card Graphic */}
                    <div className="relative h-44 w-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-2xl border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-inner text-left">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-7 bg-amber-500/80 rounded-md shadow-inner" /> {/* Chip */}
                        <span className="text-white font-mono text-[9px] font-bold tracking-widest border border-white/20 px-2 py-0.5 rounded uppercase">JABALPUR BANK</span>
                      </div>
                      <p className="font-mono text-white text-md tracking-[0.18em] my-3 select-all">{cardNumber}</p>
                      <div className="flex justify-between items-center text-slate-300 font-mono text-[9px]">
                        <div>
                          <span className="text-[6px] text-slate-500 block uppercase font-sans">Cardholder</span>
                          <span className="font-bold">{currentUser ? currentUser.email.split('@')[0].toUpperCase() : 'VISITOR SANSKARDHANI'}</span>
                        </div>
                        <div>
                          <span className="text-[6px] text-slate-500 block uppercase font-sans">Expiry</span>
                          <span className="font-bold">{cardExpiry}</span>
                        </div>
                      </div>
                    </div>

                    {/* Form fields */}
                    <div className="space-y-4 text-left">
                      <div className="space-y-1">
                        <label className="text-[8px] text-slate-500 font-bold uppercase font-mono block">Card Number</label>
                        <input 
                          type="text" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4582 9182 1202 8593"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-700 font-mono focus:outline-none" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase font-mono block">Expiry Date</label>
                          <input 
                            type="text" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/29"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-700 font-mono focus:outline-none text-center" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase font-mono block">CVV Code</label>
                          <input 
                            type="password" 
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            maxLength={3}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-700 font-mono focus:outline-none text-center" 
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {payTab === 'scanner' && (
                  <div className="space-y-4 text-center">
                    <div className="mx-auto w-40 h-40 bg-white p-2 rounded-2xl border border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                      <img 
                        src={config.paymentDetails?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${config.paymentDetails?.upiId || 'megha213@okaxis'}&pn=JabalpurSmartEngine&am=${payPrice.replace(/[^0-9]/g, '')}`} 
                        alt="Payment QR Code" 
                        className="w-full h-full object-contain select-none pointer-events-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Scan using any UPI App (GPay, PhonePe, Paytm)</span>
                      <div className="bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-left">
                        <span className="text-slate-400 font-mono">UPI ID: <strong className="text-white">{config.paymentDetails?.upiId || 'megha213@okaxis'}</strong></span>
                        <button 
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(config.paymentDetails?.upiId || 'megha213@okaxis');
                            if (window.showToast) window.showToast("UPI ID Copied to Clipboard!", "success");
                          }}
                          className="text-indigo-400 hover:text-indigo-300 font-black text-[10px] tracking-widest uppercase cursor-pointer"
                        >
                          COPY
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {payTab === 'bank' && (
                  <div className="space-y-3 text-left font-mono text-xs">
                    <div className="bg-slate-950 border border-white/5 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-slate-500 text-[10px] uppercase">Account Holder:</span>
                        <strong className="text-slate-200">{config.paymentDetails?.holderName || 'Megha Choudhary'}</strong>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-slate-500 text-[10px] uppercase">Bank Name:</span>
                        <strong className="text-slate-200">{config.paymentDetails?.bankName || 'State Bank of India'}</strong>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-slate-500 text-[10px] uppercase">Account Number:</span>
                        <div className="flex gap-2">
                          <strong className="text-slate-200 select-all">{config.paymentDetails?.accountNumber || '382901928392'}</strong>
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(config.paymentDetails?.accountNumber || '382901928392');
                              if (window.showToast) window.showToast("Account Number Copied!", "success");
                            }}
                            className="text-indigo-400 hover:text-indigo-300 text-[9px] font-bold cursor-pointer"
                          >
                            COPY
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 text-[10px] uppercase">IFSC Code:</span>
                        <div className="flex gap-2">
                          <strong className="text-slate-200 select-all">{config.paymentDetails?.ifscCode || 'SBIN0001234'}</strong>
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(config.paymentDetails?.ifscCode || 'SBIN0001234');
                              if (window.showToast) window.showToast("IFSC Code Copied!", "success");
                            }}
                            className="text-indigo-400 hover:text-indigo-300 text-[9px] font-bold cursor-pointer"
                          >
                            COPY
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-500 text-center leading-normal font-sans">Transfer the payable total to the account above, and click "Securely Pay" to register the transaction.</p>
                  </div>
                )}

                {/* Confirm secure pay */}
                <button
                  onClick={executePaymentCall}
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-xs shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  🔒 Securely Pay {payPrice}
                </button>
              </div>
            )}

            {payingState === 'paying' && (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full border-t-2 border-indigo-500 border-r-2 border-r-indigo-500/30 animate-spin" />
                <h5 className="font-poppins font-bold text-white text-sm">Authenticating 3D Secure Webhook...</h5>
                <p className="text-slate-500 text-xs font-sans leading-relaxed text-center">Processing payment coordinates with Jabalpur Razorpay Simulator node. Please do not close or reload.</p>
              </div>
            )}

            {payingState === 'success' && (
              <div className="p-6 space-y-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                  <span className="text-emerald-400 text-xl font-bold">✓</span>
                </div>
                <div>
                  <h5 className="font-poppins font-bold text-emerald-400 text-sm">Payment Captured Successfully!</h5>
                  <p className="text-slate-400 text-[10px] mt-1 font-sans">Simulated Razorpay transaction successfully registered to Jabalpur ledger.</p>
                </div>

                {/* Transaction Slip Receipt */}
                <div className="bg-slate-950 border border-white/5 rounded-xl p-4 text-left font-mono text-[9px] space-y-2 select-all leading-normal">
                  <div className="text-center font-bold border-b border-white/5 pb-2 text-[10px] text-indigo-400">
                    JABALPUR SMARTENGINE RECEIPT
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TRANSACTION ID:</span>
                    <span className="text-slate-200">{payTransactionId || 'TXN-81928092'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ROSTER PLAN:</span>
                    <span className="text-slate-200 uppercase">{payPlanName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PAID AMOUNT:</span>
                    <span className="text-emerald-400 font-bold">{payPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ESCROW GATE:</span>
                    <span className="text-slate-200">RAZORPAY SIM V3.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TIMESTAMP:</span>
                    <span className="text-slate-200">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="text-center text-slate-600 border-t border-white/5 pt-2 text-[8px]">
                    THANK YOU FOR CHOOSING NEXTRANK
                  </div>
                </div>

                <button
                  onClick={() => { playClickSound(); setShowPayModal(false); }}
                  className="w-full bg-white/5 border border-white/10 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 text-xs font-semibold"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline custom icons that avoid lucide conflicts
function CodeBlockIcon(props) {
  return (
    <svg 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      viewBox="0 0 24 24" 
      {...props}
    >
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  );
}
