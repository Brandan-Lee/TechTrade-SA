import {
    ChevronRight,
    Clock,
    Eye,
    Info,
    MapPin,
    ShieldCheck,
    Star,
} from "lucide-react";
import React, { useState } from "react";
import PurpleGradientButton from "../../components/ui/PurpleGradientButton";
import AuthInput from "../../components/ui/AuthInput";
import AlternateButton from "../../components/ui/AlternateButton";
import ActiveListingCard from "../../components/main/profile/ActiveListingCard";
import { useNavigate } from "react-router-dom";

export default function ViewListing() {
    const [offerValue, setOfferValue] = useState("");
    const [description, setDescription] = useState("");
    const [activeImg, setActiveImg] = useState(0);
    const navigate = useNavigate();

    const productImages = [
        "https://placehold.co/600x600/581c87/white?text=Main+View",
        "https://placehold.co/600x600/7c3aed/white?text=Front+Angle",
        "https://placehold.co/600x600/db2777/white?text=Back+Ports",
        "https://placehold.co/600x600/4c1d95/white?text=Side+Profile",
        "https://placehold.co/600x600/9d174d/white?text=Box+Content",
        "https://placehold.co/600x600/6d28d9/white?text=Serial+Number",
    ];

    const specs = [
        { label: "Brand", value: "NVIDIA" },
        { label: "Model", value: "GeForce RTX 3080 Ti Founders Edition" },
        { label: "Memory", value: "12GB GDDR6X" },
        { label: "Core Clock", value: "1665 MHz" },
        { label: "Boost Clock", value: "1770 MHz" },
        { label: "Interface", value: "PCIe 4.0 x16" },
        { label: "Power Connectors", value: "2x 8-pin" },
        { label: "TDP", value: "350W" },
        { label: "Outputs", value: "3x DisplayPort 1.4a, 1x HDMI 2.1" },
        { label: "Warranty", value: "No Warranty (Private Sale)" },
    ];

    const handleViewListing = (e) => {
		e.stopPropagation();
		navigate(`/view-listing`);
	}

    const handleViewProfile = (e) => {
        e.stopPropagation();
        navigate(`/profile`);
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-['Inter']">
            <main className="max-w-6xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: Visuals & Specs */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Image gallery Container */}
                    <div className="flex flex-col gap-3">
                        <div className="aspect-square w-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 relative group">
                            <img
                                src={productImages[activeImg]}
                                alt="Product"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            
                            {/* Overlay Counter - Inside relative parent */}
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black tracking-widest z-10">
                                {activeImg + 1} / {productImages.length}
                            </div>

                            {/* Pagination Dots - Inside relative parent */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                {productImages.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            activeImg === i ? "w-6 bg-violet-500" : "bg-white/50 w-1.5"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Thumbnail Grid - Responsive 6-col */}
                        <div className="grid grid-cols-6 gap-2">
                            {productImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                        activeImg === i
                                            ? "border-pink-500 scale-95 ring-2 ring-purple-700/20"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${i}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Info Card */}
                    <div className="bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-xl p-6 shadow-xl border border-pink-600/30 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                            <h1 className="text-2xl md:text-3xl font-black leading-tight">
                                NVIDIA RTX 3080 Ti <br /> Founders Edition
                            </h1>

                            <div className="md:text-right shrink-0">
                                <p className="text-pink-500 text-3xl font-black italic drop-shadow-sm">
                                    R12,500
                                </p>
                                <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded text-white text-[10px] font-black tracking-widest uppercase shadow-lg">
                                    Excellent Condition
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-6 mb-6 text-white/60">
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-tighter">
                                <Eye size={14} className="text-pink-400" /> 143 views
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-tighter">
                                <Clock size={14} className="text-pink-400" /> Posted 2 days ago
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-white/10 pt-6">
                            <h3 className="text-lg font-black uppercase tracking-tight text-pink-400 flex items-center gap-2">
                                <Info size={18} /> Description
                            </h3>
                            <p className="text-white/80 leading-relaxed text-sm md:text-base font-medium italic">
                                Selling my NVIDIA GeForce RTX 3080 Ti Founders Edition in
                                excellent condition. Card has been well maintained in a
                                climate-controlled environment. Never overclocked. Perfect for 4K gaming.
                            </p>
                        </div>
                    </div>

                    {/* Technical Specifications */}
                    <div className="bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-xl p-6 shadow-xl text-white">
                        <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Technical Specifications</h2>
                        <div className="grid grid-cols-1 gap-1">
                            {specs.map((spec, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-pink-600/30 last:border-0 hover:bg-white/5 transition-colors px-2 rounded">
                                    <span className="text-white/60 text-sm font-semibold">{spec.label}</span>
                                    <span className="text-white text-sm font-bold text-right ml-4">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Seller Info & Offers */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Seller Profile Card */}
                    <div className="bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 rounded-xl p-6 shadow-xl border border-purple-700/20 text-white">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-14 h-14 rounded-full border-2 border-white flex justify-center items-center overflow-hidden bg-purple-700 shadow-xl shrink-0">
                                <img src="https://placehold.co/100x100" alt="Seller" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-black text-lg leading-tight">Brandan-Lee James S.</h4>
                                <div className="flex items-center gap-2 text-[10px] mt-1 font-bold opacity-90 uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><ShieldCheck size={12} /> Verified Seller</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><MapPin size={12} /> Gauteng</span>
                                </div>
                            </div>
                        </div>
                        
                        <PurpleGradientButton
                            onClick={handleViewProfile}
                            label="View Profile"
                        />

                        {/* Trust Metrics - Inside the purple/pink card container or just below */}
                        <div className="grid grid-cols-3 gap-2 text-center bg-black/10 rounded-xl py-4 border border-white/10 mt-6">
                            <div>
                                <div className="flex items-center justify-center gap-1 text-white text-xl font-black italic">
                                    <Star size={16} fill="currentColor" className="text-amber-400" /> 4.9
                                </div>
                                <p className="text-[9px] font-black uppercase opacity-70 tracking-widest mt-1">Trust Score</p>
                            </div>
                            <div>
                                <p className="text-xl font-black italic">24</p>
                                <p className="text-[9px] font-black uppercase opacity-70 tracking-widest mt-1">Trades</p>
                            </div>
                            <div>
                                <p className="text-xl font-black italic">100%</p>
                                <p className="text-[9px] font-black uppercase opacity-70 tracking-widest mt-1">Positive</p>
                            </div>
                        </div>
                    </div>

                    {/* Make an offer card */}
                    <div className="bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 rounded-xl p-6 shadow-xl border border-pink-600/30 text-white">
                        <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Make an offer</h3>
                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-lg z-10">R</span>
                                <AuthInput
                                    type="number"
                                    value={offerValue}
                                    onChange={(e) => setOfferValue(e.target.value)}
                                    className="pl-10" // Make room for the 'R'
                                />
                            </div>

                            <label className="text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                                Buyers Note
                            </label>
                            <textarea
                                className="w-full h-48 bg-slate-100 rounded-xl px-4 border transition-all text-gray-900 pr-12 focus:outline-none focus:ring-2 ring-pink-500 text-base font-medium leading-relaxed rounded-[2rem] shadow-inner placeholder:text-gray-500"
                                placeholder="Buyers Note"
                                placeholder="Buyers Note"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
					        />

                            <PurpleGradientButton
                                label="SUBMIT OFFER"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <AlternateButton label="VIEW SELLER SHOP" />
                        <button 
                            className="w-full max-w-xs h-[56px] rounded-md border-2 border-red-500/50 
                                    text-red-500 font-bold tracking-tight hover:bg-red-500 
                                    hover:text-white hover:border-red-500 transition-all 
                                    duration-300 uppercase text-sm active:scale-95 mx-auto"
                        >
                            Report this Listing
                        </button>
                    </div>

                    {/* Similar Listings */}
                    <div
                        onClick={handleViewListing}
                        className="flex flex-col gap-4 mt-4"
                    >
                        <h3 className="text-violet-800 text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            Similar Listings <ChevronRight size={20} />
                        </h3>
                        <div className="flex flex-col gap-4">
                             <ActiveListingCard
                                    title="NVIDIA RTX 3080 Ti Founders Edition"
                                    price="12,500"
                                    condition="Excellent"
                                    time="Posted 2 days ago"
                                    views="143"
                                    image="https://placehold.co/200"
                                />
                                <ActiveListingCard
                                    title="AMD Ryzen 9 7950X (Sealed)"
                                    price="9,800"
                                    condition="Brand New"
                                    time="Posted 5 days ago"
                                    views="98"
                                    image="https://placehold.co/200"
                                />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}