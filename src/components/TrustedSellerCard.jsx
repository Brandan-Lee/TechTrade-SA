import React from "react";
import { Star, CheckCircle, Shield, Zap, TrendingUp } from "lucide-react";
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
	};

	return (
		<div
			onClick={handleViewShop}
			className={`
                group relative min-w-[320px] p-[1px] rounded-2xl overflow-hidden cursor-pointer shrink-0 transition-all duration-300
                ${
									isMaster
										? "bg-gradient-to-br from-fuchsia-500 via-fuchsia-500/20 to-transparent shadow-[0_0_20px_rgba(217,70,239,0.15)]"
										: "bg-gradient-to-br from-violet-600/50 via-violet-600/10 to-transparent"
								}
            `}
		>
			{/* Inner Content - The "Hardware Shell" */}
			<div className="relative bg-[#0a0a0c] rounded-[15px] p-6 h-full flex flex-col gap-5 z-10">
				{/* Profile Header */}
				<div className="flex items-center gap-4">
					<div className="relative shrink-0">
						{/* Status Ring */}
						<div
							className={`absolute -inset-1 rounded-full blur-[2px] opacity-40 group-hover:opacity-100 transition-opacity ${isMaster ? "bg-fuchsia-500" : "bg-violet-500"}`}
						></div>
						<img
							src={image}
							alt={name}
							className={`relative w-16 h-16 rounded-full border-2 object-cover ${isMaster ? "border-fuchsia-500" : "border-violet-500"}`}
						/>
						<div className="absolute -bottom-1 -right-1 bg-[#0a0a0c] rounded-full p-0.5">
							<CheckCircle
								className={`w-5 h-5 ${isMaster ? "text-fuchsia-400" : "text-emerald-400"}`}
							/>
						</div>
					</div>

					<div className="flex flex-col">
						<h2 className="text-slate-100 text-lg font-black uppercase tracking-tight italic group-hover:text-white transition-colors">
							{name}
						</h2>
						<div
							className={`mt-1.5 px-2 py-0.5 border flex items-center gap-1.5 rounded-md w-max ${isMaster ? "border-fuchsia-500/50 bg-fuchsia-500/10" : "border-violet-500/30 bg-violet-500/5"}`}
						>
							{isMaster ? (
								<Zap size={10} className="text-fuchsia-400" />
							) : (
								<Shield size={10} className="text-violet-400" />
							)}
							<span
								className={`text-[10px] font-black uppercase tracking-widest ${isMaster ? "text-fuchsia-400" : "text-violet-400"}`}
							>
								{tier}
							</span>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 gap-3">
					<div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
						<div className="flex items-center gap-1.5 mb-1">
							<Star className="w-3.5 h-3.5 text-fuchsia-400 fill-fuchsia-400" />
							<span className="text-slate-100 text-sm font-black italic">
								{rating}
							</span>
						</div>
						<p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
							{reviews} Logs
						</p>
					</div>

					<div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
						<div className="flex items-center gap-1.5 mb-1">
							<TrendingUp className="w-3.5 h-3.5 text-violet-400" />
							<span className="text-slate-100 text-sm font-black italic">
								{sales}
							</span>
						</div>
						<p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
							Transfers
						</p>
					</div>
				</div>

				{/* Action Button */}
				<button
					onClick={handleViewShop}
					className={`
                        mt-2 w-full py-3 rounded-xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300
                        border-2 flex items-center justify-center gap-2
                        ${
													isMaster
														? "border-fuchsia-600 text-fuchsia-400 hover:bg-fuchsia-600 hover:text-white shadow-[0_0_15px_rgba(217,70,239,0.2)]"
														: "border-violet-600 text-violet-400 hover:bg-violet-600 hover:text-white"
												}
                    `}
				>
					Access Profile
				</button>
			</div>

			{/* Background "Scanline" Decoration */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
		</div>
	);
}
