import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import ListingCard from "../../ListingCard";

// 1. DATA LIVES OUTSIDE (Simulating a DB table)
const MOCK_DATA = [
    { title: "NVIDIA RTX 4090 Founders Edition", price: "R28,500", seller: "Maxwell Chen", location: "Gauteng", status: "Available Now", condition: "Like New", image: "https://placehold.co/600x400/2e1065/ffffff?text=RTX+4090" },
    { title: "AMD Ryzen 9 7950X3D Processor", price: "R9,200", seller: "Sarah van der Berg", location: "Western Cape", status: "Offer Received", condition: "New", image: "https://placehold.co/600x400/2e1065/ffffff?text=Ryzen+9" },
    { title: "Samsung 990 PRO 4TB NVMe Gen4", price: "R7,200", seller: "Amara Okonkwo", location: "KwaZulu-Natal", status: "Payment Pending", condition: "New", image: "https://placehold.co/600x400/2e1065/ffffff?text=Samsung+990" },
    { title: "Intel Core i9-14900K Raptor Lake", price: "R8,800", seller: "Sarah van der Berg", location: "Western Cape", status: "Available Now", condition: "New", image: "https://placehold.co/600x400/2e1065/ffffff?text=i9-14900K" }
];

export default function MarketPlace() {
    const location = useLocation();
    const [displayListings, setDisplayListings] = useState(MOCK_DATA);
    const [loading, setLoading] = useState(false);

    const formatPrice = (str) => Number(str.replace(/[^0-9.-]+/g, ""));

    useEffect(() => {
    const fetchAndFilter = async () => {
        setLoading(true);

        //Grab the state from the URL
        const state = location.state;
        const activeFilters = state?.appliedFilters;

        //Explicitly check if state is missing or filters are cleared
        const hasNoFilters = !activeFilters || 
            Object.values(activeFilters).every(v => v === null || v === "");

        if (hasNoFilters) {
            setDisplayListings(MOCK_DATA); // Revert to full original list
            setLoading(false);
            return; // Stop here
        }

        // 3. Otherwise, proceed with filtering
        const filtered = MOCK_DATA.filter(item => {
            const price = formatPrice(item.price);
            const min = activeFilters.priceMin ? Number(activeFilters.priceMin) : 0;
            const max = activeFilters.priceMax ? Number(activeFilters.priceMax) : Infinity;

            const matchesCategory = !activeFilters.category || 
                item.title.toLowerCase().includes(activeFilters.category.toLowerCase().slice(0, -2));
            
            const matchesCondition = !activeFilters.condition || 
                item.condition === activeFilters.condition;

            const matchesPrice = price >= min && price <= max;

            return matchesCategory && matchesCondition && matchesPrice;
        });

        setDisplayListings(filtered);
        setLoading(false);
    };

    fetchAndFilter();
}, [location.state]); // This dependency is key—it fires whenever navigate() is called

    return (
        <section className="w-full bg-neutral-100 py-12 px-4 min-h-screen">
            <div className="max-w-[1440px] mx-auto">
                <div className="mb-10">
                    <h1 className="text-purple-600 text-4xl font-black uppercase tracking-tighter">
                        {location.state?.appliedFilters?.category || "Main Marketplace"}
                    </h1>
                    <p className="text-gray-500 text-lg font-medium h-7">
                        {loading ? "Updating results..." : `Showing ${displayListings.length} items`}
                    </p>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {!loading && displayListings.map((item) => (
                            <motion.div
                                key={item.title}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ListingCard {...item} isFeatured={false} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {!loading && displayListings.length === 0 && (
                    <div className="w-full py-20 text-center text-gray-400 font-bold text-xl">
                        No hardware found. Try clearing your filters.
                    </div>
                )}
            </div>
        </section>
    );
}