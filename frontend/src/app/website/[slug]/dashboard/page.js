"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { API_URL } from '../../../../config';
import DynamicDashboardLayout from '../../../../components/DynamicDashboardLayout';

export default function DynamicWebsiteDashboard({ params }) {
  const [slug, setSlug] = useState('');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  };

  if (loading) {
    return (
      <div className="flex bg-[#030014] flex-col items-center justify-center text-white h-screen font-mono">
        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Compiling Dynamic Dashboard...</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex bg-[#030014] flex-col items-center justify-center text-white h-screen font-mono p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-lg font-bold uppercase tracking-wider text-rose-400">Dynamic Dashboard Error</h2>
        <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">{error || 'Could not fetch config data.'}</p>
        <button onClick={() => window.location.href = `/website/${slug}`} className="mt-6 border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs transition-colors">Return to Site</button>
      </div>
    );
  }

  return (
    <DynamicDashboardLayout
      websiteName={config.websiteName || 'Nexus SaaS'}
      category={config.category || config.businessType}
      theme={config.theme}
      paymentDetails={config.paymentDetails}
      slug={slug}
    />
  );
}
