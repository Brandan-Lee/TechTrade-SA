import React from "react";
import { Cpu, ShieldCheck, Lock } from 'lucide-react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Pillars() {
    const pillars = [
        {
            title: "Hardware Intelligence",
            desc: "We utilize data-driven insights to verify device specifications and market value, protecting you from 'lemon' hardware.",
            icon: <Cpu className="w-8 h-8 text-violet-800" />
        },
        {
            title: "Managed Trust",
            desc: "Every user and listing is vetted through our multi-point negotiation hub to ensure integrity and authenticity.",
            icon: <ShieldCheck className="w-8 h-8 text-violet-800" />
        },
        {
            title: "Transactional Security",
            desc: "Military-grade escrow protocols with Argon2id encryption, ensuring zero-trust architecture for every transaction.",
            icon: <Lock className="w-8 h-8 text-violet-800" />
        }
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Delay between each card
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }} // Triggers slightly before it hits center screen
            variants={containerVariants}
            className="w-full bg-neutral-100 py-16 px-4 border-t-[3px] border-pink-600"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div variants={cardVariants} className="mb-12">
                    <h2 className="text-purple-600 text-3xl font-black uppercase italic tracking-tighter">
                        Our Pillars
                    </h2>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="p-8 bg-gradient-to-br from-violet-800 via-purple-600 to-violet-800 rounded-2xl shadow-xl flex flex-col gap-6 relative overflow-hidden group border border-white/10"
                        >
                            {/* Icon with glow effect */}
                            <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 rounded-xl z-10 shadow-[0_0_20px_rgba(219,39,119,0.4)]">
                                <div className="absulute inset-0 bg-pink-400 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="relative z-10">
                                    {pillar.icon}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-white text-2xl font-bold leading-tight">
                                    {pillar.title}
                                </h3>
                                <p className="text-white/80.text-sm.leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Navigation to Login */}
                <motion.div 
                    variants={cardVariants}
                    className="flex flex-col items-center justify-center gap-6 mt-8 w-full"
                >
                    <Link to='/login'
                        className="w-full sm:w-auto text-center px-10 py-4 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-md outline outline-2 outline-pink-600 hover:scale-105 transition-all text-white font-bold text-lg tracking-tight shadow-lg shadow-pink-500/10"
                    >
                        Register Now
                    </Link>

                    <p className="text-gray-400 text-[10px] sm:text-xs font-normal tracking-wide text-center">
                        Securing the South African Tech Landscape since 2026.
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
}