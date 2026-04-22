import React from "react";
import { Star, CheckCircle } from 'lucide-react';

export default function TrustedSellerCard({ name, tier, rating, reviews, sales, specialty, image, isMaster }) {
    return (
        <div className={`min-w-[320px] h-64 p-6 bg-white rounded-2xl shadow-xl border-2 flex flex-col gap-4 shrink-0 transition-transform hover:scale-[1.02] ${isMaster ? 'border-pink-600' : 'border-purple-700/30'}`}>
            {/* Profile Header */}
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    <img src={image} 
                        alt={name}
                        className="w-16 h-16 rounded-full border-4 border-purple-700 object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border shadow-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-gray-800 text-lg font-bold">{name}</h3>
                    <div className="mt-1 px-3 py-0.5 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full w-max">
                        <span className="text-white text-[10px] font-bold uppercase tracking-wide">{tier}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-gray-800 font-bold">{rating}</span>
                    </div>
                    <p className="text-gray-500 text-[10px]">{reviews} reviews</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="text-gray-800 font-bold block">{sales}</span>
                    <p className="text-gray-500 text-[10px]">Total Sales</p>
                </div>
            </div>

            {/* Action Area */}
            <div className="flex justify-between items-center mt-auto">
                <div className="px-3 py-1.5 bg-green-100 rounded-lg border border-emerald-500/30">
                    <span className="text-emerald-500 text-[10px] font-bold">
                        {specialty || "Top Seller"}
                    </span>
                </div>

                <button className="px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-600 text-white text-[10px] font-bold rounded-lg transition-all">
                    VIEW SHOP
                </button>
            </div>
        </div>
    );
}