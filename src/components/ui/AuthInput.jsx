import React from "react";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";

const AuthInput = ({
    label,
    error,
    isPassword,
    showPassword,
    togglePassword,
    id,
    className = "", // This receives the "animate-shake" class
    ...props
}) => {
    const inputId = id || `cyber-input-${label?.replace(/\s+/g, "-").toLowerCase()}`;
    const errorId = `${inputId}-error`;

    return (
        <div className="w-full space-y-2">
            <label
                htmlFor={inputId}
                className="block text-slate-400 text-sm md:text-base font-black uppercase tracking-[0.3em] ml-1 font-mono"
            >
                {label}
            </label>

            <div className={`relative group ${className}`}>
                <input
                    {...props}
                    id={inputId}
                    type={isPassword ? (showPassword ? "text" : "password") : props.type}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? errorId : undefined}
                    className={`w-full h-12 md:h-14 bg-black rounded-xl pl-5 text-xs md:text-sm font-mono transition-[color,background-color,border-color,box-shadow] duration-300 border pr-12 ${
                        error
                            ? "border-rose-500 text-rose-400 focus:ring-1 focus:ring-rose-500/30 focus:border-rose-500"
                            : "border-white/10 text-slate-200 placeholder:text-slate-800 focus:outline-none focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/20"
                    }`}
                />

                {/* Password Toggle Button */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors font-mono ${
                            error ? "text-rose-500/50" : "text-slate-600 hover:text-fuchsia-400"
                        }`}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>

            {/* Error Notification */}
            {error && typeof error === "string" && (
                <div role="alert" className="flex items-center gap-1.5 text-rose-500 text-sm font-bold uppercase tracking-wider ml-1 mt-1.5">
                    <ShieldAlert size={12} />
                    <span>[ALERT_LOG]: {error}</span>
                </div>
            )}
        </div>
    );
};

export default AuthInput;