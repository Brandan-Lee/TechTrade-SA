import React from "react";
import { ShieldCheck, Check } from "lucide-react";

export default function ComponentCard({
    title,
    icon: Icon,
    placeholder,
    value,
    onChange,
}) {
    // Hardcoded for display logic illustration; normally parsed dynamically per type
    const specs = [
        { label: "BRAND", value: "NVIDIA" },
        { label: "MODEL", value: "GEFORCE RTX 3080 TI FE" },
        { label: "MEMORY", value: "12GB GDDR6X" },
        { label: "TDP / POWER", value: "350W (2X 8-PIN)" },
    ];

    return (
        <div className="w-full bg-[#0c0c0e]/90 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-[0_0_30px_rgba(0,0,0,0.4)] border border-white/10 transition-all duration-300 hover:border-fuchsia-500/30 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* LEFT SIDE: INPUT MODULE (Span 7) */}
                <div className="lg:col-span-7 space-y-4">
                    {/* Module Title Matrix */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-lg flex items-center justify-center text-fuchsia-400 group-hover:bg-fuchsia-500/20 transition-colors">
                            {Icon && <Icon size={18} />}
                        </div>
                        <div>
                            <h3 className="text-white text-sm md:text-base font-black uppercase tracking-wider font-mono">
                                {title}
                            </h3>
                        </div>
                    </div>

                    {/* Interactive Input Block */}
                    <div className="space-y-2">
                        <label className="block text-slate-500 text-[10px] uppercase font-mono tracking-[0.25em]">
                            Input Component Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={value}
                                onChange={onChange} // Fixed: case-sensitivity bug from 'onchange'
                                placeholder={placeholder?.toUpperCase()}
                                className="w-full h-12 md:h-14 px-4 bg-black border border-white/10 text-slate-200 rounded-xl font-medium text-xs md:text-sm focus:outline-none focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/20 transition-all placeholder:text-slate-800 placeholder:font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: TELEMETRY TECH SPECS (Span 5) */}
                <div className="lg:col-span-5 bg-black/50 border border-fuchsia-500/10 rounded-xl p-4 relative overflow-hidden h-full flex flex-col justify-center">
                    {/* Decorative Corner Notch */}
                    <div className="absolute top-0 right-0 w-2 h-2 bg-fuchsia-500/30 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
                    
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-3.5 h-3.5 text-fuchsia-500" />
                        <span className="text-white font-black text-[9px] md:text-[10px] tracking-widest uppercase font-mono">
                            Verified Specifications
                        </span>
                    </div>

                    {/* Compact Specs Row Map */}
                    <div className="space-y-2">
                        {specs.map((spec, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[10px] md:text-xs border-b border-white/[0.03] pb-1 last:border-0 last:pb-0 font-mono">
                                <span className="text-slate-500 uppercase">{spec.label}</span>
                                <span className="text-fuchsia-400/90 font-bold max-w-[160px] truncate text-right">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}