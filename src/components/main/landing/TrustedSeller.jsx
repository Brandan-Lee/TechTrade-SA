import React from 'react';
import TrustedSellerCard from '../../TrustedSellerCard';

export default function TrustedSellers() {
    const sellers = [
        { name: "David Nkosi", tier: "Elite Tier", rating: "4.8", reviews: "692", sales: "289", specialty: "Build Specialist", image: "https://i.pravatar.cc/150?u=1" },
        { name: "Amara Okonkwo", tier: "Elite Tier", rating: "4.9", reviews: "956", sales: "413", specialty: "Storage Pro", image: "https://i.pravatar.cc/150?u=2" },
        { name: "Maxwell Chen", tier: "Elite Tier", rating: "4.9", reviews: "847", sales: "342", specialty: "GPU Specialist", image: "https://i.pravatar.cc/150?u=3" },
        { name: "Sarah v.d. Berg", tier: "Master Tier", rating: "5.0", reviews: "1204", sales: "521", specialty: "Custom Builds", isMaster: true, image: "https://i.pravatar.cc/150?u=4" }
    ];

    return (
        <section className="w-full bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 py-12 px-4">
            <div className="max-w-[1440px] mx-auto">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-white text-3xl font-black">Trusted Sellers</h2>
                        </div>
                            
                        <p className="text-purple-100/70 text-sm mt-1">Elite Verified Merchants</p>
                    </div>
                </div>

                {/* Scrollable Container */}
                <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x touch-pan-x">
                    {sellers.map((seller, index) => (
                        <div key={index} className='snap-start'>
                            <TrustedSellerCard {...seller} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}