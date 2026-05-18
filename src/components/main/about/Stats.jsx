import React from "react";
import { LayoutGrid, ShieldCheck, Banknote, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Stats() {
    const stats = [
        {
            label: "Active Listings",
            value: "12K+",
            icon: <LayoutGrid className="w-5 h-5" />,
            accent: "from-fuchsia-500/20",
        },
        {
            label: "Trust Score",
            value: "98.7%",
            icon: <ShieldCheck className="w-5 h-5" />,
            accent: "from-violet-500/20",
        },
        {
            label: "ZAR Secured",
            value: "5.2M",
            icon: <Banknote className="w-5 h-5" />,
            accent: "from-purple-500/20",
        },
    ];

    return (
        <section className="w-full py-16 px-4 bg-[#0a0a0c] relative overflow-hidden">
            {/* Top scanning line decorative element */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
            
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative flex-1 group"
                        >
                            {/* Card Glow Background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                            
                            <div className="relative h-full px-6 py-8 bg-[#121214] border border-white group-hover:border-fuchsia-500/30 rounded-2xl flex flex-col items-center gap-3 shadow-2xl transition-all">
                                
                                {/* Icon Header */}
                                <div className="p-3 bg-white/5 rounded-xl text-fuchsia-400 mb-2 border border-white/5 group-hover:border-fuchsia-500/50 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all">
                                    {stat.icon}
                                </div>

                                {/* Value */}
                                <div className="flex flex-col items-center">
                                    <span className="text-white text-3xl md:text-4xl font-black italic tracking-tighter leading-none">
                                        {stat.value}
                                    </span>
                                    
                                    {/* Sub-indicator */}
                                    <div className="flex items-center gap-1 mt-2">
                                        <Activity size={10} className="text-fuchsia-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                            Live Pulse
                                        </span>
                                    </div>
                                </div>

                                {/* Label */}
                                <div className="mt-2 text-slate-400 text-[11px] font-bold uppercase tracking-[0.25em] text-center border-t border-white/5 pt-4 w-full">
                                    {stat.label}
                                </div>

                                {/* Corner Decorative Bit */}
                                <div className="absolute top-2 right-2 w-1 h-1 bg-fuchsia-500/30 rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom scanning line decorative element */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        </section>
    );
}