import React from "react";
import { ShieldCheck, ArrowRight, Terminal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function TransactionItem({
	transaction,
	statusConfig,
	isCommitted,
}) {
	const formattedPrice = new Intl.NumberFormat("en-ZA", {
		style: "currency",
		currency: "ZAR",
	}).format(transaction.agreed_price_cents / 100);

	const navigate = useNavigate();

	return (
		<article className="bg-base-200/40 backdrop-blur-sm border border-white/10 hover:border-purple-500/20 rounded-2xl p-6 transition-all duration-300 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] relative group text-sm">
			<div className="flex flex-col sm:flex-row gap-6">
				<div className="w-full sm:w-32 h-32 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
					<img
						src={transaction.primary_image_url}
						alt={transaction.listing_title}
						className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
					/>
				</div>

				<div className="flex-grow flex flex-col justify-between gap-4">
					<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
						<div>
							<Link
								to={`/view-listing/${transaction.listing_id}`}
								className="text-white hover:text-purple-400 font-bold text-base sm:text-lg uppercase tracking-tight transition-colors inline-block"
							>
								{transaction.listing_title}
							</Link>
							<p className="text-slate-600 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest mt-0.5">
								Transaction Record
							</p>
						</div>
						<div className="text-left sm:text-right">
							<span className="text-white font-black text-lg sm:text-xl tracking-wide">
								{formattedPrice}
							</span>
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-[10px] sm:text-xs">
						<div className="flex items-center gap-2 text-slate-500">
							<span className="font-bold uppercase text-[8px] sm:text-[10px]">
								ID:
							</span>
							<span className="text-purple-400 font-mono">
								{transaction.public_id}
							</span>
						</div>
						<div className="flex items-center gap-2 text-slate-500">
							<span className="font-bold uppercase text-[8px] sm:text-[10px]">
								Date:
							</span>
							<span className="text-slate-300">{transaction.created_at}</span>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
						<div className="flex flex-wrap items-center gap-3">
							<div
								className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border ${statusConfig.color}`}
							>
								{statusConfig.icon}
								<span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
									{statusConfig.label}
								</span>
							</div>

							{Number(transaction.escrow_released) === 1 && (
								<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
									<ShieldCheck className="w-4 h-4" />
									<span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
										Funds Released
									</span>
								</div>
							)}
						</div>

						<div className="w-full sm:w-auto flex flex-wrap gap-2 justify-end relative z-10">
							{isCommitted && (
								<>
									<button
										onClick={() => navigate(`/whatsapp-ttl/${transaction.id}`)}
										className="btn btn-sm w-full sm:w-auto bg-gradient-to-r from-secondary to-purple-600 hover:from-secondary hover:to-purple-500 border-none text-white font-black tracking-widest text-[9px] sm:text-[11px] uppercase h-9 px-5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
									>
										<span>Open Contact Page</span>
										<ArrowRight size={13} />
									</button>

									<button
										onClick={() =>
											navigate(`/escrow-tracker/${transaction.id}`)
										}
										className="btn btn-sm w-full sm:w-auto font-black tracking-widest text-[9px] sm:text-[11px] uppercase h-9 px-5 rounded-lg border bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all duration-200"
									>
										<Terminal size={13} className="text-slate-400" />
										<span>Manage Funds</span>
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}
