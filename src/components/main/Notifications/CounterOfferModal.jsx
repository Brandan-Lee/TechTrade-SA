import React, { useState } from "react";
import BaseModal from "../../ui/BaseModal";
import { Handshake } from "lucide-react";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";

const CounterOfferModal = ({ isOpen, onClose, onSubmit, listingName }) => {
    const [amount, setAmount] = useState("");

    const isInvalid = !amount || isNaN(amount) || parseFloat(amount) <= 0;

    const handleSubmit = () => {
        if (isInvalid) return;
        onSubmit(amount);
        setAmount(""); 
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Counter Offer Protocol"
            icon={<Handshake className="w-4 h-4 text-fuchsia-400" />}
            centerContent={true}
        >
            {/* Main Centered Chassis Wrapper */}
            <div className="w-full flex justify-center p-5 sm:p-8 font-mono bg-[#07050e] text-slate-300 select-none selection:bg-fuchsia-500/30">
                
                {/* Structural Constraint Inner Box */}
                <div className="w-full max-w-sm flex flex-col items-start gap-6 sm:gap-7">
                    
                    {/* Active Target Listing Context Header */}
                    <div className="flex flex-col gap-1.5 text-left w-full border-l-2 border-purple-500/30 pl-3">
                        <p className="text-slate-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                            Modifying Negotiation Vector For:
                        </p>
                        <span className="text-sm sm:text-base text-white font-black tracking-wide uppercase drop-shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                            {listingName || "Target Hardware Listing"}
                        </span>
                    </div>

                    {/* Financial Data Input Section */}
                    <div className="w-full flex flex-col gap-2">
                        <label 
                            htmlFor="counter-amount"
                            className="text-purple-400 text-[10px] sm:text-xs font-black uppercase tracking-widest pl-1"
                        >
                            Proposed Transmission Amount
                        </label>
                        
                        <div className="relative group w-full flex items-stretch">
                            {/* Currency Indicator Node */}
                            <span 
                                className="absolute left-4 top-0 h-full flex items-center text-slate-400 group-focus-within:text-fuchsia-400 font-black text-xs sm:text-sm z-10 pointer-events-none transition-colors duration-200"
                                aria-hidden="true"
                            >
                                R
                            </span>
                            
                            <AuthInput
                                id="counter-amount"
                                type="number"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                aria-required="true"
                                aria-invalid={isInvalid && amount !== ""}
                                className="pl-9 w-full bg-[#0d091a] border border-purple-500/20 focus:border-fuchsia-500/80 rounded-lg text-white text-xs sm:text-sm font-bold tracking-wide py-2.5 sm:py-3 transition-all duration-200" 
                            />
                        </div>
                    </div>

                    {/* Operational Submit Action Panel */}
                    <div className="w-full pt-2">
                        <CyberActionButton
                            onClick={handleSubmit}
                            disabled={isInvalid}
                            label="TRANSMIT PROPOSAL"
                            className={`w-full transition-all duration-200 font-black tracking-widest text-xs sm:text-sm ${
                                isInvalid 
                                ? "opacity-40 cursor-not-allowed bg-purple-950/20 border border-purple-500/10 text-slate-500" 
                                : "bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-950/30"
                            }`}
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default CounterOfferModal;