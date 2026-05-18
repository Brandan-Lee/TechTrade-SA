import React, { useState } from "react";
import { MessageSquare, ShieldAlert, Clock, HelpCircle, Save, CheckCircle2 } from "lucide-react";

export default function WhatsAppTTLPage() {
    const [selectedTTL, setSelectedTTL] = useState("24h");
    const [customDays, setCustomDays] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const ttlOptions = [
        { id: "24h", label: "24 Hours", desc: "For high-velocity trade chats containing temporary pricing coordinates.", icon: "⚡" },
        { id: "7d", label: "7 Days", desc: "Standard cycle. Ideal for normal escrow settlement and transport windows.", icon: "⏳" },
        { id: "90d", label: "90 Days", desc: "Long-term tracking. Recommended for bulk wholesale vendor accounts.", icon: "𗢙" },
        { id: "custom", label: "Custom Lifespan", desc: "Specify an explicit cryptographic time-horizon for structural data drop.", icon: "⚙️" }
    ];

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simulating backend cryptographic state synchronization
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            
            {/* Cyberpunk background accent glows */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                
                {/* Header Section */}
                <header className="mb-10 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-bold tracking-wider uppercase mb-3">
                        <MessageSquare className="w-3.5 h-3.5" /> Secure Handshake Node
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-100 uppercase">
                        WhatsApp <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">TTL Protocols</span>
                    </h1>
                    <p className="text-base-content/70 mt-2 text-sm sm:text-base max-w-xl">
                        Enforce auto-expiring ephemeral lifespans on external platform metadata. Once timer parameters clear, chat records dissolve automatically.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left & Center: Configuration Core Form */}
                    <main className="lg:col-span-2" id="main-content" aria-label="TTL Configuration Panel">
                        <form onSubmit={handleSave} className="space-y-6">
                            
                            {/* Radio Option Cards Group */}
                            <fieldset className="space-y-3">
                                <legend className="text-sm font-bold tracking-wide uppercase text-neutral-300 font-mono mb-3">
                                    Select Active Retain Window
                                </legend>
                                <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-required="true">
                                    {ttlOptions.map((option) => {
                                        const isChecked = selectedTTL === option.id;
                                        return (
                                            <label
                                                key={option.id}
                                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none focus-within:ring-2 focus-within:ring-primary ${
                                                    isChecked
                                                        ? "bg-primary/5 border-primary shadow-lg shadow-primary/5"
                                                        : "bg-base-200/50 border-neutral-800 hover:border-neutral-700 hover:bg-base-200"
                                                }`}
                                            >
                                                {/* Hidden input field optimized for screen reader focus maps */}
                                                <input
                                                    type="radio"
                                                    name="whatsapp-ttl-interval"
                                                    value={option.id}
                                                    checked={isChecked}
                                                    onChange={() => setSelectedTTL(option.id)}
                                                    className="radio radio-primary mt-1 shrink-0"
                                                    aria-describedby={`desc-${option.id}`}
                                                />
                                                <div>
                                                    <span className="font-bold text-neutral-100 text-sm sm:text-base flex items-center gap-2">
                                                        <span>{option.icon}</span> {option.label}
                                                    </span>
                                                    <span 
                                                        id={`desc-${option.id}`} 
                                                        className="block text-xs sm:text-sm text-base-content/60 mt-1 leading-relaxed"
                                                    >
                                                        {option.desc}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </fieldset>

                            {/* Conditional Custom Selection Parameter Input View */}
                            {selectedTTL === "custom" && (
                                <div className="p-4 rounded-xl border border-neutral-800 bg-base-200/30 animate-fade-in">
                                    <label htmlFor="custom-ttl-days" className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-2">
                                        Explicit Lifespan Period (In Days)
                                    </label>
                                    <div className="flex items-center gap-3 max-w-xs">
                                        <input
                                            id="custom-ttl-days"
                                            type="number"
                                            min="1"
                                            max="365"
                                            required
                                            value={customDays}
                                            onChange={(e) => setCustomDays(e.target.value)}
                                            placeholder="e.g. 14"
                                            className="input input-bordered input-primary w-full font-mono bg-base-300 text-neutral-100"
                                            aria-label="Custom dynamic lifespan countdown ceiling value"
                                        />
                                        <span className="text-sm font-mono text-neutral-400 uppercase tracking-wider">Days</span>
                                    </div>
                                </div>
                            )}

                            {/* Form Execution Submission Trigger */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={`btn btn-primary w-full sm:w-auto px-8 gap-2 uppercase font-bold tracking-wider rounded-xl ${
                                        isSaving ? "loading" : ""
                                    }`}
                                    aria-live="polite"
                                >
                                    {!isSaving && <Save className="w-4 h-4" />}
                                    {isSaving ? "Syncing Grid..." : "Commit TTL Policy"}
                                </button>
                            </div>
                        </form>
                    </main>

                    {/* Right Side Info Section / Informational Sidebar */}
                    <aside className="space-y-4" aria-label="Policy Information & System Warnings">
                        
                        {/* Notice Card A */}
                        <div className="card bg-base-200 border border-neutral-800 p-5 rounded-2xl">
                            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-amber-400 flex items-center gap-2 mb-3">
                                <ShieldAlert className="w-4 h-4 shrink-0" /> Integrity Note
                            </h2>
                            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                                Enabling Time-To-Live parameters limits secondary platform vectors from crawling old deal metadata. However, this does not prevent manual screenshot logging or platform-native archiving by your recipient.
                            </p>
                        </div>

                        {/* Notice Card B */}
                        <div className="card bg-base-200/40 border border-neutral-800/60 p-5 rounded-2xl text-xs sm:text-sm">
                            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-300 flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 shrink-0" /> Execution Matrix
                            </h2>
                            <ul className="space-y-2 text-base-content/60 list-disc list-inside">
                                <li>Applies to system logs & trade boards</li>
                                <li>Realtime counter synchronizations</li>
                                <li>Revocable or mutable at any step</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Accessible Live Region Popup Toast Alert Feedback */}
            <div className="toast toast-end z-50 p-4" role="alert" aria-live="assertive">
                {showToast && (
                    <div className="alert alert-success shadow-xl border border-emerald-500/30 rounded-xl flex items-center gap-3 bg-[#0a2416] text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                        <div>
                            <span className="font-bold block text-sm">Security Protocols Updated</span>
                            <span className="text-xs text-emerald-400/80 font-mono">WhatsApp TTL profile linked successfully.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}