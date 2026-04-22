import React from 'react';

export default function WelcomeBanner() {
    return (
        <div className="w-full bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 overflow-hidden border-b border-white/10">
            <div className="max-w-[1440px] mx-auto h-10 lg:h-12 flex items-center justify-start px-4">
                <h2 className="text-white text-sm md:text-base lg:text-lg font-black font-['Inter'] tracking-tight text-center">
                    WELCOME TO TECHTRADE SA
                </h2>
            </div>
        </div>
    );
}