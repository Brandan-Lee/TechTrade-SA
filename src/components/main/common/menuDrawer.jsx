import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function MenuDrawer({ isOpen, closeMenu }) {
    const [activeIndex, setActiveIndex] = useState(null);
    
    const menuItems = [
        "About Us",
        "Main Marketplace",
        "Sell Your Gear",
        "Build Doctor",
        "My Offers",
        "divider",
        "Settings",
        "Contact Us",
        "Log in/Register"
    ];

    return (
        <>
            {/* Close Menu when clicking outside */}
            <div className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeMenu} 
            />

            {/* Drawer Panel */}
            <aside
                className={`fixed top-0 left-0 w-72 h-full z-[70] bg-gradient-to-b from-pink-600 via-pink-400 to-pink-600 shadow-2xl transition-transform duration-300 ease-in-out transform ${ isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full px-6 pt-6 gap-8">
                    {/* Header  */}
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-white text-xl font-bold font-['Inter']">Menu</h2>
                        <button 
                            onClick={closeMenu}
                            className='p-1 hover:bg-white/10 rounded-full transition-colors'>
                                <X className='w-8 h-8 text-violet-800' />
                            </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className='flex flex-col items-end gap-[-3px]'>
                        {menuItems.map((item, index) => {
                            if (item === "divider") {
                                return <div key={index} className='w-56 h-px my-2 border-t border-violet-800' />;
                            }

                            const isActive = activeIndex === index;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`w-56 h-12 flex items-center px-4 rounded-lg text-white text-base font-semibold font-['Inter'] relative overflow-hidden 
                                        ${isActive
                                            ? 'bg-white/30 shadow-inner translate-x-[-8px] scale-105'
                                            : 'hover:bg-white/10'
                                        }`}
                                    >
                                        {/* Left accent bar that appears when clicked */}
                                        {isActive && (
                                            <div className="absolute left-0 w-1.5 h-full bg-violet-800" />
                                        )}
                                        <span className={isActive ? 'pl-2' : ''}>{item}</span>
                                    </button>
                            )
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}