import React from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function FilterBar() {
    const categories = [
        "GPUs", "CPUs", "RAM", "Storage", "Cooling", "PSUs", "Cases"
    ];

    const filterTags = [
        { label: "Price", icon: true },
        { label: "Condition", icon: true },
    ];

    return (
        <nav className={`w-full bg-white/95 z-40 shadow-[0px_1px_3px_rgba(0,0,0,0.1)] border-b border-gray-100`}>
            <div className={`max-w-[1440px] mx-auto h-16 px-4 flex items-center gap-4 overflow-x-auto no-scrollbar touch-pan-x`}>
                {/* Label Section */}
                <div className={`flex items-center gap-2 pr-4 border-r border-gray-200 shrink-0`}>
                    <SlidersHorizontal className="w-4 h-4 text-purple-700" />
                    <span className={`text-gray-500 text-sm font-semibold tracking-wide uppercase`}>
                        FILTER
                    </span>
                </div>

                {/* Categories and Filter Chips */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Main Category (Active State) */}
                    <button className={`h-9 px-5 bg-gradient-to-r from-purple-700 to-purple-600 rounded-lg shadow-md text-white text-sm font-bold shrink-0 hover:brightness-110 transition-all`}>
                        ALL HARDWARE
                    </button>

                    {/* Dynamic Category List */}
                    {categories.map((cat) => (
                        <button key={cat} className={`h-9 px-5 bg-white border border-gray-200 rounded-lg text-gray-500 text-sm font-medium shrink-0 hover:border-purple-300 hover:text-purple-700 transition-colors`}>
                            {cat}
                        </button>
                    ))}

                    {/* Vertical Divider */}
                    <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

                    {/* Functional Filters */}
                    {filterTags.map((filter) => (
                        <button key={filter.label} className={`h-9 px-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium flex items-center gap-2 shrink-0 hover:bg-gray-100 transition-all`}>
                            {filter.label}
                            {filter.icon && <ChevronDown className="w-3 h-3 text-gray-400" />}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}