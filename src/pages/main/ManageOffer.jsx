import {
    AlertCircle,
    ArrowLeft,
    Clock,
    MapPin,
    MessageSquare,
    ShieldCheck,
    Star,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import CyberActionButton from "../../components/ui/CyberActionButton";
import AlternateButton from "../../components/ui/AlternateButton";

const ManageOffer = ({ openCounterModal }) => {
    const navigate = useNavigate();

    const handleViewListing = (e) => {
        e.stopPropagation();
        navigate(`/view-listing`);
    };

    const offerData = {
        itemTitle: "RTX 3080 Gaming OC",
        originalPrice: "R 12,500",
        offerPrice: "R 8,500.00",
        buyerName: "Thabo Mthembu",
        buyerRating: "4.9/5",
        buyerReviews: "27",
        buyerLocation: "Gauteng",
        memberSince: "Jan 2024",
        buyerNote: "Can collect this weekend if accepted.",
        timeReceived: "2 hours ago",
    };

    return (
        <div className="min-h-screen bg-[#07050e] text-slate-300 font-mono pb-16 selection:bg-fuchsia-500/30 select-none">
            {/* Top Navigation Bar */}
            <div className="w-full max-w-5xl mx-auto pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-purple-400 hover:text-fuchsia-400 transition-colors duration-200 mb-6 text-xs sm:text-sm font-bold tracking-wider uppercase"
                >
                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Station Terminal</span>
                </button>

                <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black tracking-wider uppercase mb-8 border-b border-purple-500/10 pb-4 flex items-center gap-3">
                    <span className="w-2 h-6 bg-fuchsia-500 rounded-sm" aria-hidden="true" />
                    Offer Broker Engine
                </h1>

                {/* Dashboard Terminal Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
                    
                    {/* Left Column Section: Hardware Core & Trader Credentials */}
                    <div className="md:col-span-5 flex flex-col gap-6">
                        
                        {/* Hardware Matrix Block */}
                        <div className="p-4 sm:p-5 bg-[#0d091a] border border-purple-500/20 rounded-xl shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
                            <div className="flex items-center gap-4 relative z-10">
                                <img
                                    src="https://placehold.co/150x150?text=GPU"
                                    alt={`Hardware listing thumbnail for ${offerData.itemTitle}`}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-purple-500/30 group-hover:border-fuchsia-500/50 transition-colors duration-300"
                                />
                                <div className="min-w-0">
                                    <h2 className="text-white text-sm sm:text-base lg:text-lg font-black tracking-wide truncate">
                                        {offerData.itemTitle}
                                    </h2>
                                    <div className="flex items-center flex-wrap gap-2.5 mt-1.5">
                                        <span className="text-slate-500 text-xs line-through font-medium">
                                            {offerData.originalPrice}
                                        </span>
                                        <span className="bg-purple-950/50 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold text-purple-400 uppercase tracking-widest">
                                            1 Incoming Vector
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Network Trader Credentials Card */}
                        <div className="p-6 bg-[#0d091a] border border-purple-500/20 rounded-xl shadow-lg flex flex-col items-center text-center relative group">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-b from-purple-500 to-fuchsia-500 shadow-md shadow-fuchsia-500/10">
                                    <img
                                        src="https://placehold.co/96x96"
                                        alt={`Network avatar file for ${offerData.buyerName}`}
                                        className="w-full h-full rounded-full object-cover border-2 border-[#0d091a]"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-[#130a24] border border-emerald-500/40 rounded-full flex items-center justify-center shadow-lg" title="Identity Verified">
                                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                                </div>
                            </div>

                            <h3 className="text-white text-base sm:text-lg font-black tracking-wide mb-1">
                                {offerData.buyerName}
                            </h3>

                            {/* Trust Rating Array */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-amber-400" aria-label={`Rating configuration: ${offerData.buyerRating}`}>
                                    {[...Array(4)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" aria-hidden="true" />
                                    ))}
                                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" aria-hidden="true" />
                                </div>
                                <span className="text-slate-400 text-xs font-semibold">
                                    {offerData.buyerRating} ({offerData.buyerReviews} logs)
                                </span>
                            </div>

                            <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] sm:text-xs font-black tracking-widest uppercase">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
                                Verified Node
                            </div>

                            {/* Geographical Metadata */}
                            <div className="w-full pt-4 border-t border-purple-500/10 flex items-center justify-between text-xs text-slate-400 px-2">
                                <div className="flex items-center gap-1">
                                    <MapPin size={12} className="text-purple-400" aria-hidden="true" />
                                    <span className="font-medium">{offerData.buyerLocation}</span>
                                </div>
                                <div className="text-right">
                                    <span className="opacity-60 text-[11px]">Synced {offerData.memberSince}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column Section: Data Vector Transmission & Actions */}
                    <div className="md:col-span-7 flex flex-col gap-6">
                        
                        {/* Transaction Bid Summary Panel */}
                        <div className="p-6 sm:p-8 bg-[#0a0615] border-2 border-purple-500/30 rounded-xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" aria-hidden="true" />
                            
                            <span className="text-purple-400 text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-80">
                                Transmitted Pricing Value
                            </span>

                            <div className="text-fuchsia-400 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight my-1 drop-shadow-[0_0_12px_rgba(217,70,239,0.2)]">
                                {offerData.offerPrice}
                            </div>

                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] sm:text-xs mt-2">
                                <Clock className="w-3 h-3 text-purple-500/60" aria-hidden="true" />
                                <span>Transmission window opened {offerData.timeReceived}</span>
                            </div>
                        </div>

                        {/* Associated Operator Context Note */}
                        <div className="p-4 bg-[#0d091a] border border-purple-500/10 rounded-xl flex gap-3.5 shadow-md">
                            <div className="w-8 h-8 rounded bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-400" aria-hidden="true">
                                <MessageSquare size={14} />
                            </div>
                            <div className="min-w-0">
                                <span className="text-slate-500 text-[10px] sm:text-xs font-black uppercase tracking-widest block mb-1">
                                    Inbound Context Attachment
                                </span>
                                <p className="text-slate-300 text-xs sm:text-sm font-medium italic leading-relaxed">
                                    &ldquo;{offerData.buyerNote}&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* Interactive Execution Layout Controls */}
                        <div className="flex flex-col gap-4 mt-2">
                            {/* Positive Action Array */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CyberActionButton 
                                    label="ACCEPT PIPELINE" 
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20"
                                />
                                <AlternateButton
                                    label="COUNTER PROPOSAL"
                                    onClick={openCounterModal}
                                    className="border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500/10"
                                />
                            </div>

                            {/* Secondary Administrative Paths */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <AlternateButton 
                                    onClick={handleViewListing}
                                    label="INSPECT LISTING CORE"
                                    className="border-purple-500/20 text-slate-400 hover:text-white"
                                />
                                <CyberActionButton 
                                    label="TERMINATE BID" 
                                    className="bg-[#170a11] border border-rose-500/30 text-rose-400 hover:bg-rose-950/30"
                                />
                            </div>

                            {/* Structural Risk Compliance Notice */}
                            <div className="p-4 bg-[#140b18] rounded-xl border border-fuchsia-500/20 flex gap-3.5 shadow-inner mt-4">
                                <AlertCircle className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5 animate-pulse" aria-hidden="true" />
                                <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                                    Initiating verification authorization locks this core asset container and automatically maps the transaction parameters into the <strong className="text-fuchsia-400 font-bold">Escrow State Machine</strong> array alongside a temporary secure communication route.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageOffer;