import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	Clock,
	XCircle,
	CheckCircle,
	Package,
	AlertTriangle,
} from "lucide-react";
import TransactionItem from "../../components/main/transactions/TransactionItem";
import { apiFetch } from "../../lib/api";

export default function MyTransactions() {
	const navigate = useNavigate();
	const [filter, setFilter] = useState("all");
	const [transactions, setTransactions] = useState([]);
	const [isSyncing, setIsSyncing] = useState(true);

	useEffect(() => {
		async function fetchTransactions() {
			try {
				const response = await apiFetch(
					"/transactions/fetch_my_transactions.php",
				);
				const data = await response.json();
				if (response.ok && data.status === "success") {
					setTransactions(data.transactions);
				}
			} catch (error) {
				console.error("Data packet sequence sync validation dropped:", error);
			} finally {
				setIsSyncing(false);
			}
		}
		fetchTransactions();
	}, []);

	const getStatusConfig = (status) => {
		switch (status) {
			case "pending":
				return {
					bgColor: "bg-amber-500/10",
					borderColor: "border-amber-500/30",
					color: "text-amber-400",
					label: "pending",
					icon: <Clock className="w-3.5 h-3.5" />,
				};
			case "committed":
				return {
					bgColor: "bg-fuchsia-500/10",
					borderColor: "border-fuchsia-500/30",
					color: "text-fuchsia-400",
					label: "Committed",
					icon: <Package className="w-3.5 h-3.5" />,
				};
			case "completed":
				return {
					bgColor: "bg-emerald-500/10",
					borderColor: "border-emerald-500/30",
					color: "text-emerald-400",
					label: "completed",
					icon: <CheckCircle className="w-3.5 h-3.5" />,
				};
			case "cancelled":
				return {
					bgColor: "bg-rose-500/10",
					borderColor: "border-rose-500/30",
					color: "text-rose-400",
					label: "terminated",
					icon: <XCircle className="w-3.5 h-3.5" />,
				};
			default:
				return {
					bgColor: "bg-slate-500/10",
					borderColor: "border-slate-500/30",
					color: "text-slate-400",
					label: "Disputed Action",
					icon: <AlertTriangle className="w-3.5 h-3.5" />,
				};
		}
	};

	const filteredTransactions = transactions.filter(
		(tx) => filter === "all" || tx.status === filter,
	);

	if (isSyncing) {
		return (
			<div className="w-screen h-screen flex flex-col items-center justify-center bg-[#050506] font-mono gap-3">
				<div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
				<p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
					Syncing Transaction Ledger Matrix...
				</p>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="bg-[#050506] text-slate-300 pb-20 relative overflow-hidden font-mono"
		>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

			<header className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-6 border-b border-white/5 relative z-10">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h1 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tight">
							MY TRANSACTIONS
						</h1>
					</div>

					<div className="flex flex-wrap gap-2">
						{["all", "pending", "committed", "cancelled"].map((status) => (
							<button
								key={status}
								onClick={() => setFilter(status)}
								className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
									filter === status
										? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
										: "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
								}`}
							>
								{status}
							</button>
						))}
					</div>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-8 flex flex-col gap-6 relative z-10">
				{filteredTransactions.length > 0 ? (
					<div className="space-y-4">
						{filteredTransactions.map((transaction) => (
							<TransactionItem
								key={transaction.id}
								transaction={transaction}
								statusConfig={getStatusConfig(transaction.status)}
								isCommitted={transaction.status === "committed"}
							/>
						))}
					</div>
				) : (
					<div className="py-20 border border-dashed border-white/10 rounded-2xl bg-[#0c0c0e]/40 backdrop-blur-sm text-center flex flex-col items-center justify-center p-6 max-w-xl mx-auto mt-12">
						<div className="w-12 h-12 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-center text-purple-400/80 mb-4">
							<Package size={20} />
						</div>
						<h2 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
							NO TRANSACTIONS FOUND
						</h2>
						<p className="text-slate-400 text-xs">
							{filter === "all"
								? "You have no transaction history yet"
								: `No ${filter} transactions found`}
						</p>
					</div>
				)}
			</main>
		</motion.div>
	);
}
