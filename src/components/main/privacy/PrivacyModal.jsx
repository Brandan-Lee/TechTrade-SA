import React from "react";
import BaseModal from "../../ui/BaseModal";
import { ProtocolSection } from "../tos/ProtocolSection";
import { AlertCircle, Cookie, Lock, Scale, ShieldCheck, Zap } from "lucide-react";
import DataCard from "./DataCard";

const PrivacyModal = ({ isOpen, onClose }) => {
    const lastUpdated = "13 May 2026";
    const docVersion = "1.0";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Data Integrity and Privacy"
            icon={<ShieldCheck className="w-5 h-5 text-white" />}
            footerText={`v${docVersion} | ${lastUpdated}`}
            centerContent={false}
        >
            <div className="flex flex-col gap-8 py-2">
                {/* Cookie Registry Section - Standardized Grid */}
                <ProtocolSection
                    title="Cookie Registry"
                    icon={<Cookie className="text-violet-600" size={24} />}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <DataCard
                            label="Essential"
                            title="Necessary Cookies: System Critical"
                            badge="Always On"
                            type="badge"
                            gradient="bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800"
                            description="These cookies power the Transactional State Machine and maintain secure user sessions. They enable core marketplace functions including escrow operations"
                        />
                        <DataCard
                            label="Optimization"
                            title="Analytics and Performance Tracking"
                            type="toggle"
                            gradient="bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800"
                            description="These cookies help us improve the Build Doctor algorithms and marketplace intelligence by collecting anonymized usage patterns"
                        />
                    </div>
                </ProtocolSection>

                {/* Encryption Engine Section - Equal Height Grid */}
                <ProtocolSection
                    title="The Encryption Engine"
                    icon={<Lock className="text-violet-600" size={24} />}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        <div className="p-5 bg-emerald-600 text-white rounded-xl shadow-sm flex flex-col">
                            <h4 className="font-bold text-sm md:text-base mb-2 uppercase tracking-tight">AES-256 Encryption</h4>
                            <p className="text-xs md:text-sm leading-relaxed opacity-90">
                                All personal data and Build Doctor profiles are encrypted using
                                military-grade AES-256 standards.
                            </p>
                        </div>

                        <div className="p-5 bg-blue-600 text-white rounded-xl shadow-sm flex flex-col">
                            <h4 className="font-bold text-sm md:text-base mb-2 uppercase tracking-tight">TLS 1.3 Protocol</h4>
                            <p className="text-xs md:text-sm leading-relaxed opacity-90">
                                Data in transit is secured with perfect forward secrecy, ensuring
                                intercepted data cannot be decrypted.
                            </p>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-violet-800 to-purple-600 text-white rounded-xl shadow-sm flex flex-col sm:col-span-2 lg:col-span-1">
                            <h4 className="font-bold text-sm md:text-base mb-2 uppercase tracking-tight">WhatsApp TTL Bridge</h4>
                            <p className="text-xs md:text-sm leading-relaxed opacity-90">
                                Phone numbers and relay metadata are purged from our systems
                                immediately after the 24-hour timer.
                            </p>
                        </div>
                    </div>
                </ProtocolSection>

                {/* Data Usage Section - Fixed Alignment */}
                <ProtocolSection
                    title="Data Usage Policy"
                    icon={<Scale className="text-violet-600" size={24} />}
                >
                    <div className="flex flex-col gap-6 mt-3">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 bg-emerald-100 p-1.5 rounded-md shrink-0">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-slate-900 text-sm md:text-base font-bold leading-none mb-1">
                                    We do not sell your data
                                </p>
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                    TechTrade SA operates on a transaction fee model. Your info is
                                    never shared with third-party advertisers.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 bg-emerald-100 p-1.5 rounded-md shrink-0">
                                <Zap className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-slate-900 text-sm md:text-base font-bold leading-none mb-1">
                                    Hardware specs train our Intelligence Layer
                                </p>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    GPU models and architectures improve Build Doctor compatibility
                                    without linking to your identity.
                                </p>
                            </div>
                        </div>
                    </div>
                </ProtocolSection>

                {/* Rights Section - Improved List Layout */}
                <ProtocolSection
                    title="Your Data Rights (GDPR/POPIA)"
                    icon={<AlertCircle className="text-violet-600" size={24} />}
                >
                    <div className="space-y-4 mt-2">
                        <p className="text-slate-600 text-sm md:text-base">
                            Under GDPR and POPIA, you have the following enforceable rights:
                        </p>

                        <ul className="grid grid-cols-1 gap-3 ml-1">
                            {[
                                { label: "Right to Access", text: "Request a copy of all personal data held about you." },
                                { label: "Right to Erasure", text: "Request complete account deletion (subject to tax law)." },
                                { label: "Right to Portability", text: "Export your data in machine-readable JSON/CSV." }
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-2 text-slate-600 text-sm md:text-base items-start">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                                    <span><strong>{item.label}:</strong> {item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                                <Scale size={14} className="text-slate-400" />
                                <p className="text-slate-500 text-sm md:text-base font-black uppercase tracking-wider">
                                    Data Retention Note
                                </p>
                            </div>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                Transaction records are retained for 7 years per SARS regulations
                                for tax compliance and fraud prevention.
                            </p>
                        </div>
                    </div>
                </ProtocolSection>
            </div>
        </BaseModal>
    );
};

export default PrivacyModal;