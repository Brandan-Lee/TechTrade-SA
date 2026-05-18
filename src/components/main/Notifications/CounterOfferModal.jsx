import React, { useState } from "react";
import BaseModal from "../../ui/BaseModal";
import { Handshake } from "lucide-react";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";

const CounterOfferModal = ({ isOpen, onClose, onSubmit, listingName }) => {
    // Use a simple string state for better reliability in this specific form
    const [amount, setAmount] = useState("");

    const handleSubmit = () => {
        if (!amount || isNaN(amount)) return;
        onSubmit(amount);
        setAmount(""); 
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Counter Offer"
            icon={<Handshake className="w-5 h-5 text-white" />}
            centerContent={true}
        >
            {/* 
                1. CENTERING: 'flex justify-center' centers the inner block.
            */}
            <div className="w-full flex justify-center p-6">
                
                {/* Inner block has a fixed max-width but stays left-aligned internally */}
                <div className="w-full max-w-sm flex flex-col items-start gap-6">
                    
                    {/* Information Header */}
                    <div className="flex flex-col gap-1 text-left">
                        <p className="text-slate-600 text-sm md:text-base font-black uppercase tracking-[0.2em]">
                            You are making a counter offer for:
                        </p>
                        <span className=" text-sm md:text-base text-violet-900 font-bold underline decoration-pink-500 mt-3">
                            {listingName || "Selected Listing"}
                        </span>
                    </div>

                    {/* Input Section */}
                    <div className="w-full flex flex-col gap-3">
                        <div className="relative group w-full">
                            <span className="absolute left-4 top-1/2 translate-y-1/2 text-slate-400 font-bold z-10 pointer-events-none">
                                R
                            </span>
                            <AuthInput
                                label="Enter Counter Offer Amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                // Added padding-left (pl-10) so text doesn't overlap the 'R'
                                className="pl-10 w-full" 
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="w-full">
                        <CyberActionButton
                            onClick={handleSubmit}
                            label="SUBMIT COUNTER OFFER"
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default CounterOfferModal;