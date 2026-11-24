import React, { useState, useEffect } from "react";
import { Search, Landmark, Inbox, AlertOctagon } from "lucide-react";
import { apiFetch } from "@/lib/api";
import CyberAlert, { type AlertType } from "@/components/ui/CyberAlert";
import { SupportMessageCard } from "@/features/admin";

export default function UserSupport() {
	const [tickets, setTickets] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [isLoading, setIsLoading] = useState(true);
	const [alertConfig, setAlertConfig] = useState<{ show: boolean; message: string; type: AlertType }>({
		show: false,
		type: "error",
		message: "",
	});

	useEffect(() => {
		const fetchSupportData = async () => {
			try {
				const response = await apiFetch("/support/get_messages.php");
				const result = await response.json();

				if (result.success) {
					setTickets(result.messages);
				} else {
					setAlertConfig({
						show: true,
						type: "error",
						message: result.error || "Could not load messages.",
					});
				}
			} catch (err) {
				setAlertConfig({
					show: true,
					type: "error",
					message: "Could not connect to the server to find messages.",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchSupportData();
	}, []);

	const handleUpdateStatus = async (ticketId, newStatus) => {
		try {
			const response = await apiFetch("/support/update_status.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ticket_id: ticketId, status: newStatus }),
			});
			const result = await response.json();

			if (result.success) {
				setTickets((prev) =>
					prev.map((t) =>
						t.id === ticketId ? { ...t, status: newStatus } : t,
					),
				);
				setAlertConfig({
					show: true,
					type: "success",
					message: "Status updated successfully.",
				});
			} else {
				throw new Error(result.error);
			}
		} catch (err) {
			setAlertConfig({
				show: true,
				type: "error",
				message: err.message || "Could not complete your request.",
			});
		}
	};

	const filteredTickets = tickets.filter((t) => {
		const matchesSearch =
			t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
			t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			t.contact_info.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus = statusFilter === "all" || t.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	if (isLoading) {
		return (
			<div className="text-center py-12 font-mono text-xs sm:text-sm md:text-base text-slate-500 uppercase tracking-widest animate-pulse">
				Loading messages...
			</div>
		);
	}

	const newTicketsCount = tickets.filter((t) => t.status === "new").length;

	return (
		<div className="space-y-6 font-mono text-slate-300 relative">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808001_1px,transparent_1px),linear-gradient(to_bottom,#80808002_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

			<header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-white/5 pb-5 relative z-10">
				<div>
					<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						User{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-secondary">
							Support
						</span>
					</h1>
					<p className="text-sm text-slate-500 mt-1 uppercase tracking-wider">
						Review and handle customer messages.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
					<nav
						aria-label="Message status filters"
						className="flex flex-wrap gap-1 bg-black/40 border border-white/5 p-1 rounded-xl"
					>
						{[
							{ id: "all", label: "All" },
							{ id: "new", label: "New" },
							{ id: "in_progress", label: "Active" },
							{ id: "resolved", label: "Resolved" },
							{ id: "closed", label: "Closed" },
						].map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setStatusFilter(tab.id)}
								className={`px-3 py-1.5 rounded-lg text-xs sm:text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider transition-all cursor-pointer ${
									statusFilter === tab.id
										? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.25)]"
										: "text-slate-400 hover:bg-white/5 hover:text-white"
								}`}
							>
								{tab.label}
							</button>
						))}
					</nav>

					<div className="relative min-w-[240px]">
						<label htmlFor="search-messages" className="sr-only">
							Filter messages
						</label>
						<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
							<Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</span>
						<input
							id="search-messages"
							type="search"
							placeholder="FILTER CURRENT LIST..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full h-10 pl-9 pr-4 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm md:text-base tracking-wide uppercase text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all"
						/>
					</div>
				</div>
			</header>

			{alertConfig.show && (
				<div className="mb-4 relative z-10 text-sm">
					<CyberAlert
						type={alertConfig.type}
						message={alertConfig.message}
						onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
					/>
				</div>
			)}

			<section
				className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10"
				aria-label="Message metrics"
			>
				<article className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
					<div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 shrink-0">
						<Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
					</div>
					<div>
						<h2 className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-slate-500 font-normal">
							Open Messages
						</h2>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-white mt-0.5">
							{tickets.length} Total Messages
						</p>
					</div>
				</article>
				<article className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
					<div className="p-3 bg-info/10 rounded-xl text-info shrink-0">
						<Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
					</div>
					<div>
						<h2 className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-slate-500 font-normal">
							Unattended Messages
						</h2>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-info mt-0.5">
							{newTicketsCount} Marked As New
						</p>
					</div>
				</article>
			</section>

			<main className="relative z-10">
				{filteredTickets.length === 0 ? (
					<div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-black/20 max-w-xl mx-auto mt-6 flex flex-col items-center justify-center p-6">
						<div className="w-12 h-12 rounded-xl bg-purple-500/5 border border-purple-500/15 flex items-center justify-center text-purple-400/70 mb-4">
							<AlertOctagon className="w-4 h-4 sm:w-5 sm:h-5" />
						</div>
						<h2 className="text-white font-bold text-sm uppercase tracking-widest mb-1">
							No Messages Found
						</h2>
						<p className="text-slate-500 text-sm max-w-xs leading-normal">
							{statusFilter === "all"
								? "There are currently no support messages in the system."
								: `No messages found matching status "${statusFilter}".`}
						</p>
					</div>
				) : (
					<ul className="grid grid-cols-1 gap-4">
						{filteredTickets.map((ticket) => (
							<li key={ticket.id}>
								<SupportMessageCard
									ticket={ticket}
									onUpdateStatus={handleUpdateStatus}
								/>
							</li>
						))}
					</ul>
				)}
			</main>
		</div>
	);
}
