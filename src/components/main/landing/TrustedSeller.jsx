import React, { useState, useEffect } from "react";
import { ChevronRight, Zap, Loader2 } from "lucide-react";
import TrustedSellerCard from "../market/TrustedSellerCard";
import { apiFetch } from "../../../lib/api";

export default function TrustedSellers() {
	const [sellers, setSellers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchSellers = async () => {
			try {
				const response = await apiFetch(
					"marketplace/get_trusted_sellers.php",
					{
						method: "GET",
						headers: { Accept: "application/json" },
					},
				);

				if (response.ok) {
					const data = await response.json();
					setSellers(Array.isArray(data) ? data : []);
				}
			} catch (err) {
				console.error(
					"Network terminal error pulling dynamic trusted sellers:",
					err,
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSellers();
	}, []);

	return (
		<section className="w-full bg-[#050505] relative py-16 px-4 overflow-hidden">
			<div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>

			<div className="absolute -top-24 -left-24 w-96 h-96 bg-fuchsia-600/10 blur-[120px] rounded-full"></div>

			<div className="max-w-[1440px] mx-auto relative z-10">
				<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
					<div className="space-y-2">
						<h2 className="text-white text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
							Trusted{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
								Sellers
							</span>
						</h2>

						<p className="text-slate-400 text-sm md:text-base font-medium max-w-md uppercase tracking-tight">
							<span className="text-white">Trusted Traders</span>
						</p>
					</div>

					<div className="flex items-center gap-4 group cursor-pointer">
						<span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest group-hover:text-fuchsia-400 transition-colors">
							Swipe to see more
						</span>
						<div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white group-hover:border-fuchsia-500 transition-all">
							<ChevronRight
								size={18}
								className="group-hover:translate-x-0.5 transition-transform"
							/>
						</div>
					</div>
				</div>

				<div className="relative">
					<div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none hidden md:block"></div>

					{isLoading ? (
						<div className="w-full flex py-20 flex-col items-center justify-center gap-3 text-slate-500 font-mono text-xs uppercase tracking-widest">
							<Loader2 className="animate-spin text-fuchsia-500" size={24} />
							Retrieving Secure Seller Metrics...
						</div>
					) : (
						<div className="flex overflow-x-auto gap-6 pb-12 no-scrollbar snap-x snap-mandatory touch-pan-x">
							{sellers.length > 0 ? (
								sellers.map((seller) => (
									<div
										key={seller.id}
										className="snap-center md:snap-start min-w-[300px] md:min-w-[340px] transition-transform duration-300 hover:-translate-y-2"
									>
										<TrustedSellerCard
											{...seller}
											isMaster={seller.tier === "Master Tier"}
										/>
									</div>
								))
							) : (
								<div className="text-slate-600 font-mono text-xs uppercase p-6 border border-white/5 rounded-2xl w-full text-center">
									No verified sellers matching minimum trust criteria are
									currently active online.
								</div>
							)}

							{/* Final "View All" Card for UX completion */}
							<div className="snap-center md:snap-start min-w-[200px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-white/5 group hover:border-fuchsia-500/50 transition-all cursor-pointer">
								<div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<Zap
										size={24}
										className="text-slate-500 group-hover:text-fuchsia-400"
									/>
								</div>
								<span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">
									Full Registry
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			<style
				dangerouslySetInnerHTML={{
					__html: `
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`,
				}}
			/>
		</section>
	);
}
