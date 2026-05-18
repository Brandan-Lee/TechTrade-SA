import { Calendar1, Cpu, MapPin, Quote, ShieldCheck, Trophy, Terminal } from "lucide-react";
import React, { useState } from "react";
import StatCard from "../../components/main/profile/StatCard";
import CyberActionButton from "../../components/ui/CyberActionButton";
import ActiveListingCard from "../../components/main/profile/ActiveListingCard";
import TradeHistoryCard from "../../components/main/profile/TradeHistoryCard";
import ReviewCard from "../../components/main/profile/ReviewCard";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("active");

    const reviews = [
        {
            id: 1,
            user: "Thabo M.",
            rating: 5,
            comment:
                "Excellent GPU condition. Transaction was seamless through the escrow system.",
            date: "12 May 2026",
        },
        {
            id: 2,
            user: "Sarah J.",
            rating: 5,
            comment:
                "Very knowledgeable about hardware specs. RAM was exactly as described.",
            date: "09 May 2026",
        },
    ];

    return (
        <div className="min-h-screen bg-[#050506] text-slate-300 pb-12 relative overflow-hidden">
            {/* Ambient Interface Matrix Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

            {/* HERO IDENTITY TERMINAL */}
            <section className="w-full bg-[#0c0c0e]/80 border-b border-white/5 pt-14 pb-16 px-4 flex flex-col items-center relative z-10 backdrop-blur-md">
                
                {/* Security Verified Avatar Frame */}
                <div className="relative">
                    <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-fuchsia-500/40 p-1 bg-black shadow-[0_0_30px_rgba(217,70,239,0.15)]">
                        <img
                            src="https://placehold.co/128"
                            alt="User Identity Portrait"
                            className="w-full h-full rounded-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                    {/* Floating Status Node */}
                    <div className="absolute bottom-1 right-1 bg-black border border-fuchsia-500 p-2 rounded-full shadow-lg shadow-fuchsia-500/20 text-fuchsia-400">
                        <ShieldCheck size={16} />
                    </div>
                </div>

                {/* Identity Metadata */}
                <div className="mt-6 text-center space-y-1.5">
                    <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-black uppercase font-mono tracking-tight">
                        Brandan-Lee James Sherbrooke
                    </h1>
                    <div className="flex items-center justify-center gap-1 text-slate-500 font-mono text-xs uppercase tracking-widest">
                        <MapPin size={12} className="text-fuchsia-500/60" />
                        <span>Gauteng</span>
                    </div>
                </div>

                {/* Cyber Integrity Telemetry Bar */}
                <div className="mt-8 w-full max-w-sm bg-black border border-white/10 p-3.5 rounded-xl shadow-2xl flex items-center justify-between font-mono relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-12 h-[1px] bg-fuchsia-500" />
                    
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-lg flex items-center justify-center text-fuchsia-400">
                            <Trophy size={16} />
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                                Trust Integrity
                            </p>
                            <p className="text-base font-black text-white tracking-tight">4.9 / 5.0</p>
                        </div>
                    </div>

                    <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 px-2.5 py-1 rounded text-fuchsia-400 font-bold text-[10px] md:text-xs tracking-wider">
                        24 TRADES
                    </div>
                </div>
            </section>

            {/* TELEMETRY MATRIX STATS */}
            <div className="max-w-4xl w-full mx-auto px-4 mt-8 grid grid-cols-3 gap-3 relative z-10">
                <StatCard
                    icon={<ShieldCheck className="text-fuchsia-400" size={16} />}
                    label="TOTAL TRADES"
                    value="14"
                />
                <StatCard
                    icon={<Quote className="text-fuchsia-400" size={16} />}
                    label="TOTAL REVIEWS"
                    value="8"
                />
                <StatCard
                    icon={<Calendar1 className="text-fuchsia-400" size={16} />}
                    label="SYS_ENTRY_DATE"
                    value="OCT 2025"
                />
            </div>

            {/* DATA LEDGERS & RECORD LOGS */}
            <main className="max-w-4xl w-full mx-auto px-4 mt-8 flex flex-col gap-8 relative z-10">
                <div className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                    {/* Interactive Tab Controller Matrix */}
                    <div className="flex bg-black border-b border-white/5 font-mono" role="tablist" aria-label="Profile Data Ledger">
                        <button
                            role="tab"
                            aria-selected={activeTab === "active"}
                            onClick={() => setActiveTab("active")}
                            className={`flex-1 py-4 font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 outline-none
                                ${activeTab === "active"
                                    ? "text-fuchsia-400 bg-white/[0.02] border-b-2 border-fuchsia-500 shadow-[inset_0_-10px_20px_rgba(217,70,239,0.03)]"
                                    : "text-slate-600 hover:text-slate-300 border-b-2 border-transparent"
                                }`}
                        >
                            Active Listings
                        </button>
                        <button
                            role="tab"
                            aria-selected={activeTab === "history"}
                            onClick={() => setActiveTab("history")}
                            className={`flex-1 py-4 font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 outline-none
                                ${activeTab === "history"
                                    ? "text-fuchsia-400 bg-white/[0.02] border-b-2 border-fuchsia-500 shadow-[inset_0_-10px_20px_rgba(217,70,239,0.03)]"
                                    : "text-slate-600 hover:text-slate-300 border-b-2 border-transparent"
                                }`}
                        >
                            Trade History
                        </button>
                    </div>

                    {/* Active Tab Panel Target Wrapper */}
                    <div className="p-4 md:p-6 flex flex-col gap-4 bg-transparent">
                        {activeTab === "active" ? (
                            <>
                                <ActiveListingCard
                                    title="NVIDIA RTX 3080 Ti Founders Edition"
                                    price="12,500"
                                    condition="Excellent"
                                    time="Posted 2 days ago"
                                    views="143"
                                    image="https://placehold.co/200"
                                />
                                <ActiveListingCard
                                    title="AMD Ryzen 9 7950X (Sealed)"
                                    price="9,800"
                                    condition="Brand New"
                                    time="Posted 5 days ago"
                                    views="98"
                                    image="https://placehold.co/200"
                                />
                            </>
                        ) : (
                            <>
                                <TradeHistoryCard
                                    title="ASUS ROG Strix RTX 3070"
                                    buyer="Thabo M."
                                    date="May 11, 2026"
                                    price="R8,500"
                                    status="COMPLETED"
                                />
                                <TradeHistoryCard
                                    title="Corsair Dominator 32GB DDR5"
                                    buyer="Sarah J."
                                    date="May 09, 2026"
                                    price="R3,200"
                                    status="IN PROGRESS"
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* USER TELEMETRY FEEDBACK LOGS */}
                <section className="space-y-4">
                    <h2 className="text-white text-base md:text-lg font-black uppercase font-mono tracking-[0.2em] flex items-center gap-2">
                        <span className="w-1 h-3 bg-fuchsia-500 inline-block shadow-[0_0_8px_#d946ef]" />
                        User Reviews
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} {...review} />
                        ))}
                    </div>
                </section>

                {/* DASHBOARD ACTION CONTROLS */}
                <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-white/5 pt-6">
                    <div className="w-full max-w-xs">
                        <CyberActionButton label="EDIT PROFILE" className="w-full" />
                    </div>

                    <button
                        type="button"
                        aria-label="Permanently terminate this network identity profile account link"
                        className="w-full max-w-xs h-12 md:h-14 rounded-xl border border-rose-500/30 bg-rose-500/[0.02] 
                            text-rose-400 font-mono font-black text-xs tracking-widest hover:bg-rose-500 
                            hover:text-white hover:border-rose-500 hover:shadow-[0_0_25px_rgba(244,63,94,0.25)] transition-all 
                            duration-300 uppercase active:scale-95 outline-none focus:ring-1 focus:ring-rose-500/40"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "CRITICAL WARNING: Are you sure you want to delete this profile? This action is permanent.",
                                )
                            ) {
                                console.log("Account deleted");
                            }
                        }}
                    >
                        Delete Profile
                    </button>
                </div>
            </main>
        </div>
    );
}