import React from "react";

const PurpleGradientButton = ({ label, isLoading, ...props }) => (
    <button
        {...props}
        disabled={isLoading}
        className="w-full h-14 md:h-16 bg-gradient-to-r from-violet-800 to-purple-600 rounded-xl md:rounded-2xl outline outline-2 outline-pink-600 text-white font-black text-lg tracking-widest shadow-xl shadow-purple-500/20 hover:from-pink-400 hover:to-pink-600 hover:outline-purple-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
    >
        {isLoading 
            ? (<span className="loading loading-spinner loading-md"></span>)
            : (label)
        }
    </button>
);

export default PurpleGradientButton;