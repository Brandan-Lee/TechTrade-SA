import { Radio, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";

export default function AuthHeader() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const messages = [
        "Escrow Protocol Engaged. The Transactional State Machine is monitoring all active negotiations to ensure funds and hardware are released only upon mutual verification.",
        "Hardware Intelligence Active. All listings in your region are currently verified via the Managed Trust &amp; Negotiation Hub.",
        "Node-to-Node Security Active. Every device listed has hhundergone a multi-point credential audit to mitigate the risk of fraudulent listings in the South African tech market."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % messages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [messages.length]);

    return (
        <div className="w-full h-full bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 flex flex-col items-center justify-center py-8 lg:py-12 px-4 gap-12">
            {/* Branding Section */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-pink-600/40 rounded-full blur-xl animate-pulse" />
                    <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-2xl" />
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className='relative z-10 w-16 h-16 lg:w-20 lg:h-20 object-contain' 
                    />
                </div>

                <div className="text-center spacy-y-1">
                    <h1 className="text-white text-3xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight">
                        TechTrade SA
                    </h1>
                </div>
            </div>

            {/* Status Card (Tablet and Desktop) */}
            <div className="hidden md:flex flex-col items-center w-full max-w-2xl bg-neutral-100 rounded-xl p-6 shadow-2xl gap-4 animate-in fade-in slide-in-from-top-4 duration-500 ">
                {/* Shield Icon */}
                <div className="p-2 bg-violet-100 rounded-full">
                    <ShieldCheck className="w-8 h-8 text-violet-600" />
                </div>
                {/* Live Indicator */}
                <div className="flex items-center gap-2 text-violet-600 font-bold tracking-widest text-sm uppercase">
                    <Radio className="w-4 h-4 text-green-500 animate-pulse" />
                </div>

                {/* Message Slider */}
                <div className="h-16 flex items-center justify-center text-center"> 
                    <p className="text-gray-600 text-sm font-medium font-['Inter'] leading-relaxed transition-all duration-500">
                        {messages[currentSlide]}
                    </p>
                </div>

                {/* Pagination Dots */}
                <div className="flex gap-2">
                    {messages.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${currentSlide === i ? 'bg-violet-600 w-4' : 'bg-violet-200'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};