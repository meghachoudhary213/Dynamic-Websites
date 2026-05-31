"use client";

import React, { useState } from 'react';
import AuthGuard from '../../../components/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { 
  ShoppingBag, CreditCard, Tag, ArrowRight, LogOut, 
  CheckCircle, Clock, Heart, Award, Gift, Compass
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  
  const purchases = [
    { orderId: "TXN_7829102", product: "Premium Royal Coaching Plan - Jabalpur", date: "May 28, 2026", price: "₹15,000", status: "Settled" },
    { orderId: "TXN_7821901", product: "ShopVerse Premium Brand Bag Bundle", date: "May 12, 2026", price: "₹4,200", status: "Delivered" },
    { orderId: "TXN_7811902", product: "AashiyanaX Prime Tour Token", date: "Apr 25, 2026", price: "₹1,500", status: "Delivered" }
  ];

  const recommendItems = [
    { title: "Sanskardhani Gold Class Pass", price: "₹2,500", discount: "20% OFF", rating: 4.9 },
    { title: "ShopVerse Summer Luxury Jacket", price: "₹3,800", discount: "Buy 1 Get 1", rating: 4.8 }
  ];

  return (
    <AuthGuard allowedRoles={['customer']}>
      <div className={`min-h-screen flex flex-col relative overflow-hidden bg-[#0a0502] text-slate-100`}>
        {/* Glow Spots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-700/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-3xl" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
              🛍️
            </div>
            <span className="font-mono font-black text-sm tracking-wider uppercase text-white">ShopVerse Customer Desk</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase">
              Customer Mode
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 border border-white/10 hover:bg-rose-500/15 hover:text-rose-400 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
          
          {/* Welcome Banner */}
          <div className="p-6 bg-gradient-to-r from-amber-950/30 via-stone-950/40 to-slate-950/60 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-widest block">Premium Shopper Profile</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white">
                Hello, {user?.name || 'Exclusive Customer'}!
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Access your luxury boutique parameters, transaction logs, and Razorpay mock invoice settlements.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left font-mono text-[10px] shrink-0 self-start md:self-auto">
              <p className="text-slate-300 font-bold">EMAIL: <span className="text-white">{user?.email}</span></p>
              <p className="text-slate-400 mt-0.5">PHONE: {user?.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Stats Directory */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {[
              { label: "Boutique Purchases", value: "₹20,700", desc: "Settled via secure gateways", icon: CreditCard, color: "text-amber-400" },
              { label: "Active Vouchers", value: "3 Coupons", desc: "Eligible for 20% discounts", icon: Tag, color: "text-orange-400" },
              { label: "Total Orders", value: "3 Settled", desc: "MERN dynamic routes validated", icon: ShoppingBag, color: "text-amber-500" },
              { label: "Explorer Coins", value: "850 Pts", desc: "Loyalty boutique score", icon: Gift, color: "text-yellow-400" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">{stat.label}</span>
                  <p className={`text-2xl font-black font-mono tracking-tight ${stat.color}`}>{stat.value}</p>
                  <div className="w-8 h-[1px] bg-white/10 my-1" />
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium"><Icon className="w-3.5 h-3.5 shrink-0" /> {stat.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Splitted Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Transaction logs history (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/20 border border-white/5 rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-amber-400 font-mono uppercase tracking-wider">Transaction Invoice Settlement</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Mock Razorpay order histories stored transparently in MongoDB database.</p>
                </div>
                <ShoppingBag className="w-5 h-5 text-amber-400 shrink-0" />
              </div>

              <div className="space-y-3">
                {purchases.map((pur, idx) => (
                  <div key={idx} className="bg-slate-950/85 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider">{pur.orderId}</span>
                      <h4 className="font-bold text-slate-200 text-sm mt-1">{pur.product}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> Purchased: {pur.date}</p>
                    </div>

                    <div className="flex gap-4 md:text-right font-mono items-center">
                      <span className="text-white font-black text-md block">{pur.price}</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                        {pur.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Curated Recommendations & Support (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Boutique catalog suggestions */}
              <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-orange-400 font-mono uppercase tracking-wider">Luxury Recommendations</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Selected dynamic items tailored for your lifestyle.</p>
                  </div>
                  <Compass className="w-5 h-5 text-orange-400 shrink-0" />
                </div>

                <div className="space-y-3">
                  {recommendItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/80 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <span className="font-bold text-slate-200 text-xs block truncate">{item.title}</span>
                        <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wide block mt-1">{item.discount}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-amber-400 font-mono block text-sm">{item.price}</span>
                        <a href="/website/shopverse" target="_blank" className="text-[8px] bg-amber-500 hover:bg-amber-600 text-black px-2 py-1 rounded font-bold uppercase inline-block mt-1 transition-colors">
                          Shop Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo alerts */}
              <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 text-left space-y-3">
                <h3 className="font-bold text-sm text-amber-500 font-mono uppercase tracking-wider">Active Shopping Bag</h3>
                <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest font-mono">🎫 DISCOUNT COUPON ACTIVE: NEXUS20</span>
                  <p className="text-xs text-slate-300 leading-normal">
                    Enter the code <strong className="text-white">NEXUS20</strong> in the shopverse gateway sandbox checkout to enjoy 20% discount on boutique items!
                  </p>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </AuthGuard>
  );
}
