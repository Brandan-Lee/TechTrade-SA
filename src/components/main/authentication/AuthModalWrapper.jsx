import React, { useState, useEffect } from "react";
import { X, ArrowLeft, Terminal, ShieldAlert } from "lucide-react";
import AuthHeader from "./AuthHeader";

const AuthModalWrapper = ({ 
  isOpen, 
  onClose, 
  onBack, 
  children, 
  showBackButton = true 
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) return null;

  const SCANLINE_OVERLAY = (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
  );

  // --- MOBILE & TABLET (Full Terminal View) ---
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#050505] flex flex-col animate-in slide-in-from-bottom duration-500">
        {SCANLINE_OVERLAY}
        
        <div className="relative flex-shrink-0 border-b border-fuchsia-500/20">
          {showBackButton && (
            <button
              onClick={onBack || onClose}
              className="absolute top-6 left-6 z-[310] text-fuchsia-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] bg-fuchsia-500/10 px-3 py-1.5 rounded-md border border-fuchsia-500/20 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          )}
          <AuthHeader />
        </div>

        <div className="flex-grow p-6 overflow-y-auto flex flex-col relative">
          <div className="max-w-md mx-auto my-auto w-full relative z-10">
            {children}
          </div>
          
          {/* Decorative Corner Bit */}
          <div className="absolute bottom-4 right-4 opacity-20">
             <Terminal size={40} className="text-fuchsia-500" />
          </div>
        </div>
      </div>
    );
  }

  // --- DESKTOP MODAL (Data Vault View) ---
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      {/* Backdrop: Ultra-dark with blur */}
      <div 
        className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative flex w-full max-w-6xl h-[700px] bg-[#0a0a0c] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-300">
        {SCANLINE_OVERLAY}

        {/* Left Column: Branding (The Core) */}
        <div className="hidden lg:flex lg:flex-grow w-[40%] relative bg-black border-r border-fuchsia-500/30 flex-col items-stretch overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-fuchsia-600/20 blur-[100px]" />
          <AuthHeader />
          
          {/* System Status readout at the bottom */}
          <div className="mt-auto p-8 border-t border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3 text-fuchsia-500/50">
              <ShieldAlert size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Secure Connection Established</span>
            </div>
          </div>
        </div>

        {/* Right Column: Content (The Interface) */}
        <div className="flex-grow h-full bg-[#0a0a0c] relative flex flex-col">
          {/* Top Bar for Desktop */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
          
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 z-20 text-slate-500 hover:text-fuchsia-400 hover:rotate-90 transition-all duration-300 p-2"
            aria-label="Close Authentication Interface"
          >
            <X size={24} />
          </button>
          
          <div className="flex-grow overflow-y-auto flex flex-col custom-scrollbar">
            <div className="max-w-md mx-auto my-auto p-12 w-full animate-in fade-in slide-in-from-right-4 duration-700">
              {children}
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
             <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-fuchsia-500/20 w-8 h-8 rounded-br-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModalWrapper;