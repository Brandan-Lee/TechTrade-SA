import React, { useState, useEffect } from "react";
import { Search, ShieldAlert, Landmark, HelpCircle } from "lucide-react";
import { apiFetch } from "../../lib/api";
import CyberAlert from "../../components/ui/CyberAlert";
import EscrowPaymentCard from "../../components/admin/escrow/EscrowPaymentCard";

export default function EscrowVault() {
	const [vaultItems, setVaultItems] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [alertConfig, setAlertConfig] = useState({
		show: false,
		type: "error",
		message: "",
	});

	useEffect(() => {
		const fetchVaultData = async () => {
			try {
				const response = await apiFetch("/payments/get_pending_escrow.php");
				const result = await response.json();

				if (result.success) {
					setVaultItems(result.vault);
				} else {
					setAlertConfig({
						show: true,
						type: "error",
						message: result.error || "Failed to load payment records.",
					});
				}
			} catch (err) {
				setAlertConfig({
					show: true,
					type: "error",
					message: "Failed to connect to the payment gateway server.",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchVaultData();
	}, []);

	const handleReleaseFunds = async (transactionId) => {
		if (
			!window.confirm(
				"Are you sure you want to release these funds to the seller? This action cannot be undone.",
			)
		) {
			return;
		}

		try {
			const response = await apiFetch("/payments/release_escrow_funds.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ transaction_id: Number(transactionId) }),
			});

			const result = await response.json();

			if (result.success) {
				// Instantly clear the paid element out of our view listing dashboard
				setVaultItems((prevItems) =>
					prevItems.filter((item) => item.transaction.id !== transactionId),
				);

				setAlertConfig({
					show: true,
					type: "success",
					message: result.message || "Funds successfully released.",
				});
			} else {
				setAlertConfig({
					show: true,
					type: "error",
					message: result.error || "Could not complete request processing.",
				});
			}
		} catch (err) {
			setAlertConfig({
				show: true,
				type: "error",
				message:
					"Communication connection lost during processing execution steps.",
			});
		}
	};

	const filteredVault = vaultItems.filter((item) => {
		const query = searchQuery.toLowerCase();
		return (
			item.mPaymentId.toLowerCase().includes(query) ||
			item.transaction.publicId.toLowerCase().includes(query) ||
			item.payer.name.toLowerCase().includes(query)
		);
	});

	if (isLoading) {
		return (
			<div className="text-center py-12 font-mono text-xs sm:text-sm md:text-base text-slate-500 uppercase tracking-widest animate-pulse">
				Loading payment records...
			</div>
		);
	}

	return (
		<div className="space-y-6 font-mono text-slate-300">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-5">
				<div>
					<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						Escrow{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Vault
						</span>
					</h1>
					<p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-slate-500 mt-1 uppercase tracking-wider">
						View and manage secure holdings for uncompleted orders.
					</p>
				</div>

				<div className="relative w-full sm:w-72">
					<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
						<Search size={16} />
					</span>
					<input
						type="search"
						placeholder="FILTER BY ORDER OR BUYER..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 text-[10px] sm:text-xs tracking-wide uppercase text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all"
					/>
				</div>
			</header>

			{alertConfig.show && (
				<div className="mb-4">
					<CyberAlert
						type={alertConfig.type}
						message={alertConfig.message}
						onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
					/>
				</div>
			)}

			<section
				className="grid grid-cols-1 md:grid-cols-2 gap-4"
				aria-label="Vault Overview"
			>
				<div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
					<div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
						<Landmark size={20} />
					</div>
					<div>
						<p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm uppercase tracking-widest text-slate-500">
							Pending Transactions
						</p>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-white mt-0.5">
							{vaultItems.length} Active Orders
						</p>
					</div>
				</div>
				<div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
					<div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-400 shrink-0">
						<ShieldAlert size={20} />
					</div>
					<div>
						<p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm uppercase tracking-widest text-slate-500">
							Total Held Funds
						</p>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-fuchsia-400 mt-0.5">
							ZAR{" "}
							{vaultItems
								.reduce((acc, curr) => acc + curr.amount, 0)
								.toFixed(2)}
						</p>
					</div>
				</div>
			</section>

			<main>
				{filteredVault.length === 0 ? (
					<div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-black/20">
						<p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-slate-500">
							<HelpCircle size={16} /> No pending escrow orders found matching
							your search.
						</p>
					</div>
				) : (
					<ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
						{filteredVault.map((item) => (
							<EscrowPaymentCard
								key={item.id}
								item={item}
								onReleaseFunds={handleReleaseFunds}
							/>
						))}
					</ul>
				)}
			</main>
		</div>
	);
}
