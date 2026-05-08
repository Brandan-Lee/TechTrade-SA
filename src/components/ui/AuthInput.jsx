import React from "react";
import { Eye, EyeOff } from "lucide-react";

const AuthInput = ({ 
    label, 
    error, 
    isPassword, 
    showPassword, 
    togglePassword, 
    ...props 
}) => (
    <div className="w-full space-y-1.5">
        <label className="text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
            {label}
        </label>
        
        <div className="relative">
            <input
                {...props}
                type={
                    isPassword 
                        ? (showPassword ? "text" : "password") 
                        : props.type
                }
                className={`w-full h-12 md:h-14 bg-slate-100 rounded-xl px-4 border transition-all text-gray-900 pr-12 ${
                    error 
                        ? 'border-red-500 ring-1 ring-red-500' 
                        : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-600'
                }`}
            />

            {/* Toggle Button - Only renders if isPassword prop is true */}
            {isPassword && (
                <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 focus:text-violet-600 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}
        </div>

        {error && (
            <span className="text-red-500 text-[10px] font-bold uppercase ml-1 block">
                {error}
            </span>
        )}
    </div>
);

export default AuthInput;