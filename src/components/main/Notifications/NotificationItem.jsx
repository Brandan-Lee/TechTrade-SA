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
	body, // Extracted directly from backend system-generated entries
	time,
	type,
	status,
	onAction,
	onDelete,
	is_read,
	offerAmount,
	listingName,
	buyerName,
	sellerName,
	isSeller,
}) => {
	const isItemRead = Number(is_read) === 1;
	const amISeller = Number(isSeller) === 1;

	// Select an icon based on the notification type
	const getIcon = () => {
		const iconSize = 16;
		switch (type) {
			case "offer":
				return <DollarSign size={iconSize} className="text-fuchsia-400" />;
			case "system":
				return <Shield size={iconSize} className="text-cyan-400" />;
			case "counter":
				return <Handshake size={iconSize} className="text-amber-400" />;
			default:
				return <MessageSquare size={iconSize} className="text-purple-400" />;
		}
	};

	// Generate descriptive text matching the item type, status, and user perspective
	const renderMessage = () => {
		const textHighlight = "text-fuchsia-400 font-bold tracking-wide";
		const textSuccess = "text-emerald-400 font-black tracking-widest uppercase";
		const textFailure = "text-red-400 font-black tracking-widest uppercase";

		// PRIORITIZATION: If a direct backend string message exists, display it verbatim
		if (body) {
			return <span className="uppercase tracking-wide">{body}</span>;
		}

		// Fallback to evaluating explicit review action notifications
		if (type === "review") {
			return (
				<span className="text-slate-400">
					You have received a new review. You can find it on your profile page.
					Please check it out and respond if necessary.
				</span>
			);
		}

		// Fallback logic for legacy marketplace offer processing structures
		if (type === "offer") {
			if (status === "accepted") {
				return (
					<span>
						{buyerName} <span className={textSuccess}>ACCEPTED</span> the offer
						from {buyerName} of{" "}
						<span className={textHighlight}>R{offerAmount}</span> for{" "}
						<span className="text-white">[{listingName}]</span>.
					</span>
				);
			}

			if (status === "declined") {
				return (
					<span>
						{sellerName} <span className={textFailure}>DECLINED</span> the offer
						from {buyerName} for{" "}
						<span className="text-white">[{listingName}]</span>.
					</span>
				);
			}

			if (status === "pending") {
				return (
					<span>
						You received an offer of{" "}
						<span className={textHighlight}>R{offerAmount}</span> for{" "}
						<span className="text-white">[{listingName}]</span> from{" "}
						{buyerName || "a buyer"}. Please review and take action.
					</span>
				);
			}
		}

		if (type === "counter") {
			if (amISeller) {
				if (status === "accepted") {
					return (
						<span>
							{buyerName} <span className={textSuccess}>ACCEPTED</span> the
							counter offer of{" "}
							<span className={textHighlight}>R{offerAmount}</span> for{" "}
							<span className="text-white">[{listingName}]</span>.
						</span>
					);
				}

				if (status === "declined") {
					return (
						<span>
							{buyerName} <span className={textFailure}>DECLINED</span> the
							counter offer for{" "}
							<span className="text-white">[{listingName}]</span>.
						</span>
					);
				}
			} else {
				if (status === "pending") {
					return (
						<span>
							<span className="text-white font-bold">
								{sellerName || "The seller"}
							</span>{" "}
							sent you a counter offer of{" "}
							<span className={textHighlight}>R{offerAmount}</span> for{" "}
							<span className="text-white">[{listingName}]</span>.
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
						</span>
					);
				} else {
					return (
						<span>
							You already reacted on this offer for{" "}
							<span className="text-white">[{listingName}]</span>.
						</span>
					);
				}
			}
		}

		return (
			<span className="text-slate-500">
				No message data available for this notification type index.
			</span>
		);
	};

	return (
		<div
			role="status"
			className={`relative w-full p-4 sm:p-5 font-mono border rounded-lg flex flex-col gap-3.5 transition-all duration-300 selection:bg-fuchsia-500/30 ${
				isItemRead
					? "bg-[#0c0c0e]/40 border-white/5 opacity-60 hover:opacity-80"
					: "bg-[#110d1a]/90 border-purple-500/30 shadow-[inset_0_0_12px_rgba(168,85,247,0.05)] shadow-black/50"
			}`}
		>
			{/* Header area */}
			<div className="w-full flex justify-between items-start gap-4">
				<div className="flex items-start gap-3 sm:gap-4">
					{/* Notification icon slot */}
					<div
						className={`w-9 h-9 sm:w-10 sm:h-10 rounded shrink-0 flex items-center justify-center border transition-colors ${
							isItemRead
								? "bg-slate-900 border-white/5"
								: "bg-purple-950/40 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
						}`}
					>
						{getIcon()}
					</div>

					<div className="space-y-0.5 sm:space-y-1">
						<div className="flex flex-wrap items-center gap-2">
							<h4
								className={`text-xs sm:text-sm md:text-base font-black uppercase tracking-tight ${
									isItemRead ? "text-slate-500" : "text-white"
								}`}
							>
								{title || "System Notification"}
							</h4>

							{!isItemRead && (
								<span
									className="inline-flex items-center gap-1 bg-fuchsia-500/10 border border-fuchsia-500/30 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] text-fuchsia-400 font-extrabold tracking-widest uppercase animate-pulse"
									aria-label="New notification"
								>
									<AlertCircle size={8} /> LIVE
								</span>
							)}
						</div>

						{/* Timestamp display */}
						<div className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-bold uppercase tracking-wider">
							<Clock size={11} className="text-slate-600" />
							<span>{time || "Recently"}</span>
						</div>
					</div>
				</div>

				<button
					onClick={() => onDelete?.(id)}
					aria-label={`Delete notification ${title}`}
					className="p-1.5 sm:p-2 rounded border border-transparent text-slate-600 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all focus:outline-none focus:border-red-500/30"
				>
					<Trash2 size={14} />
				</button>
			</div>

			<div
				className={`text-[11px] sm:text-xs md:text-sm leading-relaxed tracking-wide ${
					isItemRead ? "text-slate-500" : "text-slate-300 font-medium"
				}`}
			>
				{renderMessage()}
			</div>
		</div>
	);
};

export default NotificationItem;
