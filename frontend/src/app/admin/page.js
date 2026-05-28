"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Layers, Activity, Grid, Monitor, Smartphone, 
  Tablet, LogOut, Lock, RefreshCw, Sliders, Eye, Palette, 
  Bot, TrendingUp, Sparkles, Plus, Trash, CreditCard, 
  Volume2, Check, AlertCircle, Play, ShieldAlert, FileText, 
  ChevronRight, Sun, Moon, Users
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
  const [saasSections, setSaasSections] = useState(['hero', 'features', 'stats', 'about']);
  const [saasModules, setSaasModules] = useState(['students', 'attendance', 'tests', 'notes', 'fees', 'analytics']);

  // User Desk States
  const [usersList, setUsersList] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');

  // Theme Toggler state
  const [lightMode, setLightMode] = useState(true);

  // Active Menu tabs
  const [activeTab, setActiveTab] = useState('swapper'); // swapper | sections | theme | ai_oracle | payment
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

  useEffect(() => {
    if (token && activeTab === 'user_desk') {
      loadUsersList();
    }
  }, [token, activeTab]);

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
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Failed to connect to backend configuration database.', 'error');
      }
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
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Failed to sync system notifications.', 'error');
      }
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

  const handleCreateSaaSUser = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          name: newUserName,
          phone: newUserPhone,
          otp: '111111', // bypass verification for admin panel
          websiteId: activeConfig.businessType
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`👤 User ${newUserEmail} successfully created for ${activeConfig.websiteName}!`);
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserName('');
        setNewUserPhone('');
        loadUsersList();
      } else {
        alert(data.message || 'Failed to create user.');
      }
    } catch (err) {
      alert('Failed to register user.');
    }
  };

  const loadUsersList = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
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
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-white h-screen">
        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Validating Administration parameters...</p>
      </div>
    );
  }

  // 1. Admin Login Layer
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 cyber-grid cyber-grid-glow font-sans">
        <div className="w-full max-w-md glass-panel rounded-3xl border border-white/10 p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center space-y-2 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-outfit font-black tracking-tight text-white">SmartCity Command</h2>
            <p className="text-xs text-slate-400 font-mono">Jabalpur Multi-Business Web Operating System</p>
          </div>

          {authError && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center gap-2 text-rose-400 text-xs animate-pulse">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Email Node Address</label>
              <input 
                type="email" required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-xs px-4 py-3.5 rounded-xl text-white focus:outline-none focus:border-indigo-500/50" 
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Decryption Password</label>
              <input 
                type="password" required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-xs px-4 py-3.5 rounded-xl text-white focus:outline-none focus:border-indigo-500/50" 
              />
            </div>
            
            <div className="bg-slate-900 border border-white/5 p-3 rounded-xl text-[10px] text-slate-400 leading-normal">
              <strong>🔒 Standard credentials:</strong><br />
              Email: <code className="text-indigo-400">admin@jabalpur.gov</code><br />
              Pass: <code className="text-indigo-400">jabalpur2026</code>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3.5 rounded-xl shadow-lg shadow-indigo-500/15 hover:scale-[1.01] active:scale-95 transition-transform"
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
    <div className={lightMode ? 'light-theme min-h-screen flex flex-col transition-all duration-500 bg-slate-50 text-slate-900' : 'min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-all duration-500'}>
      
      {/* Top command status bar */}
      <header className="h-16 border-b border-slate-200/10 glass-panel px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <h1 className="font-outfit font-black text-sm tracking-wide uppercase text-glow">
              Nexus Command Center
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono opacity-80">
            <span className="border-r border-slate-500/20 pr-4">
              STATUS: <strong className="text-emerald-500">ONLINE</strong>
            </span>
            <span>
              ENGINE: <strong className="text-indigo-500">{serverStatus.mode}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Light/Dark Mode Toggle Toggler */}
          <button 
            onClick={() => { playClickSound(); setLightMode(!lightMode); }}
            className="p-2 rounded-lg border border-slate-500/20 text-indigo-500 bg-indigo-500/5 hover:scale-105 active:scale-95 transition-transform"
            title="Toggle Light/Dark Theme"
          >
            {lightMode ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400 animate-spin delay-1000" />}
          </button>

          {/* Audio toggle button */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled ? 'border-indigo-500/30 text-indigo-500 bg-indigo-500/5' : 'border-slate-500/20 text-slate-400'
            }`}
            title="Toggle system sounds"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-slate-500/20 hover:bg-rose-500/15 hover:text-rose-500 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            Term Session
          </button>
        </div>
      </header>

      {/* Main split work layout */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden h-[calc(100vh-64px)]">
        
        {/* Left Side: Parameters Editor pane (5 columns) */}
        <div className="xl:col-span-5 border-r border-slate-500/20 flex flex-col bg-transparent overflow-y-auto">
          
          {/* Configuration menu selectors */}
          <div className="flex border-b border-slate-500/10 bg-slate-900/10 p-2 gap-1 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
            {[
              { id: 'swapper', label: 'Engine Swapper', icon: RefreshCw },
              { id: 'saas_creator', label: 'SaaS Builder', icon: Plus },
              { id: 'sections', label: 'CMS Editor', icon: Layers },
              { id: 'theme', label: 'Theme Studio', icon: Palette },
              { id: 'user_desk', label: 'User Desk', icon: Users },
              { id: 'ai_oracle', label: 'AI Oracle Console', icon: Bot },
              { id: 'payment', label: 'Razorpay Sim', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { playClickSound(); setActiveTab(tab.id); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activeTab === tab.id 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : lightMode
                        ? 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 bg-white/50 border border-slate-200/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-500/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 flex-1 space-y-6">

            {/* TAB 1: WEBSITE TEMPLATE ENGINE SWAPPER */}
            {activeTab === 'swapper' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm">Dynamic Business Engine Swapper</h3>
                  <p className="text-[10px] opacity-80">Choose from your 10 custom high-premium Jabalpur business website templates. The system re-maps all theme variables and content models in the database instantly!</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {allConfigs.map((cfg) => (
                    <button
                      key={cfg.businessType}
                      onClick={() => handleSwitchTemplate(cfg.businessType)}
                      className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-24 ${
                        cfg.isActive 
                          ? lightMode
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-[0_0_15px_rgba(99,102,241,0.08)]'
                            : 'border-indigo-600 bg-indigo-600/10 text-glow font-bold'
                          : lightMode
                            ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
                            : 'border-slate-500/10 bg-slate-900/5 hover:bg-slate-900/10'
                      }`}
                    >
                      <span className="text-[9px] font-bold tracking-widest font-mono uppercase text-indigo-600 dark:text-indigo-400">
                        {cfg.businessType.replace('_', ' ')}
                      </span>
                      <span className={`text-xs font-black block mt-2 leading-tight ${lightMode ? 'text-slate-800' : 'text-slate-200'}`}>
                        {cfg.theme.name}
                      </span>
                      {cfg.isActive && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 1B: SAAS CREATOR WIZARD */}
            {activeTab === 'saas_creator' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    Deploy New Dynamic Website
                  </h3>
                  <p className="text-[10px] opacity-80 font-medium">Configure dynamic properties for your SaaS instance. The system provisions layouts and colors instantly.</p>
                </div>

                <form onSubmit={handleCreateSaaSWebsite} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Website Name</label>
                    <input 
                      type="text" 
                      value={saasName} 
                      onChange={(e) => setSaasName(e.target.value)} 
                      placeholder="e.g. NextRank Academy" 
                      className="w-full bg-slate-900/5 border border-slate-500/20 text-xs px-3 py-2 rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Industry Category</label>
                    <select
                      value={saasCategory}
                      onChange={(e) => setSaasCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-500/20 text-xs px-3 py-2.5 rounded-lg"
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Primary Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={saasPrimary} 
                          onChange={(e) => setSaasPrimary(e.target.value)} 
                          className="w-10 h-8 rounded border border-slate-500/20 bg-transparent cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={saasPrimary} 
                          onChange={(e) => setSaasPrimary(e.target.value)} 
                          className="w-full bg-slate-900/5 border border-slate-500/20 text-[10px] px-2 rounded-lg" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Accent Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={saasAccent} 
                          onChange={(e) => setSaasAccent(e.target.value)} 
                          className="w-10 h-8 rounded border border-slate-500/20 bg-transparent cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={saasAccent} 
                          onChange={(e) => setSaasAccent(e.target.value)} 
                          className="w-full bg-slate-900/5 border border-slate-500/20 text-[10px] px-2 rounded-lg" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Font Family</label>
                    <select
                      value={saasFont}
                      onChange={(e) => setSaasFont(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-500/20 text-xs px-3 py-2.5 rounded-lg"
                    >
                      <option value="Space Grotesk">Space Grotesk (Futuristic)</option>
                      <option value="Outfit">Outfit (Modern Tech)</option>
                      <option value="Inter">Inter (Clean Clean)</option>
                      <option value="Poppins">Poppins (Friendly)</option>
                    </select>
                  </div>

                  <div className="space-y-2 border-t border-slate-500/10 pt-3">
                    <label className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block">Dynamic Sections Selection</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'hero', label: 'Hero Banner' },
                        { id: 'features', label: 'Features Specs' },
                        { id: 'stats', label: 'Stats Grid' },
                        { id: 'about', label: 'Vision / Story' }
                      ].map(sec => (
                        <label key={sec.id} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saasSections.includes(sec.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSaasSections([...saasSections, sec.id]);
                              else setSaasSections(saasSections.filter(s => s !== sec.id));
                            }}
                            className="accent-indigo-500"
                          />
                          {sec.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-500/10 pt-3">
                    <label className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block">Dashboard Modules (Role Adaptive)</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'students', label: 'Student Directory' },
                        { id: 'attendance', label: 'RFID Gate Log' },
                        { id: 'tests', label: 'MCQ Test Builder' },
                        { id: 'notes', label: 'Notes Library' },
                        { id: 'fees', label: 'Fees Manager' },
                        { id: 'analytics', label: 'Rank Analytics' },
                        { id: 'products', label: 'Product Catalog' },
                        { id: 'orders', label: 'Orders List' },
                        { id: 'appointments', label: 'Appointments Book' },
                        { id: 'doctors', label: 'Doctor Roster' }
                      ].map(mod => (
                        <label key={mod.id} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saasModules.includes(mod.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSaasModules([...saasModules, mod.id]);
                              else setSaasModules(saasModules.filter(m => m !== mod.id));
                            }}
                            className="accent-indigo-500"
                          />
                          {mod.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg active:scale-95 transition-transform uppercase tracking-wider"
                  >
                    🚀 Deploy Dynamic SaaS Site
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: VISUAL SECTION EDITOR (CMS CONTENT MANAGER) */}
            {activeTab === 'sections' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-slate-500/10 pb-2">
                  <h3 className="font-bold text-sm">Dynamic Page & CMS Editor</h3>
                  <button 
                    onClick={handleSaveConfig}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow transition-transform active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>

                {/* Hero section CMS fields */}
                <div className="glass-card rounded-2xl p-4 space-y-3 bg-indigo-500/5 border-indigo-500/10 border">
                  <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase">
                    CMS: HERO BANNER DETAILS
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">Hero Main Title</label>
                      <input 
                        type="text" 
                        value={formConfig.hero.title} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          updated.hero.title = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-full bg-slate-900/5 border border-slate-500/20 text-xs px-3 py-2 rounded-lg mt-0.5" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">Hero Description</label>
                      <textarea 
                        value={formConfig.hero.subtitle} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          updated.hero.subtitle = e.target.value;
                          setFormConfig(updated);
                        }}
                        className="w-full bg-slate-900/5 border border-slate-500/20 text-xs px-3 py-2 rounded-lg h-16 mt-0.5" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {formConfig.sections.map((sec, idx) => (
                    <div key={sec.id} className="glass-card rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">
                          SECTION [{idx + 1}]: {sec.type.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="text-[9px] font-bold text-slate-500">VISIBLE</label>
                          <input 
                            type="checkbox" 
                            checked={sec.visible} 
                            onChange={(e) => handleUpdateConfigField(idx, 'visible', e.target.checked)}
                            className="accent-indigo-500 w-3.5 h-3.5 cursor-pointer" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500">Section Title</label>
                          <input 
                            type="text" 
                            value={sec.title} 
                            onChange={(e) => handleUpdateConfigField(idx, 'title', e.target.value)}
                            placeholder="Section Title" 
                            className="w-full bg-slate-900/5 border border-slate-500/20 text-xs px-3 py-2 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500">Section Subtitle</label>
                          <input 
                            type="text" 
                            value={sec.subtitle} 
                            onChange={(e) => handleUpdateConfigField(idx, 'subtitle', e.target.value)}
                            placeholder="Section Subtitle" 
                            className="w-full bg-slate-900/5 border border-slate-500/20 text-xs px-3 py-2 rounded-lg" 
                          />
                        </div>
                        {sec.type === 'about' && sec.content && (
                          <div>
                            <label className="text-[9px] font-bold text-indigo-400">About Content Paragraph</label>
                            <textarea 
                              value={sec.content.text || ''} 
                              onChange={(e) => {
                                const updated = { ...formConfig };
                                updated.sections[idx].content.text = e.target.value;
                                setFormConfig(updated);
                              }}
                              placeholder="About Text Paragraph" 
                              className="w-full bg-slate-900/5 border border-slate-500/20 text-xs px-3 py-2 rounded-lg h-20 mt-0.5" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Payment & Billing Settings Section */}
                <div className="glass-card rounded-2xl p-4 space-y-3 bg-emerald-500/5 border-emerald-500/10 border text-left">
                  <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase block">
                    CMS: PAYMENT & BILLING DETAILS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">UPI ID</label>
                      <input 
                        type="text" 
                        value={formConfig.paymentDetails?.upiId || ''} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          if (!updated.paymentDetails) updated.paymentDetails = {};
                          updated.paymentDetails.upiId = e.target.value;
                          setFormConfig(updated);
                        }}
                        placeholder="e.g. user@okaxis"
                        className="w-full bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg mt-0.5" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">QR Code Image URL</label>
                      <input 
                        type="text" 
                        value={formConfig.paymentDetails?.qrCodeUrl || ''} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          if (!updated.paymentDetails) updated.paymentDetails = {};
                          updated.paymentDetails.qrCodeUrl = e.target.value;
                          setFormConfig(updated);
                        }}
                        placeholder="e.g. https://example.com/qr.png (optional)"
                        className="w-full bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg mt-0.5" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">Account Holder Name</label>
                      <input 
                        type="text" 
                        value={formConfig.paymentDetails?.holderName || ''} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          if (!updated.paymentDetails) updated.paymentDetails = {};
                          updated.paymentDetails.holderName = e.target.value;
                          setFormConfig(updated);
                        }}
                        placeholder="e.g. Megha Choudhary"
                        className="w-full bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg mt-0.5" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">Bank Name</label>
                      <input 
                        type="text" 
                        value={formConfig.paymentDetails?.bankName || ''} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          if (!updated.paymentDetails) updated.paymentDetails = {};
                          updated.paymentDetails.bankName = e.target.value;
                          setFormConfig(updated);
                        }}
                        placeholder="e.g. State Bank of India"
                        className="w-full bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg mt-0.5" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">Bank Account Number</label>
                      <input 
                        type="text" 
                        value={formConfig.paymentDetails?.accountNumber || ''} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          if (!updated.paymentDetails) updated.paymentDetails = {};
                          updated.paymentDetails.accountNumber = e.target.value;
                          setFormConfig(updated);
                        }}
                        placeholder="e.g. 382901928392"
                        className="w-full bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg mt-0.5" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500">Bank IFSC Code</label>
                      <input 
                        type="text" 
                        value={formConfig.paymentDetails?.ifscCode || ''} 
                        onChange={(e) => {
                          const updated = { ...formConfig };
                          if (!updated.paymentDetails) updated.paymentDetails = {};
                          updated.paymentDetails.ifscCode = e.target.value;
                          setFormConfig(updated);
                        }}
                        placeholder="e.g. SBIN0001234"
                        className="w-full bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg mt-0.5" 
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleResetTemplate}
                  className="w-full border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 text-[10px] font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Reset Current Template to Defaults
                </button>
              </div>
            )}

            {/* TAB 3B: USER DESK PANEL */}
            {activeTab === 'user_desk' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1 pb-2 border-b border-slate-500/10">
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    <Users className="w-5 h-5 text-indigo-500 animate-bounce" />
                    Dynamic User Directories
                  </h3>
                  <p className="text-[10px] opacity-80">Administrate registered users across all dynamic websites, select roles, and link them to tenant websites.</p>
                </div>

                {/* Provision User Form */}
                <form onSubmit={handleCreateSaaSUser} className="space-y-3 p-4 bg-slate-500/5 rounded-2xl border border-slate-500/10">
                  <span className="text-[8px] text-indigo-400 font-bold tracking-widest block uppercase">Provision SaaS User</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={newUserName} 
                      onChange={(e) => setNewUserName(e.target.value)} 
                      className="bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg text-white placeholder-slate-700"
                      required
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone" 
                      value={newUserPhone} 
                      onChange={(e) => setNewUserPhone(e.target.value)} 
                      className="bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg text-white placeholder-slate-700"
                      required
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={newUserEmail} 
                    onChange={(e) => setNewUserEmail(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg text-white placeholder-slate-700"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={newUserPassword} 
                      onChange={(e) => setNewUserPassword(e.target.value)} 
                      className="bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg text-white placeholder-slate-700"
                      required
                    />
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="bg-slate-950 border border-slate-500/20 text-xs px-3 py-2 rounded-lg text-white font-semibold"
                    >
                      <option value="student">Student (Education)</option>
                      <option value="customer">Customer (E-Commerce)</option>
                      <option value="teacher">Teacher (Education)</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl active:scale-95 transition-transform"
                  >
                    + Provision User Node
                  </button>
                </form>

                {/* User Directory list */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest block font-mono">Active Directory</span>
                  {usersList.map((user) => (
                    <div key={user._id} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between text-[11px] hover:bg-slate-900/50 transition-colors">
                      <div>
                        <p className="font-bold text-white leading-normal">{user.name || 'Anonymous User'} <span className="bg-indigo-500/15 text-indigo-400 font-mono text-[9px] px-2 py-0.5 rounded-full uppercase ml-1.5 font-black">{user.role}</span></p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{user.email} • {user.phone || 'No Mobile'}</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">Linked Tenant: <span className="text-amber-500 font-bold">{user.websiteId ? user.websiteId.split('_')[0].toUpperCase() : 'CENTRAL SYSTEM'}</span></p>
                      </div>
                    </div>
                  ))}
                  {usersList.length === 0 && (
                    <p className="italic text-slate-500 text-xs text-center py-4">No users logged in dynamic database.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: THEME STUDIO */}
            {activeTab === 'theme' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-slate-500/10 pb-2">
                  <h3 className="font-bold text-sm">Visual Color & Styling Studio</h3>
                  <button 
                    onClick={handleSaveConfig}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow"
                  >
                    Save Style
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">AI Suggested Palette Generative</h4>
                    <div className="flex gap-2">
                      {['futuristic', 'elegant'].map((style) => (
                        <button
                          key={style}
                          onClick={() => handleTriggerAISuggestTheme(style)}
                          className="flex-1 bg-slate-500/5 border border-slate-500/20 hover:bg-slate-500/10 text-[10px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                          Apply {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Primary Color (Hex/HSL)</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={formConfig.theme.primary.startsWith('#') ? formConfig.theme.primary : '#3b82f6'} 
                          onChange={(e) => {
                            const updated = { ...formConfig };
                            updated.theme.primary = e.target.value;
                            setFormConfig(updated);
                          }}
                          className="w-10 h-8 rounded border border-slate-500/20 bg-transparent cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={formConfig.theme.primary} 
                          onChange={(e) => {
                            const updated = { ...formConfig };
                            updated.theme.primary = e.target.value;
                            setFormConfig(updated);
                          }}
                          className="w-full bg-slate-900/5 border border-slate-500/20 text-xs px-3 rounded-lg" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Secondary Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={formConfig.theme.secondary.startsWith('#') ? formConfig.theme.secondary : '#8b5cf6'} 
                          onChange={(e) => {
                            const updated = { ...formConfig };
                            updated.theme.secondary = e.target.value;
                            setFormConfig(updated);
                          }}
                          className="w-10 h-8 rounded border border-slate-500/20 bg-transparent cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={formConfig.theme.secondary} 
                          onChange={(e) => {
                            const updated = { ...formConfig };
                            updated.theme.secondary = e.target.value;
                            setFormConfig(updated);
                          }}
                          className="w-full bg-slate-900/5 border border-slate-500/20 text-xs px-3 rounded-lg" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Accent Accent Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={formConfig.theme.accent.startsWith('#') ? formConfig.theme.accent : '#06b6d4'} 
                          onChange={(e) => {
                            const updated = { ...formConfig };
                            updated.theme.accent = e.target.value;
                            setFormConfig(updated);
                          }}
                          className="w-10 h-8 rounded border border-slate-500/20 bg-transparent cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={formConfig.theme.accent} 
                          onChange={(e) => {
                            const updated = { ...formConfig };
                            updated.theme.accent = e.target.value;
                            setFormConfig(updated);
                          }}
                          className="w-full bg-slate-900/5 border border-slate-500/20 text-xs px-3 rounded-lg" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AI ORACLE PANEL */}
            {activeTab === 'ai_oracle' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    <Bot className="w-5 h-5 text-indigo-500 animate-bounce" />
                    AI Dynamic Copy & Slogan Generator
                  </h3>
                  <p className="text-[10px] opacity-80">Provide a marketing description. The AI will output a matching header title, optimized subtitles, and structured specs specific to Jabalpur city.</p>
                </div>

                <div className="space-y-3">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe your target business goal..."
                    className="w-full bg-slate-900/5 border border-slate-500/20 text-xs p-3 rounded-xl h-20 placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    onClick={handleTriggerAIContent}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Simulate AI Generation
                  </button>

                  {aiGeneratedData && (
                    <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-2xl space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded-full block w-fit">AI DRAFT COPY</span>
                      <h4 className="font-bold text-xs leading-snug">{aiGeneratedData.heroTitle}</h4>
                      <p className="text-[10px] opacity-80 leading-normal">{aiGeneratedData.heroSubtitle}</p>
                      <button
                        onClick={applyAIGeneratedContent}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-[9px] font-bold py-2 rounded-lg"
                      >
                        Apply Content Draft
                      </button>
                    </div>
                  )}
                </div>

                {/* Local SEO Optimizer Section */}
                <div className="border-t border-slate-500/10 pt-4 space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs">Local Google SEO Evaluator</h4>
                    <p className="text-[9px] opacity-75">Scan active metadata tags to calculate search indexing parameters.</p>
                  </div>
                  <button
                    onClick={handleTriggerAISEOScan}
                    className="w-full bg-slate-500/5 border border-slate-500/20 text-[10px] font-bold py-2 rounded-lg hover:bg-slate-500/10"
                  >
                    Scan Landing Page Metadata
                  </button>

                  {seoReport && (
                    <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl space-y-2 text-[10px] text-slate-300">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">SEO Health Index</span>
                        <span className={`font-mono font-bold text-sm ${seoReport.score > 85 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {seoReport.score}/100
                        </span>
                      </div>
                      <div className="space-y-1.5 pt-1 border-t border-slate-500/10">
                        <strong className="text-[9px] text-slate-500 block uppercase tracking-wider">Optimization Suggestions:</strong>
                        {seoReport.suggestions.map((s, idx) => (
                          <p key={idx} className="leading-snug flex items-start gap-1">
                            <span className="text-amber-500 shrink-0">•</span>
                            {s}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: RAZORPAY PAYMENT SIMULATION */}
            {activeTab === 'payment' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm">Razorpay Webhooks Simulation</h3>
                  <p className="text-[10px] opacity-80">Trigger a simulated transaction event from the server. This emits instant WebSocket events, popping beautiful checkout confirmations on all active frontend users!</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleManualPaymentSimulation}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                  >
                    <CreditCard className="w-4 h-4" />
                    Simulate Payment Reciept (₹15,000)
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* System Notifications log footer */}
          <div className="border-t border-slate-500/10 bg-slate-900/5 p-4 max-h-[140px] overflow-y-auto shrink-0">
            <h4 className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2 font-mono flex items-center justify-between">
              <span>Server Webhook Feeds</span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
            </h4>
            <div className="space-y-1.5 font-mono text-[9px] opacity-75">
              {notifications.slice(0, 3).map((n, idx) => (
                <p key={idx} className="truncate flex items-start gap-1.5">
                  <ChevronRight className="w-2.5 h-2.5 text-indigo-500 shrink-0 mt-0.5" />
                  {n.message}
                </p>
              ))}
              {notifications.length === 0 && (
                <p className="italic text-slate-500">No network triggers caught.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Split live Preview Pane (7 columns) */}
        <div className="xl:col-span-7 bg-slate-100 dark:bg-slate-900 flex flex-col overflow-hidden relative transition-colors duration-500">
          
          {/* Header controls for Device Viewports */}
          <div className="h-14 border-b border-slate-500/20 bg-slate-950/5 dark:bg-slate-950/20 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold">High-Fidelity Preview Gateway</span>
            </div>

            <div className="flex items-center gap-1">
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
                        ? 'border-indigo-500/30 text-indigo-500 bg-indigo-500/5' 
                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title={`Preview in ${dev.id} resolution`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Mock Viewport viewport */}
          <div className="flex-1 p-8 flex items-center justify-center overflow-auto cyber-grid">
            <div 
              style={{ 
                width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                height: '100%',
                maxWidth: '100%'
              }}
              className="rounded-2xl border border-slate-500/20 bg-slate-950 shadow-2xl flex flex-col overflow-hidden transition-all duration-500 select-none relative"
            >
              {/* Browser bar layout */}
              <div className="h-10 border-b border-white/5 bg-slate-900 flex items-center justify-between px-4 shrink-0">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block" />
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block" />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
                </div>
                <div className="bg-white/5 border border-white/5 text-[9px] text-slate-400 px-4 py-1.5 rounded-lg w-1/2 text-center truncate font-mono">
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
