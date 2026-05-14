import { Calendar1, Cpu, MapPin, ShieldCheck, Trophy } from "lucide-react";
import React, { useState } from "react";
import StatCard from "../../components/main/profile/StatCard";
import PurpleGradientButton from "../../components/ui/PurpleGradientButton";
import ActiveListingCard from "../../components/main/profile/ActiveListingCard";
import TradeHistoryCard from "../../components/main/profile/TradeHistoryCard";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("active");

	return (
		<div className="min-h-screen bg-neutral-100 flex flex-col items-center pb-10">
			{/* Hero Section */}
			<section className="w-full bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 pt-12 pb-20 px-4 flex flex-col items-center relative overflow-hidden">
				{/* Profile Image with Glow */}
				<div className="relative z-10">
					<div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-50 scale-125" />
					<div className="relative w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
						<img
							src="https://placehold.co/128"
							alt="Avatar"
							className="w-full h-full"
						/>
					</div>
					<div className="absolute bottom-1 right-1 bg-gradient-to-r from-pink-600 to-pink-400 p-2 rounded-full border-2 border-white">
						<ShieldCheck size={16} className="text-white" />
					</div>
				</div>

				<h1 className="text-white text-2xl lg:text-3xl font-black mt-6 text-center leading-tight">
					Brandan-Lee James Sherbrooke
				</h1>

				<div className="flex items-center gap-2 text-white/90 mt-2 font-semibold">
					<MapPin size={16} />
					<span>Gauteng</span>
				</div>

				{/* Rating Floating Bar */}
				<div className="mt-8 w-full max-w-sm bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 p-4 rounded-xl shadow-2xl border border-white/25 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center">
							<Trophy size={20} className="text-white" />
						</div>

						<div>
							<p className="text-sm md:text-base text-white/80 font-bold tracking-widest uppercase">
								Trust Integrity
							</p>
							<p className="text-xl font-black text-white">4.9 / 5.0</p>
						</div>
					</div>

					<div className="bg-purple-700 px-3 py-1 rounded text-white font-bold text-xs md:text-sm">
						24 Trades
					</div>
				</div>
			</section>

			{/* Stats Grid */}
			<div className="max-w-4xl w-full px-4 mt-10 grid grid-cols-3 gap-3">
				<StatCard
					icon={<ShieldCheck className="text-white" />}
					label="Total Trades"
					value="14"
				/>
				<StatCard
					icon={<Cpu className="text-white" />}
					label="Hardware Verified"
					value="8"
				/>
				<StatCard
					icon={<Calendar1 className="text-white" />}
					label="Member since"
					value="Oct 2025"
				/>
			</div>

			{/* Tabs and Listings */}
			<main className="max-w-4xl w-full px-4 mt-8 flex flex-col gap-6">
				<div className="bg-white rounded-xl shadow-md overflow-hidden">
					{/* Tabs */}
					<div className="flex border-b bg-gradient-to-r from-violet-800 to-purple-700">
						<button 
                            onClick={() => setActiveTab("active")}
                            className={`flex-1 py-4 font-black text-sm md:text-base transition-all duration-200 ${
                                activeTab === "active" 
                                ? "text-pink-500 border-b-4 border-pink-500 bg-white/10" 
                                : "text-white/60 hover:text-white border-b-4 border-transparent"
                            }`}
                        >
                            Active Listings
                        </button>
                        <button 
                            onClick={() => setActiveTab("history")}
                            className={`flex-1 py-4 font-black text-sm md:text-base transition-all duration-200 ${
                                activeTab === "history" 
                                ? "text-pink-500 border-b-4 border-pink-500 bg-white/10" 
                                : "text-white/60 hover:text-white border-b-4 border-transparent"
                            }`}
                        >
                            Trade History
                        </button>
					</div>

					{/* Listing List */}
					<div className="p-4 flex flex-col gap-4">
                        {activeTab === "active" ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <TradeHistoryCard 
                                    title="ASUS ROG Strix RTX 3070" 
                                    buyer="Thabo M." 
                                    date="May 11, 2026" 
                                    price="R8,500" 
                                    status="COMPLETED" 
                                />
                                <TradeHistoryCard 
                                    title="Corsair Dominator 32GB DDR5" 
                                    buyer="Sarah J." 
                                    date="May 09, 2026" 
                                    price="R3,200" 
                                    status="IN PROGRESS" 
                                />
                            </>
                        )}
					</div>
				</div>

				{/* Action Button */}
				<div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                    <div className="w-full max-w-xs">
                        <PurpleGradientButton label="EDIT PROFILE" />
                    </div>
                    
                    <button 
                        className="w-full max-w-xs h-[56px] rounded-md border-2 border-red-500/50 
                                text-red-500 font-bold tracking-tight hover:bg-red-500 
                                hover:text-white hover:border-red-500 transition-all 
                                duration-300 uppercase text-sm md:text-base active:scale-95"
                        onClick={() => {
                            if(window.confirm("Are you sure you want to delete your account? This action is permanent.")) {
                                console.log("Account deleted");
                            }
                        }}
                    >
                        Delete Account
                    </button>
                </div>
			</main>
		</div>
	);
}
