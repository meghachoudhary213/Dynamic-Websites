"use client";

import React, { useState, useEffect } from 'react';
import { 
  Award, BookOpen, Calendar, Clock, LogOut, CheckCircle, 
  TrendingUp, Activity, Bell, FileText, ArrowRight, User,
  ShoppingBag, CreditCard, Tag, Compass, Layers, Home, Menu, X, Plus, Edit2, Zap
} from 'lucide-react';
import { API_URL } from '../config';

export default function DynamicDashboardLayout({ websiteName, category, theme, paymentDetails, slug }) {
  const isEducation = category === 'coaching' || category === 'education';
  const isEcommerce = category === 'ecommerce';

  // Available Modules list based on category
  const educationModules = [
    { id: 'attendance', label: 'Attendance', icon: CheckCircle },
    { id: 'tests', label: 'Tests Diagnostics', icon: Award },
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'courses', label: 'Syllabus Courses', icon: BookOpen }
  ];

  const ecommerceModules = [
    { id: 'products', label: 'Product Catalog', icon: ShoppingBag },
    { id: 'orders', label: 'Delivery Orders', icon: Compass },
    { id: 'payments', label: 'Payment Ledger', icon: CreditCard }
  ];

  const activeModules = isEducation ? educationModules : isEcommerce ? ecommerceModules : [
    { id: 'overview', label: 'Overview Metrics', icon: Layers }
  ];

  const [activeTab, setActiveTab] = useState(activeModules[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic MongoDB Collections State
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch website data dynamically from MongoDB
  useEffect(() => {
    async function loadDynamicData() {
      try {
        const targetSlug = slug || 'nextrank';
        const res = await fetch(`${API_URL}/api/website/data/${targetSlug}`);
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses || []);
          setStudents(data.students || []);
          setProductsList(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching dynamic website data from MongoDB:', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadDynamicData();
  }, [slug]);

  // Sound effects
  const playClickSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
      audio.volume = 0.08;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // Standard Hardcoded Fallbacks (Hybrid mode ensures beautiful display even if empty)
  const coursesFallback = [
    { name: "IIT-JEE Advanced Physics", duration: "12 Months", faculty: "Dr. H.C. Verma", target: "JEE 2027", progress: 78 },
    { name: "Organic Chemistry Masterclass", duration: "6 Months", faculty: "Prof. D.K. Singh", target: "JEE/NEET", progress: 62 },
    { name: "NEET Biology Diagnostics", duration: "9 Months", faculty: "Dr. Shashi Bala", target: "NEET 2026", progress: 91 }
  ];

  const testsFallback = [
    { title: "All India JEE Test 04", date: "June 05, 2026", score: "284/360", rank: "AIR 142" },
    { title: "NEET Chemistry Sectional", date: "May 24, 2026", score: "172/180", rank: "AIR 89" }
  ];

  const notesFallback = [
    { title: "Rotational Mechanics Cheat Sheet", category: "Physics", size: "2.4 MB", type: "PDF Document" },
    { title: "Chemical Kinetics Lecture Formula", category: "Chemistry", size: "1.8 MB", type: "PDF Document" },
    { title: "Cell Structure Diagrams Index", category: "Biology", size: "4.1 MB", type: "Image Pack" }
  ];

  const productsFallback = [
    { id: 1, name: "ShopVerse Premium Leather Bag", price: 4200, rating: 4.8, stock: 12, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400" },
    { id: 2, name: "Luxury Autumn Woolen Jacket", price: 3800, rating: 4.7, stock: 8, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400" },
    { id: 3, name: "Gold Plated Chrono Watch", price: 6500, rating: 4.9, stock: 4, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400" }
  ];

  const ordersFallback = [
    { id: "ORD-98210", product: "ShopVerse Premium Leather Bag", date: "Today, 10:30 AM", status: "In Transit", location: "Tilwara Edge Hub" },
    { id: "ORD-98102", product: "Luxury Autumn Woolen Jacket", date: "Yesterday, 04:15 PM", status: "Delivered", location: "Vijay Nagar Node" }
  ];

  const paymentsFallback = [
    { id: "TXN_7829102", amount: "₹4,200", method: "Razorpay UPI", time: "Today, 10:35 AM", status: "Settled" },
    { id: "TXN_7821901", amount: "₹3,800", method: "Razorpay Bank", time: "Yesterday, 04:20 PM", status: "Settled" }
  ];

  // Hybrid resolvers
  const coursesData = courses.length > 0 ? courses : coursesFallback;
  const testsData = testsFallback;
  const notesData = notesFallback;
  const renderProductsList = productsList.length > 0 ? productsList : productsFallback;
  const ordersData = ordersFallback;
  const paymentsData = paymentsFallback;

  const activeStudent = students.length > 0 ? students[0] : {
    name: "Aarav Sharma",
    attendance: 94.2,
    mockRank: "AIR 142",
    diagnosedHours: 248,
    syllabusTrack: 76.4
  };

  // Database price modifier
  const handleEditPrice = async (productId, currentPrice) => {
    playClickSound();
    const newPrice = parseInt(prompt("Edit Price coordinate (INR):", currentPrice)) || currentPrice;
    if (newPrice === currentPrice) return;

    try {
      const res = await fetch(`${API_URL}/api/website/product/price`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, price: newPrice })
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProductsList(productsList.map(p => p.productId === productId ? { ...p, price: data.product.price } : p));
        alert('Product price successfully updated in MongoDB!');
      } else {
        // Local fallback edit
        setProductsList(productsList.map(p => p.id === productId ? { ...p, price: newPrice } : p));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to sync price with MongoDB database.');
    }
  };

  // Database product adder
  const handleAddProduct = async () => {
    playClickSound();
    const name = prompt("Enter luxury product title:");
    if (!name) return;
    const price = parseInt(prompt("Enter price (INR):")) || 2500;
    
    try {
      const res = await fetch(`${API_URL}/api/website/product/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price,
          websiteId: slug || 'shopverse'
        })
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProductsList([data.product, ...productsList]);
        alert('Product successfully created in MongoDB database!');
      } else {
        // Local fallback append
        const newLocal = { id: Date.now(), name, price, rating: 5.0, stock: 10, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400" };
        setProductsList([newLocal, ...productsList]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save product to MongoDB.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#040209] text-slate-100 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-[var(--primary)]/10 blur-[120px] animate-blob-slow" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-[var(--secondary)]/10 blur-[120px] animate-blob-medium" />
      </div>

      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/65 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col justify-between transform md:translate-x-0 transition-transform duration-300 md:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-8 text-left">
          {/* Brand header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-[var(--primary)]/20 text-glow">
                {isEducation ? '🎓' : isEcommerce ? '🛍️' : '✦'}
              </div>
              <span className="font-mono font-black text-sm tracking-wider uppercase text-white truncate max-w-[150px]">
                {websiteName}
              </span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="md:hidden p-1 rounded-lg border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Nav */}
          <nav className="space-y-1.5 pt-4">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono mb-2">CONSOLE PANEL</span>
            {activeModules.map((mod) => {
              const Icon = mod.icon;
              const isSelected = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    playClickSound();
                    setActiveTab(mod.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                    isSelected 
                      ? 'bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/15 border border-[var(--primary)]/30 text-white shadow-lg shadow-[var(--primary)]/10 font-bold'
                      : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isSelected ? 'text-[var(--accent)]' : 'text-slate-400'}`} />
                  <span>{mod.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions inside sidebar */}
        <div className="space-y-4 pt-4 border-t border-white/5 text-left">
          <a
            href={`/website/${slug}`}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <Home className="w-4.5 h-4.5" />
            <span>Portal Home</span>
          </a>
        </div>
      </aside>

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-slate-950/30 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/5 md:hidden text-slate-400 hover:text-white cursor-pointer"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <h2 className="font-royal royal-heading text-md md:text-lg font-bold text-white uppercase tracking-wider text-left">
              {activeModules.find(m => m.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase border ${
              isEducation 
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {category} dashboard
            </span>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-300 font-mono">Visitor Node</span>
            </div>
          </div>
        </header>

        {/* Dash Space Scrollable Area */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* Adapted Telemetry Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {isEducation && (
              <>
                <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/5 rounded-full blur-xl" />
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">Overall Attendance</span>
                  <p className="text-2xl font-black font-mono tracking-tight text-[var(--accent)] mt-1">{activeStudent.attendance}%</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 182/194 slots complete</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/5 rounded-full blur-xl" />
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">JEE Mock Rank</span>
                  <p className="text-2xl font-black font-mono tracking-tight text-white mt-1">{activeStudent.mockRank}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium"><Award className="w-3.5 h-3.5 text-amber-400" /> Top 1% nationwide</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/5 rounded-full blur-xl" />
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">Study Session Timers</span>
                  <p className="text-2xl font-black font-mono tracking-tight text-cyan-400 mt-1">{activeStudent.diagnosedHours} Hours</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5 text-cyan-400" /> Interactive syllabus paces</p>
                </div>
              </>
            )}

            {isEcommerce && (
              <>
                <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/5 rounded-full blur-xl" />
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">Average Boutique Sales</span>
                  <p className="text-2xl font-black font-mono tracking-tight text-[var(--accent)] mt-1">₹24,500</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Active webhook settlements</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/5 rounded-full blur-xl" />
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">Stock Catalog Listings</span>
                  <p className="text-2xl font-black font-mono tracking-tight text-white mt-1">{renderProductsList.length} Products</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium"><ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Premium luxury brand catalog</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/5 rounded-full blur-xl" />
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">Settled Orders ledger</span>
                  <p className="text-2xl font-black font-mono tracking-tight text-orange-400 mt-1">8 Delivery Logs</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium"><CreditCard className="w-3.5 h-3.5 text-orange-400" /> Razorpay simulated webhooks</p>
                </div>
              </>
            )}

            {!isEducation && !isEcommerce && (
              <div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl col-span-3 text-center space-y-1">
                <span className="text-[9px] text-slate-500 uppercase font-mono block">Dashboard State</span>
                <p className="text-md font-bold text-white">Default system layout. Category not specified.</p>
              </div>
            )}
          </div>

          {/* Dynamic Module Content Areas */}
          <div className="bg-slate-900/20 border border-white/5 rounded-3xl p-6 text-left relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-2xl pointer-events-none" />
            
            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-20 font-mono text-xs">
                <RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mb-3" />
                <span>Synchronizing MongoDB Records...</span>
              </div>
            ) : (
              <>
                {/* MODULE 1: ATTENDANCE */}
                {activeTab === 'attendance' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="font-bold text-lg text-white font-mono uppercase tracking-wide">Interactive Attendance Matrix</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Track daily diagnostic check-ins in Jabalpur classrooms.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Attendance sandbox check-in */}
                      <div className="p-4 bg-slate-950/80 border border-white/5 rounded-2xl text-left space-y-4">
                        <span className="text-[9px] font-bold text-[var(--accent)] uppercase font-mono block tracking-wider">Check-in Terminal</span>
                        <p className="text-xs text-slate-400 leading-normal">
                          Simulate a student check-in card scan to update attendance indices on our MongoDB server instantly.
                        </p>
                        <button
                          onClick={() => alert('✓ Check-in recorded! Your academic attendance has paced up.')}
                          className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)]/95 text-white font-bold text-xs tracking-wider px-5 py-3 rounded-xl uppercase active:scale-95 transition-all shadow-md cursor-pointer"
                        >
                          Verify Card Check-in
                        </button>
                      </div>

                      {/* Visual Attendance Calendar Grid */}
                      <div className="p-4 bg-slate-950/80 border border-white/5 rounded-2xl text-left space-y-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block tracking-wider">Monthly Calendar Grid (May 2026)</span>
                        <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[9px]">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                            <div key={i} className="text-slate-500 font-bold py-1">{d}</div>
                          ))}
                          {Array.from({ length: 31 }, (_, i) => {
                            const day = i + 1;
                            const isAbsent = day === 6 || day === 18;
                            const isFuture = day > 29;
                            return (
                              <div
                                key={i}
                                className={`py-2 rounded-lg font-bold border transition-colors ${
                                  isFuture 
                                    ? 'bg-slate-950 text-slate-700 border-white/2' 
                                    : isAbsent 
                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}
                              >
                                {day}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 2: TESTS */}
                {activeTab === 'tests' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="font-bold text-lg text-white font-mono uppercase tracking-wide">Test Series Diagnostics</h3>
                      <p className="text-xs text-slate-400 mt-0.5">National test records and percentile curves.</p>
                    </div>

                    <div className="space-y-3">
                      {testsData.map((test, idx) => (
                        <div key={idx} className="p-4 bg-slate-950/80 border border-white/5 rounded-2xl flex items-center justify-between text-xs hover:border-white/10 transition-colors">
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-slate-200 text-sm block truncate">{test.title}</span>
                            <span className="text-[9px] font-mono text-slate-500 block mt-1">{test.date}</span>
                          </div>
                          <div className="text-right shrink-0 space-y-1">
                            <span className="font-bold text-[var(--accent)] font-mono text-md block">{test.score}</span>
                            <span className="text-[8px] bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 px-2 py-0.5 rounded font-mono uppercase font-bold inline-block">{test.rank}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODULE 3: NOTES */}
                {activeTab === 'notes' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="font-bold text-lg text-white font-mono uppercase tracking-wide">Study Notes Repository</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Syllabus revision cheat sheets and class lectures.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {notesData.map((note, idx) => (
                        <div key={idx} className="bg-slate-950/80 border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:scale-105 transition-transform duration-300">
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] font-bold uppercase tracking-wider">{note.category}</span>
                            <h4 className="font-bold text-slate-200 text-xs mt-1 leading-snug">{note.title}</h4>
                            <p className="text-[10px] text-slate-500 font-mono">{note.type} • {note.size}</p>
                          </div>
                          <button
                            onClick={() => alert(`Downloading "${note.title}"...`)}
                            className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            Download Document
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODULE 4: COURSES */}
                {activeTab === 'courses' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="font-bold text-lg text-white font-mono uppercase tracking-wide">Active Course Milestones</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Enrolled coaching subjects and curriculum pacing progress.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {coursesData.map((course, idx) => (
                        <div key={idx} className="bg-slate-950/80 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:scale-105 transition-transform duration-300">
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold uppercase tracking-wider">{course.target}</span>
                            <h4 className="font-bold text-slate-200 text-sm mt-1 leading-snug">{course.name}</h4>
                            <p className="text-[10px] text-slate-400">Paced by: <strong className="text-[var(--accent)] font-semibold">{course.faculty}</strong></p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                              <span>Milestone progress</span>
                              <span className="text-white font-bold">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] h-full rounded-full" style={{ width: `${course.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODULE 5: PRODUCTS */}
                {activeTab === 'products' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div>
                        <h3 className="font-bold text-lg text-white font-mono uppercase tracking-wide">Dynamic Product Catalog</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Stock indices and sandbox price coordinates.</p>
                      </div>
                      <button 
                        onClick={handleAddProduct}
                        className="bg-amber-500 hover:bg-amber-600 text-black font-bold font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer uppercase shadow"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Product
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {renderProductsList.map((prod) => (
                        <div key={prod.productId || prod.id} className="bg-slate-950/80 border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
                          <div className="space-y-3">
                            <div className="rounded-xl overflow-hidden aspect-square border border-white/5 relative bg-slate-900">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover opacity-90" />
                              <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-amber-400 font-mono">⭐ {prod.rating}</span>
                            </div>
                            <h4 className="font-bold text-slate-200 text-xs leading-snug truncate">{prod.name}</h4>
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                              <span>Stock: <strong className="text-white">{prod.stock} items</strong></span>
                              <span>Price: <strong className="text-amber-400 font-bold">₹{prod.price}</strong></span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/5 mt-4 flex gap-2">
                            <button
                              onClick={() => handleEditPrice(prod.productId || prod.id, prod.price)}
                              className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[9px] uppercase tracking-wider py-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 text-slate-400" /> Edit Price
                            </button>
                            <button
                              onClick={() => {
                                playClickSound();
                                alert(`Simulated checking out "${prod.name}" for ₹${prod.price}...`);
                              }}
                              className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold text-[9px] uppercase tracking-wider py-2 rounded-lg transition-all cursor-pointer"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODULE 6: ORDERS */}
                {activeTab === 'orders' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="font-bold text-lg text-white font-mono uppercase tracking-wide">Delivery Orders Matrix</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Mock shipping logs tracked through local SaaS networks.</p>
                    </div>

                    <div className="space-y-3">
                      {ordersData.map((order, idx) => (
                        <div key={idx} className="p-4 bg-slate-950/80 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider">{order.id}</span>
                            <h4 className="font-bold text-slate-200 text-sm mt-1">{order.product}</h4>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> Order Time: {order.date}</p>
                          </div>

                          <div className="flex gap-4 items-center justify-between md:justify-end">
                            <div className="text-left md:text-right font-mono text-[9px]">
                              <span className="text-slate-500 block">CURRENT DEPOT</span>
                              <span className="text-slate-300 font-bold block">{order.location}</span>
                            </div>
                            <span className={`text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase shrink-0 border ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODULE 7: PAYMENTS */}
                {activeTab === 'payments' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="font-bold text-lg text-white font-mono uppercase tracking-wide">Razorpay Webhook Ledger</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Dispatch simulated checkout webhooks to test notification sockets.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* UPI settlements box */}
                      <div className="p-5 bg-slate-950/80 border border-white/5 rounded-2xl text-left space-y-4">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase font-mono block tracking-wider">Settlement Node info</span>
                        <div className="space-y-2 text-[10px] font-mono leading-normal text-slate-300">
                          <p>Active UPI: <strong className="text-white">{paymentDetails?.upiId || 'jabalpur@sbi'}</strong></p>
                          <p>Bank Acc: <strong className="text-white">{paymentDetails?.accountNumber || '382901928392'}</strong></p>
                          <p>Settlement Gateway: <span className="text-emerald-400 font-bold">RAZORPAY Sandboxed</span></p>
                        </div>
                        <button
                          onClick={() => alert(`Simulating Razorpay UPI webhook dispatches for VPA ${paymentDetails?.upiId || 'jabalpur@sbi'}...`)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-[10px] tracking-wider py-3 rounded-xl uppercase active:scale-95 transition-all shadow cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" /> Dispatch UPI Webhook
                        </button>
                      </div>

                      {/* Transaction ledger list */}
                      <div className="p-5 bg-slate-950/80 border border-white/5 rounded-2xl col-span-2 text-left space-y-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block tracking-wider">Mock Settled ledgers ({paymentsData.length})</span>
                        <div className="space-y-2">
                          {paymentsData.map((pay, idx) => (
                            <div key={idx} className="p-3 bg-slate-900/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-white font-mono block truncate">{pay.id}</span>
                                <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{pay.time} via {pay.method}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-bold text-emerald-400 font-mono text-sm block">{pay.amount}</span>
                                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold inline-block mt-0.5">{pay.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* DEFAULT MODULE */}
                {activeTab === 'overview' && (
                  <div className="text-center py-12 font-mono space-y-2 text-xs">
                    <p>Welcome to Jabalpur SmartEngine Customizer Console.</p>
                    <p className="text-slate-500">Choose custom industry categories in website manager configurations.</p>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
