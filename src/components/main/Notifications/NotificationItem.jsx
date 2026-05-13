import {
	Clock,
	DollarSign,
	Handshake,
	MessageSquare,
	Shield,
	Circle,
	Trash2,
	X,
	Check,
} from "lucide-react";
import React from "react";

const NotificationItem = ({
	id,
	title,
	time,
	type, // 'offer', 'bridge', 'counter'
	status, // 'pending', 'accepted', 'declined', 'expired'
	actionLabel,
	onAction,
	onDelete,
	isRead,
	offerAmount,
	listingName,
	buyerName,
	sellerName,
}) => {
	const getIcon = () => {
		switch (type) {
			case "offer":
				return <DollarSign className="w-5 h-5 text-white" />;
			case "bridge":
				return <Shield className="w-5 h-5 text-white" />;
			case "counter":
				return <Handshake className="w-5 h-5 text-white" />;
			default:
				return <MessageSquare className="w-5 h-5 text-white" />;
		}
	};

	const renderMessage = () => {
		//Offer Types
		if (type === "offer") {
			if (status === "accepted") {
				return (
					<span>
						Your offer of <span className="font-bold">R{offerAmount}</span> for
						[{listingName}] was{" "}
						<span className="text-green-600 font-bold uppercase">Accepted</span>{" "}
						by {sellerName}.
					</span>
				);
			}

			if (status === "declined") {
				return (
					<span>
						Your offer for [{listingName}] was{" "}
						<span className="text-red-600 font-bold uppercase">Declined</span>{" "}
						by {sellerName}
					</span>
				);
			}

			return (
				<span>
					<span className="font-bold text-violet-900">
						New Offer: R{offerAmount}
					</span>{" "}
					received for [{listingName}] from {buyerName}.
				</span>
			);
		}

		//Counter Offer Types
		if (type === "counter") {
			if (status === "accepted") {
				return (
					<span>
						Counter-offer of <span className="font-bold">R{offerAmount}</span>{" "}
						for [{listingName}] has been{" "}
						<span className="text-green-600 font-bold uppercase">Accepted</span>
						.
					</span>
				);
			}

			if (status === "declined") {
				return (
					<span>
						Counter-offer for [{listingName}] was{" "}
						<span className="text-red-600 font-bold uppercase">Declined</span>.
					</span>
				);
			}

			return (
				<span>
					<span className="font-bold text-violet-900">{sellerName}</span> sent a
					counter-offer of{" "}
					<span className="font-bold text-violet-900">R{offerAmount}</span> for
					your request.
				</span>
			);
		}

		//Bridge Types
		if (type === "bridge") {
			if (status === "expired")
				return (
					<span className="text-neutral-500 italic font-medium">
						The Secure Bridge for [{listingName}] has expired.
					</span>
				);
			return (
				<span>
					Secure Bridge Established. Your contact window with {sellerName} for{" "}
					{listingName} is active for 24 hours.
				</span>
			);
		}

		return <span>Generic update for [{listingName}].</span>;
	};

	return (
		<div
			className={`group relative self-stretch min-h-[80px] pl-4 pr-5 py-4 transition-all rounded-lg shadow-sm border-l-4 flex flex-col gap-3 ${
				isRead
					? "bg-neutral-100 border-neutral-300 opacity-75"
					: "bg-pink-400/20 border-pink-600 shadow-md"
			}`}
		>
			{/* Delete Button (Visible on Hover) */}
			<button
				onClick={() => onDelete(id)}
				className="absolute top-2 right-2 p-1.5 rounded-md text-neutral-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
			>
				<Trash2 className="w-4 h-4" />
			</button>

			<div className="self-stretch flex justify-start items-start gap-4">
				<div
					className={`w-10 h-10 shrink-0 rounded-full flex justify-center items-center shadow-md bg-gradient-to-r 
                    ${isRead ? "from-gray-500 to-gray-400" : "from-violet-800 via-purple-600 to-violet-800"}`}
				>
					{getIcon()}
				</div>

				<div className="flex-1 flex flex-col gap-1">
					<div className="flex justify-between items-start">
						<div className="flex items-center gap-2">
							<h4
								className={`text-base font-bold leading-5 ${isRead ? "text-neutral-600" : "text-violet-900"}`}
							>
								{title}
							</h4>
							{!isRead && (
								<Circle className="w-2 h-2 fill-pink-600 text-pink-600" />
							)}
						</div>
						<span className="text-violet-800 text-xs font-medium flex items-center gap-1 shrink-0 mr-6">
							<Clock className="w-3 h-3" /> {time}
						</span>
					</div>

					<p
						className={`text-sm leading-tight ${isRead ? "text-neutral-500" : "text-slate-700 font-medium"}`}
					>
						{renderMessage()}
					</p>

					{/* Counter Offer Accept/Decline Actions */}
					{type === "counter" && status === "pending" && (
						<div className="flex gap-2 mt-3">
							<button className="flex-1 h-10 bg-gradient-to-r from-violet-800 to-purple-600 rounded-lg text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
								<Check className="w-4 h-4" /> ACCEPT
							</button>
							<button className="flex-1 h-10 border-2 border-pink-600 rounded-lg text-pink-600 font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-pink-50 active:scale-95 transition-all">
								<X className="w-4 h-4" /> DECLINE
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default NotificationItem;
