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
	body,
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
	const isRead = Number(is_read) === 1;
	const isUserSeller = Number(isSeller) === 1;

	const getIcon = () => {
		const size = 16;
		switch (type) {
			case "offer":
				return <DollarSign size={size} className="text-fuchsia-400" />;
			case "system":
				return <Shield size={size} className="text-cyan-400" />;
			case "counter":
				return <Handshake size={size} className="text-amber-400" />;
			default:
				return <MessageSquare size={size} className="text-purple-400" />;
		}
	};

	const renderMessage = () => {
		const priceStyle = "text-fuchsia-400 font-bold";
		const successStyle = "text-emerald-400 font-black uppercase";
		const failureStyle = "text-red-400 font-black uppercase";

		if (body) {
			return <span className="uppercase">{body}</span>;
		}

		if (type === "review") {
			return (
				<span className="text-slate-400">
					You have received a new review. Check your profile page to see it.
				</span>
			);
		}

		if (type === "offer") {
			if (status === "accepted") {
				return (
					<span>
						{buyerName} <span className={successStyle}>ACCEPTED</span> the offer
						of <span className={priceStyle}>R{offerAmount}</span> for{" "}
						<span className="text-white">[{listingName}]</span>.
					</span>
				);
			}

			if (status === "declined") {
				return (
					<span>
						{sellerName} <span className={failureStyle}>DECLINED</span> the
						offer for <span className="text-white">[{listingName}]</span>.
					</span>
				);
			}

			if (status === "pending") {
				return (
					<span>
						You received an offer of{" "}
						<span className={priceStyle}>R{offerAmount}</span> for{" "}
						<span className="text-white">[{listingName}]</span> from{" "}
						{buyerName || "a buyer"}. Please review it.
					</span>
				);
			}
		}

		if (type === "counter") {
			if (isUserSeller) {
				if (status === "accepted") {
					return (
						<span>
							{buyerName} <span className={successStyle}>ACCEPTED</span> your
							counter offer of{" "}
							<span className={priceStyle}>R{offerAmount}</span> for{" "}
							<span className="text-white">[{listingName}]</span>.
						</span>
					);
				}

				if (status === "declined") {
					return (
						<span>
							{buyerName} <span className={failureStyle}>DECLINED</span> your
							counter offer for{" "}
							<span className="text-white">[{listingName}]</span>.
						</span>
					);
				}
			} else if (status === "pending") {
				return (
					<span>
						<span className="text-white font-bold">
							{sellerName || "The seller"}
						</span>{" "}
						sent you a counter offer of{" "}
						<span className={priceStyle}>R{offerAmount}</span> for{" "}
						<span className="text-white">[{listingName}]</span>.
						<div className="flex flex-col sm:flex-row gap-2 pt-2.5 border-t border-white/5">
							<button
								onClick={() => onAction?.(id, "accept")}
								className="flex-1 h-9 bg-fuchsia-600 hover:bg-fuchsia-500 text-black font-black text-[10px] sm:text-xs rounded uppercase flex items-center justify-center gap-1.5 transition-all"
							>
								<Check size={12} strokeWidth={3} />
								<span>ACCEPT</span>
							</button>
							<button
								onClick={() => onAction?.(id, "decline")}
								className="flex-1 h-9 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 font-black text-[10px] sm:text-xs rounded uppercase flex items-center justify-center gap-1.5 transition-all"
							>
								<X size={12} strokeWidth={3} />
								<span>DECLINE</span>
							</button>
						</div>
					</span>
				);
			}
		}

		return <span className="text-slate-500">No message available.</span>;
	};

	return (
		<article
			className={`relative w-full p-4 sm:p-5 border rounded-lg flex flex-col gap-3.5 transition-all duration-300 text-xs sm:text-sm md:text-base lg:text-lg ${
				isRead
					? "bg-[#0c0c0e]/40 border-white/5 opacity-60"
					: "bg-[#110d1a]/90 border-purple-500/30"
			}`}
		>
			<div className="w-full flex justify-between items-start gap-4">
				<div className="flex items-start gap-3 sm:gap-4">
					<div
						className={`w-9 h-9 sm:w-10 sm:h-10 rounded flex items-center justify-center border ${isRead ? "bg-slate-900" : "bg-purple-950/40"}`}
					>
						{getIcon()}
					</div>

					<div className="space-y-0.5">
						<div className="flex flex-wrap items-center gap-2">
							<h1
								className={`text-xs sm:text-sm font-black uppercase ${isRead ? "text-slate-500" : "text-white"}`}
							>
								{title || "Notification"}
							</h1>
							{!isRead && (
								<span className="inline-flex items-center gap-1 bg-fuchsia-500/10 border border-fuchsia-500/30 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] text-fuchsia-400 font-extrabold uppercase">
									<AlertCircle size={8} /> NEW
								</span>
							)}
						</div>
						<div className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-bold uppercase">
							<Clock size={11} className="text-slate-600" />
							<span>{time || "Recently"}</span>
						</div>
					</div>
				</div>

				<button
					onClick={() => onDelete?.(id)}
					className="p-2 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
				>
					<Trash2 size={14} />
				</button>
			</div>

			<div className="text-[11px] sm:text-xs md:text-sm leading-relaxed">
				{renderMessage()}
			</div>
		</article>
	);
};

export default NotificationItem;
