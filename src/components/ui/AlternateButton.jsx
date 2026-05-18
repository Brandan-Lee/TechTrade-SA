import React from "react";

const AlternateButton = ({ label, disabled, ...props }) => (
    <button
        {...props}
        disabled={disabled}
        aria-disabled={disabled ? "true" : undefined}
        className="w-full h-12 md:h-14 lg:h-16 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/[0.02] text-fuchsia-400 font-mono font-black text-xs md:text-sm uppercase tracking-[0.25em] transition-all duration-300 relative overflow-hidden group
            hover:border-fuchsia-500 hover:bg-fuchsia-500/10 hover:text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.2)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black
            active:scale-[0.98] 
            disabled:opacity-20 disabled:pointer-events-none disabled:shadow-none
            flex items-center justify-center gap-2"
    >
        {/* Subtle Cyberpunk Corner Accents inside the button wireframe */}
        <span className="absolute top-0 left-0 w-1 h-1 bg-fuchsia-500/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <span className="absolute bottom-0 right-0 w-1 h-1 bg-fuchsia-500/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Dynamic Data Transmission text formatting */}
        <span className="relative z-10 block truncate px-4">
            {label}
        </span>
    </button>
);

export default AlternateButton;