import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrustedSellerCard({
	name,
	tier,
	rating,
	reviews,
	sales,
	specialty,
	image,
	isMaster,
}) {
	const navigate = useNavigate();

	const handleViewShop = (e) => {
		e.stopPropagation();
		navigate(`/profile`);
	}
	
	return (
		<div
			className={`min-w-[320px] h-auto p-6 bg-white rounded-2xl shadow-xl border-2 flex flex-col gap-4 shrink-0 transition-transform hover:scale-[1.02] ${isMaster ? "border-pink-600" : "border-purple-700/30"}`}
		>
			{/* Profile Header */}
			<div className="flex items-center gap-4">
				<div className="relative shrink-0">
					<img
						src={image}
						alt={name}
						className="w-16 h-16 rounded-full border-4 border-purple-700 object-cover"
					/>
					<div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border shadow-sm">
						<CheckCircle className="w-4 h-4 text-emerald-500" />
					</div>
				</div>

				<div className="flex flex-col">
					<h2 className="text-gray-800 text-lg md:text-xl font-bold">{name}</h2>
					<div className="mt-1 px-3 py-0.5 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full w-max">
						<span className="text-white text-sm font-bold uppercase tracking-wide">
							{tier}
						</span>
					</div>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-3">
				<div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
					<div className="flex items-center gap-1">
						<Star className="w-4 h-4 text-amber-500 fill-amber-500" />
						<span className="text-gray-800 text-sm md:text-base font-bold">{rating}</span>
					</div>
					<p className="text-gray-500 text-sm md:text-base">{reviews} reviews</p>
				</div>

				<div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
					<span className="text-gray-800 text-sm md:text-base font-bold block">{sales}</span>
					<p className="text-gray-500 text-sm md:text-base">Total Sales</p>
				</div>
			</div>

			{/* Action Area */}
			<div className="flex justify-between items-center mx-auto">
				<button className="w-full h-14 px-4 md:h-16 bg-gradient-to-r from-violet-800 to-purple-600 rounded-xl md:rounded-2xl outline outline-2 outline-pink-600 text-white font-black text-lg tracking-widest shadow-xl shadow-purple-500/20 hover:from-pink-400 hover:to-pink-600 hover:outline-purple-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
					VIEW SHOP
				</button>
			</div>
		</div>
	);
}
