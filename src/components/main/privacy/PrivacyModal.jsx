import React from "react";
import BaseModal from "../../ui/BaseModal";
import { ProtocolSection } from "../tos/ProtocolSection";
import { AlertCircle, Cookie, Lock, Scale, ShieldCheck, Zap } from "lucide-react";

const PrivacyModal = ({ isOpen, onClose }) => {
    const lastUpdated = "13 May 2026";
    const docVersion = "1.0";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Data Integrity and Privacy"
            icon={<ShieldCheck className="w-4 h-4 text-fuchsia-400" />}
            footerText={`v${docVersion} | Core Security Sync: ${lastUpdated}`}
            centerContent={false}
        >
            <div className="flex flex-col gap-10 py-4 max-w-2xl mx-auto px-1 select-none font-mono selection:bg-fuchsia-500/30">
                
                {/* Encryption Engine Section */}
                <ProtocolSection
                    title="The Encryption Engine"
                    icon={<Lock className="text-fuchsia-400" size={16} />}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        {/* AES Card */}
                        <div className="p-4 sm:p-5 bg-[#0c0915] border border-emerald-500/20 rounded-lg shadow-md flex flex-col transition-all duration-300 hover:border-emerald-500/40 group">
                            <h4 className="font-black text-xs sm:text-sm text-emerald-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-sm bg-emerald-500 group-hover:animate-pulse" aria-hidden="true" />
                                AES-256 System
                            </h4>
                            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                                All personal database files and Build Doctor profiles are fully encrypted using military-grade AES-256 standard frameworks.
                            </p>
                        </div>

                        {/* TLS Card */}
                        <div className="p-4 sm:p-5 bg-[#0c0915] border border-blue-500/20 rounded-lg shadow-md flex flex-col transition-all duration-300 hover:border-blue-500/40 group">
                            <h4 className="font-black text-xs sm:text-sm text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-sm bg-blue-500 group-hover:animate-pulse" aria-hidden="true" />
                                TLS 1.3 Protocol
                            </h4>
                            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                                Active data in transit is protected with perfect forward secrecy protocols, preventing unauthorized stream decryption.
                            </p>
                        </div>

                        {/* WhatsApp TTL Card */}
                        <div className="p-4 sm:p-5 bg-[#0c0915] border border-fuchsia-500/20 rounded-lg shadow-md flex flex-col sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:border-fuchsia-500/40 group">
                            <h4 className="font-black text-xs sm:text-sm text-fuchsia-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-sm bg-fuchsia-500 group-hover:animate-pulse" aria-hidden="true" />
                                WhatsApp TTL
                            </h4>
                            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                                Real host numbers and temporary bridge metadata arrays are systematically purged immediately following the 24-hour cycle limit.
                            </p>
                        </div>
                    </div>
                </ProtocolSection>

                {/* Data Usage Policy Section */}
                <ProtocolSection
                    title="Data Usage Policy"
                    icon={<Scale className="text-fuchsia-400" size={16} />}
                >
                    <div className="flex flex-col gap-5 mt-2">
                        {/* Rule 1 */}
                        <div className="flex items-start gap-3.5 p-4 bg-[#0c0915] border border-purple-500/10 rounded-lg">
                            <div className="w-6 h-6 rounded bg-emerald-950/30 border border-emerald-500/30 flex justify-center items-center shrink-0 text-emerald-400" aria-hidden="true">
                                <ShieldCheck size={14} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-white text-xs sm:text-sm font-black uppercase tracking-wider mb-1">
                                    Zero Monetization Framework
                                </h4>
                                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                                    TechTrade SA operates exclusively on a secure transaction fee layout. Your network profile information is never exposed to external data brokers or telemetry networks.
                                </p>
                            </div>
                        </div>

                        {/* Rule 2 */}
                        <div className="flex items-start gap-3.5 p-4 bg-[#0c0915] border border-purple-500/10 rounded-lg">
                            <div className="w-6 h-6 rounded bg-fuchsia-950/30 border border-fuchsia-500/30 flex justify-center items-center shrink-0 text-fuchsia-400" aria-hidden="true">
                                <Zap size={14} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-white text-xs sm:text-sm font-black uppercase tracking-wider mb-1">
                                    Intelligence Architecture Training
                                </h4>
                                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
                                    Uploaded system hardware specifications help train our internal diagnostics model to optimize architecture compatibility reports without linking records to your identity parameters.
                                </p>
                            </div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* Rights Section */}
                <ProtocolSection
                    title="Your Data Rights (GDPR/POPIA)"
                    icon={<AlertCircle className="text-fuchsia-400" size={16} />}
                >
                    <div className="space-y-4 mt-1">
                        <p className="text-slate-300 text-[11px] sm:text-xs md:text-sm font-medium leading-relaxed">
                            Under applicable GDPR and POPIA security data frameworks, operators hold the following enforceable terminal rights:
                        </p>

                        <ul className="grid grid-cols-1 gap-3.5 list-none pl-0">
                            {[
                                { label: "Right to Access", text: "Request a complete encrypted export copy of all personal database logs tied to your station index." },
                                { label: "Right to Erasure", text: "Trigger complete permanent profile deletion routines (excluding data segments bound by tax regulation logs)." },
                                { label: "Right to Portability", text: "Instantly transmit data logs across system nodes in standard machine-readable JSON formats." }
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-slate-400 text-[11px] sm:text-xs md:text-sm items-start group">
                                    <div className="h-4 w-4 rounded border border-purple-500/30 bg-purple-950/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-fuchsia-400 transition-colors" aria-hidden="true">
                                        <div className="h-1.5 w-1.5 bg-purple-500 group-hover:bg-fuchsia-400 rounded-sm transition-colors" />
                                    </div>
                                    <p className="leading-relaxed font-medium">
                                        <strong className="text-white font-black uppercase tracking-wider mr-1.5">{item.label}:</strong> 
                                        {item.text}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        {/* Data Retention Note Footer Panel */}
                        <div className="mt-6 p-4 sm:p-5 bg-[#0a0812] border border-purple-500/20 rounded-lg shadow-inner">
                            <div className="flex items-center gap-2 mb-2" aria-hidden="true">
                                <Scale size={12} className="text-purple-400 animate-pulse" />
                                <h4 className="text-purple-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                                    Data Retention Protocol
                                </h4>
                            </div>
                            <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                                Exchange financial records are systematically stored for a 7-year regulatory pipeline under standard SARS tax guidelines for anti-fraud validation and audit compliance.
                            </p>
                        </div>
                    </div>
                </ProtocolSection>
            </div>
        </BaseModal>
    );
};

export default PrivacyModal;