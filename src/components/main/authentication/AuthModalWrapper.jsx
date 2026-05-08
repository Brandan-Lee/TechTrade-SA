import React, { useState, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";
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

  //Mobile & Tablet Full Screen
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[300] bg-neutral-100 flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="relative flex-shrink-0">
          {showBackButton && (
            <button
              onClick={onBack || onClose}
              className="absolute top-6 left-6 z-[310] text-white/80 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          <AuthHeader />
        </div>
        <div className="flex-grow p-8 overflow-y-auto flex flex-col">
          <div className="max-w-md mx-auto my-auto p-8 w-full">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Modal
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-violet-950/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative flex w-full max-w-5xl h-[768px] max-h-[1024px] bg-neutral-100 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Left Column: Branding (Static) */}
        <div className="hidden lg:flex lg:flex-grow w-1/3 bg-violet-800 border-r-4 border-pink-600 flex-col items-stretch overflow-hidden">
          <AuthHeader />
        </div>

        {/* Right Column: Form (Scrollable) */}
        <div className="flex-grow h-full bg-white relative flex flex-col">
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 z-10 text-purple-600 hover:text-pink-800 hover:scale-[1.5] transition-all"
          >
            <X size={28} />
          </button>
          
          <div className="flex-grow overflow-y-auto flex flex-col">
            <div className="max-w-md mx-auto my-auto p-12 w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModalWrapper;