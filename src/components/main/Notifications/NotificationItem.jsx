import React from "react";
import {
	Clock,
	DollarSign,
	Handshake,
	MessageSquare,
	Shield,
	Trash2,
	X,
	Check,
	AlertCircle,
} from "lucide-react";

const NotificationItem = ({
	id,
	title,
	time,
	type, // 'offer', 'bridge', 'counter'
	status, // 'pending', 'accepted', 'declined', 'expired'
	onAction, // Triggered via onAction(id, "accept" | "decline")
	onDelete,
	isRead,
	offerAmount,
	listingName,
	buyerName,
	sellerName,
}) => {
	// Icon matrix selector for explicit data feeds
	const getIcon = () => {
		const iconSize = 16;
		switch (type) {
			case "offer":
				return <DollarSign size={iconSize} className="text-fuchsia-400" />;
			case "bridge":
				return <Shield size={iconSize} className="text-cyan-400" />;
			case "counter":
				return <Handshake size={iconSize} className="text-amber-400" />;
			default:
				return <MessageSquare size={iconSize} className="text-purple-400" />;
		}
	};

	// Live-rendered decryption feed strings
	const renderMessage = () => {
		const highlightedCipher = "text-fuchsia-400 font-bold tracking-wide";
		const successCipher =
			"text-emerald-400 font-black tracking-widest uppercase";
		const failureCipher = "text-red-400 font-black tracking-widest uppercase";

		if (type === "offer") {
			if (status === "accepted") {
				return (
					<span>
						Your offer of{" "}
						<span className={highlightedCipher}>R{offerAmount}</span> for{" "}
						<span className="text-white">[{listingName}]</span> was{" "}
						<span className={successCipher}>ACCEPTED</span> by{" "}
						{sellerName || "NODE_SELLER"}.
					</span>
				);
			}

			if (status === "declined") {
				return (
					<span>
						Your offer for <span className="text-white">[{listingName}]</span>{" "}
						was <span className={failureCipher}>DECLINED</span> by{" "}
						{sellerName || "NODE_SELLER"}.
					</span>
				);
			}

			return (
				<span>
					Incoming transaction payload of{" "}
					<span className={highlightedCipher}>R{offerAmount}</span> detected for{" "}
					<span className="text-white">[{listingName}]</span> via{" "}
					{buyerName || "UNKNOWN_NODE"}.
				</span>
			);
		}

		if (type === "counter") {
			if (status === "accepted") {
				return (
					<span>
						Counter-negotiation value{" "}
						<span className={highlightedCipher}>R{offerAmount}</span> for{" "}
						<span className="text-white">[{listingName}]</span> has been
						finalized to <span className={successCipher}>ACCEPTED</span>.
					</span>
				);
			}

			if (status === "declined") {
				return (
					<span>
						Counter-negotiation parameter for{" "}
						<span className="text-white">[{listingName}]</span> was{" "}
						<span className={failureCipher}>DECLINED</span>.
					</span>
				);
			}

			return (
				<span>
					<span className="text-white font-bold">
						{sellerName || "SELLER_NODE"}
					</span>{" "}
					pushed a counter-override allocation of{" "}
					<span className={highlightedCipher}>R{offerAmount}</span> for your
					active terminal request.
				</span>
			);
		}

		if (type === "bridge") {
			if (status === "expired") {
				return (
					<span className="text-slate-600 italic">
						[SIGNAL_LOSS]: Secure encryption bridge for [{listingName}] has
						dropped offline.
					</span>
				);
			}
			return (
				<span>
					Secure bridge data channel active. Comm-window with{" "}
					{sellerName || "HOST_NODE"} for{" "}
					<span className="text-white">[{listingName}]</span> remains clear for
					24 hours.
				</span>
			);
		}

		return (
			<span className="text-slate-400">
				Standard system log update recorded for [{listingName}].
			</span>
		);
	};

	return (
		<div
			role="status"
			className={`relative w-full p-4 sm:p-5 font-mono border rounded-lg flex flex-col gap-3.5 transition-all duration-300 selection:bg-fuchsia-500/30 ${
				isRead
					? "bg-[#0c0c0e]/40 border-white/5 opacity-60 hover:opacity-80"
					: "bg-[#110d1a]/90 border-purple-500/30 shadow-[inset_0_0_12px_rgba(168,85,247,0.05)] shadow-black/50"
			}`}
		>
			{/* Top Interactive Metric Data Header Line */}
			<div className="w-full flex justify-between items-start gap-4">
				<div className="flex items-start gap-3 sm:gap-4">
					{/* Hardened Matrix Type Telemetry Icon */}
					<div
						className={`w-9 h-9 sm:w-10 sm:h-10 rounded shrink-0 flex items-center justify-center border transition-colors ${
							isRead
								? "bg-slate-900 border-white/5"
								: "bg-purple-950/40 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
						}`}
					>
						{getIcon()}
					</div>

					{/* Meta String Configuration Block */}
					<div className="space-y-0.5 sm:space-y-1">
						<div className="flex flex-wrap items-center gap-2">
							<h4
								className={`text-xs sm:text-sm md:text-base font-black uppercase tracking-tight ${
									isRead ? "text-slate-500" : "text-white"
								}`}
							>
								{title || "SYSTEM_BROADCAST"}
							</h4>

							{/* Live Alert Tracking Micro-Pill */}
							{!isRead && (
								<span
									className="inline-flex items-center gap-1 bg-fuchsia-500/10 border border-fuchsia-500/30 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] text-fuchsia-400 font-extrabold tracking-widest uppercase animate-pulse"
									aria-label="Unread broadcast"
								>
									<AlertCircle size={8} /> LIVE
								</span>
							)}
						</div>

						{/* Network Datetime Readout Link */}
						<div className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-bold uppercase tracking-wider">
							<Clock size={11} className="text-slate-600" />
							<span>{time || "00:00_SYS"}</span>
						</div>
					</div>
				</div>

				{/* Secure Data Disposal Link Action */}
				<button
					onClick={() => onDelete?.(id)}
					aria-label={`Purge log entry ${title}`}
					className="p-1.5 sm:p-2 rounded border border-transparent text-slate-600 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all focus:outline-none focus:border-red-500/30"
				>
					<Trash2 size={14} />
				</button>
			</div>

			{/* Core Message Readout Shell */}
			<div
				className={`text-[11px] sm:text-xs md:text-sm leading-relaxed tracking-wide ${
					isRead ? "text-slate-500" : "text-slate-300 font-medium"
				}`}
			>
				{renderMessage()}
			</div>

			{type === "counter" && status === "pending" && (
				<div className="flex flex-col sm:flex-row gap-2 pt-2.5 border-t border-white/5">
					<button
						onClick={() => onAction?.(id, "accept")}
						className="flex-1 h-9 bg-fuchsia-600 hover:bg-fuchsia-500 text-black font-black text-[10px] sm:text-xs tracking-widest rounded uppercase flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(217,70,239,0.2)] transition-all active:scale-[0.98] focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
					>
						<Check size={12} strokeWidth={3} />
						<span>ACCEPT</span>
					</button>
					<button
						onClick={() => onAction?.(id, "decline")}
						className="flex-1 h-9 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 font-black text-[10px] sm:text-xs tracking-widest rounded uppercase flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] focus:outline-none focus:ring-1 focus:ring-red-400"
					>
						<X size={12} strokeWidth={3} />
						<span>DECLINE</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default NotificationItem;
