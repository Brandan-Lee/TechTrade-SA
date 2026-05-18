import React from "react";
import { Terminal, Cpu, Radio } from "lucide-react";

export default function WelcomeBanner() {
    return (
        <div className="relative w-full bg-[#050505] overflow-hidden border-b border-fuchsia-500/30 p-3">
            {/* The "Cyber-Grid" background effect */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Animated Scanning Beam */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-fuchsia-500/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

            <div className="max-w-[1440px] mx-auto h-10 lg:h-11 flex items-center justify-between px-4 lg:px-8 relative z-10">
                
                {/* Center: Main Message */}
                <div className="flex items-center gap-2 mx-auto md:mx-0">
                    <Terminal size={14} className="text-fuchsia-400 hidden sm:block" />
                    <h2 className="text-white text-[11px] md:text-xs font-black tracking-[0.3em] uppercase italic">
                        Welcome to <span className="text-fuchsia-400">TechTrade SA</span>
                    </h2>
                </div>

            </div>

        </div>
    );
}