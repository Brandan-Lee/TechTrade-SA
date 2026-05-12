import {
	AlertCircle,
	ArrowLeft,
	Clock,
	MapPin,
	MessageSquare,
	ShieldCheck,
	Star,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import PurpleGradientButton from "../../components/ui/PurpleGradientButton";
import AlternateButton from "../../components/ui/AlternateButton";

const ManageOffer = () => {
	const navigate = useNavigate();

	const offerData = {
		itemTitle: "RTX 3080 Gaming OC",
		originalPrice: "R 12,500",
		offerPrice: "R 8,500.00",
		buyerName: "Thabo Mthembu",
		buyerRating: "4.9/5",
		buyerReviews: "27",
		buyerLocation: "Gauteng",
		memberSince: "Jan 2024",
		buyerNote: "Can collect this weekend if accepted.",
		timeReceived: "2 hours ago",
	};

	return (
		<div className="min-h-screen bg-neutral-100 pb-12">
			{/* Header Area */}
			<div className="w-full max-w-4xl mx-auto pt-8 px-4 sm:px-8">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors mb-4"
				>
					<ArrowLeft className="w-5 h-5" />
					<span className="font-bold">Back to My Offers</span>
				</button>

				<h1 className="text-purple-600 text-3xl sm:text-4xl font-black tracking-tight mb-8">
					Manage Offer
				</h1>

				{/* THE GRID CONTAINER START */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Left Column: User Profile and Item Summary */}
					<div className="flex flex-col gap-6">
						{/* Item Summary Card */}
						<div className="w-full p-5 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-2xl shadow-xl border border-pink-600">
							<div className="flex items-center gap-4">
								<img
									src="https://placehold.co/150x150?text=GPU"
									alt="Product"
									className="w-20 h-20 rounded-xl object-cover border-2 border-pink-500"
								/>

								<div className="flex-1">
									<h2 className="text-white text-xl font-bold leading-tight">
										{offerData.itemTitle}
									</h2>

									<div className="flex items-center gap-3 mt-1">
										<span className="text-white/70 text-sm line-through font-medium">
											{offerData.originalPrice}
										</span>
										<span className="bg-gradient-to-r from-pink-600 to-pink-400 px-2 py-0.5 rounded text-white text-[10px] font-black uppercase tracking-wider">
											1 Active Offer
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Buyer Profile Card */}
						<div className="w-full p-8 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-2xl border border-pink-600 flex flex-col items-center text-center">
							<div className="relative mb-4">
								<div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-purple-400 to-pink-500">
									<img
										src="https://placehold.co/96x96"
										alt="Profile"
										className="w-full h-full rounded-full border-4 border-white"
									/>
								</div>

								<div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-purple-700">
									<ShieldCheck className="w-5 h-5 text-purple-700" />
								</div>
							</div>

							<h3 className="text-white text-2xl font-bold mb-1">
								{offerData.buyerName}
							</h3>

							<div className="flex items-center gap-2 mb-4">
								<div className="flex text-amber-400">
									{[...Array(4)].map((_, i) => (
										<Star key={i} className="w-4 h-4 fill-current" />
									))}
									<Star className="w-4 h-4" />
								</div>

								<span className="text-white text-sm font-semibold">
									{offerData.buyerRating} ({offerData.buyerReviews} reviews)
								</span>
							</div>

							<div className="bg-gradient-to-r from-pink-600 to-pink-400 px-4 py-1.5 rounded-xl flex items-center gap-2 mb-4">
								<ShieldCheck className="w-4 h-4 text-white" />
								<span className="text-white text-sm font-bold tracking-tight uppercase">
									Verified TechTrader
								</span>
							</div>

							<div className="space-y-1 text-white/90">
								<div className="flex items-center justify-center gap-2">
									<MapPin className="w-4 h-4" />
									<span className="text-sm font-medium">
										{offerData.buyerLocation}
									</span>
								</div>

								<p className="text-xs opacity-75">
									Member since {offerData.memberSince}
								</p>
							</div>
						</div>
					</div>

					{/* Right Column: Offer Details and Actions */}
					<div className="flex flex-col gap-6">
						{/* Offer Amount Card */}
						<div className="w-full p-8 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-2xl border-2 border-pink-600 flex flex-col items-center">
							<span className="text-white text-sm font-bold uppercase tracking-widest opacity-80 mb-2">
								Offer Amount
							</span>

							<div className="text-pink-500 text-5xl font-black mb-2">
								{offerData.offerPrice}
							</div>

							<div className="flex items-center gap-1 text-white/70 text-xs mb-8">
								<Clock className="w-3 h-3" />
								<span>Received {offerData.timeReceived}</span>
							</div>
						</div>

						{/* Buyer Note Box */}
						<div className="w-full bg-white p-4 rounded-xl border border-purple-200 flex gap-3">
							<MessageSquare className="w-5 h-5 text-purple-700 shrink-0 mt-1" />
							<div>
								<span className="text-slate-500 text-[10px] font-black uppercase tracking-wider block">
									Buyer's Note
								</span>

								<p className="text-slate-800 text-sm font-medium italic">
									{offerData.buyerNote}
								</p>
							</div>
						</div>

						{/* Action Buttons and Gaurdrail */}
						<div className="flex flex-col gap-4">
							<PurpleGradientButton label="DECLINE" />
							<PurpleGradientButton label="ACCEPT" />
							<AlternateButton label="COUNTER-OFFER" />

							{/* System Warning */}
							<div className="p-4 bg-gradient-to-r from-pink-600 to-pink-400 rounded-xl border border-violet-800 flex gap-3">
								<AlertCircle className="w-6 h-6 text-white shrink-0" />

								<p className="text-white text-xs font-medium leading-relaxed">
									Accepting this offer will initiate the{" "}
									<strong>Escrow State Machine</strong>, generate a whatsapp{" "}
									<strong>TTL Bridge</strong> and lock the listing.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageOffer;
