import React, { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import GradientButton from "../../ui/PurpleGradientButton";
import AuthFooter from "./AuthFooter";

export const OTPModal = ({
    isOpen,
    onClose,
    onSwitchToReset,
    onSwitchToLogin,
    onSwitchToForgot,
}) => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    // --- Timer Logic ---
    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [isOpen]);

    // --- Input Logic ---
    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleVerify = async (e) => {
        
    };

    return (
        <AuthModalWrapper 
            isOpen={isOpen} 
            onClose={onClose} 
            onBack={onSwitchToForgot}
        >
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-purple-600 text-4xl md:text-5xl font-black uppercase tracking-tighter">
                        OTP Verification
                    </h1>
                    <p className="text-gray-600 text-xs font-medium leading-tight mt-4">
                        Please enter the 4-digit code sent to your registered email to complete verification.
                    </p>
                </div>

                {/* OTP Input Grid */}
                <form onSubmit={handleVerify} className="space-y-8">
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-16 h-16 md:w-20 md:h-20 text-center text-2xl font-black rounded-2xl border-2 border-slate-200 focus:border-pink-600 focus:ring-4 focus:ring-pink-600/10 focus:outline-none text-violet-800 transition-all bg-slate-50"
                            />
                        ))}
                    </div>

                    {/* Timer Box */}
                    <div className="flex justify-between items-center bg-slate-100 p-4 rounded-2xl border border-slate-200">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Expires in: <span className="text-pink-600 ml-1">
                                00:{timer < 10 ? `0${timer}` : timer}s
                            </span>
                        </div>
                        <button
                            type="button"
                            disabled={timer > 0}
                            onClick={() => setTimer(60)}
                            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${
                                timer > 0 ? "text-slate-400 cursor-not-allowed" : "text-violet-800 hover:text-pink-600"
                            }`}
                        >
                            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Resend
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <GradientButton 
                            label="VERIFY CODE" 
                            type="submit"
							onClick={onSwitchToReset}
                            isLoading={isLoading} 
                        />
                        
						<AuthFooter 
							label="CANCEL"
							onClick={onSwitchToLogin}
						/>
                    </div>
                </form>

                {/* FAQ Link */}
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                    Wondering how we use this code for verification?
                    <button className="text-violet-800 ml-1 underline">Know here</button>
                </p>
            </div>
        </AuthModalWrapper>
    );
};

export default OTPModal;