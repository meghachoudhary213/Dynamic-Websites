"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, BookOpen, Calendar, CheckCircle, Clock, Cpu, 
  DollarSign, Dumbbell, FileText, Heart, HelpCircle, Layers, 
  MapPin, Phone, Shield, Sparkles, Star, TrendingUp, 
  Users, Utensils, Video, Volume2, Zap, AlertTriangle, Send, Mail, Lock,
  Bookmark, ShoppingBag, Eye, Trash, ShieldCheck, UserCheck, 
  Briefcase, Search, UploadCloud, ChevronRight, BarChart2, Sun, Moon, Bot, RefreshCw
} from 'lucide-react';
import { io } from 'socket.io-client';
import MarbleRocksCanvas from '../../components/MarbleRocksCanvas';
import DynamicChatbot from '../../components/DynamicChatbot';
import { API_URL } from '../../config';

// Premium HTML5 Hologram Visualizer for SmartEngine
const CanvasHologram = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = 380;
    let height = canvas.height = 400;
    
    const particles = [];
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? '#6366f1' : '#00f5ff'
      });
    }
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid circle backgrounds
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 120, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width/2, height/2, 60, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw orbital scanner line
      const scanY = (Math.sin(Date.now() / 1500) + 1) * (height / 2) + 50;
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.25)';
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(width/2 - 140, scanY);
      ctx.lineTo(width/2 + 140, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset
      
      // Draw and update particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connecting vector lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 80) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 - (dist / 80) * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  
  return <canvas ref={canvasRef} className="w-full h-full block bg-[#030014]/60" />;
};

