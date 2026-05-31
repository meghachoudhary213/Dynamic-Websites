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
import MarbleRocksCanvas from '../../../components/MarbleRocksCanvas';
import DynamicChatbot from '../../../components/DynamicChatbot';
import { API_URL } from '../../../config';

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
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 120, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width/2, height/2, 60, 0, Math.PI * 2);
      ctx.stroke();
      
      const scanY = (Math.sin(Date.now() / 1500) + 1) * (height / 2) + 50;
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.25)';
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(width/2 - 140, scanY);
      ctx.lineTo(width/2 + 140, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
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

export default function DynamicWebsiteRoute({ params }) {
  const [slug, setSlug] = useState('');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom interactive mock checkout panel
  const [showPayModal, setShowPayModal] = useState(false);
  const [payPlanName, setPayPlanName] = useState('');
  const [payPrice, setPayPrice] = useState('');
  const [payingState, setPayingState] = useState('idle');
  const [payTransactionId, setPayTransactionId] = useState('');
  const [payTab, setPayTab] = useState('card');

  useEffect(() => {
    if (params) {
      Promise.resolve(params).then((resolvedParams) => {
        setSlug(resolvedParams.slug || '');
      });
    }
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    loadWebsiteConfig();
  }, [slug]);

  useEffect(() => {
    const handlePreviewMessage = (e) => {
      if (e.data?.type === 'LIVE_CONFIG_UPDATE' && e.data?.config) {
        setConfig(e.data.config);
        applyThemeVariables(e.data.config.theme, e.data.config.category || e.data.config.businessType);
      }
    };
    window.addEventListener('message', handlePreviewMessage);
    return () => window.removeEventListener('message', handlePreviewMessage);
  }, []);

  const loadWebsiteConfig = async () => {
    const slugMap = {
      nextrank: 'coaching',
      shopverse: 'ecommerce',
      medicare: 'hospital',
      cybershield: 'cybersecurity'
    };

    const targetSlug = slugMap[slug.toLowerCase()] || slug;

    try {
      const res = await fetch(`${API_URL}/api/website/config/${targetSlug}`);
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
        applyThemeVariables(data.config.theme, data.config.category || data.config.businessType);
      } else {
        setError(`Configuration profile for slug "${slug}" not found.`);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Connection refused. Is the MERN API server online?');
      setLoading(false);
    }
  };

  const applyThemeVariables = (theme, activeCategory) => {
    if (!theme) return;
    const root = document.documentElement;

    let primary = theme.primary || '#6366f1';
    let secondary = theme.secondary || '#a855f7';
    let accent = theme.accent || '#f43f5e';
    let background = theme.background || '#0b0f19';
    let textColor = theme.textColor || '#f3f4f6';

    // We no longer override theme values with hardcoded codes!
    // This allows custom pickers to take full effect on the public route.

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

  const triggerRazorpaySimulation = (planName, price) => {
    setPayPlanName(planName);
    setPayPrice(price);
    setPayingState('idle');
    setPayTransactionId('');
    setShowPayModal(true);
  };

  const handleSimulatePayment = async () => {
    setPayingState('paying');
    setTimeout(async () => {
      try {
        const cleanPrice = typeof payPrice === 'string' ? parseInt(payPrice.replace(/[^0-9]/g, '')) : payPrice;
        const res = await fetch(`${API_URL}/api/website/simulate-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: cleanPrice || 5000,
            userName: 'Stand-alone Visitor',
            planName: payPlanName
          })
        });
        const data = await res.json();
        if (data.success) {
          setPayTransactionId(data.transactionId);
          setPayingState('success');
        }
      } catch (err) {
        setPayingState('idle');
        alert('Payment simulator offline.');
      }
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex bg-[#030014] flex-col items-center justify-center text-white h-screen font-mono">
        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Compiling Dynamic Route...</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex bg-[#030014] flex-col items-center justify-center text-white h-screen font-mono p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-lg font-bold uppercase tracking-wider text-rose-400">Dynamic Route Error</h2>
        <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">{error || 'Could not fetch config data.'}</p>
        <button onClick={() => window.location.href = '/'} className="mt-6 border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs transition-colors">Return to Console</button>
      </div>
    );
  }

  const { theme, hero, navigation, sections, footer } = config;
  const businessType = config.category || (config.businessType && config.businessType.includes('_') ? config.businessType.split('_')[0] : config.businessType) || 'coaching';

  return (
    <div className={`website-preview-scope min-h-screen flex flex-col relative overflow-hidden ${businessType}-theme`} style={{ backgroundColor: 'var(--bg-custom)', fontFamily: 'var(--font-family-custom), sans-serif', color: 'var(--text-custom)' }}>
      {/* Background canvas Ripple/Parallax effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <MarbleRocksCanvas activeEffect={hero.jabalpurBranding?.interactiveEffect || 'electronic_grid'} />
      </div>

      {/* Standalone Nav Header */}
      <nav className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs font-black shadow-lg">
            {navigation.logoText ? navigation.logoText.substring(0, 2).toUpperCase() : 'NX'}
          </div>
          <span className="font-mono font-black text-sm tracking-wider uppercase text-white">{navigation.logoText || 'Nexus Engine'}</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <span className="bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase animate-pulse hidden md:inline-block">
            🌐 Active Route Slug: {slug}
          </span>
          <a
            href={`/website/${slug}/dashboard`}
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 border border-[var(--primary)]/30 px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-wider shadow cursor-pointer"
          >
            Launch Dashboard
          </a>
        </div>
      </nav>

      {/* Hero Showcase Block */}
      <section className="relative pt-24 pb-20 md:py-32 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-slate-300 font-mono tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
            <span>Premium Central India Engine Nodes</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black royal-heading tracking-wide leading-none text-[var(--text-custom)] uppercase">
            {hero.title}
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
            {hero.subtitle}
          </p>
          <div className="pt-3">
            <button onClick={() => triggerRazorpaySimulation('General Admission', '15000')} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold text-xs tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 uppercase">
              {hero.ctaText || 'Get Started'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center mx-auto relative group">
          <div className="royal-frame rounded-[var(--radius-custom)] shadow-2xl relative w-[320px] h-[360px] md:w-[380px] md:h-[400px] overflow-hidden border border-white/10 hover:border-[var(--primary)]/30 transition-colors duration-500 bg-[#030014]/60">
            {businessType === 'smartengine' ? (
              <CanvasHologram />
            ) : (
              <img src={hero.bgImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800"} alt="Visual showcase representation" className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-custom)] via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </section>

      {/* Dynamic Sections Renderer */}
      {sections.map((section) => {
        if (!section.visible) return null;

        // If selected website type is education (coaching), show only courses and faculty sections
        if (businessType === 'coaching' || businessType === 'education') {
          if (section.type !== 'courses' && section.type !== 'faculty') {
            return null;
          }
        }

        return (
          <section key={section.id} id={section.id} className="py-16 md:py-24 px-6 max-w-7xl mx-auto w-full border-t border-white/5 relative z-10 transition-all duration-300">
            <div className="section-header-alignment text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-royal royal-heading font-semibold tracking-wide text-[var(--text-custom)] uppercase">
                {section.title}
              </h2>
              <div className="section-header-divider w-8 h-[2px] bg-[var(--primary)]/50 mx-auto" />
              <p className="text-slate-400 text-xs md:text-sm font-sans tracking-wide">
                {section.subtitle}
              </p>
            </div>

            {section.type === 'features' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((feat, fIdx) => (
                  <div key={fIdx} className="royal-card rounded-[var(--radius-custom)] p-8 space-y-4 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/5 rounded-full blur-xl pointer-events-none" />
                    <div style={{ background: `var(--primary)12` }} className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner border border-[var(--primary)]/20 text-glow">
                      {feat.icon || '✦'}
                    </div>
                    <h3 className="text-lg font-royal royal-heading font-semibold text-white group-hover:text-[var(--primary)] transition-colors">
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
                    <p className="text-4xl md:text-5xl font-royal royal-heading font-bold text-glow" style={{ color: 'var(--accent)' }}>
                      {stat.number}
                    </p>
                    <div className="w-8 h-[1px] bg-white/10 mx-auto my-2" />
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-sans">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(section.content || []).map((course, idx) => (
                  <div key={idx} className="royal-card rounded-[var(--radius-custom)] p-6 space-y-4 flex flex-col justify-between hover:scale-105 transition-transform">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold uppercase tracking-wider">{course.target}</span>
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
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-white/10 shadow-xl">
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

          </section>
        );
      })}

      {/* Standalone Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950/60 backdrop-blur-md relative z-10 px-6 text-center text-xs text-slate-500 font-mono">
        <p>{footer.text || `© 2026 ${config.websiteName}. Centralized Dynamic Engine.`}</p>
      </footer>

      {/* Premium Simulated Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-[#0a081a] border border-white/10 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
            <h3 className="text-md font-bold text-white font-mono uppercase tracking-wider">Simulated Checkout Gateway</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Plan: <span className="text-[var(--primary)]">{payPlanName}</span> • Price: <span className="text-emerald-400">{payPrice}</span></p>

            <div className="space-y-4 mt-6">
              {payingState === 'idle' && (
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-300 font-mono leading-normal">
                    <strong>💳 Payment details configured:</strong><br />
                    UPI Destination: <code className="text-[var(--primary)]">{config.paymentDetails?.upiId || 'jabalpur@sbi'}</code><br />
                    MOCK Account: <code className="text-[var(--primary)]">{config.paymentDetails?.accountNumber || '382901928392'}</code>
                  </div>
                  <button onClick={handleSimulatePayment} className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider active:scale-95 transition-all shadow">
                    Complete Simulated Checkout
                  </button>
                </div>
              )}

              {payingState === 'paying' && (
                <div className="flex flex-col items-center justify-center py-6 font-mono text-xs">
                  <RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mb-3" />
                  <span>Processing secure dynamic transaction...</span>
                </div>
              )}

              {payingState === 'success' && (
                <div className="space-y-4 py-4 text-center font-mono">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-xl">✓</div>
                  <h4 className="text-emerald-400 font-bold text-sm">TRANSACTION SUCCESSFUL!</h4>
                  <p className="text-[9px] text-slate-400">Mock VPA settlement recorded under TransID: <br /><code className="text-white block mt-1">{payTransactionId}</code></p>
                  <button onClick={() => setShowPayModal(false)} className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-[10px] text-slate-300 hover:text-white transition-colors">Close Gateway</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Bot Assistance Drawer */}
      <DynamicChatbot />
    </div>
  );
}
