import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Cpu, Wifi, FilterX } from "lucide-react";
import ListingCard from "../../ListingCard";

// Simulated DB
const MOCK_DATA = [
    {
        id: 1,
        title: "NVIDIA RTX 4090 Founders Edition",
        price: "R28,500",
        seller: "Maxwell Chen",
        location: "Gauteng",
        status: "Available Now",
        condition: "Like New",
        image: "https://placehold.co/600x400/2e1065/ffffff?text=RTX+4090",
    },
    {
        id: 2,
        title: "AMD Ryzen 9 7950X3D Processor",
        price: "R9,200",
        seller: "Sarah van der Berg",
        location: "Western Cape",
        status: "Offer Received",
        condition: "New",
        image: "https://placehold.co/600x400/2e1065/ffffff?text=Ryzen+9",
    },
    {
        id: 3,
        title: "Samsung 990 PRO 4TB NVMe Gen4",
        price: "R7,200",
        seller: "Amara Okonkwo",
        location: "KwaZulu-Natal",
        status: "Payment Pending",
        condition: "New",
        image: "https://placehold.co/600x400/2e1065/ffffff?text=Samsung+990",
    },
    {
        id: 4,
        title: "Intel Core i9-14900K Raptor Lake",
        price: "R8,800",
        seller: "Sarah van der Berg",
        location: "Western Cape",
        status: "Available Now",
        condition: "New",
        image: "https://placehold.co/600x400/2e1065/ffffff?text=i9-14900K",
    },
];

export default function MarketPlace() {
    const location = useLocation();
    const [displayListings, setDisplayListings] = useState(MOCK_DATA);
    const [loading, setLoading] = useState(false);

    const formatPrice = (str) => Number(str.replace(/[^0-9.-]+/g, ""));

    useEffect(() => {
        const fetchAndFilter = async () => {
            setLoading(true);
            const state = location.state;
            const activeFilters = state?.appliedFilters;

            const hasNoFilters =
                !activeFilters ||
                Object.values(activeFilters).every((v) => v === null || v === "");

            // Simulate network latency for "scanning" feel
            await new Promise(resolve => setTimeout(resolve, 400));

            if (hasNoFilters) {
                setDisplayListings(MOCK_DATA);
                setLoading(false);
                return;
            }

            const filtered = MOCK_DATA.filter((item) => {
                const price = formatPrice(item.price);
                const min = activeFilters.priceMin ? Number(activeFilters.priceMin) : 0;
                const max = activeFilters.priceMax ? Number(activeFilters.priceMax) : Infinity;

                const matchesCategory =
                    !activeFilters.category ||
                    item.title.toLowerCase().includes(activeFilters.category.toLowerCase().slice(0, -2));

                const matchesCondition =
                    !activeFilters.condition ||
                    item.condition === activeFilters.condition;

                const matchesPrice = price >= min && price <= max;

                return matchesCategory && matchesCondition && matchesPrice;
            });

            setDisplayListings(filtered);
            setLoading(false);
        };

        fetchAndFilter();
    }, [location.state]);

    return (
        <section className="w-full bg-[#050505] py-12 px-6 min-h-screen relative overflow-hidden">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="mb-12 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-white text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                                {location.state?.appliedFilters?.category || "All Hardware"}
                            </h1>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md">
                                    <Wifi size={12} className="text-emerald-500" />
                                    <p className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">
                                        {loading ? "Scanning..." : `Signals Detected: ${displayListings.length}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <div className="h-px w-full bg-gradient-to-r from-fuchsia-500/50 via-white/10 to-transparent" />
                </header>

                {/* Grid Section */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {!loading &&
                            displayListings.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                >
                                    {/* Pass extra props for cyberpunk style if ListingCard supports them */}
                                    <ListingCard {...item} theme="dark" />
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                <AnimatePresence>
                    {!loading && displayListings.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
                        >
                            <FilterX size={48} className="text-slate-700 mb-4" />
                            <h2 className="text-slate-400 font-black uppercase tracking-widest text-xl">
                                Zero Signals Found
                            </h2>
                            <p className="text-slate-600 text-xs uppercase tracking-widest mt-2">
                                Adjust your frequency (filters) to scan again.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}