import React, { useEffect, useRef, useState } from "react";
import {
    Menu,
    ShoppingCart,
    Bell,
    User,
    UserCircle,
    File,
    Settings,
    LogOut,
} from "lucide-react";
import SearchBar from "./searchbar";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";

export default function NavBar({ toggleMenu, onLoginClick, onNotificationClick }) {
    const location = useLocation();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropDownRef = useRef(null);

    const menuItems = [
        { label: "Manage My Profile", icon: <UserCircle size={18} />, path: "/profile" },
        { label: "View My Offers", icon: <File size={18} />, path: "/offers" },
        { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
        { label: "Logout", icon: <LogOut size={18} />, path: "/logout", isDanger: true },
    ];

    const navLinks = [
        { name: "About Us", path: "/about" },
        { name: "Marketplace", path: "/marketplace" },
        { name: "Sell your Gear", path: "/sell" },
        { name: "Build Doctor", path: "/build-doctor" },
        { name: "Login/Register", isModal: true },
        { name: "Contact Us", path: "/contact" },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const UserMenu = () => (
        <div className="relative shrink-0" ref={dropDownRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                }}
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                className={`w-9 h-9 rounded-lg flex justify-center items-center outline outline-1 transition-all ${
                    isUserDropdownOpen
                        ? "bg-pink-600 outline-pink-500 shadow-[0_0_15px_rgba(219,39,119,0.6)]"
                        : "bg-white/10 outline-white/20 hover:bg-pink-400/20"
                }`}
            >
                <User className="w-4 h-4 text-white" />
            </button>

            {isUserDropdownOpen && (
                <div
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                    className="absolute right-0 top-[120%] w-64 z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <div className="bg-gradient-to-b from-pink-600 via-pink-500 to-pink-600 rounded-2xl shadow-2xl border border-white/20 p-2 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10 mb-1">
                            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                                Logged in as
                            </p>
                            <p className="text-white font-bold truncate">Username</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            {menuItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.path}
                                    onClick={() => setIsUserDropdownOpen(false)}
                                    className={`w-full h-11 flex items-center gap-3 px-4 rounded-xl text-sm font-bold transition-all ${
                                        item.isDanger
                                            ? "text-red-100 hover:bg-red-500/30"
                                            : "text-white hover:bg-white/20 hover:translate-x-1"
                                    }`}
                                >
                                    <span className={item.isDanger ? "text-red-200" : "text-white/80"}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-[1440px] flex flex-col lg:flex-row items-center gap-4 lg:gap-10 px-2 lg:px-8 py-4 lg:py-2 mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between w-full lg:w-auto lg:justify-start gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden w-10 h-10 bg-white/10 rounded-lg flex justify-center items-center outline outline-1 outline-white/20"
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>

                    <Link to="/" className="flex items-center gap-1 lg:gap-4 group cursor-pointer">
                        <img src={logo} alt="Logo" className="w-10 h-10 lg:w-16 lg:h-16 object-cover" />
                        <h1 className="text-white text-xl lg:text-4xl font-black tracking-tighter whitespace-nowrap">
                            TechTrade SA
                        </h1>
                    </Link>
                </div>

                {/* Mobile Right Icons - Flat layout to prevent stacking */}
                <div className="flex lg:hidden items-center gap-2">
                    <button className="w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center">
                        <ShoppingCart className="w-4 h-4 text-white" />
                    </button>
                    <div className="relative">
                        <button
                            onClick={onNotificationClick} 
                            className="w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center"
                        >
                            <Bell className="w-5 h-5 text-white" />
                        </button>
                        <div className="w-2 h-2 absolute right-2 top-1.5 bg-amber-500 rounded-full border border-purple-600" />
                    </div>
                    <UserMenu />
                </div>
            </div>

            {/* Desktop & Search Section */}
            <div className="w-full flex flex-col gap-3 lg:gap-2 flex-1">
                <div className="hidden lg:flex items-center justify-between w-full">
                    <nav className="flex items-center gap-6 xl:gap-8">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const commonStyles = `text-white text-sm xl:text-base font-bold whitespace-nowrap transition-all duration-200 pb-1 ${
                                isActive ? "border-b-2 border-pink-500 text-pink-400" : "hover:text-pink-400 border-b-2 border-transparent"
                            }`;

                            return link.isModal ? (
                                <button key={link.name} onClick={onLoginClick} className={commonStyles}>
                                    {link.name}
                                </button>
                            ) : (
                                <Link key={link.name} to={link.path} className={commonStyles}>
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button className="w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center outline outline-1 outline-white/20 hover:bg-pink-400/20">
                            <ShoppingCart className="w-4 h-4 text-white" />
                        </button>
                        <div className="relative">
                            <button 
                                onClick={onNotificationClick}
                                className="w-9 h-9 bg-white/10 rounded-lg flex justify-center items-center outline outline-1 outline-white/20 hover:bg-pink-400/20"
                            >
                                <Bell className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-2 h-2 absolute right-2 top-1.5 bg-amber-500 rounded-full border border-purple-600" />
                        </div>
                        <UserMenu />
                    </div>
                </div>

                <div className="w-full lg:pt-1">
                    <SearchBar className="max-w-none lg:max-w-[800px]" />
                </div>
            </div>
        </div>
    );
}