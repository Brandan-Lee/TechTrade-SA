import React from "react";

export const GradientHighlightBox = ({ title, children, icon }) => (
    <aside 
        className="w-full p-4 sm:p-5 md:p-6 bg-[#0e0a1a]/90 border border-purple-500/30 rounded-lg flex flex-col gap-3.5 shadow-[inset_0_0_15px_rgba(168,85,247,0.04)] shadow-black/60 relative overflow-hidden group font-mono selection:bg-fuchsia-500/30"
        aria-label={`${title || "System Alert"} Highlight`}
    >
        <div className="absolute top-0 right-0 w-16 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-fuchsia-500 opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 right-0 w-[2px] h-16 bg-gradient-to-b from-fuchsia-500 via-purple-500 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-start gap-3 sm:gap-4">
            {icon && (
                <div 
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-purple-950/40 border border-purple-500/40 flex justify-center items-center shrink-0 text-fuchsia-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                    aria-hidden="true"
                >
                    {icon}
                </div>
            )}

            <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
                {title && (
                    <h4 className="text-white text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.18em] leading-none">
                        {title}
                    </h4>
                )}

                <div className="text-slate-300 text-[11px] sm:text-xs md:text-sm leading-relaxed tracking-wide font-medium">
                    {children}
                </div>
            </div>
        </div>
    </aside>
);