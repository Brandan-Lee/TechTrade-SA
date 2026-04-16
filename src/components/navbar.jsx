import React from 'react';
import { Menu, ShoppingCart, Bell, User } from 'lucide-react';
import SearchBar from './searchbar';

export default function NavBar({ toggleMenu }) {
    const navLinks = [
        "About Us",
        "Marketplace",
        "Sell your Gear",
        "Build Doctor",
        "Login/Register",
        "More"
    ]

    return (
        <div className="w-full max-w-[1440px] flex flex-col lg:flex-row items-center gap-4 lg:gap-10 px-2 lg:px-8 py-4 lg:py-2">
            {/* Left Side: Logo and Brand */}
            <div className="flex items-center gap-3">
                {/* Mobile Burger */}
                <button
                    onClick={toggleMenu}
                    className='lg:hidden w-10 h-10 bg-white/10 rounded-lg flex justify-center items-center outline outline-1 outline-white/20'
                >
                    <Menu className='w-6 h-6 text-white' />
                </button>

                {/* Logo and Branding */}
                <div className="flex items-center gap-2 lg:gap-4">
                    <img src="/logo.png" alt="Logo" className='w-10 h-10 lg:w-16 lg:h-16 object-contain' />
                    <h1 className='text-white text-xl lg:text-4xl font-black tracking-tighter whitespace-nowrap'>
                        TechTrade SA
                    </h1>
                </div>

                {/* Action Icons (Mobile/Tablet) */}
                <div className="flex lg:hidden items-center gap-2">
                    {/* Shopping Cart */}
                    <button className='w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center'>
                        <ShoppingCart className='w-4 h-4 text-white' />
                    </button>
                    {/* Bell */}
                    <div className="relative">
                        <button className="w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center">
                            <Bell className="w-5 h-5 text-white" />
                        </button>
                        <div className="w-2 h-2 absolute right-2 top-1.5 bg-amber-500 rounded-full border border-purple-600" />
                    </div>
                    {/* User */}
                    <button className='w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center'>
                        <User className='w-4 h-4 text-white' />
                    </button>
                </div>
            </div>

            {/* Right Container: Links, Icons and Search */}
            <div className="w-full flex flex-col gap-3 lg:gap-2 flex-1">
                {/* Upper Row (Desktop) */}
                <div className="hidden lg:flex items-center justify-between w-full">
                    <nav className="flex items-center gap-6 xl:gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link}
                                className='text-white text-sm xl:text-base font-bold hover:text-pink-400 transition-colors whitespace-nowrap'>
                                    {link}
                                </button>
                        ))}
                    </nav>

                    {/* Action Icons (Mobile/Tablet) */}
                    <div className="flex items-center gap-3">
                        {/* Shopping Cart */}
                        <button className='w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center outline outline-1 outline-white/20 hover:bg-pink-400/20'>
                            <ShoppingCart className='w-4 h-4 text-white' />
                        </button>
                        {/* Bell */}
                        <div className="relative">
                            <button className="w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center outline outline-1 outline-white/20 hover:bg-pink-400/20">
                                <Bell className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-2 h-2 absolute right-2 top-1.5 bg-amber-500 rounded-full border border-purple-600" />
                        </div>
                        {/* User */}
                        <button className='w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center outline outline-1 outline-white/20 hover:bg-pink-400/20'>
                            <User className='w-4 h-4 text-white' />
                        </button>
                    </div>
                </div>

                {/* Lower Row: Search Bar */}
                <div className="w-full lg:pt-1">
                    <SearchBar className="max-w-none lg:max-w-[800px]" />
                </div>
            </div>
        </div>
    );
}