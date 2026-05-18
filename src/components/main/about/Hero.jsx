import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe } from "lucide-react";
import HeroImage from "../../../assets/hero.png";

export default function Hero() {
    return (
        <section className="relative w-full h-[500px] sm:h-[600px] lg:h-[750px] overflow-hidden bg-[#0a0a0c] ">
            {/* Background Layer: Image + Dark Overlay + Cyber-Grid */}
            <div className="absolute inset-0 z-0">
                <img
                    src={HeroImage}
                    alt="TechTrade Network Hub"
                    className="w-full h-full object-cover mix-blend-luminosity scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/60 via-[#0a0a0c] to-[#0a0a0c] opacity-60" />
                {/* Subtle Digital Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center">
                
                {/* Status Indicator */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-6"
                >
                    <div className="flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400">
                            Nuke Suite Online
                        </span>
                    </div>
                </motion.div>

                <div className="max-w-4xl space-y-6">
                    {/* Main Heading */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-100 font-black italic uppercase tracking-tighter text-4xl sm:text-6xl lg:text-8xl leading-[0.9]"
                    >
                        Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">Trade.</span>
                        <br />
                        Managed <span className="text-white">Trust.</span>
                    </motion.h1>

                    {/* Cyber Accent Line */}
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "80px" }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-2 bg-fuchsia-600 rounded-full shadow-[0_0_20px_rgba(219,39,119,0.8)]"
                    />

                    {/* Subtext */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-white font-bold max-w-lg text-lg sm:text-xl lg:text-2xl leading-relaxed border-l-2 border-slate-800 pl-6"
                    >
                        South Africa's premier destination for secure high-end hardware exchange. 
                        Professionalizing the second-hand market.
                    </motion.p>
                </div>

                {/* Technical Badges - Floating UX feature */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="grid grid-cols-2 md:flex gap-4 md:gap-8 mt-12"
                >
                    <div className="flex items-center gap-3 text-slate-500 hover:text-fuchsia-400 transition-colors">
                        <ShieldCheck size={20} />
                        <span className="text-xs text-white font-black uppercase tracking-widest">Escrow Protected</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 hover:text-violet-400 transition-colors">
                        <Zap size={20} />
                        <span className="text-xs text-white font-black uppercase tracking-widest">Instant Audit</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 hover:text-blue-400 transition-colors">
                        <Globe size={20} />
                        <span className="text-xs text-white font-black uppercase tracking-widest">ZA Nationwide</span>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0c] to-transparent z-20" />
        </section>
    );
}