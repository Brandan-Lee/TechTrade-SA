import React from "react";
import {
	User,
	Mail,
	MessageSquare,
	PhoneCall,
	Clock,
	CheckCircle,
	Activity,
	AlertTriangle,
} from "lucide-react";

export default function SupportMessageCard({ ticket, onUpdateStatus }) {
	// Pick the border and text color based on the message status
	const getStatusColor = (status) => {
		switch (status) {
			case "new":
				return "border-blue-500/30 bg-blue-500/5 text-blue-400";
			case "in_progress":
				return "border-amber-500/30 bg-amber-500/5 text-amber-400";
			case "resolved":
				return "border-emerald-500/30 bg-emerald-500/5 text-emerald-400";
			case "closed":
				return "border-rose-500/30 bg-rose-500/5 text-rose-400";
			default:
				return "border-zinc-500/30 bg-zinc-500/5 text-zinc-400";
		}
	};

	const isWhatsApp = ticket.contact_preference?.toLowerCase() === "whatsapp";

	return (
		<li className="bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-white/10 transition-all font-mono text-slate-300">
			{/* Top Bar: Subject and Status */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
				<div className="flex items-start gap-3">
					<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
						<MessageSquare size={20} />
					</div>
					<div>
						<span className="text-xs sm:text-xs md:text-sm lg:text-base uppercase font-bold tracking-widest text-slate-500 block">
							Subject
						</span>
						<h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-black uppercase text-white tracking-wide mt-0.5">
							{ticket.subject}
						</h3>
					</div>
				</div>

				{/* Status Label */}
				<span
					className={`self-start sm:self-center px-2.5 py-1 rounded-lg border text-xs sm:text-xs md:text-sm lg:text-base font-black uppercase tracking-widest flex items-center gap-1.5 ${getStatusColor(ticket.status)}`}
				>
					<Clock
						size={12}
						className={ticket.status === "new" ? "animate-pulse" : ""}
					/>
					Status: {ticket.status.replace("_", " ")}
				</span>
			</div>

			{/* Contact Information Row */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3 border-y border-white/5 bg-black/20 rounded-xl text-center sm:text-left px-4">
				<div className="truncate">
					<p className="text-xs sm:text-xs md:text-sm lg:text-base uppercase tracking-wider text-slate-500">
						Sender Name
					</p>
					<p className="text-xs sm:text-xs md:text-sm lg:text-base font-black text-slate-300 truncate mt-0.5 flex items-center justify-center sm:justify-start gap-1">
						<User size={12} className="text-slate-500 shrink-0" />
						{ticket.name}
					</p>
				</div>

				{/* Changes automatically depending on if they prefer Email or WhatsApp */}
				<div className="truncate">
					<p className="text-xs sm:text-xs md:text-sm lg:text-base uppercase tracking-wider text-slate-500">
						{isWhatsApp ? "WhatsApp Number" : "Email Address"}
					</p>
					<p className="text-xs sm:text-xs md:text-sm lg:text-base font-black text-slate-300 truncate mt-0.5 flex items-center justify-center sm:justify-start gap-1">
						{isWhatsApp ? (
							<MessageSquare size={12} className="text-slate-500 shrink-0" />
						) : (
							<Mail size={12} className="text-slate-500 shrink-0" />
						)}
						{ticket.contact_info}
					</p>
				</div>

				<div>
					<p className="text-xs sm:text-xs md:text-sm lg:text-base uppercase tracking-wider text-slate-500">
						Reply Route
					</p>
					<p className="text-xs sm:text-xs md:text-sm lg:text-base font-black text-fuchsia-400 uppercase mt-0.5 flex items-center justify-center sm:justify-start gap-1">
						<PhoneCall size={12} className="text-fuchsia-500 shrink-0" />
						Via {ticket.contact_preference}
					</p>
				</div>
			</div>

			{/* Message Content */}
			<div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl">
				<p className="text-xs sm:text-xs md:text-sm lg:text-base uppercase tracking-wider text-slate-500 mb-1">
					Submitted Message Content
				</p>
				<p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
					{ticket.message}
				</p>
			</div>

			{/* Bottom Bar: Time received and Action Buttons */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-t border-white/[0.02] pt-2">
				<div className="text-xs sm:text-xs md:text-sm lg:text-base text-slate-500 opacity-60">
					Received: {new Date(ticket.created_at).toLocaleString("en-ZA")}
				</div>

				{/* Show choices depending on the current status */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
					{/* If the message is brand new */}
					{ticket.status === "new" && (
						<>
							<button
								type="button"
								onClick={() =>
									onUpdateStatus && onUpdateStatus(ticket.id, "in_progress")
								}
								className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-[0.97] transition-all text-white font-bold text-xs sm:text-xs md:text-sm lg:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950/20"
							>
								<Activity size={13} />
								Start Processing
							</button>
							<button
								type="button"
								onClick={() =>
									onUpdateStatus && onUpdateStatus(ticket.id, "closed")
								}
								className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-rose-950/40 hover:text-rose-400 border border-white/5 hover:border-rose-900/40 active:scale-[0.97] transition-all text-zinc-400 font-bold text-xs sm:text-xs md:text-sm lg:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
							>
								<AlertTriangle size={13} />
								Dismiss / Close
							</button>
						</>
					)}

					{/* If the message is currently being worked on */}
					{ticket.status === "in_progress" && (
						<>
							<button
								type="button"
								onClick={() =>
									onUpdateStatus && onUpdateStatus(ticket.id, "resolved")
								}
								className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] transition-all text-white font-bold text-xs sm:text-xs md:text-sm lg:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20"
							>
								<CheckCircle size={13} />
								Mark Resolved
							</button>
							<button
								type="button"
								onClick={() =>
									onUpdateStatus && onUpdateStatus(ticket.id, "closed")
								}
								className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-rose-950/40 hover:text-rose-400 border border-white/5 hover:border-rose-900/40 active:scale-[0.97] transition-all text-zinc-400 font-bold text-xs sm:text-xs md:text-sm lg:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
							>
								<AlertTriangle size={13} />
								Close Ticket
							</button>
						</>
					)}

					{/* New Rule Layout: If the message is resolved, it can now be officially closed */}
					{ticket.status === "resolved" && (
						<button
							type="button"
							onClick={() =>
								onUpdateStatus && onUpdateStatus(ticket.id, "closed")
							}
							className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-rose-900 hover:text-white border border-rose-500/30 active:scale-[0.97] transition-all text-rose-400 font-bold text-xs sm:text-xs md:text-sm lg:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
						>
							<AlertTriangle size={13} />
							Close Ticket Permanently
						</button>
					)}

					{/* If the message is completely closed and locked into the file storage archives */}
					{ticket.status === "closed" && (
						<span className="text-xs sm:text-xs md:text-sm lg:text-base uppercase text-slate-600 font-bold tracking-widest px-2 py-1 border border-white/5 bg-black/10 rounded-lg">
							Archived History Record
						</span>
					)}
				</div>
			</div>
		</li>
	);
}
