import { Clock, ShieldCheck, Star } from "lucide-react";
import React from "react";
import PurpleGradientButton from "../../ui/PurpleGradientButton";
import AlternateButton from "../../ui/AlternateButton"; // Ensure file name matches!
import { useNavigate } from "react-router-dom";

export default function IncomingOfferCard({
	product,
	offerAmount,
	originalPrice,
	buyer,
	message,
	timeAgo,
}) {
    const navigate = useNavigate();

    const handleManage = (e) => {
        e.stopPropagation();
        navigate(`/manage-offer`);
    }

	return (
		<div className="w-full bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-xl p-5 border border-pink-600/30 shadow-xl">
			{/* Main Wrapper */}
			<div className="flex flex-col lg:flex-row gap-6 items-start">
				{/* Product Info Section */}
				<div className="flex gap-4 w-full lg:w-1/4 shrink-0">
					<img
						src={product.image || "https://placehold.co/80"}
						alt={product.brand}
						className="w-20 h-20 rounded-lg object-cover bg-white/10 shrink-0"
					/>
					<div className="flex flex-col justify-center">
						<h3 className="text-white text-sm md:text-base font-bold leading-tight uppercase tracking-tight">
							{product.brand}
						</h3>
						<p className="text-white/80 text-xs md:text-sm font-medium mb-1">
							{product.model}
						</p>
						<span className="text-pink-400 text-sm md:text-base font-black italic">
							{originalPrice}
						</span>
					</div>
				</div>

				{/* Buyer Profile and Message Section */}
				<div className="flex-1 w-full bg-white/5 rounded-lg p-3 lg:bg-transparent lg:p-0">
					<div className="flex items-center gap-3 mb-3">
						<div className="relative shrink-0">
							<img
								src={buyer.avatar}
								alt={buyer.name}
								className="w-12 h-12 rounded-full border-2 border-pink-500"
							/>
							<div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-0.5 border border-white">
								<ShieldCheck size={10} className="text-white" />
							</div>
						</div>

						<div>
							<div className="flex items-center gap-2">
								<span className="text-white text-sm md:text-base font-bold">
									{buyer.name}
								</span>
								<span className="text-white text-xs md:text-sm">//</span>
								<div className="flex items-center gap-1 text-amber-400">
									<Star size={12} fill="currentColor" />
									<span className="text-white text-sm md:text-base font-bold">
										5 Stars
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 rounded p-3 border border-gray-200 shadow-inner">
						<p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed italic">
							"{message}"
						</p>
					</div>
				</div>

				{/* Combined Offer Info & Actions Section */}
				<div className="w-full lg:w-48 flex flex-col gap-3 shrink-0">
					<div className="flex justify-between lg:justify-end items-center gap-3">
						<div className="h-10 w-1 bg-gradient-to-b from-pink-600 to-pink-400 rounded-full hidden lg:block" />

						<div className="text-right">
							<div className="text-pink-500 text-2xl lg:text-3xl font-black italic leading-none">
								{offerAmount}
							</div>
							<div className="flex items-center justify-end gap-1 text-white text-sm md:text-base mt-1">
								<Clock size={10} />
								<span>{timeAgo}</span>
							</div>
						</div>
					</div>

					{/* Action Buttons are now inside the right-hand column */}
					<div className="flex flex-col gap-2 w-full mt-2">
						<PurpleGradientButton 
                            onClick={handleManage}
                            label="MANAGE" 
                        />
					</div>
				</div>
			</div>
		</div>
	);
}
