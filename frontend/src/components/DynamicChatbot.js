"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, HelpCircle } from 'lucide-react';
import { API_URL } from '../config';

export default function DynamicChatbot({ businessType = 'coaching', colors = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  // Default greeting based on active website context
  const getGreeting = () => {
    switch (businessType) {
      case 'coaching':
        return "Welcome to NextRank Institute! I am your Class 12th AI study planner. Ask me about online test series, notes uploads, attendance, or result analytics!";
      case 'ecommerce':
        return "Welcome to Libaas couture store. I am your AI style recommender. Explore our luxury liquid commerce wishlist, animated cards, or smart checkout!";
      case 'real_estate':
        return "Welcome to AashiyanaX. I am your property AI consultant. Want to launch 3D virtual tours, check active filters, or book an agent?";
      case 'hospital':
        return "AarogyaCare clinic command active. I am your Healing Frost health guide. Check clinical report downloads, doctor lists, or book consults.";
      case 'cafe':
        return "Welcome to Cafe Aura coffee glass lounge! Ask me about online reservations, weekend acoustic music, ordering coffees, or food items!";
      case 'startup':
        return "NexaTech Hub online. Operational parameters: OPTIMAL. Ask me about custom AI sandbox compile runs, stats dashboards, or product demos!";
      case 'gym':
        return "Welcome to FlexArena Power Glass gym! I am your AI wellness guide. Calculate your BMI, check power workout plans, or book memberships!";
      case 'tourism':
        return "ExploreAura SkyGlass planner active. Voyage down moonlight gorges safely. Ask me to generate AI itineraries or check budget trip planners!";
      case 'cybersecurity':
        return "ThreatZero matrix firewall online. Ask me about live attack monitors, quiz parameters, or security tips.";
      case 'career':
        return "JobSphere recruitment terminal online. Let's analyze your resume grade, perform conversational AI interviews, or track placements!";
      default:
        return "Hello! I am your JobSphere/ThreatZero advisor. How can I assist you with your business needs today?";
    }
  };

  // Quick suggestions based on active website context
  const getSuggestions = () => {
    switch (businessType) {
      case 'coaching':
        return ["Online test series details?", "Notes upload link?", "Check result analytics"];
      case 'ecommerce':
        return ["Add gold kurta to wishlist", "Verify smart checkout", "AI Style recommendations"];
      case 'real_estate':
        return ["Launch virtual 3D tour", "Vijay Nagar duplex price?", "Book agent session"];
      case 'hospital':
        return ["Book AarogyaCare consult", "Emergency dispatch hotline", "Download my health report"];
      case 'cafe':
        return ["Coffee Menu rates?", "Reserve table online", "Live acoustic bands schedule"];
      case 'startup':
        return ["Compile sandbox AI prompt", "Live system stats", "Launch product demo"];
      case 'gym':
        return ["Calculate my BMI target", "Workout plans list", "Gym membership prices"];
      case 'tourism':
        return ["AI Itinerary for Bhedaghat", "SkyGlass budget calculator", "Book shoreline eco-cottage"];
      case 'cybersecurity':
        return ["Check live attack log", "Take cyber quiz sandbox", "MFA protection tips"];
      case 'career':
        return ["Launch resume analyzer", "Start mock interview Q&A", "Internship finder lists"];
      default:
        return ["System features", "How do I switch sites?"];
    }
  };

  // Initialize chat logs when template swaps
  useEffect(() => {
    setMessages([
      { sender: 'bot', text: getGreeting(), timestamp: new Date() }
    ]);
  }, [businessType]);

  // Keep chat scrolled to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    if (!textToSend) setInputValue('');

    // Append user message
    setMessages(prev => [...prev, { sender: 'user', text, timestamp: new Date() }]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, businessType })
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: "Apologies, my cognitive pipelines are experiencing latency. Please try again.", timestamp: new Date() }]);
      }
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: "Unable to connect to Jabalpur SmartEngine. Please ensure the backend is running.", timestamp: new Date() }]);
    }
  };

  const primaryColor = colors.primary || '#6366f1';

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Trigger floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{ background: primaryColor }}
          className="flex items-center justify-center w-14 h-14 rounded-full text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full" />
          
          {/* Tooltip tooltip */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl">
            Chat with Jabalpur AI Advisor ✨
          </div>
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="w-[360px] md:w-[390px] h-[520px] rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header layout */}
          <div 
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}dd, ${colors.secondary || '#a855f7'}dd)` 
            }}
            className="p-4 text-white flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  Jabalpur AI Oracle
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                </h4>
                <p className="text-[10px] text-white/80 uppercase tracking-widest font-semibold font-mono">
                  {businessType} mode
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 cyber-grid cyber-grid-glow">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    m.sender === 'user' ? 'bg-slate-800 text-slate-300' : 'bg-white/10 text-white'
                  }`}
                >
                  {m.sender === 'user' ? 'U' : <Bot className="w-4 h-4" />}
                </div>
                <div>
                  <div 
                    style={{ 
                      backgroundColor: m.sender === 'user' ? `${primaryColor}22` : 'rgba(255,255,255,0.03)',
                      borderColor: m.sender === 'user' ? `${primaryColor}44` : 'rgba(255,255,255,0.06)'
                    }}
                    className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                      m.sender === 'user' ? 'text-white rounded-tr-none' : 'text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-1 px-1">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 mr-auto max-w-[80%]">
                <div className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 animate-bounce">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions list */}
          <div className="px-4 py-2 bg-slate-900/60 border-t border-white/5 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            {getSuggestions().map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="text-[10px] text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-all"
              >
                <HelpCircle className="w-3 h-3 text-slate-400" />
                {s}
              </button>
            ))}
          </div>

          {/* Input control form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about this business..."
              className="flex-1 bg-white/5 border border-white/10 text-xs px-3.5 py-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/15"
            />
            <button
              type="submit"
              style={{ background: primaryColor }}
              className="p-2.5 rounded-xl text-white hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shrink-0 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