export default function PreviewPage() {
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
  const [authPhone, setAuthPhone] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [authOtpSent, setAuthOtpSent] = useState(false);
  const [authOtpValue, setAuthOtpValue] = useState('');
  const [authCountdown, setAuthCountdown] = useState(0);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  // 11. SmartEngine (AI SaaS Platform) States
  const [saasTab, setSaasTab] = useState('analytics'); // analytics | workflows | recommendations | files | team | chat
  const [saasLogs, setSaasLogs] = useState([
    '⚡ Established system pipeline index coordinates.',
    '🔮 Edge models successfully calibrated with Tilwara server node.',
    '🛡️ Secure salts encryption protocols active.'
  ]);
  const [saasFiles, setSaasFiles] = useState([
    { name: 'Model_Weights_V4.bin', size: '2.4 GB', type: 'Weights' },
    { name: 'Token_Embeddings_Schema.json', size: '124 KB', type: 'JSON' }
  ]);
  const [saasTeam, setSaasTeam] = useState([
    { name: 'Dr. Priya Nair', role: 'Chief Scientist', email: 'priya@smartengine.ai', status: 'ACTIVE' },
    { name: 'Er. Amit Agrawal', role: 'Security Architect', email: 'amit@smartengine.ai', status: 'ON_STANDBY' }
  ]);
  const [saasNewMemberEmail, setSaasNewMemberEmail] = useState('');
  const [saasNewMemberRole, setSaasNewMemberRole] = useState('Operator');
  const [promptInput, setPromptInput] = useState('');
  const [promptLogs, setPromptLogs] = useState([]);
  const [latencyMeter, setLatencyMeter] = useState(18);
  const [tokensTicked, setTokensTicked] = useState(240500);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [voiceTelemetryActive, setVoiceTelemetryActive] = useState(false);
  const [voiceWaves, setVoiceWaves] = useState([12, 45, 82, 34, 18, 90, 64]);

  // Dynamic MERN Custom Sandbox State Parameters
  const [outfitStyle, setOutfitStyle] = useState('Royal Traditional');
  const [outfitSize, setOutfitSize] = useState('M');
  const [outfitColor, setOutfitColor] = useState('#D4AF37');
  const [outfitPreviewReport, setOutfitPreviewReport] = useState('');

  const [bpRooms, setBpRooms] = useState(3);
  const [bpFloors, setBpFloors] = useState(2);
  const [bpWidth, setBpWidth] = useState(50);
  const [bpPreviewReport, setBpPreviewReport] = useState('');

  const [diagSugar, setDiagSugar] = useState(90);
  const [diagBps, setDiagBps] = useState(120);
  const [diagHeartRate, setDiagHeartRate] = useState(72);
  const [diagReport, setDiagReport] = useState('');

  const [roastTemp, setRoastTemp] = useState(200);
  const [roastDuration, setRoastDuration] = useState(15);
  const [roastBean, setRoastBean] = useState('Arabica Single Origin');
  const [roastReport, setRoastReport] = useState('');

  const [simDdosIp, setSimDdosIp] = useState('182.28.12.92');
  const [simIntensity, setSimIntensity] = useState(50);
  const [simDdosActive, setSimDdosActive] = useState(false);
  const [draggedWidgets, setDraggedWidgets] = useState([
    { id: 'w_latency', title: 'Gateway Latency', value: '18ms', desc: 'Average edge api response time.' },
    { id: 'w_tokens', title: 'LLM Active Tokens', value: '240.5K', desc: 'Realtime token consumption rate.' },
    { id: 'w_load', title: 'Container Load', value: '42%', desc: 'Tilwara-Bhedaghat edge processor.' }
  ]);

  // Typing Effect for MERN SaaS Landing Pages - Custom & Dynamic
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    if (authCountdown > 0) {
      const timer = setTimeout(() => setAuthCountdown(authCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [authCountdown]);

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

  useEffect(() => {
    if (!config) return;
    const category = config.category || (config.businessType && config.businessType.includes('_') ? config.businessType.split('_')[0] : config.businessType) || 'coaching';

    const phrasesMap = {
      coaching: [
        'Class 12th Board Preparations',
        'Competitive IIT-JEE/NEET Diagnostics',
        'Real-time Biometric Parent RFID Logs',
        'Adaptive Science & Commerce Prep'
      ],
      ecommerce: [
        'Luxury Wardrobe Couture Collections',
        'Indian Organic Silk Weavers',
        'Animated Products & Checkout',
        'Interactive Fashion Sandbox'
      ],
      real_estate: [
        'Luxury Gated Riversides Villas',
        'Madan Mahal Structural balance',
        '3D Spatial Virtual Tours Builder',
        'Regional Plot Search Engines'
      ],
      hospital: [
        'Healing Frost Telemetry Care',
        'Sanskardhani Clinical specialities',
        'Emergency WebSocket Sirens Dispatch',
        'Secured health report Vault'
      ],
      cafe: [
        'Coffees lounge overlooking Gorges',
        'Cozy Acoustic Music Sessions',
        'Online dine-in Deck bookings',
        'Artisanal Gourmet showcase'
      ],
      startup: [
        'Incubating Silicon Valley start-ups',
        'Bargi green hydro server grids',
        'Low-overhead sandbox compilers',
        'Dynamic MERN developers workspace'
      ],
      gym: [
        'Biomechanical power gyms club',
        'Active calorie BMI trackers',
        'Barbell volume volume loaders',
        'Conquering athletic targets'
      ],
      tourism: [
        'Excursions down Marble Gorges',
        'SkyGlass Travel budget engines',
        'Tailored weekend AI travel schedules',
        'Shoreline eco-cottages bookings'
      ],
      cybersecurity: [
        'ThreatZero matrix firewall block',
        'Simulated network pen-test grids',
        'Zero-Trust security diagnostics',
        'Multi-factor salt cryptographies'
      ],
      career: [
        'FutureHire placement accelerators',
        'Deep-learning resume parser score',
        'Conversational AI mock interviews',
        'Central India internships discovery'
      ],
      smartengine: [
        'LLM Agent Orchestrator Swarms',
        'Autonomous Microservices Deployments',
        'Real-time Vector Pipelines',
        'Self-Healing Container Nodes'
      ]
    };

    const typingPhrases = phrasesMap[category] || phrasesMap.smartengine;
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeoutId;
    
    const tick = () => {
      const currentPhrase = typingPhrases[phraseIdx];
      if (!isDeleting) {
        setTypingText(currentPhrase.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentPhrase.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, 2000); // Hold phrase
        } else {
          timeoutId = setTimeout(tick, 80); // Speed of typing
        }
      } else {
        setTypingText(currentPhrase.substring(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % typingPhrases.length;
          timeoutId = setTimeout(tick, 500); // Pause before next phrase
        } else {
          timeoutId = setTimeout(tick, 40); // Speed of deleting
        }
      }
    };
    
    tick();
    return () => clearTimeout(timeoutId);
  }, [config]);

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

  const handleGenerateAuthOtp = async () => {
    playClickSound();
    setAuthError('');
    setAuthSuccess('');

    if (!authEmail && !authPhone) {
      setAuthError('Please provide your Email or Phone Number to request an OTP code.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail.toLowerCase(), phone: authPhone })
      });
      const data = await res.json();

      if (data.success) {
        setAuthOtpSent(true);
        setAuthOtpValue(data.otp); // Save generated OTP
        setAuthCountdown(60);
        setAuthSuccess(`🔑 Simulated verification OTP successfully sent! Code: ${data.otp}`);
      } else {
        setAuthError(data.message || 'Failed to generate registration OTP.');
      }
    } catch (err) {
      setAuthError('Could not connect to NextRank OTP server.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAuthError('');
    setAuthSuccess('');

    // Format Requirement Complexity Check
    const hasLetter = /[a-zA-Z]/.test(authPassword);
    const hasNumber = /[0-9]/.test(authPassword);
    const hasSymbol = /[^a-zA-Z0-9]/.test(authPassword);
    const isLongEnough = authPassword.length >= 8;

    if (!isLongEnough || !hasLetter || !hasNumber || !hasSymbol) {
      setAuthError('Password must be at least 8 characters long and contain letters, numbers, and symbols.');
      setSubmitting(false);
      return;
    }

    if (!authOtpSent) {
      setAuthError('Please request an OTP verification code first.');
      setSubmitting(false);
      return;
    }

    if (!authOtp) {
      setAuthError('Please input the 6-digit OTP code received.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authName,
          email: authEmail.toLowerCase(),
          phone: authPhone,
          password: authPassword,
          otp: authOtp,
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
          setAuthName('');
          setAuthPhone('');
          setAuthOtp('');
          setAuthOtpSent(false);
          setAuthOtpValue('');
          setAuthCountdown(0);
          setAuthSuccess('');
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
        
        if (data.user.role === 'student') {
          setCoachingTab('student_portal');
        }
        
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthEmail('');
          setAuthPassword('');
          setAuthSuccess('');
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
        applyThemeVariables(data.config.theme, data.config.category || data.config.businessType);
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
  const applyThemeVariables = (theme, activeCategory) => {
    if (!theme) return;
    const root = document.documentElement;

    let primary = theme.primary || '#6366f1';
    let secondary = theme.secondary || '#a855f7';
    let accent = theme.accent || '#f43f5e';
    let background = theme.background || '#0b0f19';
    let textColor = theme.textColor || '#f3f4f6';

    // We no longer override theme primary/accent/background values with hardcoded codes!
    // This allows custom pickers in the Theme Manager to take full effect.
    // If the theme objects are missing these custom values, we assign the standard defaults.

    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--bg-custom', background);
    root.style.setProperty('--text-custom', textColor);

    root.style.setProperty('--radius-custom', 
      theme.borderRadius === 'xl' ? '12px' : 
      theme.borderRadius === '2xl' ? '16px' : 
      theme.borderRadius === '3xl' ? '24px' : '8px'
    );
    root.style.setProperty('--font-family-custom', 
      theme.fontFamily === 'Space Grotesk' ? 'var(--font-space-grotesk)' : 
      theme.fontFamily === 'Outfit' ? 'var(--font-poppins)' : 
      theme.fontFamily === 'Poppins' ? 'var(--font-poppins)' : 
      theme.fontFamily === 'Inter' ? 'var(--font-space-grotesk)' : 'var(--font-montserrat)'
    );

    // Dynamic Card Customizations
    const radiusMap = { none: '0px', sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px', '3xl': '32px', full: '9999px' };
    const borderMap = { none: '0px', thin: '1px', thick: '2px' };
    const shadowMap = {
      none: 'none',
      subtle: '0 4px 12px rgba(0, 0, 0, 0.08)',
      glass: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      'glowing-neon': `0 0 20px -5px ${primary}, 0 8px 32px rgba(0, 0, 0, 0.5)`
    };

    root.style.setProperty('--card-radius', radiusMap[theme.cardRadius] || radiusMap[theme.borderRadius] || '16px');
    root.style.setProperty('--card-border-width', borderMap[theme.cardBorder] || '1px');
    root.style.setProperty('--card-shadow', shadowMap[theme.cardShadow] || '0 16px 40px -12px rgba(0, 0, 0, 0.5)');

    // Dynamic Button Customizations
    const btnBgMap = {
      solid: primary,
      gradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
      outline: 'transparent',
      glass: 'rgba(255, 255, 255, 0.05)'
    };
    const btnRadiusMap = { none: '0px', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px' };
    const btnBorderMap = {
      none: '0px solid transparent',
      thin: '1px solid rgba(255, 255, 255, 0.15)',
      neon: `1.5px solid ${accent}`
    };
    const btnHoverTransformMap = {
      grow: 'scale(1.05)',
      translate: 'translateY(-3px)',
      pulse: 'none',
      glow: 'scale(1.02)'
    };

    root.style.setProperty('--button-bg', btnBgMap[theme.buttonBg] || primary);
    root.style.setProperty('--button-radius', btnRadiusMap[theme.buttonRadius] || '12px');
    root.style.setProperty('--button-border', btnBorderMap[theme.buttonBorder] || 'none');
    root.style.setProperty('--button-hover-bg', theme.buttonBg === 'outline' ? 'rgba(255, 255, 255, 0.08)' : accent);
    root.style.setProperty('--button-hover-transform', btnHoverTransformMap[theme.buttonHover] || 'scale(1.05)');
    root.style.setProperty('--button-shadow', theme.buttonHover === 'glow' ? `0 0 20px -3px ${primary}` : 'none');

    // Dynamic Layout Customizations
    const layoutAlignMap = { left: 'left', center: 'center', right: 'right' };
    const layoutFlexAlignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
    const spacingMap = { compact: '32px', balanced: '64px', relaxed: '112px' };

    root.style.setProperty('--layout-alignment', layoutAlignMap[theme.layoutAlignment] || 'center');
    root.style.setProperty('--layout-flex-alignment', layoutFlexAlignMap[theme.layoutAlignment] || 'center');
    root.style.setProperty('--section-spacing-top', spacingMap[theme.sectionSpacing] || '64px');
    root.style.setProperty('--section-spacing-bottom', spacingMap[theme.sectionSpacing] || '64px');
    root.style.setProperty('--layout-margin-left', theme.layoutAlignment === 'left' ? '0px' : 'auto');
    root.style.setProperty('--layout-margin-right', theme.layoutAlignment === 'right' ? '0px' : 'auto');
  };

  useEffect(() => {
    loadActiveConfig();
    checkLoggedInUser();

    // Listen to real-time socket config swaps
    const socket = io(API_URL);
    
    socket.on('config-updated', (updatedConfig) => {
      console.log('🔌 Real-time config update received:', updatedConfig);
      setConfig(updatedConfig);
      applyThemeVariables(updatedConfig.theme, updatedConfig.category || updatedConfig.businessType);
    });

    socket.on('payment-success', (payload) => {
      alert(`💳 [REAL-TIME GATEWAY ALERT] Payment received!\nPlan: ${payload.planName}\nAmount: ₹${payload.amount}\nUser: ${payload.userName}\nTransaction ID: ${payload.transactionId}`);
    });

    // Listen for live config updates via postMessage
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'LIVE_CONFIG_UPDATE') {
        setConfig(event.data.config);
        applyThemeVariables(event.data.config.theme, event.data.config.category || event.data.config.businessType);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      socket.disconnect();
      window.removeEventListener('message', handleMessage);
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

  // Live SmartEngine telemetry simulator
  useEffect(() => {
    const category = config?.category || (config?.businessType && config.businessType.includes('_') ? config.businessType.split('_')[0] : config?.businessType);
    if (category !== 'smartengine') return;
    const interval = setInterval(() => {
      setLatencyMeter(prev => {
        const nextVal = prev + (Math.random() - 0.5) * 4;
        return Math.min(Math.max(Math.round(nextVal), 12), 35);
      });
      setTokensTicked(prev => prev + Math.floor(Math.random() * 80) + 10);
      setVoiceWaves(prev => prev.map(() => Math.floor(Math.random() * 85) + 10));
    }, 2000);

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

  const downloadReceiptSlip = () => {
    playClickSound();
    const receiptContent = `==================================================
        JABALPUR SMARTENGINE - TRANSACTION RECEIPT        
==================================================
TRANSACTION ID : ${payTransactionId || 'TXN-81928092'}
ROSTER PLAN    : ${payPlanName ? payPlanName.toUpperCase() : 'PREMIUM SUBSCRIPTION'}
PAID AMOUNT    : ${payPrice || 'N/A'}
ESCROW GATEWAY : RAZORPAY SIMULATOR V3.2
STATUS         : CAPTURED / SUCCESSFUL
TIMESTAMP      : ${new Date().toLocaleString()}
CLIENT EMAIL   : ${currentUser ? currentUser.email : 'VISITOR'}
SECURITY CODE  : SH-3829-9102-JBP
==================================================
          SECURE EDGE NODE JABALPUR NEXUS          
==================================================
THANK YOU FOR YOUR TRUST AND BUSINESS WITH SMARTENGINE!`;

    const element = document.createElement("a");
    const file = new Blob([receiptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Receipt_${payTransactionId || 'TXN-81928092'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getIndustryWidgets = () => {
    const defaultWidgets = [
      { id: 'w_latency', title: 'Gateway Latency', value: `${latencyMeter}ms`, desc: 'Average edge api response time.' },
      { id: 'w_tokens', title: 'LLM Active Tokens', value: `${(tokensTicked/1000).toFixed(1)}K`, desc: 'Realtime token consumption rate.' },
      { id: 'w_load', title: 'Container Load', value: '42%', desc: 'Tilwara-Bhedaghat edge processor.' }
    ];

    switch(businessType) {
      case 'coaching':
        return [
          { id: 'w_students', title: 'Active Students', value: '150+', desc: 'Logged on RFID classroom portal.' },
          { id: 'w_attendance', title: 'Biometric Attendance', value: '98%', desc: 'Current daily check-in average.' },
          { id: 'w_score', title: 'Mock Target Score', value: `${rankMockScore}`, desc: 'Target conceptual metric score.' }
        ];
      case 'ecommerce':
        return [
          { id: 'w_orders', title: 'Active Orders', value: `${cart.length + 3} active`, desc: 'Wardrobe checkout queue.' },
          { id: 'w_wishlist', title: 'Wishlist Caches', value: `${wishlist.length} items`, desc: 'Style targets saved.' },
          { id: 'w_price', title: 'Couture Total', value: `₹${cartTotal.toLocaleString()}`, desc: 'Active shopping bag value.' }
        ];
      case 'real_estate':
        return [
          { id: 'w_properties', title: 'Properties Listed', value: '24 listed', desc: 'Duplexes and plots coordinates.' },
          { id: 'w_tours', title: 'Active 3D Tours', value: virtualTourActive ? 'ACTIVE' : 'STANDBY', desc: 'Blueprints visual state.' },
          { id: 'w_consults', title: 'Agent consultations', value: selectedBookingTime ? 'BOOKED' : 'OPEN', desc: 'Active slot allocations.' }
        ];
      case 'hospital':
        return [
          { id: 'w_patients', title: 'Telem Patients', value: '12 tokens', desc: 'Frost wait list status.' },
          { id: 'w_ambulance', title: 'Siren Dispatch', value: activeSupportSiren ? 'DISPATCHED' : 'STANDBY', desc: 'Rapid EMT coordinates status.' },
          { id: 'w_sugar', title: 'Verified Sugar', value: `${diagSugar} mg/dL`, desc: 'Diagnostics sugar logs.' }
        ];
      case 'cafe':
        return [
          { id: 'w_tables', title: 'Tables Reserved', value: `${tableSeats} seats`, desc: 'Riverside Bhedaghat lounge deck.' },
          { id: 'w_roaster', title: 'Roaster Temperature', value: `${roastTemp}°C`, desc: 'Arabica coffee roasting targets.' },
          { id: 'w_cart', title: 'Dine-In Cart', value: `${orderCart.length} orders`, desc: 'Artisanal coffee orders queue.' }
        ];
      case 'startup':
        return [
          { id: 'w_incubators', title: 'Accelerator slots', value: '4 cohorts', desc: 'Incubation tracks allocated.' },
          { id: 'w_concurrency', title: 'Node Compute CPU', value: `${cpuUsage}%`, desc: 'Hydro green grid load ratio.' },
          { id: 'w_teams', title: 'MP Teams Seeding', value: '12 active', desc: 'Jabalpur developers catalog.' }
        ];
      case 'gym':
        return [
          { id: 'w_bmi', title: 'Caloric BMI index', value: bmiResult ? bmiResult.bmi : '22.8', desc: 'Calculated metabolic target.' },
          { id: 'w_weight', title: 'Volume Target', value: `${bmiWeight} kg`, desc: 'Target mechanical load.' },
          { id: 'w_members', title: 'Active Athletes', value: '340 active', desc: 'FlexArena roster checkpoint.' }
        ];
      case 'tourism':
        return [
          { id: 'w_trips', title: 'Moonlight Bookings', value: '48 tickets', desc: 'Boating white marble reservations.' },
          { id: 'w_stays', title: 'Resort stays', value: '9 stays', desc: 'Riverside cottages checklist.' },
          { id: 'w_budget', title: 'Itinerary budget', value: `₹${(budgetTransit * budgetDays).toLocaleString()}`, desc: 'Forecasted package rates.' }
        ];
      case 'cybersecurity':
        return [
          { id: 'w_attacks', title: 'DDoS Blocks', value: `${simulatedAttackLogs.length} blocked`, desc: 'Cyber firewall intrusion filters.' },
          { id: 'w_quiz', title: 'Quiz Score', value: `${secQuizScore} correct`, desc: 'phishing posturing check index.' },
          { id: 'w_threat', title: 'Threat Status', value: simDdosActive ? 'DDoS COMPILING' : 'SECURE', desc: 'Active security salt posture.' }
        ];
      case 'career':
        return [
          { id: 'w_rating', title: 'Resume rating', value: resumeRating ? `${resumeRating.score}/100` : 'N/A', desc: 'Deep learning parse check index.' },
          { id: 'w_interview', title: 'Conversational Feedback', value: interviewFeedback ? 'COMPLETED' : 'PENDING', desc: 'AI mock interview evaluation.' },
          { id: 'w_internships', title: 'Startup Internships', value: '24 listings', desc: 'High-margin remote slots index.' }
        ];
      default:
        return defaultWidgets;
    }
  };

  const getIndustryChartData = () => {
    const defaultChart = [
      { x: 'SWARMS', y: 84, val: '12 swarms' },
      { x: 'REFACTORS', y: 91, val: '240 nodes' },
      { x: 'TUNING', y: 95, val: '95% index' },
      { x: 'LOGS', y: 72, val: '18ms lat' }
    ];

    switch(businessType) {
      case 'coaching':
        return [
          { x: 'PHYSICS', y: 94, val: '94% score' },
          { x: 'CHEMISTRY', y: 91, val: '91% score' },
          { x: 'MATHS', y: 98, val: '98% score' },
          { x: 'BIOLOGY', y: 88, val: '88% score' }
        ];
      case 'ecommerce':
        return [
          { x: 'BANARASI', y: 75, val: '₹45K price' },
          { x: 'ORGANZA', y: 92, val: '₹85K price' },
          { x: 'LUCKNOWI', y: 64, val: '₹18.5K price' },
          { x: 'COUTURE', y: 82, val: '82% demand' }
        ];
      case 'real_estate':
        return [
          { x: 'TILWARA', y: 84, val: '₹1.4 Cr' },
          { x: 'VIJAY NAGAR', y: 95, val: '₹95L price' },
          { x: 'BHEDAGHAT', y: 70, val: '₹65L price' },
          { x: 'GROWTH', y: 88, val: '88% index' }
        ];
      case 'hospital':
        return [
          { x: 'CARDIOLOGY', y: 85, val: '85% recovery' },
          { x: 'DIAGNOSTICS', y: 92, val: '92% speed' },
          { x: 'PEDIATRICS', y: 76, val: '76% beds' },
          { x: 'EMERGENCY', y: 60, val: '12 min dispatch' }
        ];
      case 'cafe':
        return [
          { x: 'ESPRESSO', y: 90, val: '₹280 price' },
          { x: 'ROSE CHAI', y: 78, val: '₹180 price' },
          { x: 'LAVA FUDGE', y: 94, val: '₹340 price' },
          { x: 'MUSIC GIGS', y: 85, val: '85% occupancy' }
        ];
      case 'startup':
        return [
          { x: 'INCUBATION', y: 80, val: '80% success' },
          { x: 'VC PITCH', y: 65, val: '₹10L average' },
          { x: 'COWORKING', y: 90, val: '90% occupied' },
          { x: 'SAAS CORES', y: 75, val: '75% nodes' }
        ];
      case 'gym':
        return [
          { x: 'STRENGTH', y: 92, val: '92% reps' },
          { x: 'HIIT CARDIO', y: 84, val: '84% bpm' },
          { x: 'SILVER PASS', y: 60, val: '60% capacity' },
          { x: 'GOLD VIP', y: 78, val: '78% capacity' }
        ];
      case 'tourism':
        return [
          { x: 'BOATING', y: 95, val: '95% tickets' },
          { x: 'SAFARIS', y: 88, val: '88% jeep slots' },
          { x: 'ECO RESORT', y: 74, val: '74% booked' },
          { x: 'HERITAGE', y: 60, val: '60% matches' }
        ];
      case 'cybersecurity':
        return [
          { x: 'PHISH BLOCKS', y: 92, val: '92% filters' },
          { x: 'PORT SCANS', y: 85, val: '85% firewall' },
          { x: 'SSH BLOCKS', y: 98, val: '98% secure' },
          { x: 'DDOS BLOCK', y: 74, val: '74% logs' }
        ];
      case 'career':
        return [
          { x: 'RESUME RATING', y: 78, val: '78% avg' },
          { x: 'MOCK ANSWERS', y: 86, val: '86% grade' },
          { x: 'PLACED LPA', y: 94, val: '₹18L package' },
          { x: 'INTERNSHIPS', y: 64, val: '24 active' }
        ];
      default:
        return defaultChart;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-white h-screen">
        <div className="w-16 h-16 rounded-full border-t-2 border-indigo-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold tracking-wide animate-pulse">Initializing Dynamic Preview Shell...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-white p-6 max-w-lg mx-auto text-center h-screen">
        <AlertTriangle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2">Dynamic Shell Pipeline Offline</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => { setLoading(true); setError(null); loadActiveConfig(); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
        >
          Re-establish Connection
        </button>
      </div>
    );
  }

  if (!config) return null;

  const { theme, hero, navigation, sections, footer } = config;
  const businessType = config.category || (config.businessType && config.businessType.includes('_') ? config.businessType.split('_')[0] : config.businessType) || 'coaching';

  return (
    <div className={`website-preview-scope min-h-screen flex flex-col transition-all duration-1000 relative overflow-hidden ${businessType}-theme ${businessType === 'coaching' ? 'matte-gold-theme' : ''} ${siteLightMode ? 'light-site' : ''}`} style={{ backgroundColor: businessType === 'coaching' ? undefined : (siteLightMode ? '#fdfbf7' : theme.background), fontFamily: 'var(--font-family-custom), sans-serif' }}>
      {/* Dynamic Animated Glass Orbs & Neon Grid Mesh - Premium Startup Layout */}
      {!siteLightMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 matrix-mesh">
          <div style={{ background: `radial-gradient(circle, ${theme.primary}25, transparent 75%)` }} className="moving-orb top-[-10%] left-[-10%] w-[700px] h-[700px]" />
          <div style={{ background: `radial-gradient(circle, ${theme.secondary}20, transparent 75%)` }} className="moving-orb top-[30%] right-[-10%] w-[600px] h-[600px]" />
          <div style={{ background: `radial-gradient(circle, ${theme.primary}15, transparent 70%)` }} className="moving-orb top-[60%] left-[-15%] w-[800px] h-[800px]" />
          <div style={{ background: `radial-gradient(circle, ${theme.secondary}22, transparent 70%)` }} className="moving-orb bottom-[-5%] right-[10%] w-[700px] h-[700px]" />

          <div style={{ background: `radial-gradient(circle, ${theme.primary}18, transparent 70%)` }} className="absolute top-[10%] right-[20%] w-96 h-96 blur-[120px] rounded-full" />
          <div style={{ background: `radial-gradient(circle, ${theme.secondary}15, transparent 70%)` }} className="absolute top-[45%] left-[5%] w-80 h-80 blur-[120px] rounded-full" />

          <div style={{ border: `1px solid ${theme.primary}2d`, background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${theme.primary}0a 100%)` }} className="glass-bubble-gold top-[5%] left-[3%] w-28 h-28 animate-float-slow" />
          <div style={{ border: `1px solid ${theme.secondary}2d`, background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${theme.secondary}0a 100%)` }} className="glass-bubble-gold top-[14%] right-[5%] w-36 h-36 animate-float-medium" />
          <div style={{ border: `1px solid ${theme.primary}2d`, background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${theme.primary}0a 100%)` }} className="glass-bubble-gold top-[28%] left-[8%] w-24 h-24 animate-float-slowest" />
          <div style={{ border: `1px solid ${theme.secondary}2d`, background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${theme.secondary}0a 100%)` }} className="glass-bubble-gold top-[42%] right-[10%] w-40 h-40 animate-float-slow" />
          <div style={{ border: `1px solid ${theme.primary}2d`, background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${theme.primary}0a 100%)` }} className="glass-bubble-gold top-[58%] left-[4%] w-32 h-32 animate-float-medium" />
          <div style={{ border: `1px solid ${theme.secondary}2d`, background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${theme.secondary}0a 100%)` }} className="glass-bubble-gold top-[70%] right-[8%] w-20 h-20 animate-float-slowest" />
          <div style={{ border: `1px solid ${theme.primary}2d`, background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${theme.primary}0a 100%)` }} className="glass-bubble-gold top-[83%] left-[10%] w-44 h-44 animate-float-slow" />
          <div style={{ border: `1px solid ${theme.secondary}2d`, background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${theme.secondary}0a 100%)` }} className="glass-bubble-gold top-[94%] right-[4%] w-28 h-28 animate-float-medium" />
        </div>
      )}
      {/* Ambient background light blobs */}
      <div style={{ background: `radial-gradient(circle at 10% 20%, ${theme.primary}1f, transparent 40%)` }} className="fixed top-0 left-0 w-[550px] h-[550px] pointer-events-none -z-10 blur-[130px]" />
      <div style={{ background: `radial-gradient(circle at 90% 80%, ${theme.secondary}14, transparent 40%)` }} className="fixed bottom-0 right-0 w-[550px] h-[550px] pointer-events-none -z-10 blur-[130px]" />

      <MarbleRocksCanvas effect={hero.jabalpurBranding.interactiveEffect} colors={theme} />
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
              <a key={idx} href={link.href} className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group py-2">
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {businessType === 'ecommerce' && (
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full font-mono">
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> {wishlist.length}</span>
                <span className="flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5 text-amber-500" /> {cart.length}</span>
              </div>
            )}
            <button
              onClick={() => setSiteLightMode(!siteLightMode)}
              className="p-2.5 rounded-full border border-amber-500/25 bg-amber-500/5 text-amber-500 hover:scale-105 active:scale-95 transition-transform"
              title="Toggle Website Theme Mode"
            >
              {siteLightMode ? <Moon className="w-4 h-4 text-stone-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            {(businessType === 'coaching' || businessType === 'smartengine') && (
              currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[var(--accent)] font-bold hidden sm:inline-block">
                    {businessType === 'smartengine' ? '⚡' : '🎓'} {currentUser.email.split('@')[0]}
                  </span>
                  <button
                    onClick={() => {
                      playClickSound();
                      const element = document.getElementById('dynamic_modules');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`text-[10px] border border-amber-500/30 px-3.5 py-1.5 rounded-full font-black transition-all hover:scale-105 active:scale-95 shadow-md ${
                      businessType === 'smartengine'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 text-black'
                    }`}
                  >
                    Dashboard Portal 🚀
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      localStorage.removeItem('userToken');
                      setCurrentUser(null);
                      setCoachingTab('student_portal');
                      setSaasTab('analytics');
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
                  className="text-[10px] border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/20 text-white px-4 py-1.5 rounded-full font-bold transition-all active:scale-95 shadow-inner"
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
            <h3 className="text-white font-bold text-sm">EMERGENCY SHIELD ACTIVE</h3>
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

          {businessType === 'smartengine' ? (
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-sans font-extrabold tracking-tight leading-[1.05] text-white">
              The Flagship Platform for <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                {typingText}
              </span>
              <span className="text-cyan-400 font-normal ml-1">|</span>
            </h1>
          ) : (
            <h1 className={`text-4xl md:text-5xl lg:text-7xl font-royal royal-heading tracking-wide leading-[1.12] text-[var(--text-custom)] text-glow ${businessType === 'coaching' ? 'text-center max-w-4xl font-bold not-italic' : 'font-normal'}`}>
              {hero.title} for <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 font-extrabold not-italic block mt-2 text-glow">
                {typingText}
              </span>
              <span className="text-cyan-400 font-normal ml-1 typing-caret"></span>
            </h1>
          )}

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
            <a href="#about" className="bg-white/5 border border-white/10 px-8 py-3.5 rounded-full font-semibold text-slate-200 hover:bg-white/10 transition-all text-sm">
              Explore Mission
            </a>
          </div>
        </div>

        <div className={`relative flex animate-in fade-in slide-in-from-right-5 duration-700 delay-200 ${businessType === 'coaching' ? 'lg:col-span-12 justify-center mx-auto mt-6' : 'lg:col-span-5 justify-center lg:justify-end'}`}>
          <div className="w-[320px] h-[340px] md:w-[380px] md:h-[400px] rounded-3xl overflow-hidden royal-frame relative group shadow-2xl">
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              {businessType === 'smartengine' ? (
                <CanvasHologram />
              ) : (
                <img src={hero.bgImage} alt="Dynamic visual representation" className="w-full h-full object-cover opacity-85 group-hover:scale-110 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-custom)] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 glass-panel border border-indigo-500/20 rounded-2xl p-4 animate-float">
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block mb-1 font-sans">
                  {businessType === 'smartengine' ? 'Autonomous AI Core' : 'Jabalpur Smart Engine OS'}
                </span>
                <p className="text-white font-royal royal-heading font-medium text-xs leading-snug">
                  {businessType === 'smartengine'
                    ? 'Distributed multi-agent pipeline nodes compiled with 18ms latency targets.'
                    : 'Fully functional no-code dynamic layout swapper active. Switch themes instantly.'}
                </p>
              </div>
            </div>
          </div>

          {businessType === 'smartengine' && (
            <>
              <div className="absolute top-[10%] left-[-15%] glass-panel border border-indigo-500/30 rounded-xl p-3 shadow-2xl animate-float font-mono text-[9px] text-slate-300">
                <span className="text-emerald-400 font-bold">✔ edge nodes:</span> active
              </div>
              <div className="absolute bottom-[20%] right-[-10%] glass-panel border border-indigo-500/30 rounded-xl p-3 shadow-2xl animate-float font-mono text-[9px] text-slate-300">
                <span className="text-indigo-400 font-bold">latency:</span> {latencyMeter}ms
              </div>
            </>
          )}
        </div>
      </section>

      {/* Dynamic Sections Loop */}
      {sections.map((section) => {
        if (!section.visible) return null;

        // If selected website type is education, show only courses and faculty sections
        if (businessType === 'coaching' || businessType === 'education') {
          if (section.type !== 'courses' && section.type !== 'faculty') {
            return null;
          }
        }

        return (
          <section key={section.id} id={section.id} className="py-16 md:py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/5 transition-all duration-300">
            <div className="section-header-alignment text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-royal royal-heading font-semibold tracking-wide text-[var(--text-custom)] uppercase">
                {section.title}
              </h2>
              <div className="flex items-center flex-center-align justify-center gap-3 my-2 opacity-80 pointer-events-none">
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
                {(section.content || []).map((feat, fIdx) => (
                  <div key={fIdx} className="royal-card rounded-[var(--radius-custom)] p-8 space-y-4 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                    <div style={{ background: `${theme.primary}12`, borderColor: 'rgba(251,191,36,0.2)' }} className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner border text-glow">
                      {feat.icon || '✦'}
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
                {(section.content || []).map((stat, sIdx) => (
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

            {section.type === 'about' && section.content && (
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
                      <img src={section.content.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800"} alt="Core vision graphic" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/20 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {section.type === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((course, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-4 flex flex-col justify-between hover:scale-105 transition-transform">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider">{course.target}</span>
                      <h3 className="text-lg font-bold text-white leading-snug">{course.name}</h3>
                      <p className="text-xs text-slate-400">Duration: <strong className="text-slate-300">{course.duration}</strong></p>
                      <p className="text-xs text-slate-400">Coached by: <span className="text-[var(--primary)] font-semibold">{course.faculty}</span></p>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xl font-black text-glow text-white">{course.fees}</span>
                      <button onClick={() => triggerRazorpaySimulation(course.name, course.fees)} className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-lg text-white font-sans bg-indigo-600 hover:bg-indigo-700 transition-colors shadow active:scale-95">Enroll Now</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'faculty' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((fac, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-amber-500/30 shadow-xl shadow-amber-500/5">
                      <img src={fac.image || fac.img} alt={fac.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-md font-bold text-white">{fac.name}</h3>
                      <p className="text-xs text-[var(--accent)] font-semibold font-mono">{fac.subject}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{fac.qual} • {fac.exp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'results' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((res, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 text-center space-y-3 relative overflow-hidden group">
                    <span className="absolute top-3 right-3 text-lg opacity-40 group-hover:scale-125 transition-transform">🏆</span>
                    <p className="text-3xl font-black text-glow" style={{ color: theme.primary || '#D4AF37' }}>{res.number}</p>
                    <div className="w-6 h-[1px] bg-slate-500/20 mx-auto" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{res.label}</h4>
                    <p className="text-[10px] text-slate-400">{res.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((prod, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-4 space-y-4 hover:scale-105 transition-transform flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="rounded-xl overflow-hidden aspect-square border border-white/5 relative">
                        <img src={prod.image || prod.img} alt={prod.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-amber-400 font-mono">⭐ {prod.rating}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{prod.name}</h3>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-md font-black text-white">{prod.price}</span>
                      <button onClick={() => triggerRazorpaySimulation(prod.name, prod.price)} className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow active:scale-95">Buy Now</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'offers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((off, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 flex flex-col justify-between border-l-4 border-l-emerald-500">
                    <div className="space-y-2">
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-1 rounded-full font-bold uppercase w-fit block">{off.promo}</span>
                      <h3 className="text-2xl font-black text-white">{off.discount}</h3>
                      <p className="text-xs text-slate-300">{off.desc}</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Artisan Code: <code className="text-indigo-400 font-bold ml-1">{off.code}</code></span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(off.code);
                          if (window.showToast) window.showToast('Promo Code Copied!', 'success');
                          setSaasLogs(prev => [`💳 Promo claimed: "${off.code}" copied to clipboard.`, ...prev]);
                        }}
                        className="text-[9px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((cat, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-4 hover:scale-105 transition-transform text-center space-y-3">
                    <div className="rounded-xl overflow-hidden aspect-video border border-white/5 relative">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-950/80 text-indigo-400 font-bold">{cat.count}</span>
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{cat.name}</h3>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'properties' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((prop, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-4 space-y-4 hover:scale-105 transition-transform flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="rounded-xl overflow-hidden aspect-video border border-white/5 relative">
                        <img src={prop.image} alt={prop.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-amber-500 font-mono">{prop.type}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white leading-snug">{prop.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">📏 {prop.size}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-md font-black text-amber-500">{prop.price}</span>
                      <button onClick={() => triggerRazorpaySimulation(`Booking Fee - ${prop.name}`, '5000')} className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-lg text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow active:scale-95">Reserve Tour</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'regions' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((reg, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{reg.name}</h3>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{reg.growth}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{reg.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'agents' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
                {(section.content || []).map((ag, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <img src={ag.image} alt={ag.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white">{ag.name}</h3>
                      <p className="text-[10px] text-amber-500 font-semibold">{ag.role}</p>
                      <p className="text-[9px] text-slate-400">{ag.exp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((serv, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl text-cyan-400">{serv.icon}</div>
                    <h3 className="text-md font-bold text-white">{serv.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{serv.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'doctors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
                {(section.content || []).map((doc, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white">{doc.name}</h3>
                      <p className="text-[10px] text-cyan-400 font-semibold">{doc.specialty}</p>
                      <p className="text-[9px] text-slate-400">{doc.qual} • {doc.exp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'appointments' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((appt, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full w-fit block uppercase ${appt.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400' : appt.status === 'LIMITED' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>{appt.status}</span>
                      <h3 className="text-sm font-bold text-white font-mono">{appt.time}</h3>
                      <p className="text-[10px] text-slate-400">{appt.slots}</p>
                    </div>
                    <button 
                      onClick={() => {
                        playClickSound();
                        if (appt.status === 'FULL') {
                          alert('This appointment session is fully booked! Please select another timing.');
                          return;
                        }
                        alert(`🩺 Simulated booking slot reserved: ${appt.time}. Clinical admission lead appended!`);
                        setSaasLogs(prev => [`🩺 Outpatient appt token requested for slot: ${appt.time}.`, ...prev]);
                      }}
                      className="w-full text-center text-[10px] uppercase font-bold tracking-widest py-2 rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 transition-colors cursor-pointer"
                    >
                      {appt.status === 'FULL' ? 'No Slots' : 'Reserve Slot'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'menu' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((item, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-4 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="rounded-xl overflow-hidden aspect-square border border-white/5 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 bg-amber-950/90 border border-amber-500/25 px-2.5 py-0.5 rounded-md text-[8px] font-bold text-amber-400 font-mono uppercase">{item.category}</span>
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{item.name}</h3>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-sm font-black text-amber-500 font-mono">{item.price}</span>
                      <button onClick={() => triggerRazorpaySimulation(item.name, item.price)} className="text-[9px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-md text-white bg-amber-700 hover:bg-amber-800 transition-colors shadow active:scale-95 cursor-pointer">Order Online</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'gigs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
                {(section.content || []).map((gig, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-4 border-l-4 border-l-amber-500 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-amber-500">{gig.date} • {gig.timing}</span>
                      <h3 className="text-md font-bold text-white">{gig.name}</h3>
                      <p className="text-xs text-slate-400">Featuring: <strong className="text-slate-300">{gig.artist}</strong></p>
                    </div>
                    <button onClick={() => alert(`🎵 Simulated reservation confirmed for: "${gig.name}" acoustic night lounge seat!`)} className="w-full text-center text-[9px] font-bold uppercase tracking-wider py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors cursor-pointer">Book Free Entry Seat</button>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((gal, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-3 space-y-3">
                    <div className="rounded-xl overflow-hidden aspect-video border border-white/5 relative">
                      <img src={gal.image} alt={gal.caption} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 text-center uppercase tracking-wider">{gal.caption}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'programs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((prog, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-3 border-l-4 border-l-blue-500">
                    <span className="text-[9px] font-mono font-bold text-blue-400">{prog.duration}</span>
                    <h3 className="text-md font-bold text-white">{prog.name}</h3>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-white/5 font-mono">
                      <span>Perks: <strong>{prog.equity}</strong></span>
                      <span>Limit: <strong>{prog.cap}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'mentors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
                {(section.content || []).map((ment, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{ment.name}</h3>
                      <p className="text-[10px] text-blue-400 font-semibold">{ment.role}</p>
                      <p className="text-[9px] text-slate-400 mt-1">{ment.exp} • {ment.qual}</p>
                    </div>
                    <button onClick={() => alert(`🤖 Simulated 1-on-1 advisor slot booked under ${ment.name}!`)} className="mt-4 text-[9px] uppercase font-bold tracking-wider py-1.5 rounded-lg border border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 cursor-pointer">Book Mentoring Slot</button>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'showcase' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((show, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">{show.company}</h3>
                      <p className="text-[10px] text-slate-400">{show.slogan}</p>
                    </div>
                    <span className="bg-blue-500/15 text-blue-400 font-mono text-[9px] font-black px-2.5 py-0.5 rounded-full">{show.status}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'workouts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((work, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-3 border-l-4 border-l-red-500">
                    <span className="text-[9px] font-mono font-bold text-red-500">{work.frequency}</span>
                    <h3 className="text-md font-bold text-white leading-snug">{work.name}</h3>
                    <p className="text-xs text-slate-300">Target Lift: <strong className="text-white">{work.focus}</strong></p>
                    <span className="bg-slate-900 border border-white/5 text-[9px] font-mono px-2 py-0.5 rounded font-bold text-slate-400 w-fit block uppercase">{work.load}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'trainers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
                {(section.content || []).map((tr, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{tr.name}</h3>
                      <p className="text-[10px] text-red-500 font-semibold">{tr.role}</p>
                      <p className="text-[9px] text-slate-400 mt-1 font-mono">{tr.certs} • {tr.exp}</p>
                    </div>
                    <button onClick={() => alert(`🏋️ Dynamic training consult requested under coach ${tr.name}!`)} className="mt-4 text-[9px] uppercase font-bold tracking-wider py-1.5 rounded-lg border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 cursor-pointer">Inquire Consulting</button>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'plans' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((pl, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 flex flex-col justify-between hover:scale-105 transition-transform">
                    <div className="space-y-3">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">MEMBERSHIP PROGRAM</span>
                      <h3 className="text-lg font-black text-white leading-normal uppercase">{pl.tier}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-mono">{pl.perks}</p>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-lg font-black text-red-500">{pl.price}</span>
                      <button onClick={() => triggerRazorpaySimulation(pl.tier, pl.price)} className="text-[9px] uppercase font-bold tracking-wider px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors shadow active:scale-95 cursor-pointer">Join FlexArena</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'packages' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((pkg, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 flex flex-col justify-between hover:scale-102 transition-transform">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold uppercase">{pkg.timing}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                      <p className="text-xs text-slate-300 font-medium">Highlight: <span className="text-sky-400">{pkg.highlight}</span></p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-md font-black text-white">{pkg.price}</span>
                      <button onClick={() => triggerRazorpaySimulation(pkg.name, pkg.price)} className="text-[9px] uppercase font-bold tracking-widest px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer">Book Expedition</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'stays' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((sty, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-4 space-y-4 hover:scale-105 transition-transform flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white leading-snug">{sty.hotel}</h3>
                      <p className="text-[10px] text-slate-400">Location: <strong className="text-slate-300">{sty.location}</strong></p>
                      <p className="text-[10px] text-sky-400 font-bold">⭐ {sty.rating}</p>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-sm font-black text-sky-500 font-mono">{sty.rate}</span>
                      <button onClick={() => triggerRazorpaySimulation(sty.hotel, sty.rate)} className="text-[9px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded text-white bg-sky-600 hover:bg-sky-700 cursor-pointer">Book Stay</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'itineraries' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((iti, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider leading-snug">{iti.title}</h3>
                      <span className="bg-sky-500/10 text-sky-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">{iti.duration}</span>
                    </div>
                    <div className="w-full bg-white/2 border border-white/5 rounded-lg p-3 text-[10px] text-slate-400 font-mono leading-normal">
                      <strong>Route Mapped:</strong> <span className="text-slate-300">{iti.route}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'quizzes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
                {(section.content || []).map((quiz, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-4">
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded-full block w-fit font-black uppercase">Cyber Matrix Question {idx + 1}</span>
                    <h3 className="text-sm font-bold text-white leading-relaxed font-mono">{quiz.q}</h3>
                    <div className="space-y-2 pt-2">
                      {quiz.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => {
                            playClickSound();
                            const isCorrect = oIdx === quiz.correct;
                            if (isCorrect) {
                              alert('🛡️ ACCESS KEY GRANTED! Your security response matches secure coordinates.');
                              setSaasLogs(prev => [`🛡️ Quiz match: Question ${idx+1} completed successfully.`, ...prev]);
                            } else {
                              alert('❌ KEY DENIED! Network firewall bypass parameters mismatch.');
                            }
                          }}
                          className="w-full text-left p-3 rounded-lg bg-white/2 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-[11px] text-slate-300 transition-colors font-mono cursor-pointer"
                        >
                          {oIdx + 1}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'tips' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((tip, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-2">
                    <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase font-mono">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                      {tip.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{tip.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'threats' && (
              <div className="royal-card rounded-[var(--radius-custom)] p-6 max-w-3xl mx-auto w-full space-y-4">
                <span className="text-[8px] bg-rose-500/10 text-rose-400 font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-widest w-fit block">Mitigated Intrusion Registry</span>
                <div className="space-y-2">
                  {(section.content || []).map((thr, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between font-mono text-[10px] text-slate-400 hover:bg-slate-900 transition-all">
                      <div>
                        <p className="font-bold text-slate-200">{thr.threat} <span className="text-[8px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded uppercase font-black ml-1.5">{thr.action}</span></p>
                        <p className="text-[9px] text-slate-500 mt-1">{thr.source} • {thr.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'internships' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((intern, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2 text-left">
                      <span className="bg-indigo-500/10 text-indigo-400 text-[8px] font-mono px-2 py-0.5 rounded-full font-black uppercase">{intern.company}</span>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider leading-snug">{intern.title}</h3>
                      <p className="text-[10px] text-slate-400">Stipend: <strong className="text-slate-300">{intern.stipend}</strong></p>
                      <p className="text-[9px] text-slate-500 font-mono">📍 {intern.location}</p>
                    </div>
                    <button onClick={() => alert(`💼 Simulated application filed for "${intern.title}" internship at ${intern.company}!`)} className="w-full text-center text-[9px] font-bold uppercase tracking-wider py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer">Apply Now</button>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((sk, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-2 border-l-4 border-l-indigo-500">
                    <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">{sk.level} Skill</span>
                    <h3 className="text-md font-bold text-white">{sk.name}</h3>
                    <p className="text-[10px] text-slate-400">Duration: <strong className="text-slate-300">{sk.duration}</strong></p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'success' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((sc, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-sans">{sc.student}</h3>
                      <span className="bg-indigo-500/10 text-indigo-400 font-mono text-[9px] font-black px-2 py-0.5 rounded-full shrink-0">{sc.package}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-mono leading-none">Placed at: <span className="text-amber-500 font-bold">{sc.placed}</span></p>
                    <div className="bg-white/2 border border-white/5 rounded-lg p-3 text-[10px] text-slate-400 italic font-sans leading-normal">
                      "{sc.feedback}"
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((an, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-5 space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{an.label}</h3>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                      <span>Core Load: <strong className="text-indigo-400">{an.load}</strong></span>
                      <span>Swarms: <strong className="text-cyan-400">{an.activeAgents}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'workflows' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(section.content || []).map((wf, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-5 space-y-3 border-l-4 border-l-indigo-500">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{wf.task}</h3>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono pt-1">
                      <span>Efficiency: <strong className="text-emerald-400">{wf.efficiency}</strong></span>
                      <span>Uptime: <strong className="text-indigo-400">{wf.uptime}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>
        );
      })}

      {/* DYNAMIC BUSINESS MODULES HUB */}
      {((businessType !== 'coaching') || currentUser) && (
        <section id="dynamic_modules" className="py-20 md:py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/5 relative">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-block bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-[10px] tracking-widest px-3 py-1 rounded-full uppercase font-mono border border-[var(--primary)]/20 animate-pulse">
              ⚡ ACTIVE WORKSPACE CONSOLE NODE
            </div>
            <h2 className="text-3xl md:text-5xl font-royal royal-heading font-semibold tracking-wide text-[var(--text-custom)]">
              Smart Interactive Command Desk
            </h2>
            <div className="flex items-center justify-center gap-3 my-2 opacity-80 pointer-events-none">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/50"></span>
              <span className="text-amber-500/70 text-[10px] tracking-widest font-sans">✦ ♛ ✦</span>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/50"></span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm font-sans tracking-wide max-w-xl mx-auto">
              Administrate and scale operations dynamically. Choose from active modules, drag widgets, run local AI sandboxes, and simulate payments for **{theme.name}**.
            </p>
          </div>

          {searchPaletteOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 backdrop-blur-sm p-4 pt-[10vh] animate-in fade-in duration-200">
              <div className="max-w-lg w-full bg-[#0a081a] border border-[var(--primary)]/30 rounded-2xl shadow-2xl p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Search className="w-4 h-4 text-[var(--primary)]" />
                  <input 
                    type="text" 
                    placeholder={`Search actions in ${theme.name} (e.g. scale, sandbox, vault, salt)...`} 
                    value={paletteQuery}
                    onChange={(e) => setPaletteQuery(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-slate-600 font-mono"
                    autoFocus
                  />
                  <button 
                    onClick={() => setSearchPaletteOpen(false)}
                    className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-400 hover:text-white"
                  >
                    ESC
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {[
                    { cmd: 'Audit and enforce password salts', desc: 'Secure passwords using factor-10 Bcrypt hashing keys.', keywords: 'salts hash secure' },
                    { cmd: 'Simulate high-concurrency payment', desc: 'Trigger secure Razorpay mock checkout logs.', keywords: 'payment razorpay simulate' },
                    { cmd: 'Clean local cache vector vault', desc: 'Purge file schema tables index listings.', keywords: 'vault purge clean' },
                    { cmd: 'Scale active Edge cloud container', desc: 'Spin up self-optimizing microservices cores.', keywords: 'scale server cloud' }
                  ].filter(item => !paletteQuery || item.cmd.toLowerCase().includes(paletteQuery.toLowerCase()) || item.keywords.toLowerCase().includes(paletteQuery.toLowerCase())).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playClickSound();
                        setSearchPaletteOpen(false);
                        setSaasLogs(prev => [`⚡ CommandPalette executed: "${item.cmd}" applied successfully.`, ...prev]);
                        if (window.showToast) window.showToast(`Executed: ${item.cmd}`, 'success');
                      }}
                      className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-white/2 hover:bg-[var(--primary)]/10 border border-white/5 hover:border-[var(--primary)]/30 transition-all"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{item.cmd}</p>
                        <p className="text-[9px] text-slate-500">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main split work dashboard layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* Left 8-Columns: Interactive Modules */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Dynamic Workspace tabs (Vercel styled) */}
              <div className="flex border-b border-white/5 pb-2 gap-2 overflow-x-auto whitespace-nowrap scrollbar-none font-mono text-[10px] font-bold uppercase tracking-wider">
                {(businessType === 'smartengine'
                  ? [
                      { id: 'analytics', label: 'Telemetry Desk' },
                      { id: 'workflows', label: 'AI Workflows' },
                      { id: 'recommendations', label: 'Insights & Recs' },
                      { id: 'files', label: 'Vector Vault' },
                      { id: 'team', label: 'Collaborators Roster' }
                    ]
                  : [
                      { id: 'analytics', label: 'Telemetry Desk' },
                      { id: 'sandbox', label: 'Local AI Sandbox' },
                      { id: 'files', label: 'Vector Vault' },
                      { id: 'team', label: 'Collaborators Roster' }
                    ]
                ).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { playClickSound(); setSaasTab(tab.id); }}
                    className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl transition-all border cursor-pointer ${
                      saasTab === tab.id
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30 shadow-inner font-black'
                        : 'text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                <button
                  onClick={() => { playClickSound(); setSearchPaletteOpen(true); }}
                  className="ml-auto bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 px-3 py-1.5 rounded-xl text-[9px] font-mono text-[var(--primary)] flex items-center gap-1 transition-all"
                >
                  <Search className="w-3 h-3" /> COMMAND PANEL (⌘K)
                </button>
              </div>

              {/* TAB 1: TELEMETRY DESK */}
              {saasTab === 'analytics' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getIndustryWidgets().map((widget) => (
                      <div
                        key={widget.id}
                        onClick={() => {
                          playClickSound();
                          setSaasLogs(prev => [`⚡ Draggable widget click: swapped layout index for "${widget.title}".`, ...prev]);
                        }}
                        className="saas-card p-5 rounded-2xl border relative overflow-hidden group shadow-lg cursor-pointer hover:border-[var(--primary)]/30"
                      >
                        <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--primary)]/5 rounded-full blur-lg" />
                        <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider font-mono block">
                          {widget.title} (Click to Drag-Swap)
                        </span>
                        <h4 className="text-2xl font-mono font-black text-white mt-1 group-hover:text-[var(--primary)] transition-colors">
                          {widget.value}
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-normal mt-1">
                          {widget.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="saas-card p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Active Telemetry Load Graph</h4>
                        <p className="text-[10px] text-slate-500">Live compute loads allocated across Central India edge nodes</p>
                      </div>
                      <span className="text-[10px] font-mono bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] px-2 py-0.5 rounded font-bold animate-pulse">
                        TELEMETRY ACTIVE
                      </span>
                    </div>

                    <div className="h-44 flex items-end justify-between pt-6 border-b border-white/5 font-mono text-[9px] text-slate-500 relative">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        <div className="h-[1px] w-full border-t border-dashed border-white/10" />
                        <div className="h-[1px] w-full border-t border-dashed border-white/10" />
                        <div className="h-[1px] w-full border-t border-dashed border-white/10" />
                      </div>

                      {getIndustryChartData().map((bar, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 group z-10">
                          <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[8px] bg-slate-950 border border-[var(--primary)]/20 px-1 py-0.5 rounded -mt-6 block absolute">
                            {bar.val}
                          </span>
                          <div 
                            style={{ height: `${bar.y}%` }} 
                            className="w-10 bg-gradient-to-t from-[var(--primary)]/10 via-[var(--primary)]/40 to-[var(--primary)] rounded-t shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all group-hover:scale-y-105 duration-500 cursor-pointer"
                          />
                          <span className="text-[8px] uppercase tracking-wider font-semibold text-slate-400 mt-1">{bar.x}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AI SANDBOX */}
              {saasTab === 'sandbox' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="saas-card p-6 rounded-2xl border border-white/5 space-y-4">
                    <div>
                      <span className="text-[8px] text-[var(--primary)] font-bold tracking-widest uppercase block font-mono">Industry Sandbox Compile</span>
                      <h4 className="text-sm font-bold text-white font-poppins">{theme.name} Custom Operations Sandbox</h4>
                      <p className="text-slate-400 text-xs mt-0.5">Interact with the custom compiled diagnostics designed for class-level {businessType} environments.</p>
                    </div>

                    {businessType === 'ecommerce' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/5 pt-4">
                        <div className="md:col-span-7 space-y-4 text-xs text-left">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Select Clothing Style</label>
                            <div className="flex gap-2">
                              {['Royal Traditional', 'Contemporary Silk', 'Fusion Gold'].map(st => (
                                <button key={st} onClick={() => setOutfitStyle(st)} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${outfitStyle === st ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-white' : 'border-white/5 bg-white/5 text-slate-400'}`}>{st}</button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1.5">Size Coordinates</label>
                              <select value={outfitSize} onChange={(e) => setOutfitSize(e.target.value)} className="w-full bg-slate-950 border border-white/10 text-[10px] p-2 rounded-lg text-white font-bold">
                                <option>S</option>
                                <option>M</option>
                                <option>L</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1.5">HSL Color Tone</label>
                              <select value={outfitColor} onChange={(e) => setOutfitColor(e.target.value)} className="w-full bg-slate-950 border border-white/10 text-[10px] p-2 rounded-lg text-white font-bold">
                                <option value="#D4AF37">Antique Gold</option>
                                <option value="#818cf8">Lavender Accent</option>
                                <option value="#ef4444">Volcanic Saffron</option>
                              </select>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              playClickSound();
                              const rep = `🎉 Styled customized ${outfitStyle} (${outfitSize}) in ${outfitColor === '#D4AF37' ? 'Antique Gold' : outfitColor === '#818cf8' ? 'Lavender' : 'Volcanic Saffron'} HSL coordinates successfully!`;
                              setOutfitPreviewReport(rep);
                              setSaasLogs(prev => [`📥 Style designed: "${outfitStyle}" compiled successfully.`, ...prev]);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] tracking-widest px-5 py-2.5 rounded-xl transition-all uppercase shadow active:scale-95"
                          >
                            Compile Outfit Design
                          </button>
                        </div>

                        <div className="md:col-span-5 flex flex-col items-center justify-center border border-white/5 bg-slate-950 p-6 rounded-2xl h-48 relative overflow-hidden">
                          <div style={{ background: `radial-gradient(circle, ${outfitColor}2a, transparent 75%)` }} className="absolute inset-0 pointer-events-none" />
                          <div style={{ backgroundColor: outfitColor }} className="w-16 h-20 rounded-xl opacity-60 border-2 border-white/20 shadow-xl flex items-center justify-center font-bold text-black text-xs animate-pulse">
                            👗
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 mt-3 uppercase tracking-wider">{outfitStyle} ({outfitSize})</span>
                        </div>
                      </div>
                    )}

                    {businessType === 'real_estate' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/5 pt-4">
                        <div className="md:col-span-7 space-y-4 text-xs text-left">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Target Rooms: {bpRooms}</label>
                              <input type="range" min="1" max="5" value={bpRooms} onChange={(e) => setBpRooms(parseInt(e.target.value))} className="w-full accent-[var(--primary)]" />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Floors Multiplier: {bpFloors}</label>
                              <input type="range" min="1" max="3" value={bpFloors} onChange={(e) => setBpFloors(parseInt(e.target.value))} className="w-full accent-[var(--primary)]" />
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Plot Width Coordinates: {bpWidth}ft</label>
                            <input type="range" min="30" max="70" value={bpWidth} onChange={(e) => setBpWidth(parseInt(e.target.value))} className="w-full accent-[var(--primary)]" />
                          </div>

                          <button 
                            onClick={() => {
                              playClickSound();
                              const rep = `🏡 3D duplex structure compiled: ${bpRooms} rooms, ${bpFloors} floors, ${bpWidth}ft width plot index. Blueprint coordinates saved!`;
                              setBpPreviewReport(rep);
                              setSaasLogs(prev => [`🏡 Blueprint compiled: "${bpRooms} Rooms / ${bpFloors} Floors" duplex verified.`, ...prev]);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] tracking-widest px-5 py-2.5 rounded-xl transition-all uppercase shadow active:scale-95"
                          >
                            Compile 3D Blueprints
                          </button>
                        </div>

                        <div className="md:col-span-5 flex flex-col items-center justify-center border border-white/5 bg-slate-950 p-4 rounded-2xl h-48 relative overflow-hidden">
                          <div className="grid grid-cols-3 gap-2 w-full max-w-[160px]">
                            {Array.from({ length: Math.min(6, bpRooms * bpFloors) }).map((_, rIdx) => (
                              <div key={rIdx} className="border border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)] text-[8px] font-bold py-2 rounded text-center animate-pulse">
                                Room {rIdx + 1}
                              </div>
                            ))}
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 mt-4 uppercase tracking-wider">3D Duplex Blueprint Grid</span>
                        </div>
                      </div>
                    )}

                    {businessType === 'hospital' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/5 pt-4">
                        <div className="md:col-span-7 space-y-4 text-xs text-left">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Blood Sugar (mg/dL)</label>
                              <input type="number" value={diagSugar} onChange={(e) => setDiagSugar(parseInt(e.target.value))} className="w-full bg-slate-950 border border-white/10 text-xs p-2.5 rounded-lg text-white" />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Systolic BP (mmHg)</label>
                              <input type="number" value={diagBps} onChange={(e) => setDiagBps(parseInt(e.target.value))} className="w-full bg-slate-950 border border-white/10 text-xs p-2.5 rounded-lg text-white" />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Heart Rate (bpm)</label>
                              <input type="number" value={diagHeartRate} onChange={(e) => setDiagHeartRate(parseInt(e.target.value))} className="w-full bg-slate-950 border border-white/10 text-xs p-2.5 rounded-lg text-white" />
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              playClickSound();
                              const isSafe = diagSugar < 140 && diagBps < 130 && diagHeartRate < 100;
                              const rep = `🩺 Health analysis completed. Sugar: ${diagSugar}mg/dL, BP: ${diagBps}mmHg, HeartRate: ${diagHeartRate}bpm. Diagnostics Status: ${isSafe ? 'EXCELLENT' : 'HIGH DISPATCH ALERT'}`;
                              setDiagReport(rep);
                              setSaasLogs(prev => [`🩺 Diagnostics simulated: patient blood sugar verified at ${diagSugar} mg/dL.`, ...prev]);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] tracking-widest px-5 py-2.5 rounded-xl transition-all uppercase shadow active:scale-95"
                          >
                            Simulate Diagnostics Metrics
                          </button>
                        </div>

                        <div className="md:col-span-5 flex flex-col items-center justify-center border border-white/5 bg-slate-950 p-6 rounded-2xl h-48 text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-center text-xl text-[var(--primary)] animate-ping">
                            🩺
                          </div>
                          <span className="text-[10px] font-mono text-slate-300 font-bold uppercase block">Pulse diagnostic telemetry</span>
                          <span className="text-[9px] font-mono text-slate-500">Wait Queue: 12 Token Patients</span>
                        </div>
                      </div>
                    )}

                    {businessType === 'cafe' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/5 pt-4">
                        <div className="md:col-span-7 space-y-4 text-xs text-left">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Roasting Temp: {roastTemp}°C</label>
                              <input type="range" min="180" max="240" value={roastTemp} onChange={(e) => setRoastTemp(parseInt(e.target.value))} className="w-full accent-[var(--primary)]" />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Roasting Duration: {roastDuration} mins</label>
                              <input type="range" min="10" max="25" value={roastDuration} onChange={(e) => setRoastDuration(parseInt(e.target.value))} className="w-full accent-[var(--primary)]" />
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1.5">Select Organic Coffee Beans</label>
                            <div className="flex gap-2">
                              {['Arabica Single Origin', 'Robusta Classic Blend'].map(b => (
                                <button key={b} onClick={() => setRoastBean(b)} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${roastBean === b ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-white' : 'border-white/5 bg-white/5 text-slate-400'}`}>{b}</button>
                              ))}
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              playClickSound();
                              const rep = `☕ Roasting single-origin ${roastBean} at ${roastTemp}°C for ${roastDuration} mins. Aroma parameters matching peak quality criteria!`;
                              setRoastReport(rep);
                              setSaasLogs(prev => [`☕ Roaster active: single-origin "${roastBean}" roasts completed.`, ...prev]);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] tracking-widest px-5 py-2.5 rounded-xl transition-all uppercase shadow active:scale-95"
                          >
                            Start Roasting Coffee
                          </button>
                        </div>

                        <div className="md:col-span-5 flex flex-col items-center justify-center border border-white/5 bg-slate-950 p-6 rounded-2xl h-48 relative overflow-hidden">
                          <div style={{ background: `radial-gradient(circle, ${theme.primary}20, transparent 75%)` }} className="absolute inset-0 pointer-events-none" />
                          <div className="w-16 h-12 border-4 border-amber-900 rounded-b-3xl relative flex items-end justify-center overflow-hidden">
                            <div style={{ height: `${(roastTemp - 180) * 1.6}%` }} className="w-full bg-amber-950 transition-all duration-[2000ms] ease-out" />
                          </div>
                          <div className="w-20 h-1 bg-amber-900 rounded-full" />
                          <span className="text-[9px] font-mono text-slate-400 mt-4 uppercase tracking-wider">Aromatic Coffee Fill Level</span>
                        </div>
                      </div>
                    )}

                    {businessType === 'cybersecurity' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/5 pt-4">
                        <div className="md:col-span-7 space-y-4 text-xs text-left">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Target Attack Node IP</label>
                            <input type="text" value={simDdosIp} onChange={(e) => setSimDdosIp(e.target.value)} className="w-full bg-slate-950 border border-white/10 text-xs p-2.5 rounded-lg text-white" />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">DDoS Package Intensity: {simIntensity}%</label>
                            <input type="range" min="10" max="100" value={simIntensity} onChange={(e) => setSimIntensity(parseInt(e.target.value))} className="w-full accent-green-500" />
                          </div>

                          <button 
                            onClick={() => {
                              playClickSound();
                              setSimDdosActive(true);
                              setSaasLogs(prev => [`🛡️ Cyber firewall activated: DDoS threat check started for IP ${simDdosIp}.`, ...prev]);
                              setTimeout(() => {
                                setSimDdosActive(false);
                                alert('🛡️ INTRUSION SHIELD: Simulated DDoS packet flood blocked. IP quarantined.');
                              }, 3000);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] tracking-widest px-5 py-2.5 rounded-xl transition-all uppercase shadow active:scale-95"
                          >
                            Deploy Matrix Firewall
                          </button>
                        </div>

                        <div className="md:col-span-5 flex flex-col items-center justify-center border border-white/5 bg-slate-950 p-6 rounded-2xl h-48 text-center space-y-2">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${simDdosActive ? 'bg-rose-500/10 border-rose-500 text-rose-500 animate-ping' : 'bg-green-500/10 border-green-500 text-green-500'}`}>
                            🛡️
                          </div>
                          <span className="text-[10px] font-mono text-slate-300 font-bold uppercase block">Security Posture Telemetry</span>
                          <span className="text-[9px] font-mono text-slate-500">{simDdosActive ? 'BLOCKING DDOS HACK' : 'Grids fully protected.'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: VECTOR VAULT */}
              {saasTab === 'files' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="saas-card p-6 rounded-2xl border border-white/5 space-y-4">
                    <div>
                      <span className="text-[8px] text-[var(--primary)] font-bold tracking-widest uppercase block font-mono">Vector Vault Catalog</span>
                      <h4 className="text-sm font-bold text-white font-poppins">{theme.name} Digital Chest</h4>
                      <p className="text-slate-400 text-xs mt-0.5">Drag, drop, or simulate direct weights uploads into your secure local storage.</p>
                    </div>

                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 bg-slate-950/40 hover:bg-slate-950/80 transition-colors cursor-pointer group">
                      <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-[var(--primary)] transition-colors" />
                      <span className="text-xs font-semibold text-slate-300 font-mono">Drop medical sheets, outfit specs, or scripts</span>
                      <span className="text-[9px] text-slate-500">Supports PDF, JSON, BIN files up to 50MB</span>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {saasFiles.map((file, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between text-[11px] font-mono hover:bg-slate-900/60">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📄</span>
                            <div>
                              <p className="font-bold text-white">{file.name}</p>
                              <p className="text-[9px] text-slate-500">{file.type} • {file.size}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              playClickSound();
                              setSaasFiles(prev => prev.filter((_, i) => i !== idx));
                              setSaasLogs(prev => [`🗑️ File catalog purged: "${file.name}" deleted.`, ...prev]);
                            }}
                            className="text-slate-500 hover:text-rose-500 transition-colors p-1.5"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: COLLABORATORS ROSTER */}
              {saasTab === 'team' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="saas-card p-6 rounded-2xl border border-white/5 space-y-4">
                    <div>
                      <span className="text-[8px] text-[var(--primary)] font-bold tracking-widest uppercase block font-mono">Standby Collaborators</span>
                      <h4 className="text-sm font-bold text-white font-poppins">{theme.name} Team Roster</h4>
                      <p className="text-slate-400 text-xs mt-0.5">Administrate operations nodes, invite experts, and scale security roles.</p>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        playClickSound();
                        if (!saasNewMemberEmail) return;
                        setSaasTeam(prev => [...prev, { name: saasNewMemberEmail.split('@')[0], role: saasNewMemberRole, email: saasNewMemberEmail, status: 'ACTIVE' }]);
                        setSaasLogs(prev => [`👥 Roster invite sent: "${saasNewMemberEmail}" added as ${saasNewMemberRole}.`, ...prev]);
                        setSaasNewMemberEmail('');
                      }}
                      className="flex gap-2"
                    >
                      <input 
                        type="email" 
                        placeholder="Invite teammate email..." 
                        value={saasNewMemberEmail}
                        onChange={(e) => setSaasNewMemberEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 text-xs px-3 rounded-xl text-white focus:outline-none"
                        required
                      />
                      <select 
                        value={saasNewMemberRole}
                        onChange={(e) => setSaasNewMemberRole(e.target.value)}
                        className="bg-slate-950 border border-white/10 text-[10px] px-3 py-2 rounded-xl text-white font-bold"
                      >
                        <option>Operator</option>
                        <option>Lead Physician</option>
                        <option>Barista Chef</option>
                        <option>Security Lead</option>
                      </select>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-xs font-bold rounded-xl active:scale-95 transition-transform shrink-0">Send Invite</button>
                    </form>

                    <div className="space-y-2">
                      {saasTeam.map((mem, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between text-[11px] font-mono">
                          <div>
                            <p className="font-bold text-white">{mem.name} <span className="bg-indigo-500/10 text-indigo-400 font-mono text-[8px] px-2 py-0.5 rounded-full ml-1.5 font-black uppercase">{mem.role}</span></p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{mem.email}</p>
                          </div>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${mem.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 animate-pulse' : 'bg-amber-500/10 text-amber-400'}`}>{mem.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4-Columns: Realtime Matrix Terminal Logs */}
            <div className="lg:col-span-4 space-y-6">
              <div className="saas-card rounded-2xl border border-white/5 p-5 relative overflow-hidden flex flex-col h-[400px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <span className="text-[8px] text-[var(--accent)] font-bold tracking-widest uppercase block font-mono">Matrix Pipeline Logs</span>
                <div className="flex-1 overflow-y-auto mt-4 font-mono text-[9px] text-slate-400 space-y-2.5 text-left pr-1 scrollbar-none">
                  {saasLogs.map((log, idx) => (
                    <p key={idx} className="leading-relaxed">
                      <span className="text-[var(--primary)] font-bold mr-1.5">&gt;</span>
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Styled Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--primary)] flex items-center justify-center font-royal font-bold text-white text-xs border border-amber-500/30">
              {navigation.logoText.substring(0,1)}
            </div>
            <span className="font-royal royal-heading text-sm font-bold tracking-wider text-white">
              {navigation.logoText}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono text-center md:text-right">
            {footer.text}
          </p>
        </div>
      </footer>

      {/* Razorpay gateway overlay simulator */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 space-y-6 relative overflow-hidden text-left font-mono">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-xs font-bold text-white">RAZORPAY SECURE SIMULATOR</span>
              </div>
              <button 
                onClick={() => setShowPayModal(false)}
                className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-slate-400 hover:text-white"
              >
                CLOSE
              </button>
            </div>

            {payingState === 'idle' && (
              <div className="space-y-4 animate-in zoom-in-95 duration-300">
                <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[10px] text-slate-500">TRANSACTION INTENT</p>
                  <h4 className="text-xs font-black text-white">{payPlanName}</h4>
                  <p className="text-xl font-black text-emerald-400">{payPrice}</p>
                </div>

                <div className="flex border-b border-white/5 pb-2 gap-2 text-[10px] font-bold">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'scanner', label: 'UPI Scanner', icon: QrCode },
                    { id: 'bank', label: 'Bank Coordinates', icon: Server }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { playClickSound(); setPayTab(tab.id); }}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border transition-colors ${payTab === tab.id ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {payTab === 'card' && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="w-full bg-gradient-to-tr from-slate-950 to-slate-900 border border-white/10 rounded-2xl p-4 space-y-3 relative shadow-inner">
                      <span className="text-[7px] text-slate-500 tracking-widest block uppercase">SIMULATED ESCROW CARD</span>
                      <p className="text-sm font-bold text-white tracking-widest font-mono">{cardNumber}</p>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                        <span>HOLDER: {currentUser ? currentUser.email.split('@')[0].toUpperCase() : 'VISITOR'}</span>
                        <span>EXPIRY: {cardExpiry}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] text-slate-500 uppercase block mb-1">Simulated Card Number</label>
                        <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-slate-950 border border-white/10 text-xs px-3 py-2 rounded-lg text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-slate-500 uppercase block mb-1">Expiry</label>
                          <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full bg-slate-950 border border-white/10 text-xs px-3 py-2 rounded-lg text-white" />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 uppercase block mb-1">CVV</label>
                          <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="w-full bg-slate-950 border border-white/10 text-xs px-3 py-2 rounded-lg text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {payTab === 'scanner' && (
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-white/5 rounded-2xl text-center space-y-4 animate-in fade-in duration-300">
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded uppercase font-black tracking-wider block">Auto-Generated QR scanner</span>
                    <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center relative">
                      <div className="w-full h-full border-4 border-slate-950 relative flex items-center justify-center font-bold text-black text-[9px]">
                        [MOCK QR]
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400">Scan using any dynamic UPI application coordinates</p>
                      <p className="text-[9px] text-indigo-400 mt-1 font-bold">Linked UPI: <code className="text-white bg-white/5 px-2 py-0.5 rounded">{config.paymentDetails?.upiId || 'jabalpur@sbi'}</code></p>
                    </div>
                  </div>
                )}

                {payTab === 'bank' && (
                  <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl space-y-3 animate-in fade-in duration-300 text-xs text-left">
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black tracking-widest block uppercase">Direct Bank Coordinates</span>
                    <div className="space-y-2 text-[10px] text-slate-400 font-mono">
                      <p>Bank: <strong className="text-white">{config.paymentDetails?.bankName || 'State Bank of MP'}</strong></p>
                      <p>Account Number: <strong className="text-white">{config.paymentDetails?.accountNumber || '382901928392'}</strong></p>
                      <p>IFSC Code: <strong className="text-white">{config.paymentDetails?.ifscCode || 'SBIN0001234'}</strong></p>
                      <p>Account Holder: <strong className="text-white">{config.paymentDetails?.holderName || 'Nexus Platforms Corp'}</strong></p>
                    </div>
                  </div>
                )}

                <button 
                  onClick={executePaymentCall}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-colors active:scale-95"
                >
                  Validate simulated Payment
                </button>
              </div>
            )}

            {payingState === 'paying' && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in duration-300">
                <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin" />
                <div>
                  <h4 className="text-xs font-bold text-white">AUTONOMOUS ESCROW AUDITING...</h4>
                  <p className="text-[9px] text-slate-500 mt-1">Simulating 3D secure authentication checks & webhooks queries</p>
                </div>
              </div>
            )}

            {payingState === 'success' && (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in zoom-in-95 duration-300 font-mono">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-400 flex items-center justify-center text-2xl font-bold animate-bounce">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">CAPTURED SUCCESS</h4>
                  <p className="text-[9px] text-slate-500 mt-1">Transaction ID: <span className="text-indigo-400 font-bold">{payTransactionId}</span></p>
                </div>

                <div className="w-full bg-slate-950 p-4 rounded-2xl border border-white/5 text-left text-[10px] text-slate-400 leading-relaxed max-h-[140px] overflow-y-auto pr-1">
                  <strong>Invoice coordinates logs:</strong><br />
                  Amount: {payPrice}<br />
                  Receiver: {config.paymentDetails?.holderName || 'Nexus Platforms'}<br />
                  Client: {currentUser ? currentUser.email.split('@')[0] : 'Visitor'}<br />
                  Status: CAPTURED / SUCCESSFUL
                </div>

                <div className="flex gap-2 w-full pt-2">
                  <button 
                    onClick={downloadReceiptSlip}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] py-2 rounded-xl active:scale-95 transition-transform"
                  >
                    📥 Download Slip
                  </button>
                  <button 
                    onClick={() => setShowPayModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-[9px] py-2 rounded-xl transition-colors"
                  >
                    Exit Gate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Dummy Lucide components mapping for dynamic rendering fallback
const QrCode = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16V21H16" />
    <path d="M21 9V14" />
    <path d="M9 21H14" />
    <path d="M14 14H10V10H14V14Z" />
  </svg>
);
