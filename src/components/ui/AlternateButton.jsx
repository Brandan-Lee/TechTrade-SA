import React from "react";

const AlternateButton = ({ label, ...props }) => (
    <button
        {...props}
        className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl bg-transparent border-2 border-violet-800 text-violet-800 font-black text-sm md:text-base uppercase tracking-[0.2em] transition-all duration-200 hover:bg-pink-600 hover:text-white active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
    >
        {label}
    </button>
);

export default AlternateButton;