"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X, Sparkles } from 'lucide-react';

export default function ThemeToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type = 'info', duration = 4000 } = e.detail;
      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('show-theme-toast', handleToast);

    // Override window.alert
    if (typeof window !== 'undefined') {
      window.showToast = (message, type = 'info', duration = 4000) => {
        const event = new CustomEvent('show-theme-toast', {
          detail: { message, type, duration }
        });
        window.dispatchEvent(event);
      };

      window.alert = (message) => {
        if (!message) return;
        const msgStr = String(message);
        let type = 'info';
        const lower = msgStr.toLowerCase();
        if (
          lower.includes('error') || 
          lower.includes('failed') || 
          lower.includes('refused') || 
          lower.includes('offline') || 
          lower.includes('invalid') ||
          lower.includes('could not')
        ) {
          type = 'error';
        } else if (
          lower.includes('success') || 
          lower.includes('🎉') || 
          lower.includes('created') || 
          lower.includes('deployed') || 
          lower.includes('restored') ||
          lower.includes('received')
        ) {
          type = 'success';
        }
        window.showToast(msgStr, type);
      };
    }

    return () => {
      window.removeEventListener('show-theme-toast', handleToast);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-[99999] flex flex-col gap-3.5 max-w-md w-full px-4 md:px-0 pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        
        let icon = <Sparkles className="w-5 h-5 text-[var(--accent)] shrink-0 animate-pulse" />;
        let borderColor = 'rgba(255, 255, 255, 0.1)';
        let glowColor = 'rgba(0,0,0,0.5)';
        
        if (isError) {
          icon = <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 animate-bounce" />;
          borderColor = 'rgba(244, 63, 94, 0.4)';
          glowColor = 'rgba(244, 63, 94, 0.2)';
        } else if (isSuccess) {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          borderColor = 'rgba(16, 185, 129, 0.4)';
          glowColor = 'rgba(16, 185, 129, 0.2)';
        } else {
          // Info / default theme
          icon = <Sparkles className="w-5 h-5 text-[var(--accent)] shrink-0 animate-pulse" />;
          borderColor = 'rgba(212, 175, 55, 0.3)';
          glowColor = 'var(--primary)';
        }

        return (
          <div
            key={toast.id}
            style={{ 
              borderColor: borderColor,
              boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 20px ${glowColor}`
            }}
            className="pointer-events-auto w-full glass-panel rounded-2xl border p-4 flex items-start gap-3.5 animate-in slide-in-from-top-6 duration-300 relative overflow-hidden backdrop-blur-2xl"
          >
            {/* Ambient subtle gradient background matching active theme */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 via-transparent to-transparent pointer-events-none -z-10" />
            
            <div className="pt-0.5">{icon}</div>
            
            <div className="flex-1 pr-6 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-[var(--accent)] opacity-85 block">
                {isError ? 'System Alert' : isSuccess ? 'Confirmation' : 'Notification'}
              </span>
              <p className="text-white text-xs font-semibold leading-relaxed break-words font-sans">
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
