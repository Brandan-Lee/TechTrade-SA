import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Integrated Router Hook
import {
    ShieldCheck,
    Clock,
    XCircle,
    CheckCircle,
    Package,
    ArrowRight,
    Terminal
} from "lucide-react";

export default function MyTransactions() {
    const navigate = useNavigate(); // Navigation Instance Variable
    const [filter, setFilter] = useState("all");
    const [userRole, setUserRole] = useState("buyer"); // Simulation target switcher: 'buyer' | 'seller'

    // Transaction schema updated to clean state
    const [transactions] = useState([
        {
            id: "TX-9082314", // Updated to match your exact Escrow Tracker Page ID
            product: {
                brand: "ASUS ROG STRIX",
                model: "RTX 3080 Gaming OC",
                image: "https://placehold.co/200",
            },
            status: "pending",
            price: "R 8,500.00",
            buyer: { name: "Thabo Mthembu", avatar: "https://placehold.co/48" },
            date: "2026-05-18",
            escrowReleased: false,
        },
        {
            id: "TXN-2026-001",
            product: {
                brand: "ASUS ROG STRIX",
                model: "RTX 4090 24GB",
                image: "https://placehold.co/200",
            },
            status: "completed",
            price: "R 26,000",
            buyer: { name: "Sarah K.", avatar: "https://placehold.co/48" },
            date: "2026-05-15",
            escrowReleased: true,
        },
        {
            id: "TXN-2026-004",
            product: {
                brand: "CORSAIR",
                model: "RM1000x PSU",
                image: "https://placehold.co/200",
            },
            status: "committed",
            price: "R 3,200",
            buyer: { name: "Lisa M.", avatar: "https://placehold.co/48" },
            date: "2026-05-10",
            escrowReleased: false,
        },
        {
            id: "TXN-2026-005",
            product: {
                brand: "GIGABYTE",
                model: "M32U 4K Monitor",
                image: "https://placehold.co/200",
            },
            status: "cancelled",
            price: "R 11,000",
            buyer: { name: "Alex P.", avatar: "https://placehold.co/48" },
            date: "2026-05-08",
            escrowReleased: false,
        }
    ]);

    const filteredTransactions =
        filter === "all"
            ? transactions
            : transactions.filter((t) => t.status === filter);

    // Redirect handler passing state context down the channel if needed
    const handleManageEscrowRedirect = (transactionId) => {
        navigate("/escrow-tracker", { state: { id: transactionId } });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "completed":
                return {
                    icon: <CheckCircle className="w-4 h-4" />,
                    label: "Completed",
                    color: "text-emerald-400",
                    bgColor: "bg-emerald-500/10",
                    borderColor: "border-emerald-500/30",
                };
            case "pending":
                return {
                    icon: <Clock className="w-4 h-4" />,
                    label: "Pending",
                    color: "text-amber-400",
                    bgColor: "bg-amber-500/10",
                    borderColor: "border-amber-500/30",
                };
            case "committed":
                return {
                    icon: <Package className="w-4 h-4" />,
                    label: "Committed",
                    color: "text-fuchsia-400",
                    bgColor: "bg-fuchsia-500/10",
                    borderColor: "border-fuchsia-500/30",
                };
            case "cancelled":
                return {
                    icon: <XCircle className="w-4 h-4" />,
                    label: "Cancelled",
                    color: "text-red-400",
                    bgColor: "bg-red-500/10",
                    borderColor: "border-red-500/30",
                };
            default:
                return {
                    icon: <ShieldCheck className="w-4 h-4" />,
                    label: status,
                    color: "text-gray-400",
                    bgColor: "bg-gray-500/10",
                    borderColor: "border-gray-500/30",
                };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-screen bg-[#050506] text-slate-300 pb-20 relative overflow-hidden font-mono selection:bg-fuchsia-500/30 selection:text-white select-none"
        >
            {/* Ambient System Cyber Grid Backdrop Matrix */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

            {/* DASHBOARD TERMINAL HEADER */}
            <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-6 border-b border-white/5 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tight">
                            MY TRANSACTIONS
                        </h1>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] text-purple-400/80 font-bold uppercase tracking-wider">Access Node Mock:</span>
                            <button 
                                onClick={() => setUserRole(userRole === "buyer" ? "seller" : "buyer")} 
                                className="px-2 py-0.5 bg-purple-950/40 border border-purple-500/30 rounded text-[9px] text-white font-black uppercase tracking-wider hover:bg-purple-900 transition-colors"
                            >
                                Role: <span className="text-fuchsia-400">{userRole}</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {["all", "pending", "committed", "cancelled"].map(
                            (status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                                        filter === status
                                            ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    {status.replace("_", " ")}
                                </button>
                            ),
                        )}
                    </div>
                </div>
            </header>

            {/* DATA TRANSACTION PACKET LAYER */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-8 flex flex-col gap-6 relative z-10">
                {filteredTransactions.length > 0 ? (
                    <div className="space-y-4">
                        {filteredTransactions.map((transaction) => {
                            const statusConfig = getStatusConfig(transaction.status);
                            const isPending = transaction.status === "pending";
                            const isCommitted = transaction.status === "committed";
                            const hasEscrowPipeline = isPending; // Show track link option on active transactions

                            return (
                                <div
                                    key={transaction.id}
                                    className="bg-[#0c0c0e]/40 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 rounded-2xl p-6 transition-all shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="w-full sm:w-32 h-32 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img
                                                src={transaction.product.image}
                                                alt={transaction.product.model}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                        </div>

                                        {/* Transaction Details */}
                                        <div className="flex-grow flex flex-col justify-between gap-4">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                <div>
                                                    <h3 className="text-white font-bold text-lg uppercase tracking-tight">
                                                        {transaction.product.brand}
                                                    </h3>
                                                    <p className="text-slate-400 text-sm">
                                                        {transaction.product.model}
                                                    </p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <span className="text-white font-black text-xl tracking-wide">
                                                        {transaction.price}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <span className="font-bold uppercase text-[10px]">ID:</span>
                                                    <span className="text-purple-400 font-mono">{transaction.id}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <span className="font-bold uppercase text-[10px]">Date:</span>
                                                    <span className="text-slate-300">{transaction.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 col-span-2 md:col-span-1">
                                                    <span className="font-bold uppercase text-[10px]">User Node:</span>
                                                    <span className="text-slate-300">{transaction.buyer.name}</span>
                                                </div>
                                            </div>

                                            {/* Status Badge Array & Dynamic Action Hooks */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border ${statusConfig.color}`}>
                                                        {statusConfig.icon}
                                                        <span className="text-xs font-bold uppercase tracking-wider">
                                                            {statusConfig.label}
                                                        </span>
                                                    </div>
                                                    
                                                    {transaction.escrowReleased && (
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                                            <ShieldCheck className="w-4 h-4" />
                                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                                Escrow Released
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* CONDITIONAL ACTION BUTTONS */}
                                                <div className="w-full sm:w-auto flex flex-wrap gap-2 justify-end">
                                                    {isCommitted && (
                                                        <button 
                                                            onClick={() => alert(`Redirecting to TTL Protocol Bridge for request node ${transaction.id}`)}
                                                            className="btn btn-sm w-full sm:w-auto bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 border-none text-white font-black tracking-widest text-[11px] uppercase h-9 px-5 rounded-lg shadow-lg flex items-center justify-center gap-2"
                                                        >
                                                            <span>Open TTL Bridge</span>
                                                            <ArrowRight size={13} />
                                                        </button>
                                                    )}

                                                    {/* Target Route: Redirects to your custom tracker page path */}
                                                    {hasEscrowPipeline && (
                                                        <button
                                                            onClick={() => handleManageEscrowRedirect(transaction.id)}
                                                            className="btn btn-sm w-full sm:w-auto font-black tracking-widest text-[11px] uppercase h-9 px-5 rounded-lg border bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all"
                                                        >
                                                            <Terminal size={13} className="text-slate-400" />
                                                            <span>Manage Escrow</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 border border-dashed border-white/10 rounded-2xl bg-[#0c0c0e]/40 backdrop-blur-sm text-center flex flex-col items-center justify-center p-6 max-w-xl mx-auto mt-12 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-center text-purple-400/80 mb-4">
                            <Package size={20} />
                        </div>
                        <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                            NO TRANSACTIONS FOUND
                        </h2>
                        <p className="text-slate-400 text-xs">
                            {filter === "all"
                                ? "You have no transaction history yet"
                                : `No ${filter.replace("_", " ")} transactions found`}
                        </p>
                    </div>
                )}
            </main>
        </motion.div>
    );
}