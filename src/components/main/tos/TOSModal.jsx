import React from "react";
import BaseModal from "../../ui/BaseModal";
import {
    AlertCircle,
    AlertTriangle,
    CircleCheck,
    MessageSquare,
    ShieldAlert,
    ShieldCheck,
    UserX,
    Clock,
} from "lucide-react";
import { ProtocolSection } from "./ProtocolSection";
import { GradientHighlightBox } from "./GradientHighlightBox";
import { StrikeCard } from "./StrikeCard";
import CyberActionButton from "../../ui/CyberActionButton";

const TOSModal = ({ isOpen, onClose }) => {
    const lastUpdated = "13 May 2026";
    const docVersion = "1.0";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Terms Of Service"
            icon={<ShieldCheck className="w-4 h-4 text-fuchsia-400" />}
            footerText={`v${docVersion} | System Registry: ${lastUpdated}`}
            centerContent={false}
        >
            <div className="flex flex-col gap-10 sm:gap-14 py-4 max-w-2xl mx-auto px-1 select-none font-mono selection:bg-fuchsia-500/30">
                
                {/* Intro/Hero Core Core Warning Block */}
                <div className="relative overflow-hidden bg-[#0d0915] border-l-2 border-fuchsia-500 p-4 sm:p-5 rounded-r-lg shadow-md shadow-black/40">
                    <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed relative z-10 font-medium">
                        These protocols are legally binding and constitute the operational framework of 
                        <span className="font-black text-fuchsia-400 ml-1.5 tracking-wider">TECHTRADE SA</span>. 
                        By using this platform, you agree to comply with all outlined subsystems, safeguards, and procedures.
                    </p>
                    <div className="absolute top-[-20%] right-[-5%] opacity-[0.02] pointer-events-none" aria-hidden="true">
                        <ShieldCheck size={140} className="text-purple-500" />
                    </div>
                </div>

                {/* Escrow System Panel Section */}
                <ProtocolSection
                    title="The Escrow Protocol"
                    icon={<ShieldCheck className="text-fuchsia-400" size={16} />}
                >
                    <div className="space-y-5">
                        <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs md:text-sm font-medium">
                            When a transaction is initiated, both the buyer's funds and the seller's hardware enter a
                            <span className="mx-1.5 px-2 py-0.5 bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-[10px] sm:text-xs font-black rounded uppercase tracking-widest">
                                Locked State
                            </span>
                            within our secure escrow ecosystem. This ensures neither party can unilaterally withdraw without platform consensus or formal mediation.
                        </p>

                        {/* Conditions Sub-Matrix Element */}
                        <div className="bg-[#0c0915] rounded-lg p-4 sm:p-5 border border-purple-500/20 shadow-md">
                            <h4 className="font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] text-purple-400 mb-4 flex items-center gap-2">
                                <Clock size={12} className="text-purple-400 animate-pulse" /> Conditions For Release
                            </h4>
                            <ol className="grid grid-cols-1 gap-4 sm:gap-5 list-none">
                                {[
                                    {
                                        id: "01",
                                        t: "Buyer Confirmation",
                                        d: "Upon inspection, the buyer must confirm receipt within 24 hours to trigger release functions.",
                                    },
                                    {
                                        id: "02",
                                        t: "Seller Protection",
                                        d: "Auto-release matrices execute if the validation window expires without an active dispute.",
                                    },
                                    {
                                        id: "03",
                                        t: "Dispute Resolution",
                                        d: "Command & Control reviews all communication logs and encrypted photographic evidence.",
                                    },
                                    {
                                        id: "04",
                                        t: "Mutual Cancellation",
                                        d: "Full balance restoration to buyer and item listing recovery upon verified mutual agreement.",
                                    },
                                ].map((item) => (
                                    <li key={item.id} className="flex gap-3.5 group items-start">
                                        <span className="text-fuchsia-500/50 font-black text-xs sm:text-sm group-hover:text-fuchsia-400 transition-colors leading-none pt-0.5">
                                            {item.id}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-0.5">
                                                {item.t}
                                            </p>
                                            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                                                {item.d}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Stylized Section Break Divider */}
                        <div className="flex items-center gap-3 px-1 py-2" aria-hidden="true">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
                            <p className="text-[9px] sm:text-[10px] text-slate-600 font-bold uppercase tracking-[0.25em]">
                                Cryptographic Ledger Feed
                            </p>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* WhatsApp TTL Bridge Section */}
                <ProtocolSection
                    title="The WhatsApp TTL Bridge"
                    icon={<MessageSquare className="text-fuchsia-400" size={16} />}
                >
                    <div className="space-y-6">
                        <GradientHighlightBox
                            title="24-HOUR TIME-TO-LIVE PRIVACY WINDOW"
                            icon={<MessageSquare size={14} />}
                        >
                            Once a transaction is confirmed, a temporary encrypted WhatsApp bridge is established. This data channel exists for exactly 24 hours. After the TTL expires, the interface is destroyed and all contact info is permanently removed from runtime arrays.
                        </GradientHighlightBox>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 px-1">
                            {[
                                {
                                    t: "Automatic Activation",
                                    d: "Activates immediately upon peer trading validation.",
                                },
                                {
                                    t: "Encrypted Channel",
                                    d: "Routed through secure relays to hide host phone arrays.",
                                },
                                {
                                    t: "Self-Destruct Timer",
                                    d: "Live countdown telemetry visible to both network nodes.",
                                },
                                {
                                    t: "Zero Data Retention",
                                    d: "Only tracking metadata is signed for conflict mitigation.",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="relative pl-3.5 border-l border-purple-500/20 hover:border-fuchsia-500/50 transition-colors"
                                >
                                    <p className="font-black text-xs sm:text-sm text-fuchsia-400 uppercase mb-1 tracking-wider">
                                        {item.t}
                                    </p>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                                        {item.d}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ProtocolSection>

                {/* Integrity & Penalties Section */}
                <ProtocolSection
                    title="Integrity and Ban System"
                    icon={<AlertTriangle className="text-amber-400" size={16} />}
                >
                    <div className="space-y-5">
                        <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs md:text-sm font-medium">
                            TechTrade operates a 
                            <span className="font-black text-red-400 mx-1.5 underline decoration-red-500/40 underline-offset-4 tracking-wide uppercase">
                                Zero-Tolerance Strike System
                            </span> 
                            enforced through hardware-level identification (HWID) to safeguard our distributed marketplace ecosystems.
                        </p>

                        <div className="flex flex-col gap-3">
                            <StrikeCard
                                title="Strike 1: Warning"
                                description="Minor infractions like late logistics processing or unresponsive communication lines. Account profile flagged."
                                variant="warning"
                                icon={<AlertCircle />}
                            />
                            <StrikeCard
                                title="Strike 2: Suspension"
                                description="Misrepresented asset descriptions or consecutive customer complaints. 30-day structural lock out."
                                variant="danger"
                                icon={<ShieldAlert />}
                            />
                            <StrikeCard
                                title="Strike 3: HWID Permanent Ban"
                                description="Confirmed fraud vectors or escrow routing bypass. Full physical device lockout from network clusters."
                                variant="critical"
                                icon={<UserX />}
                            />
                        </div>

                        {/* Integration Sub-Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                            <div className="flex items-start gap-3 p-4 bg-[#0c0915] border border-purple-500/20 rounded-lg shadow-sm">
                                <div className="w-6 h-6 rounded bg-purple-950/30 border border-purple-500/30 flex justify-center items-center shrink-0 text-fuchsia-400" aria-hidden="true">
                                    <ShieldCheck size={14} />
                                </div>
                                <div className="min-w-0">
                                    <span className="font-black text-xs text-white block mb-0.5 uppercase tracking-wider">
                                        Build-Doctor Sync
                                    </span>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                                        High-value items <span className="text-fuchsia-400 font-bold font-mono">Over R5,000</span> require hardware verification scans.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-[#0c0915] border border-purple-500/20 rounded-lg shadow-sm">
                                <div className="w-6 h-6 rounded bg-amber-950/30 border border-amber-500/30 flex justify-center items-center shrink-0 text-amber-400" aria-hidden="true">
                                    <AlertTriangle size={14} />
                                </div>
                                <div className="min-w-0">
                                    <span className="font-black text-xs text-white block mb-0.5 uppercase tracking-wider">
                                        Fraud Assessment
                                    </span>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                                        Verified infraction logs result in swift arbitration sweeps and defensive strike penalties.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* Hardware Verification Section */}
                <ProtocolSection
                    title="Hardware Verification"
                    icon={<CircleCheck className="text-emerald-400" size={16} />}
                >
                    <div className="space-y-5">
                        <div className="bg-[#0a1410] border border-emerald-500/20 rounded-lg p-3.5 shadow-inner">
                            <p className="text-slate-300 text-[11px] sm:text-xs md:text-sm leading-relaxed font-medium">
                                We aggregate automated 
                                <span className="font-black tracking-wider text-emerald-400 uppercase mx-1.5">
                                    Hardware Intelligence
                                </span> 
                                metrics for telemetry arrays, but this is engineered to support, not substitute, system end-user due diligence.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] text-purple-400 px-1">
                                User Responsibility Matrix
                            </h4>
                            <ul className="space-y-3.5 list-none">
                                {[
                                    {
                                        t: "Physical Inspection",
                                        d: "Buyers must carefully evaluate hardware variables during both meetup checkups and the initial 48-hour post-receipt window.",
                                    },
                                    {
                                        t: "Build Doctor Validation",
                                        d: "For premium items exceeding R5,000, running real-time diagnostics parameters during exchanges is highly advised.",
                                    },
                                    {
                                        t: "Dispute Window",
                                        d: "Users maintain an immutable 48-hour post-transaction window to log standard arbitration tickets accompanied by explicit system data logs.",
                                    },
                                    {
                                        t: "Platform Limitations",
                                        d: "TechTrade cannot guarantee structural performance timelines or component life cycles beyond provided point-in-time automated checks.",
                                    },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="h-4 w-4 rounded border border-purple-500/30 bg-purple-950/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-fuchsia-400 transition-colors" aria-hidden="true">
                                            <div className="h-1.5 w-1.5 bg-purple-500 group-hover:bg-fuchsia-400 rounded-sm transition-colors"></div>
                                        </div>
                                        <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                                            <span className="font-black text-white uppercase tracking-wider mr-1.5">
                                                {item.t}:
                                            </span>
                                            {item.d}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </ProtocolSection>

                {/* Technical System Core Action Footer Block */}
                <div className="mt-4 pt-6 border-t border-purple-500/10">
                    <div className="max-w-md mx-auto text-center space-y-6">
                        <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed font-medium tracking-wide italic px-4">
                            "Final hardware confirmation rests entirely with the interface operators; TechTrade SA operates as a peer matching facilitator, not a transaction guarantor."
                        </p>

                        <div className="space-y-5">
                            <div className="inline-flex w-full justify-center">
                                <CyberActionButton
                                    label="ACKNOWLEDGE & TERMINATE PROTOCOL"
                                    onClick={onClose}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default TOSModal;