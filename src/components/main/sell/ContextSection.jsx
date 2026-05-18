import React from "react";

export default function ContextSection({ formData, setFormData }) {
    const conditions = ["New", "Like New", "Good", "Fair"];

    return (
        <div className="bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 w-full relative overflow-hidden group">
            {/* Corner Accent Detail */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-fuchsia-500/10 [clip-path:polygon(100%_0,100%_100%,0_0)] pointer-events-none" />

            <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                <span className="w-2 h-6 bg-fuchsia-500 inline-block" />
                Condition & Context
            </h2>

            <div className="space-y-10">
                {/* CONDITION SELECTOR */}
                <div className="form-control">
                    <label className="label text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4 flex justify-between">
                        <span>Component Condition</span>
                        {formData.condition && <span className="text-fuchsia-400">Selected: {formData.condition}</span>}
                    </label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                        {conditions.map((c) => {
                            const isSelected = formData.condition === c;
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, condition: c })}
                                    className={`relative h-12 md:h-14 rounded-lg font-bold uppercase tracking-wider text-[11px] md:text-sm transition-all duration-300 border overflow-hidden
                                        ${isSelected 
                                            ? "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.2)]" 
                                            : "bg-white/5 border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300"
                                        }`}
                                >
                                    {/* Active Indicator Bar */}
                                    {isSelected && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-fuchsia-500" />
                                    )}
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* DESCRIPTION AREA */}
                <div className="form-control">
                    <label className="label text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">
                        <span>Description</span>
                    </label>
                    <div className="relative group">
                        <textarea
                            className="w-full h-40 md:h-52 bg-black border border-white/10 text-slate-200 p-5 md:p-6 
                                       focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/30
                                       text-sm md:text-base font-medium leading-relaxed rounded-xl transition-all
                                       placeholder:text-slate-700 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                            placeholder="Input usage history, overclocking details, included accessories..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                        />
                        {/* Decorative HUD corners */}
                        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20 pointer-events-none" />
                        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}