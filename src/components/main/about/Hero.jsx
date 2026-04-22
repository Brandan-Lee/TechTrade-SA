import React from "react";
import HeroImage from "../../../assets/hero.png";

export default function Hero() {
    return (
        <section className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] overflow-hidden bg-neutral-900">
            {/* Background image */}
            <img src={HeroImage} 
                alt="TechTrade Background"
                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
            />

            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center md:justify-start px-4 sm:px-10 md:px-16 lg:px-24`}>
                <div className={`max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6`}>
                    <h1 className={`text-white font-black italic uppercase tracking-wider text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-[1.1]`}>
                        Verified Trade. Managed Trust
                    </h1>
                </div>

                <div className={`w-16 md:w-24 h-1.5 md:h-2 bg-pink-600 rounded-full shadow-[0_0_15px_rgba(219,39,119,0.5)]`} />

                <p className="text-gray-200 font-medium max-w-[280px] sm:max-w-sm md:max-w-md text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
                    South Africa's premier destination for secure high-end hardware exchange
                </p>
            </div>
        </section>
    );
}