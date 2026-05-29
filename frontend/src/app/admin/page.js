"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Layers, Activity, Grid, Monitor, Smartphone, 
  Tablet, LogOut, Lock, RefreshCw, Sliders, Eye, Palette, 
  Bot, TrendingUp, Sparkles, Plus, Trash, CreditCard, 
  Volume2, Check, AlertCircle, Play, ShieldAlert, FileText, 
  ChevronRight, Sun, Moon, Users, Server, Database, BarChart2
} from 'lucide-react';
import { io } from 'socket.io-client';
import { API_URL } from '../../config';

export default function AdminDashboard() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('admin@jabalpur.gov');
  const [password, setPassword] = useState('jabalpur2026');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (authError) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(authError, 'error');
      }
    }
  }, [authError]);
  
  // System State
  const [activeConfig, setActiveConfig] = useState(null);
  const [allConfigs, setAllConfigs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [serverStatus, setServerStatus] = useState({ status: 'OFFLINE', mode: 'Checking...' });
  const [loading, setLoading] = useState(true);

  // SaaS Creator Stepper states
  const [saasName, setSaasName] = useState('Nexus Academy');
  const [saasCategory, setSaasCategory] = useState('coaching');
  const [saasPrimary, setSaasPrimary] = useState('#D4AF37');
  const [saasAccent, setSaasAccent] = useState('#fbbf24');
  const [saasFont, setSaasFont] = useState('Space Grotesk');
  const [saasSections, setSaasSections] = useState(['courses', 'faculty', 'results']);
  const [saasModules, setSaasModules] = useState(['students', 'attendance', 'tests', 'notes', 'fees', 'analytics']);

  // Theme Toggler state
  const [lightMode, setLightMode] = useState(false);

  // Active Menu tabs inside Nexus Command Center
  const [activeTab, setActiveTab] = useState('super_admin'); // super_admin | website_manager | theme_studio | cms_engine
  const [previewDevice, setPreviewDevice] = useState('desktop'); // desktop | tablet | mobile
  
  // Interactive Customizer Form states
  const [formConfig, setFormConfig] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('premium royal coaching academy up to class 12th in Jabalpur');
  const [aiGeneratedData, setAiGeneratedData] = useState(null);
  const [seoReport, setSeoReport] = useState(null);

  // Sound effects toggler
  const [soundEnabled, setSoundEnabled] = useState(true);

  const iframeRef = useRef(null);

  useEffect(() => {
    // Check for saved JWT token
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    loadSystemStats();
    loadAllConfigurations();
    loadNotifications();

    const socket = io(API_URL);

    socket.on('config-updated', (updated) => {
      if (updated.isActive) {
        setActiveConfig(updated);
        setFormConfig(JSON.parse(JSON.stringify(updated)));
        reloadPreviewIframe();
      }
    });

    socket.on('new-notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      if (soundEnabled) playSoundChime();
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const playSoundChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.15); // E6
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  const playClickSound = () => {
    if (!soundEnabled) return;
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

  const reloadPreviewIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        if (soundEnabled) playSoundChime();
      } else {
        setAuthError(data.message || 'Credentials invalid.');
      }
    } catch (err) {
      setAuthError('Connection refused. Is backend API online?');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  const loadSystemStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/status`);
      const data = await res.json();
      setServerStatus({
        status: data.status,
        mode: data.database.mode
      });
    } catch (err) {
      setServerStatus({ status: 'OFFLINE', mode: 'Unreachable' });
    }
  };

  const loadAllConfigurations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/website/configs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAllConfigs(data.configs);
        const active = data.configs.find(c => c.isActive);
        if (active) {
          setActiveConfig(active);
          setFormConfig(JSON.parse(JSON.stringify(active)));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/website/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchTemplate = async (businessType) => {
    playClickSound();
    try {
      const res = await fetch(`${API_URL}/api/website/switch`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ businessType })
      });
      const data = await res.json();
      if (data.success) {
        setActiveConfig(data.config);
        setFormConfig(JSON.parse(JSON.stringify(data.config)));
        setAllConfigs(prev => prev.map(c => ({
          ...c,
          isActive: c.businessType === businessType
        })));
      }
    } catch (err) {
      alert('Error switching templates.');
    }
  };

  const handleCreateSaaSWebsite = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      const res = await fetch(`${API_URL}/api/website/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          websiteName: saasName,
          category: saasCategory,
          primaryColor: saasPrimary,
          accentColor: saasAccent,
          fonts: saasFont,
          sectionsSelection: saasSections,
          dashboardModulesSelection: saasModules
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🎉 Dynamic website "${saasName}" successfully deployed! Active engine has switched!`);
        setActiveConfig(data.config);
        setFormConfig(JSON.parse(JSON.stringify(data.config)));
        loadAllConfigurations();
        reloadPreviewIframe();
      } else {
        alert(data.message || 'Error deploying site.');
      }
    } catch (err) {
      alert('Error deploying dynamic website.');
    }
  };

  const handleUpdateConfigField = (sectionIndex, field, value) => {
    const updated = { ...formConfig };
    updated.sections[sectionIndex][field] = value;
    setFormConfig(updated);
  };

  const handleSaveConfig = async () => {
    playClickSound();
    try {
      const res = await fetch(`${API_URL}/api/website/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formConfig)
      });
      const data = await res.json();
      if (data.success) {
        setActiveConfig(data.config);
        alert('Configuration successfully written to database!');
      }
    } catch (err) {
      alert('Error saving configuration.');
    }
  };

  const handleResetTemplate = async () => {
    playClickSound();
    if (!confirm('Are you sure you want to restore default template configurations? All custom edits will be erased.')) return;
    try {
      const res = await fetch(`${API_URL}/api/website/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ businessType: activeConfig.businessType })
      });
      const data = await res.json();
      if (data.success) {
        setActiveConfig(data.config);
        setFormConfig(JSON.parse(JSON.stringify(data.config)));
        alert('Factory template configurations successfully restored!');
      }
    } catch (err) {
      alert('Error resetting template.');
    }
  };

  // AI Content Generator
  const handleTriggerAIContent = async () => {
    playClickSound();
    try {
      const res = await fetch(`${API_URL}/api/ai/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessType: activeConfig.businessType,
          prompt: aiPrompt
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiGeneratedData(data.data);
      }
    } catch (err) {
      alert('AI generator offline.');
    }
  };

  const applyAIGeneratedContent = () => {
    playClickSound();
    if (!aiGeneratedData) return;
    const updated = { ...formConfig };
    updated.hero.title = aiGeneratedData.heroTitle;
    updated.hero.subtitle = aiGeneratedData.heroSubtitle;
    updated.seo.metaTitle = aiGeneratedData.slogan;
    
    if (aiGeneratedData.features && updated.sections[0].type === 'features') {
      updated.sections[0].content = aiGeneratedData.features.map((f, idx) => ({
        ...updated.sections[0].content[idx],
        title: f.title,
        desc: f.desc
      }));
    }

    setFormConfig(updated);
    setAiGeneratedData(null);
    alert('AI content elements loaded into active workspace! Click Save Parameters to publish.');
  };

  const handleTriggerAISuggestTheme = async (styleMode) => {
    playClickSound();
    try {
      const res = await fetch(`${API_URL}/api/ai/suggest-theme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessType: activeConfig.businessType,
          styleMode
        })
      });
      const data = await res.json();
      if (data.success && data.theme) {
        const updated = { ...formConfig };
        updated.theme = {
          ...updated.theme,
          primary: data.theme.primary,
          secondary: data.theme.secondary,
          accent: data.theme.accent,
          background: data.theme.background,
          textColor: data.theme.textColor
        };
        setFormConfig(updated);
        alert(`Suggested HSL color theme "${styleMode}" applied to visual layout!`);
      }
    } catch (err) {
      alert('AI suggestions offline.');
    }
  };

  const handleTriggerAISEOScan = async () => {
    playClickSound();
    try {
      const res = await fetch(`${API_URL}/api/ai/seo-evaluator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formConfig.hero.title,
          description: formConfig.hero.subtitle,
          keywords: formConfig.seo.keywords,
          businessType: formConfig.businessType
        })
      });
      const data = await res.json();
      if (data.success) {
        setSeoReport(data);
      }
    } catch (err) {
      alert('SEO scanner offline.');
    }
  };

  const handleManualPaymentSimulation = async () => {
    playClickSound();
    try {
      await fetch(`${API_URL}/api/website/simulate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 15000,
          userName: 'Ramesh Patel (Vijay Nagar)',
          planName: `${activeConfig.businessType.toUpperCase()} Premium Contract`
        })
      });
    } catch (err) {
      alert('Simulations offline.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-white h-screen font-mono">
        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Validating Nexus Command session...</p>
      </div>
    );
  }

  // 1. Admin Login Layer
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 cyber-grid cyber-grid-glow font-sans">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center space-y-2 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase font-mono">Nexus Console</h2>
            <p className="text-xs text-slate-400 font-mono">Centralized Website Engine Administrator</p>
          </div>

          {authError && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center gap-2 text-rose-400 text-xs animate-pulse">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Session Email</label>
              <input 
                type="email" required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-xs px-4 py-3.5 rounded-xl text-white focus:outline-none focus:border-indigo-500/50" 
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Secure Password</label>
              <input 
                type="password" required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-xs px-4 py-3.5 rounded-xl text-white focus:outline-none focus:border-indigo-500/50" 
              />
            </div>
            
            <div className="bg-slate-950 border border-white/5 p-3 rounded-xl text-[10px] text-slate-400 leading-normal font-mono">
              <strong>🔒 Standard credentials:</strong><br />
              Email: <code className="text-indigo-400">admin@jabalpur.gov</code><br />
              Pass: <code className="text-indigo-400">jabalpur2026</code>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3.5 rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-wider"
            >
              Establish Administrative Session
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!activeConfig || !formConfig) return null;

  return (
    <div className={lightMode ? 'min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-all duration-300' : 'min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-all duration-300'}>
      
      {/* Top command status bar */}
      <header className="h-16 border-b border-white/5 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <h1 className="font-mono font-black text-sm tracking-widest uppercase text-indigo-400">
              Nexus Command Center
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono opacity-80">
            <span className="border-r border-white/10 pr-4">
              SESSION: <strong className="text-emerald-500">ONLINE</strong>
            </span>
            <span>
              DATABASE: <strong className="text-indigo-400">{serverStatus.mode}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => { playClickSound(); setLightMode(!lightMode); }}
            className="p-2 rounded-lg border border-white/10 text-indigo-400 bg-white/5 hover:scale-105 active:scale-95 transition-transform"
            title="Toggle Light/Dark Theme"
          >
            {lightMode ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400 animate-spin" />}
          </button>

          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : 'border-white/10 text-slate-400'
            }`}
            title="Toggle system sounds"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-white/10 hover:bg-rose-500/15 hover:text-rose-400 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main split work layout */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden h-[calc(100vh-64px)]">
        
        {/* Left Side: Parameters Editor pane (5 columns) */}
        <div className="xl:col-span-5 border-r border-white/5 flex flex-col bg-slate-900/10 overflow-y-auto">
          
          {/* Centralized Workspace menu selectors */}
          <div className="flex border-b border-white/5 bg-slate-900/40 p-2 gap-1 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0 font-mono">
            {[
              { id: 'super_admin', label: 'Super Admin', icon: Server },
              { id: 'website_manager', label: 'Website Manager', icon: Grid },
              { id: 'theme_studio', label: 'Theme Studio', icon: Palette },
              { id: 'cms_engine', label: 'CMS Engine', icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { playClickSound(); setActiveTab(tab.id); }}
                  className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all ${
                    activeTab === tab.id 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 flex-1 space-y-6">

            {/* STUDIO 1: SUPER ADMIN PANEL */}
            {activeTab === 'super_admin' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-indigo-400 font-mono uppercase tracking-wider">Super Admin Workspace</h3>
                  <p className="text-[10px] opacity-80">Monitor connected edge microservices, concurrent transaction feeds, and system database states near tilwara servers.</p>
                </div>

                {/* Server Telemetry Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-center space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase font-mono block">CPU Compute</span>
                    <span className="text-md font-bold text-white font-mono">42%</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-center space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase font-mono block">Active Threads</span>
                    <span className="text-md font-bold text-emerald-400 font-mono">3 active</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-center space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase font-mono block">Alloc Memory</span>
                    <span className="text-md font-bold text-indigo-400 font-mono">242 MB</span>
                  </div>
                </div>

                {/* Webhook and database indicators */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Server Address:</span>
                    <span className="text-white font-semibold">{API_URL}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Database Index:</span>
                    <span className="text-emerald-400 font-semibold">{serverStatus.mode} (CONNECTED)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">WebSocket Broadcast:</span>
                    <span className="text-indigo-400 font-semibold">Broadcasting Active</span>
                  </div>
                </div>

                {/* Razorpay transaction simulator */}
                <div className="saas-card p-4 rounded-2xl border border-white/5 space-y-3 bg-emerald-500/5 border-emerald-500/10">
                  <h4 className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Razorpay Gateway Event</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">Trigger simulated payment events. This fires webhook calls that reflect transactions instantly across active client frames.</p>
                  <button
                    onClick={handleManualPaymentSimulation}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Simulate Payment Broadcast (₹15,000)
                  </button>
                </div>
              </div>
            )}

            {/* STUDIO 2: WEBSITE MANAGEMENT CONSOLE */}
            {activeTab === 'website_manager' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-indigo-400 font-mono uppercase tracking-wider">Website Management Console</h3>
                  <p className="text-[10px] opacity-80">Toggle active configured templates or dynamically deploy a new SaaS site config.</p>
                </div>

                {/* Active Template Swapper */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Choose Active Site Configuration</span>
                  <div className="grid grid-cols-2 gap-2">
                    {allConfigs.map((cfg) => (
                      <button
                        key={cfg.businessType}
                        onClick={() => handleSwitchTemplate(cfg.businessType)}
                        className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-20 ${
                          cfg.isActive 
                            ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold'
                            : 'border-white/5 bg-white/2 hover:bg-white/5'
                        }`}
                      >
                        <span className="text-[8px] font-mono uppercase text-indigo-400">
                          {cfg.businessType.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] font-bold block mt-1 leading-snug">
                          {cfg.theme.name}
                        </span>
                        {cfg.isActive && (
                          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deploy New SaaS Site Wizard */}
                <div className="p-4 bg-white/2 border border-white/5 rounded-2xl space-y-4">
                  <h4 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-indigo-500" />
                    Deploy New Dynamic Website
                  </h4>
                  <form onSubmit={handleCreateSaaSWebsite} className="space-y-3.5">
                    <div>
                      <label className="text-[9px] text-slate-400 uppercase block mb-1">Website Name</label>
                      <input 
                        type="text" 
                        value={saasName} 
                        onChange={(e) => setSaasName(e.target.value)} 
                        placeholder="e.g. Libaas Couture Store" 
                        className="w-full bg-slate-950 border border-white/10 text-xs px-3 py-2 rounded-lg text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 uppercase block mb-1">Industry Category</label>
                      <select
                        value={saasCategory}
                        onChange={(e) => setSaasCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 text-xs p-2 rounded-lg text-white font-bold"
                      >
                        <option value="coaching">Education / Coaching (NextRank)</option>
                        <option value="ecommerce">E-Commerce (Libaas Couture)</option>
                        <option value="real_estate">Real Estate (AashiyanaX)</option>
                        <option value="hospital">Hospital (AarogyaCare)</option>
                        <option value="cafe">Cafe / Restaurant (Cafe Aura)</option>
                        <option value="startup">Future Tech Startup (NexaTech)</option>
                        <option value="gym">Gym / Fitness (FlexArena)</option>
                        <option value="tourism">Tourism Planners (ExploreAura)</option>
                        <option value="cybersecurity">Cybersecurity (ThreatZero)</option>
                        <option value="career">Career Job Portal (JobSphere)</option>
                        <option value="smartengine">Autonomous AI SaaS (SmartEngine)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase block mb-1">Primary Color</label>
                        <input 
                          type="color" 
                          value={saasPrimary} 
                          onChange={(e) => setSaasPrimary(e.target.value)} 
                          className="w-full h-8 rounded border border-white/10 bg-transparent cursor-pointer" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase block mb-1">Accent Color</label>
                        <input 
                          type="color" 
                          value={saasAccent} 
                          onChange={(e) => setSaasAccent(e.target.value)} 
                          className="w-full h-8 rounded border border-white/10 bg-transparent cursor-pointer" 
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-colors active:scale-95"
                    >
                      🚀 Deploy SaaS Website
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* STUDIO 3: THEME STUDIO */}
            {activeTab === 'theme_studio' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="font-bold text-sm text-indigo-400 font-mono uppercase tracking-wider">Dynamic Theme Studio</h3>
                  <button 
                    onClick={handleSaveConfig}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Save Styling
                  </button>
                </div>

                {/* AI Palette suggester */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 uppercase block font-mono">AI suggested colors</span>
                  <div className="flex gap-2">
                    {['futuristic', 'elegant'].map(style => (
                      <button
                        key={style}
                        onClick={() => handleTriggerAISuggestTheme(style)}
                        className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Apply {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Primary Color (Hex/HSL)</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={formConfig.theme.primary.startsWith('#') ? formConfig.theme.primary : '#3b82f6'} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          updated.theme.primary = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-10 h-8 rounded border border-white/10 bg-transparent cursor-pointer shrink-0" 
                      />
                      <input 
                        type="text" 
                        value={formConfig.theme.primary} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          updated.theme.primary = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-full bg-slate-950 border border-white/10 text-xs px-3 rounded-lg text-white" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Secondary Accent</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={formConfig.theme.secondary.startsWith('#') ? formConfig.theme.secondary : '#8b5cf6'} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          updated.theme.secondary = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-10 h-8 rounded border border-white/10 bg-transparent cursor-pointer shrink-0" 
                      />
                      <input 
                        type="text" 
                        value={formConfig.theme.secondary} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          updated.theme.secondary = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-full bg-slate-950 border border-white/10 text-xs px-3 rounded-lg text-white" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Custom Font Family</label>
                    <select
                      value={formConfig.theme.fontFamily || 'Space Grotesk'}
                      onChange={(e) => {
                        const updated = { ...formConfig };
                        updated.theme.fontFamily = e.target.value;
                        setFormConfig(updated);
                      }}
                      className="w-full bg-slate-950 border border-white/10 text-xs p-2 rounded-lg text-white font-bold"
                    >
                      <option value="Space Grotesk">Space Grotesk (Futuristic)</option>
                      <option value="Outfit">Outfit (Luxury Tech)</option>
                      <option value="Inter">Inter (Clean Modern)</option>
                      <option value="Poppins">Poppins (Friendly Serif)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Jabalpur Landmark Background Animation</label>
                    <select
                      value={formConfig.hero.jabalpurBranding?.interactiveEffect || 'electronic_grid'}
                      onChange={(e) => {
                        const updated = { ...formConfig };
                        if (!updated.hero.jabalpurBranding) updated.hero.jabalpurBranding = {};
                        updated.hero.jabalpurBranding.interactiveEffect = e.target.value;
                        setFormConfig(updated);
                      }}
                      className="w-full bg-slate-950 border border-white/10 text-xs p-2 rounded-lg text-white font-mono"
                    >
                      <option value="electronic_grid">Madan Mahal electronic grid</option>
                      <option value="canvas_ripples">Tilwara river ripples</option>
                      <option value="misty_parallax">Bhedaghat gorges mist</option>
                      <option value="neon_grids">Bhedaghat glowing grids</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STUDIO 4: CMS ENGINE */}
            {activeTab === 'cms_engine' && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="font-bold text-sm text-indigo-400 font-mono uppercase tracking-wider">CMS & Content Engine</h3>
                  <button 
                    onClick={handleSaveConfig}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Save CMS
                  </button>
                </div>

                {/* Hero section details */}
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-3">
                  <span className="text-[9px] font-bold text-indigo-400 font-mono uppercase block">Hero Title Slogans</span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] text-slate-400">Hero Main Title</label>
                      <input 
                        type="text" 
                        value={formConfig.hero.title} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          updated.hero.title = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-full bg-slate-950 border border-white/10 text-xs px-3 py-2 rounded-lg mt-0.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400">Hero Subtitle</label>
                      <textarea 
                        value={formConfig.hero.subtitle} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          updated.hero.subtitle = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-full bg-slate-950 border border-white/10 text-xs px-3 py-2 rounded-lg h-16 mt-0.5 text-white" 
                      />
                    </div>
                  </div>
                </div>

                {/* Banking coordination specs */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-3">
                  <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase block">Payment Gate details</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[8px] text-slate-400">UPI Node</label>
                      <input 
                        type="text" 
                        value={formConfig.paymentDetails?.upiId || 'jabalpur@sbi'} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          if (!updated.paymentDetails) updated.paymentDetails = {};
                          updated.paymentDetails.upiId = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-full bg-slate-950 border border-white/10 text-[10px] px-2 py-1.5 rounded-lg text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400">Bank Account</label>
                      <input 
                        type="text" 
                        value={formConfig.paymentDetails?.accountNumber || '382901928392'} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          if (!updated.paymentDetails) updated.paymentDetails = {};
                          updated.paymentDetails.accountNumber = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-full bg-slate-950 border border-white/10 text-[10px] px-2 py-1.5 rounded-lg text-white" 
                      />
                    </div>
                  </div>
                </div>

                {/* Sections visibility list */}
                <div className="space-y-3 pt-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Dynamic Sections Management</span>
                  <div className="space-y-2">
                    {formConfig.sections.map((sec, idx) => (
                      <div key={sec.id} className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-white uppercase font-mono">{sec.title}</span>
                          <span className="text-[8px] font-mono text-slate-500 block">TYPE: {sec.type}</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={sec.visible} 
                          onChange={(e) => handleUpdateConfigField(idx, 'visible', e.target.checked)}
                          className="accent-indigo-600 w-4 h-4 cursor-pointer" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleResetTemplate}
                  className="w-full border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 text-[10px] font-bold py-2.5 rounded-xl transition-all"
                >
                  Reset Current Template defaults
                </button>
              </div>
            )}

          </div>

          {/* Webhook logs footer */}
          <div className="border-t border-white/5 bg-slate-950 p-4 max-h-[140px] overflow-y-auto shrink-0 font-mono text-[9px] text-slate-400 text-left">
            <h4 className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>Intrusion Webhook Logs Feed</span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping shrink-0" />
            </h4>
            <div className="space-y-1.5">
              {notifications.slice(0, 3).map((n, idx) => (
                <p key={idx} className="truncate flex items-start gap-1">
                  <ChevronRight className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5" />
                  {n.message}
                </p>
              ))}
              {notifications.length === 0 && (
                <p className="italic text-slate-600">No Webhook queries logged.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Split live Preview Pane (7 columns) */}
        <div className="xl:col-span-7 bg-slate-900 flex flex-col overflow-hidden relative border-l border-white/5">
          
          {/* Viewport bar controls */}
          <div className="h-14 border-b border-white/5 bg-slate-950 px-6 flex items-center justify-between shrink-0 font-mono">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>Dynamic Engine Live Preview</span>
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'desktop', icon: Monitor },
                { id: 'tablet', icon: Tablet },
                { id: 'mobile', icon: Smartphone }
              ].map((dev) => {
                const Icon = dev.icon;
                return (
                  <button
                    key={dev.id}
                    onClick={() => { playClickSound(); setPreviewDevice(dev.id); }}
                    className={`p-2 rounded-lg border transition-all ${
                      previewDevice === dev.id 
                        ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' 
                        : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={`Preview in ${dev.id} viewport`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Iframe Device shell */}
          <div className="flex-1 p-8 flex items-center justify-center overflow-auto bg-slate-950/80 cyber-grid">
            <div 
              style={{ 
                width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                height: '100%',
                maxWidth: '100%'
              }}
              className="rounded-3xl border border-white/10 bg-slate-950 shadow-2xl flex flex-col overflow-hidden transition-all duration-500 select-none relative"
            >
              {/* Browser bar layout */}
              <div className="h-10 border-b border-white/5 bg-slate-900 flex items-center justify-between px-4 shrink-0 font-mono text-[9px] text-slate-400">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block" />
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block" />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
                </div>
                <div className="bg-white/5 border border-white/5 px-4 py-1 rounded-lg w-1/2 text-center truncate">
                  {typeof window !== 'undefined' ? window.location.origin + '/' : 'http://localhost:3000/'}
                </div>
                <button 
                  onClick={reloadPreviewIframe} 
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Iframe target */}
              <iframe
                ref={iframeRef}
                src="/"
                className="flex-1 w-full border-none bg-slate-950"
                title="Live Jabalpur Engine Viewer"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
