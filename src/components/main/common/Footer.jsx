import React from "react";
import {
    ShieldCheck,
    Lock,
    Globe,
    ShieldAlert,
    ChevronRight,
    Zap,
    Cpu,
    Database,
    Network
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

export default function Footer({ onLoginClick, onTOSClick, onDataClick }) {
    const steps = [
        { id: 1, label: "Available" },
        { id: 2, label: "Offered" },
        { id: 3, label: "Pending" },
        { id: 4, label: "Committed" },
        { id: 5, label: "Sold" },
    ];

    const securityIcons = [
        { label: "TLS 1.3", icon: <ShieldCheck className="w-5 h-5" /> },
        { label: "Argon2id", icon: <Lock className="w-5 h-5" /> },
        { label: "Ghost Protocol", icon: <Globe className="w-5 h-5" /> },
    ];

    const navigationLinks = [
        { name: "About Us", path: "/about" },
        { name: "Privacy Policy", isModal: true },
        { name: "Terms of Service", isModal: true },
        { name: "Marketplace", path: "/marketplace" },
        { name: "Sell your Gear", path: "/sell" },
        { name: "Build Doctor", path: "/build-doctor" },
        { name: "Login/Register", isModal: true },
        { name: "Contact Us", path: "/contact-us" },
    ];

    return (
        <footer className="w-full bg-[#050505] border-t border-white/10 font-['Inter'] overflow-hidden">
            
            {/* 1. High-Tech Escrow Timeline */}
            <section className="w-full py-16 px-4 bg-[#0a0a0c] border-b border-white/5 relative">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full mb-6">
                        <Zap size={14} className="text-fuchsia-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400">
                            Secure Pipeline
                        </span>
                    </div>
                    <h2 className="text-white text-3xl md:text-5xl font-black mb-12 uppercase italic tracking-tighter">
                        5-Step <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">Escrow Protocol</span>
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-4 items-start">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center group relative">
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-7 left-1/2 w-full h-[1px] bg-gradient-to-r from-fuchsia-500/30 to-transparent z-0" />
                                )}
                                <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#121214] border-2 border-fuchsia-500/30 group-hover:border-fuchsia-500 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all duration-300 flex items-center justify-center mb-4">
                                    <span className="text-white font-black text-xl italic">{step.id}</span>
                                </div>
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors text-center px-2">
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Nuke Suite™ Alert Bar */}
            <div className="w-full py-5 px-4 bg-gradient-to-r from-[#1a0b2e] to-[#0a0a0c] border-y border-fuchsia-500/20 relative">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <ShieldAlert className="text-fuchsia-500 w-8 h-8 animate-pulse" />
                            <div className="absolute inset-0 bg-fuchsia-500/20 blur-xl rounded-full"></div>
                        </div>
                        <div>
                            <span className="block text-white font-black text-lg tracking-tight uppercase leading-none">Nuke Suite™ Active</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-fuchsia-500/10 px-4 py-2 rounded-xl border border-fuchsia-500/20">
                            <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-ping" />
                            <span className="text-fuchsia-400 text-[10px] font-black tracking-[0.2em]">ENCRYPTED LIVE FEED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Navigation & Branding */}
            <section className="w-full pt-20 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Updated grid: Now triggers 2 columns at 'sm' (640px) to accommodate iPads at 768px */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
                        
                        {/* Brand Column */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="flex items-center gap-4">
                                <img src={logo} alt="TechTrade Logo" className="w-12 h-12 object-cover" />
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                                    TechTrade <span className="text-fuchsia-500">SA</span>
                                </h3>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                                Professionalizing the second-hand hardware market through 
                                hardware intelligence and zero-trust transactional state machines.
                            </p>
                            <div className="flex gap-4">
                                {securityIcons.map((item) => (
                                    <div key={item.label} title={item.label} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 transition-all cursor-help">
                                        {item.icon}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Links Column - Fixed for Tablet/iPad */}
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {navigationLinks.map((link) => (
                                <div key={link.name} className="flex">
                                    {link.isModal ? (
                                        <button
                                            onClick={() => {
                                                if (link.name === "Login/Register") onLoginClick();
                                                else if (link.name === "Terms of Service") onTOSClick();
                                                else onDataClick();
                                            }}
                                            className="group flex items-center gap-2 text-slate-400 hover:text-white text-[13px] font-black uppercase tracking-widest transition-all text-left"
                                        >
                                            <ChevronRight size={14} className="text-fuchsia-500 opacity-0 sm:group-hover:opacity-100 -ml-4 sm:group-hover:ml-0 transition-all shrink-0" />
                                            {link.name}
                                        </button>
                                    ) : (
                                        <Link
                                            to={link.path}
                                            className="group flex items-center gap-2 text-slate-400 hover:text-white text-[13px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <ChevronRight size={14} className="text-violet-500 opacity-0 sm:group-hover:opacity-100 -ml-4 sm:group-hover:ml-0 transition-all shrink-0" />
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                        <div className="flex items-center gap-4">
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                &copy; 2026 TechTrade SA • Secure Node ZA-01
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Database size={12} />
                                <span className="text-[9px] font-mono">0x7741_TT_SAFE</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <Cpu size={12} />
                                <span className="text-[9px] font-mono">ENCRYPT_AES_256</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
}