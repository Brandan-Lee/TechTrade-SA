import { Clock, ShieldCheck, Star, ArrowUpRight } from "lucide-react";
import React from "react";
import CyberActionButton from "../../ui/CyberActionButton";
import { useNavigate } from "react-router-dom";

export default function IncomingOfferCard({
	id,
	offerAmount,
	buyer,
	message,
	timeAgo,
	parent_offer_id,
}) {
	const navigate = useNavigate();
	const isCounterOffer =
		parent_offer_id !== null && parent_offer_id !== undefined;

	const handleManage = (e) => {
		e.stopPropagation();
		navigate(`/manage-offer/${id}`);
	};

	return (
		<article
			onClick={handleManage}
			className="w-full bg-[#09090b]/60 border border-white/5 rounded-xl p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-fuchsia-500/30 hover:bg-[#0c0c10] transition-all duration-300 relative overflow-hidden group cursor-pointer text-xs sm:text-sm md:text-base lg:text-lg"
		>
			<div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent opacity-70 group-hover:via-fuchsia-500/40 transition-all duration-300" />

			<div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative z-10">
				<div className="md:col-span-4 flex items-center gap-3">
					<div className="relative shrink-0">
						<img
							src={buyer.avatar}
							alt={`User ${buyer.name}`}
							className="w-9 h-9 rounded-full border border-fuchsia-500/20 p-[1px] bg-black object-cover"
						/>
						<div className="absolute -bottom-0.5 -right-0.5 bg-[#09090b] rounded-full p-0.5 text-fuchsia-400">
							<ShieldCheck size={8} />
						</div>
					</div>

					<div className="flex flex-col min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<span className="text-slate-200 text-xs sm:text-sm font-bold hover:text-white transition-colors truncate">
								{buyer.name}
							</span>
							<span className="text-white/10 text-xs sm:text-sm select-none hidden sm:inline">
								|
							</span>
							<div className="flex items-center gap-1 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 shrink-0">
								<Star size={8} className="text-amber-400 fill-amber-400" />
								<span className="text-amber-400 text-[8px] sm:text-[9px] font-black uppercase tracking-wider">
									Verified
								</span>
							</div>
						</div>
						<div className="flex items-center gap-1.5 text-slate-500 text-[9px] sm:text-[10px] mt-0.5">
							<Clock size={11} className="text-fuchsia-500/40" />
							<span>{timeAgo}</span>
						</div>
					</div>
				</div>

				<div className="md:col-span-5 bg-black/20 rounded-lg p-2.5 border border-white/5">
					<p className="text-slate-400 text-[11px] sm:text-xs italic leading-relaxed pl-3 border-l-2 border-fuchsia-500/30 group-hover:border-fuchsia-500 transition-colors duration-300">
						"{message}"
					</p>
				</div>

				<div className="md:col-span-3 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 pt-4 border-t border-white/5 md:pt-0 md:border-t-0 md:border-l md:border-white/5 md:pl-5">
					<div className="text-left md:text-right space-y-0.5">
						<h1 className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest">
							OFFER AMOUNT
						</h1>
						<div className="text-fuchsia-400 text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight group-hover:text-fuchsia-300 transition-colors">
							{offerAmount}
						</div>
					</div>

					{isCounterOffer ? (
						<div className="w-full text-center">
							<span className="text-[10px] sm:text-xs text-amber-400 font-bold uppercase tracking-wide bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md">
								Counter Offer Sent
							</span>
						</div>
					) : (
						<div className="w-28 md:w-full shrink-0">
							<CyberActionButton
								onClick={handleManage}
								label={
									<span className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px]">
										MANAGE{" "}
										<ArrowUpRight
											size={12}
											className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
										/>
									</span>
								}
								className="w-full text-[10px] sm:text-xs shadow-md shadow-fuchsia-950/10"
							/>
						</div>
					)}
				</div>
			</div>
		</article>
	);
}
