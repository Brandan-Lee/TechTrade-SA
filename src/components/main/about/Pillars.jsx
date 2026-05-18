import React from "react";
import { Cpu, ShieldCheck, Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import CyberActionButton from "../../ui/CyberActionButton";

export default function Pillars({ onOpenLogin }) {
    const pillars = [
        {
            title: "Hardware Intelligence",
            desc: "Data-driven verification of device specifications and market value, neutralizing 'lemon' hardware threats.",
            icon: <Cpu className="w-8 h-8 text-fuchsia-400" />,
            glow: "group-hover:shadow-[0_0_30px_rgba(192,38,211,0.4)]",
        },
        {
            title: "Managed Trust",
            desc: "Every node and listing is vetted through our multi-point negotiation hub to ensure absolute integrity.",
            icon: <ShieldCheck className="w-8 h-8 text-fuchsia-400" />,
            glow: "group-hover:shadow-[0_0_30px_rgba(192,38,211,0.4)]",
        },
        {
            title: "Transactional Security",
            desc: "Military-grade escrow with Argon2id encryption, built on a zero-trust architecture for total safety.",
            icon: <Lock className="w-8 h-8 text-fuchsia-400" />,
            glow: "group-hover:shadow-[0_0_30px_rgba(192,38,211,0.4)]",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
    };

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="w-full bg-[#0a0a0c] py-24 px-4 relative overflow-hidden"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50" />
            
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div variants={cardVariants} className="mb-16 text-center md:text-left">
                    <h2 className="text-white text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">Core Pillars</span>
                    </h2>
                    <div className="h-1 w-20 bg-fuchsia-600 mt-4 rounded-full" />
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] border-1 border-white"
                        >
                            {/* Animated Border Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-fuchsia-500/20 group-hover:to-fuchsia-500/50 transition-all duration-500" />
                            
                            <div className="relative h-full p-8 bg-[#121214] rounded-2xl flex flex-col gap-6">
                                {/* Icon Frame */}
                                <div className={`relative w-14 h-14 flex items-center justify-center bg-violet-950/40 border border-violet-500/30 rounded-xl transition-all duration-500 ${pillar.glow}`}>
                                    <div className="absolute inset-0 bg-fuchsia-500/10 blur-sm rounded-xl" />
                                    <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                                        {pillar.icon}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-slate-100 text-xl font-black uppercase tracking-tight group-hover:text-fuchsia-400 transition-colors">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                                        {pillar.desc}
                                    </p>
                                </div>

                                {/* Subtle corner accent */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="text-fuchsia-500 w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Navigation Action */}
                <motion.div
                    variants={cardVariants}
                    className="flex flex-col items-center gap-8 mt-12"
                >
                    <div className="w-full max-w-sm transform hover:scale-105 transition-transform duration-300">
                        <CyberActionButton
                            label="GET STARTED NOW"
                            onClick={onOpenLogin}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-px w-8 bg-slate-800" />
                        <p className="text-slate-500 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">
                            Secure Network Established 2026
                        </p>
                        <div className="h-px w-8 bg-slate-800" />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}