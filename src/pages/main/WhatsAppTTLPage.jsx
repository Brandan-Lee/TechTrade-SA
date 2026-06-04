import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Phone, Copy, Check, AlertTriangle, Loader2 } from "lucide-react";
import { apiFetch } from "../../lib/api";

export default function SecureContactPage() {
	const { transactionId } = useParams();

	const [transactionData, setTransactionData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const [copiedTarget, setCopiedTarget] = useState(null);

	useEffect(() => {
		if (!transactionId) {
			setErrorMessage("Missing item record identity.");
			setIsLoading(false);
			return;
		}

		const loadSecureContact = async () => {
			setIsLoading(true);
			setErrorMessage(null);

			try {
				const response = await apiFetch(
					`/secure_contact/get_secure_contact.php?public_id=${encodeURIComponent(transactionId)}`,
				);

				const res = await response.json();

				if (!response.ok) {
					throw new Error(res.error || "Unable to load contact information.");
				}

				if (res.status === "success") {
					setTransactionData(res.data);
				} else {
					throw new Error(
						res.error || "The system could not pull up this entry.",
					);
				}
			} catch (err) {
				setErrorMessage(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		loadSecureContact();
	}, [transactionId]);

	const handleCopy = (text, type) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		setCopiedTarget(type);
		setTimeout(() => setCopiedTarget(null), 2000);
	};

	if (isLoading) {
		return (
			<div className="bg-[#07050e] min-h-screen flex flex-col items-center justify-center text-purple-400 p-4">
				<Loader2 className="w-8 h-8 animate-spin mb-2 text-fuchsia-500" />
				<span className="text-xs sm:text-sm uppercase tracking-widest font-bold">
					Loading Details...
				</span>
			</div>
		);
	}

	if (errorMessage || !transactionData) {
		return (
			<div className="bg-[#07050e] min-h-screen flex flex-col items-center justify-center text-rose-400 p-4">
				<AlertTriangle className="w-8 h-8 mb-3 text-rose-500" />
				<span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
					Information Unavailable
				</span>
				<p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs text-center border border-rose-500/20 bg-rose-950/10 p-3 rounded-xl">
					{errorMessage || "The requested info could not be recovered."}
				</p>
			</div>
		);
	}

	return (
		<div className="bg-[#07050e] min-h-screen text-slate-300 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-purple-500/30">
			<div className="max-w-4xl mx-auto relative z-10">
				<header className="mb-10 text-center sm:text-left border-b border-purple-500/10 pb-6">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-white uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.15)]">
						Secure{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
							Contact Info
						</span>
					</h1>
					<p className="text-slate-400 mt-2 text-xs sm:text-sm max-w-2xl leading-relaxed">
						The offer has been accepted! Use the verified mobile numbers below
						to get in touch, talk about the item details, or arrange your
						handover.
					</p>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
					<main className="md:col-span-8 space-y-6">
						<section
							aria-label="Buyer Information"
							className="p-6 bg-[#0c081d] border border-purple-500/20 rounded-2xl relative group hover:border-purple-500/40 transition-all duration-300 shadow-xl shadow-black/40"
						>
							<h2 className="absolute top-0 left-4 -translate-y-1/2 bg-purple-600 text-white text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded shadow">
								Buyer Details
							</h2>

							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
								<div>
									<h3 className="text-white font-black text-base sm:text-lg tracking-wide">
										{transactionData.buyer.name}
									</h3>
									<p className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mt-0.5">
										Mobile Number
									</p>
									<div className="text-fuchsia-400 text-lg sm:text-xl font-bold tracking-widest mt-2 bg-[#06040f] border border-purple-950 px-3 py-1.5 rounded-lg inline-block">
										{transactionData.buyer.phone}
									</div>
								</div>

								<div className="flex sm:flex-col gap-2 shrink-0">
									<button
										onClick={() =>
											handleCopy(transactionData.buyer.phone, "buyer")
										}
										className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[#130d2a] border border-purple-500/20 hover:border-purple-500/60 text-slate-300 rounded-xl text-xs font-bold transition-all"
									>
										{copiedTarget === "buyer" ? (
											<Check className="w-3.5 h-3.5 text-emerald-400" />
										) : (
											<Copy className="w-3.5 h-3.5" />
										)}
										{copiedTarget === "buyer" ? "Copied" : "Copy Number"}
									</button>
								</div>
							</div>
						</section>

						<section
							aria-label="Seller Information"
							className="p-6 bg-[#0c081d] border border-fuchsia-500/20 rounded-2xl relative group hover:border-fuchsia-500/40 transition-all duration-300 shadow-xl shadow-black/40"
						>
							<h2 className="absolute top-0 left-4 -translate-y-1/2 bg-fuchsia-600 text-white text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded shadow">
								Seller Details
							</h2>

							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
								<div>
									<h3 className="text-white font-black text-base sm:text-lg tracking-wide">
										{transactionData.seller.name}
									</h3>
									<p className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mt-0.5">
										Mobile Number
									</p>
									<div className="text-fuchsia-400 text-lg sm:text-xl font-bold tracking-widest mt-2 bg-[#06040f] border border-fuchsia-950 px-3 py-1.5 rounded-lg inline-block">
										{transactionData.seller.phone}
									</div>
								</div>

								<div className="flex sm:flex-col gap-2 shrink-0">
									<button
										onClick={() =>
											handleCopy(transactionData.seller.phone, "seller")
										}
										className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[#130d2a] border border-fuchsia-500/20 hover:border-fuchsia-500/60 text-slate-300 rounded-xl text-xs font-bold transition-all"
									>
										{copiedTarget === "seller" ? (
											<Check className="w-3.5 h-3.5 text-emerald-400" />
										) : (
											<Copy className="w-3.5 h-3.5" />
										)}
										{copiedTarget === "seller" ? "Copied" : "Copy Number"}
									</button>
								</div>
							</div>
						</section>
					</main>

					<aside className="md:col-span-4 space-y-4">
						<section
							aria-label="Summary Details"
							className="p-5 bg-[#0a0615] border border-purple-500/10 rounded-2xl"
						>
							<span className="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest block mb-1">
								Reference Number
							</span>
							<div className="text-white font-bold text-xs sm:text-sm mb-4 text-purple-400">
								{transactionData.publicId}
							</div>

							<span className="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest block mb-1">
								Item Ordered
							</span>
							<div className="text-slate-200 font-bold text-xs sm:text-sm leading-snug">
								{transactionData.itemTitle}
							</div>
						</section>

						<section
							aria-label="Safety Tips"
							className="p-5 bg-amber-950/10 border border-amber-500/20 rounded-2xl text-[11px] sm:text-xs"
						>
							<h2 className="text-amber-400 font-black uppercase tracking-wider flex items-center gap-2 mb-2">
								<AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />{" "}
								Trading Safely
							</h2>
							<p className="text-slate-400 leading-relaxed font-medium">
								Never share password pins, bank account details, or login codes
								over the phone. Keep your personal information private and
								confirm all handovers safely.
							</p>
						</section>
					</aside>
				</div>
			</div>
		</div>
	);
}
