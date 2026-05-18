import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../main/common/ScrollToTop";
import AdminSidebar from "./common/AdminSideBar";
import { Menu } from "lucide-react"; // Import Menu icon for the mobile drawer toggle button

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Auto-scroll the main panel and automatically shut the mobile drawer view on URL changes
    useEffect(() => {
        setIsSidebarOpen(false); // Closes drawer when navigating via links
        
        const mainPanel = document.getElementById("admin-main-content");
        if (mainPanel) mainPanel.scrollTo(0, 0);
    }, [location]);

    return (
        <div 
            className="flex h-screen w-screen overflow-hidden bg-[#090614]" 
            data-theme="techtrade"
        >

            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 h-full shrink-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>

            <div className="flex flex-col flex-grow h-full overflow-hidden">
                
                {/* Responsive Header Row */}
                <header className="h-16 border-b border-neutral-800 bg-[#0d0a1f] flex items-center justify-between px-4 sm:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile & Tablet Hamburger Toggle Menu Trigger Button */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="btn btn-ghost btn-sm btn-circle lg:hidden text-neutral-400 hover:text-white"
                            aria-label="Open Navigation Sidebar"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="text-sm font-medium text-neutral-400 hidden sm:block">
                            Operational Environment: <span className="text-emerald-400 font-semibold">Live</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-mono text-neutral-300 bg-[#171233] px-2 py-1 rounded">Root Admin</span>
                    </div>
                </header>

                {/* Core Routed Workspace Pages Frame Frame View */}
                <main 
                    id="admin-main-content" 
                    className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8"
                >
                    <ScrollToTop />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}