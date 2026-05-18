import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, Radio } from "lucide-react";
import IntelSection from "../../components/main/sell/IntelSection";
import GallerySection from "../../components/main/sell/GallerySection";
import ContextSection from "../../components/main/sell/ContextSection";
import CyberActionButton from "../../components/ui/CyberActionButton";

export default function SellGear() {
    const [formData, setFormData] = useState({
        category: "",
        name: "",
        condition: "",
        description: "",
        images: [],
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full min-h-screen bg-[#050505] text-slate-300 relative overflow-x-hidden"
        >
            {/* Background Aesthetic Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* HEADER SECTION */}
            <header className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-12 pb-8 relative z-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
                        New <span className="text-fuchsia-500">Listing</span>
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-fuchsia-600 to-transparent mt-4" />
                </div>
            </header>

            {/* MAIN CONTENT GRID */}
            <main className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Intelligence & Context (Span 7) */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <section className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Cpu className="text-fuchsia-400" size={20} />
                                <h2 className="text-sm font-black uppercase tracking-widest text-white">Item Intelligence</h2>
                            </div>
                            <IntelSection formData={formData} setFormData={setFormData} />
                        </section>

                        {/* Desktop Context */}
                        <div className="hidden lg:block bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-sm">
                             <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="text-fuchsia-400" size={20} />
                                <h2 className="text-sm font-black uppercase tracking-widest text-white">Commercial Context</h2>
                            </div>
                            <ContextSection formData={formData} setFormData={setFormData} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Hardware Gallery & Finalize (Span 5) */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <section className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-sm">
                            <GallerySection formData={formData} setFormData={setFormData} />
                        </section>

                        {/* Mobile Context ONLY */}
                        <div className="lg:hidden bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-sm">
                            <ContextSection formData={formData} setFormData={setFormData} />
                        </div>

                        {/* ACTION PANEL */}
                        <div className="flex flex-col items-center gap-6 p-8 bg-fuchsia-600/5 border border-fuchsia-500/20 rounded-3xl relative overflow-hidden group">
                            {/* Decorative scanline */}
                            <div className="absolute inset-0 w-full h-[1px] bg-fuchsia-500/20 animate-scan pointer-events-none" />
                            
                            <div className="w-full">
                                <CyberActionButton 
                                    label="PUBLISH TO TECHTRADE" 
                                    className="w-full text-lg py-6"
                                />
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                    <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed">
                                        Listing undergoes <span className="text-emerald-400">verification protocols</span>. 
                                        Funds secured via TechTrade Escrow.
                                    </p>
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono text-center uppercase tracking-tighter">
                                    Status: Encrypted_Session_Active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Custom Animation Styles */}
            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(400%); }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
            `}</style>
        </motion.div>
    );
}