import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ className }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            console.log("Searching data vectors for:", searchTerm);
        }
    };

    return (
        <div className={`relative w-full lg:max-w-[672px] h-11 sm:h-12 font-mono group select-none ${className}`}>
            {/* Search Icon Indicator */}
            <Search 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/60 group-focus-within:text-fuchsia-400 w-4 h-4 sm:w-5 sm:h-5 z-10 pointer-events-none transition-colors duration-200" 
                aria-hidden="true"
            />

            {/* Main Cyber Input Area */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Query hardware arrays (RTX 4090, Ryzen 9...)"
                aria-label="Search platform hardware listings"
                className="w-full h-full pl-11 sm:pl-12 pr-20 bg-[#0d0915] border border-purple-500/20 focus:border-fuchsia-500/80 rounded-lg text-white placeholder-slate-600 outline-none transition-all duration-200 text-xs sm:text-sm font-medium tracking-wide shadow-md shadow-black/50 selection:bg-fuchsia-500/30"
            />

            {/* Clear Action Button Core */}
            {searchTerm && (
                <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear active query parameter"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 rounded border border-purple-500/10 hover:border-fuchsia-500/40 bg-[#120d1e] hover:bg-[#1a122b] text-slate-400 hover:text-fuchsia-400 transition-all duration-150 flex items-center gap-1.5 active:scale-95 text-[10px] sm:text-xs font-black tracking-widest uppercase"
                >
                    <span>CLEAR</span>
                    <X size={12} className="opacity-70 group-hover:opacity-100" />
                </button>
            )}
        </div>
    );
}