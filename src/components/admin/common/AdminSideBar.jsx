import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { 
    LayoutDashboard, 
    ShieldCheck, 
    Cpu, 
    MessageSquareCode, 
    UserX, 
    FileWarning, 
    Terminal, 
    LogOut 
} from "lucide-react";

export default function AdminSidebar({ closeSidebar }) {
    // Cyberpunk custom link highlighting styling logic
    const linkClasses = ({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
            isActive 
                ? "bg-primary text-primary-content shadow-lg shadow-primary/30 font-semibold" 
                : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
        }`;

    return (
        <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col justify-between h-full text-base-content">
            <div>
                {/* Brand Logo Header Workspace */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-base-300 bg-base-300/40">
                    <Link 
                        to="/admin" 
                        onClick={closeSidebar} 
                        className="text-neutral-100 font-bold text-base tracking-wide flex items-center gap-2 group"
                    >
                        <img 
                            src={logo} 
                            alt="TechTrade" 
                            className="w-8 h-8 object-contain group-hover:rotate-12 transition-transform duration-300" 
                        /> 
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-purple-400">
                            TechTrade Admin
                        </span>
                    </Link>

                    {/* Mobile Drawer Close Toggle Trigger */}
                    <button 
                        onClick={closeSidebar} 
                        className="btn btn-ghost btn-sm btn-circle lg:hidden text-base-content/70 hover:text-neutral-100"
                        aria-label="Close Sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Operations Navigation Control Panel */}
                <nav className="p-4 space-y-1.5 overflow-y-auto">
                    <div className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest px-4 mb-2">
                        Main Control Operations
                    </div>
                    
                    <NavLink to="/admin" end onClick={closeSidebar} className={linkClasses}>
                        <LayoutDashboard className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" /> 
                        <span>Main Dashboard</span>
                    </NavLink>

                    <NavLink to="/admin/roles" onClick={closeSidebar} className={linkClasses}>
                        <ShieldCheck className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" /> 
                        <span>User Role Management</span>
                    </NavLink>

                    <NavLink to="/admin/database" onClick={closeSidebar} className={linkClasses}>
                        <Cpu className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" /> 
                        <span>Tech Database</span>
                    </NavLink>

                    <NavLink to="/admin/messages" onClick={closeSidebar} className={linkClasses}>
                        <MessageSquareCode className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" /> 
                        <span>Our Messages</span>
                    </NavLink>

                    <div className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest px-4 pt-4 mb-2">
                        Moderation Queues
                    </div>

                    <NavLink to="/admin/reported-users" onClick={closeSidebar} className={linkClasses}>
                        <UserX className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" /> 
                        <span>Reported Users</span>
                    </NavLink>

                    <NavLink to="/admin/reported-listings" onClick={closeSidebar} className={linkClasses}>
                        <FileWarning className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" /> 
                        <span>Reported Listings</span>
                    </NavLink>

                    <div className="text-[10px] font-bold text-error/80 uppercase tracking-widest px-4 pt-4 mb-2">
                        Emergency Core
                    </div>

                    {/* Nuke Suite highlighted with warning states */}
                    <NavLink 
                        to="/admin/nuke" 
                        onClick={closeSidebar} 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group border ${
                                isActive 
                                    ? "bg-error text-error-content border-error shadow-lg shadow-error/20" 
                                    : "bg-error/10 border-error/20 text-error hover:bg-error hover:text-error-content hover:border-error"
                            }`
                        }
                    >
                        <Terminal className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        <span>Nuke Suite</span>
                    </NavLink>
                </nav>
            </div>

            {/* Sidebar Footer Link Block */}
            <div className="p-4 border-t border-base-300 bg-base-300/20">
                <Link 
                    to="/" 
                    className="btn btn-outline btn-sm w-full gap-2 border-base-300 text-base-content/70 hover:bg-base-300 hover:text-neutral-100 normal-case rounded-xl"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Exit to Marketplace</span>
                </Link>
            </div>
        </aside>
    );
}