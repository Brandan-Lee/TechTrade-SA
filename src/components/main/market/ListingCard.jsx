import React from "react";
import { MapPin, User, Zap } from "lucide-react";
import CyberActionButton from "../../ui/CyberActionButton";
import { useNavigate } from "react-router-dom";
import AlternateButton from "../../ui/AlternateButton";
import { mediaUrl } from "../../../lib/api";

export default function ListingCard({
	id,
	sellerId,
	title,
	price,
	seller,
	location,
	status,
	condition,
	image,
	isFeatured = false,
}) {
	// Styles based on item availability
	const statusColors = {
		"Available Now": "border-emerald-500/50 text-emerald-400 bg-emerald-500/10",
		"Offer Received": "border-amber-500/50 text-amber-400 bg-amber-500/10",
		"Pending Transaction":
			"border-fuchsia-500/50 text-fuchsia-400 bg-fuchsia-500/10",
	};

	const navigate = useNavigate();

	const openItemDetails = (e) => {
		e.stopPropagation();
		if (id != null) {
			navigate(`/view-listing/${id}`);
		}
	};

	const openSellerProfile = (e) => {
		e.stopPropagation();
		if (sellerId != null) {
			navigate(`/profile/${sellerId}`);
		}
	};

	return (
		<div
			onClick={openItemDetails}
			className={`
				group relative w-full bg-[#0a0a0c] rounded-2xl overflow-hidden flex flex-col 
				border border-white/5 transition-all duration-300 cursor-pointer
				hover:border-fuchsia-500/50 hover:shadow-[0_0_30px_rgba(217,70,239,0.1)]
				${isFeatured ? "ring-1 ring-fuchsia-500/30 shadow-[inset_0_0_20px_rgba(217,70,239,0.05)]" : ""}
			`}
		>
			{/* Product Image Section */}
			<div className="relative h-56 w-full overflow-hidden bg-black">
				<img
					src={mediaUrl(image)}
					alt={title}
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
				/>

				{/* Highlight Label */}
				{isFeatured && (
					<div className="absolute top-0 left-0 z-20">
						<div className="bg-fuchsia-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 flex items-center gap-1 rounded-br-xl">
							<Zap size={10} />
							Featured
						</div>
					</div>
				)}

				{/* Item Condition Badge */}
				<div className="absolute top-3 right-3 z-20">
					<div className="bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-slate-300 text-xs font-bold uppercase tracking-widest">
						{condition}
					</div>
				</div>

				{/* Status Indicator */}
				<div className="absolute bottom-3 left-3 flex items-center gap-2">
					<div
						className={`
							px-3 py-1 rounded-md border text-xs font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-sm
							${statusColors[status] || statusColors["Available Now"]}
						`}
					>
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
						</span>
						{status}
					</div>
				</div>
			</div>

			{/* Item Details Section */}
			<div className="p-5 flex flex-col flex-1">
				<h3 className="text-slate-100 text-lg font-black leading-tight h-14 line-clamp-2 uppercase italic tracking-tight group-hover:text-fuchsia-400 transition-colors">
					{title}
				</h3>

				{/* Seller and Location Details */}
				<div className="mt-4 flex flex-wrap gap-4 pb-4 border-b border-white/5">
					<div
						onClick={openSellerProfile}
						className="flex items-center gap-2 cursor-pointer group/seller"
					>
						<div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
							<User size={12} className="text-violet-400" />
						</div>
						<span className="text-sm font-bold text-slate-400 group-hover/seller:text-white transition-colors">
							{seller}
						</span>
					</div>
					<div className="flex items-center gap-2 text-slate-500">
						<MapPin size={12} className="text-fuchsia-500" />
						<span className="text-sm font-bold uppercase tracking-tighter">
							{location}
						</span>
					</div>
				</div>

				{/* Price Display */}
				<div className="py-5 flex flex-col">
					<div className="flex items-baseline gap-2">
						<span className="text-white text-3xl font-black italic tracking-tighter">
							{price}
						</span>
						<span className="text-fuchsia-500/50 text-xs font-black uppercase tracking-widest">
							ZAR
						</span>
					</div>
					<p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-1">
						Or Best Offer
					</p>
				</div>

				{/* Navigation Buttons */}
				<div className="grid grid-cols-2 gap-3 mt-auto pt-2">
					<CyberActionButton label="View Item" onClick={openItemDetails} />
					<AlternateButton label="Seller Profile" onClick={openSellerProfile} />
				</div>
			</div>
		</div>
	);
}
