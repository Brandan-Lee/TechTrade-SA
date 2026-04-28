import React from "react";
import { MapPin, User, Zap, Award } from "lucide-react";

export default function ListingCard({ title, price, seller, location, status, condition, image, isFeatured = false}) {
    const statusStyles = {
        "Available Now": "bg-green-100 outline-emerald-500 text-emerald-500",
        "Offer Received": "bg-amber-100 outline-amber-500 text-amber-500",
        "Payment Pending": "bg-purple-200 outline-purple-700 text-purple-700",
    };

    return (
        <div className={`w-full bg-white rounded-2xl shadow-lg outline outline-2 outline-offset-[-2px] outline-pink-600 overflow-hidden flex flex-col transition-all hover:shadow-2xl`}>
            {/* Image Header Area */}
            <div className="relative h-60 w-full bg-neutral-100">
                <img src={image} alt={title} className="w-full h-full object-cover" />

                {/* Featured Badge */}
                {isFeatured && (
                    <div className={`absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-md flex items-center gap-1.5 z-10`}>
                        <Award className="w-3.5 h-3.5 text-white" />
                        <span className="text-white text-xs font-black tracking-tight">Featured</span>
                    </div>
                )}

                {/* Condition Badge */}
                <div className={`absolute top-3 right-3 px-3 py-2 bg-white/95 rounded-lg shadow-md text-gray-800 text-xs font-bold`}>
                    {condition}
                </div>

                {/* Status Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end">
                    <div className={`px-3 py-1 rounded-full outline outline-2 flex items-center gap-2 ${statusStyles[status] || statusStyles["Available Now"]}`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse bg-current`} />
                        <span className="text-[10px] font-bold uppercase">{status}</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="text-gray-800 text-lg font-bold leading-tight h-14 line-clamp-2">{title}</h3>

                <div className="pb-3 border-b-2 border-pink-600 space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                        <User className="w-4 h-4 text-purple-700" />
                        <span className="text-sm font-semibold">Sold by {seller}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-bold">{location}</span>
                    </div>
                </div>

                <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-purple-700 text-3xl font-black">{price}</span>
                    <span className="text-gray-400 text-sm font-semibold">or best offer</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-auto pt-4">
                    <button className={`py-3 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 text-white font-bold rounded-md outline outline-2 outline-pink-600 hover:brightness-110 active:scale-95 transition-all`}>
                        VIEW
                    </button>
                    <button className={`py-3 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 text-white font-bold rounded-md outline outline-2 outline-pink-600 hover:brightness-110 active:scale-95 transition-all`}>
                        OFFER
                    </button>
                </div>
            </div>
        </div>
    )
}