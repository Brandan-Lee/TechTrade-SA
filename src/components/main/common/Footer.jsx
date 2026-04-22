import React from "react";
import { ShieldCheck, Lock, Globe, Zap, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    const steps = [
        { id: 1, label: "Available" },
        { id: 2, label: "Offered" },
        { id: 3, label: "Pending" },
        { id: 4, label: "Committed" },
        { id: 5, label: "Sold" }
    ];

    const securityIcons = [
        { label: "TLS 1.3", icon: <ShieldCheck className="w-7 h-7" /> },
        { label: "Argon2id", icon: <Lock className="w-7 h-7" /> },
        { label: "Ghost Protocol", icon: <Globe className="w-7 h-7" /> }
    ];

    const navigationLinks = [
        { name: "About Us", path: "/about" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Contact Support", path: "/contact" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Marketplace", path: "/market" },
        { name: "Sell your Gear", path: "/sell" },
        { name: "Build Doctor", path: "/build-doctor" },
        { name: "Login/Register", path: "/login" },
        { name: "Contact Us", path: "/contact" },
    ];

    return (
        <footer className="w-full bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 border-t-4 border-pink-600 font-inter">
            {/* Escrow Process Section */}
            <section className="w-full py-10 px-4 text-white">
                <div className="max-w-[1200px] mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-2 italic">5-Step Escrow Process</h2>
                    <p className="text-purple-100/80 mb-10 text-lg">Every transaction is fully protected</p>

                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-0">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-14 h-14 rounded-xl font-black text-xl flex items-center justify-center bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 shadow-[0_0_20px_rgba(219,39,119,0.3)] border border-pink-300/30`}>
                                        {step.id}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest mt-1">
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`hidden md:block w-16 h-[2px] mx-4 mb-8 bg-gradient-to-r from-pink-500/50 to-transparent`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nuke Suite Monitoring Bar */}
            <div className={`w-full py-5 px-4 shadow-inner bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600`}>
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
                    <ShieldAlert className="text-white w-7 h-7 animate-pulse" />
                    <div className="text-center md:text-left">
                        <span className="block text-white font-black text-xl tracking-tighter leading-none">NUKE SUITE™ ACTIVE</span>
                        <span className="text-white/90 text-sm font-bold uppercase tracking-tighter">Real-time threat monitoring and fraud detection</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/20">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
                        <span className="text-white text-[10px] font-black tracking-widest">LIVE</span>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <section className="w-full pt-16 pb-8 px-4 text-white">
                <div className="max-w-[1200px] mx-auto">
                    {/* Security Protocols */}
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-16">
                        {securityIcons.map((item) => (
                            <div key={item.label} className="flex flex-col items-center gap-4 group cursor-help">
                                <div className={`w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center bg-gradient-to-br from-pink-600 via-pink-500 to-pink-600 transform transition-transform group-hover:scale-110 border border-pink-400/20`}>
                                    <div className="text-white">
                                        {item.icon}
                                    </div>
                                </div>
                                <span className="font-black text-sm tracking-widest text-pink-100">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Links */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center border-t-2 border-b-2 border-pink-500/20 py-8 mb-10`}>
                    {navigationLinks.map((link) => (
                        <Link key={link.name}
                            to={link.path}
                            className="text-sm font-bold uppercase tracking-tight hover:text-pink-400 transition-colors py-2"
                        >
                            {link.name}
                        </Link>
                    ))}       
                </div>

                {/* Branding and Copyright */}
                <div className="flex flex-col items-center gap-6 border-t-4 border-pink-600">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-40 rounded-full" />
                            <img src="/logo.png" alt="TechTrade SA Logo" className="w-10 h-10 lg:w-16 lg:h-16 object-contain" />
                        </div>
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase">TechTrade SA</h3>
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-white text-[10px] font-medium">&copy; 2026 TechTrade SA. All Rights Reserved.</p>
                    </div>
                </div>

            </section>
        </footer>
    )
}