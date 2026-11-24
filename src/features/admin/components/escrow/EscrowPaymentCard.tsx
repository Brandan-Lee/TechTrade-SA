import React from "react";
import { Shield, Clock, Wallet, User, Hash, CheckCircle } from "lucide-react";

export default function EscrowPaymentCard({ item, onReleaseFunds }) {
	const getStepLabel = (step) => {
		switch (step) {
			case 1:
				return "Awaiting Payment";
			case 2:
				return "Awaiting Dispatch";
			case 3:
				return "In Transit";
			case 4:
				return "Hardware Inspection";
			case 5:
				return "Complete";
			default:
				return "Processing";
		}
	};

	const isPaymentSettled = item.paymentStatus === "complete";

	return (
		<li className="bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-white/10 transition-all font-mono">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
						<Wallet size={20} />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1">
								<Hash size={10} /> {item.transaction.publicId}
							</span>
						</div>
						<h3 className="text-sm xl:text-xl font-black uppercase text-white tracking-wide mt-0.5">
							{item.currency} {item.amount.toFixed(2)}
						</h3>
					</div>
				</div>

				<span className="self-start sm:self-center px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-400 text-[10px] md:text-xs xl:text-sm font-black uppercase tracking-widest flex items-center gap-1.5">
					<Clock size={12} className="animate-pulse shrink-0" />
					Transaction: {item.transaction.status}
				</span>
			</div>

			<div className="grid grid-cols-3 gap-1 sm:gap-2 py-3 border-y border-white/5 text-center bg-black/20 rounded-xl">
				<div>
					<p className="text-[9px] md:text-xs xl:text-sm uppercase tracking-wider text-slate-500">
						Buyer Name
					</p>
					<p className="text-xs md:text-sm xl:text-base font-black text-slate-300 truncate px-1 uppercase mt-0.5 flex items-center justify-center gap-1">
						<User size={10} className="text-slate-500 shrink-0" />
						{item.payer.name}
					</p>
				</div>
				<div>
					<p className="text-[9px] md:text-xs xl:text-sm uppercase tracking-wider text-slate-500">
						Deposit
					</p>
					<p
						className={`text-xs md:text-sm xl:text-base font-black uppercase mt-0.5 ${isPaymentSettled ? "text-emerald-400" : "text-zinc-500"}`}
					>
						{isPaymentSettled ? "Received" : item.paymentStatus}
					</p>
				</div>
				<div>
					<p className="text-[9px] md:text-xs xl:text-sm uppercase tracking-wider text-slate-500">
						Current Phase
					</p>
					<p className="text-xs md:text-sm xl:text-base font-black text-secondary uppercase mt-0.5 truncate px-1">
						Phase {item.transaction.escrowStep}
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/[0.02] pt-2">
				<div className="flex items-center justify-between sm:justify-start gap-4 text-[10px] md:text-xs xl:text-sm text-slate-500">
					<span className="uppercase tracking-wider flex items-center gap-1">
						<Shield size={11} className="text-slate-600" />
						{getStepLabel(item.transaction.escrowStep)}
					</span>
					<span className="opacity-60">{item.date}</span>
				</div>

				<button
					type="button"
					onClick={() => onReleaseFunds && onReleaseFunds(item.transaction.id)}
					className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] transition-all text-white font-bold text-xs md:text-sm xl:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20"
				>
					<CheckCircle size={14} />
					Release Funds to Seller
				</button>
			</div>
		</li>
	);
}
