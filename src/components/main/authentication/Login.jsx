import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, ArrowLeft } from 'lucide-react';
import AuthHeader from './AuthHeader';

export const LoginModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Update layout mode on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  // LAYOUT A: FULL SCREEN TAKEOVER (Mobile & Tablet)
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[200] bg-neutral-100 flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Mobile Header: Branding Takeover */}
        <div className="relative">
          <button
            onClick={onClose}
            className='absolute top-6 left-6 z-[210] text-white/80 flex items-center gap-2 text-xs font-bold uppercase tracking-widest'
          >
            <ArrowLeft className='w-4 h-4' /> Back
          </button>

          <AuthHeader />
        </div>

        {/* Mobile Form: */}
        <div className="flex-grow p-8 space-y-8 overflow-y-auto">
          <div className="space-y-4">
              <div className="space-y-2">
                <div className="w-full px-6 md:px-10 py-8">
                  <h1 className="text-purple-600 text-5xl font-black uppercase tracking-tighter">
                      User Login
                  </h1>
              </div>
              <label className="text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="you@company.com" 
                className="w-full h-14 bg-slate-100 rounded-xl px-4 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all text-400" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full h-14 bg-slate-100 rounded-xl px-4 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all text-400" 
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <button className="text-violet-800 text-xs font-bold uppercase tracking-widest w-full text-right py-2">Forgot Password?</button>
          </div>

          <button className="w-full h-16 bg-gradient-to-r from-violet-800 to-purple-600 rounded-2xl outline outline-2 outline-pink-600 text-white font-black text-lg shadow-xl shadow-purple-500/20">
            LOG IN
          </button>

          <div className="pt-8 border-t border-gray-200 flex flex-col items-center gap-4">
            <span className="text-slate-400 text-xs font-bold uppercase">New to TechTrade?</span>
            <button className="text-violet-800 font-black uppercase tracking-widest border-b-2 border-violet-800">Register Account</button>
          </div>
        </div>
      </div>
    );
  }

  // LAYOUT B: MODAL (Desktop)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-violet-950/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="relative flex w-[1024px] h-[768px] bg-neutral-100 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Left Column */}
        <div className='w-1/2 h-full relative border-r-4 border-pink-600 flex flex-col items-stretch'>
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            <AuthHeader />
          </div>
        </div>

        {/* Right Column */}
        <div className='w-1/2 h-full p-16 flex flex-col justify-center relative bg-white'>
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 text-pink-600 hover:text-violet-600 transition-colors">
              <X />
          </button>

          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-purple-600 text-4xl font-black uppercase tracking-tighter">
                User Login
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full h-14 bg-slate-100 rounded-xl px-4 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all text-gray-400" 
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="w-full h-14 bg-slate-100 rounded-xl px-4 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all text-gray-400" 
                  />
                   <button 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button className="w-full h-14 bg-gradient-to-r from-violet-800 to-purple-600 rounded-xl outline outline-2 outline-pink-600 text-white font-black tracking-widest hover:brightness-110 transition-all">LOG IN</button>

              <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100">
                <span className='text-slate-400 text-xs font-bold uppercase'>Don't have an account?</span>
                <button className="text-violet-800 text-[10px] font-black uppercase tracking-[0.2em]">Register Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
