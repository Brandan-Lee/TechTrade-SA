import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Cpu, Wifi, FilterX } from "lucide-react";
import ListingCard from "../market/ListingCard";
import { apiFetch } from "../../../lib/api";

export default function MarketPlace() {
	const location = useLocation();
	const navigate = useNavigate();
	const [displayListings, setDisplayListings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageInfo, setPageInfo] = useState({
		page: 1,
		totalPages: 1,
		totalCount: 0,
		limit: 10,
	});
	const [error, setError] = useState(null);

	const params = useMemo(
		() => new URLSearchParams(location.search),
		[location.search],
	);
	const queryPage = Math.max(1, parseInt(params.get("page") || "1", 10));
	const category = params.get("category") || "";
	const condition = params.get("condition") || "";
	const priceMin = params.get("priceMin") || "";
	const priceMax = params.get("priceMax") || "";
	const q = params.get("q") || "";

	useEffect(() => {
		const fetchListings = async () => {
			setLoading(true);
			setError(null);
			try {
				const qs = new URLSearchParams();
				qs.set("page", String(queryPage));
				qs.set("limit", "10");
				if (category) qs.set("category", category);
				if (condition) qs.set("condition", condition);
				if (priceMin) qs.set("priceMin", priceMin);
				if (priceMax) qs.set("priceMax", priceMax);
				if (q) qs.set("q", q);

				const response = await apiFetch(
					`/marketplace/get_marketplace_listings.php?${qs.toString()}`,
					{
						method: "GET",
						headers: { Accept: "application/json" },
					},
				);
				const data = await response.json();
				if (!response.ok)
					throw new Error(data?.error || "Marketplace scan failed.");

				setDisplayListings(Array.isArray(data.items) ? data.items : []);
				setPageInfo({
					page: data.page ?? queryPage,
					totalPages: data.totalPages ?? 1,
					totalCount: data.totalCount ?? 0,
					limit: data.limit ?? 10,
				});
			} catch (e) {
				setDisplayListings([]);
				setPageInfo({
					page: queryPage,
					totalPages: 1,
					totalCount: 0,
					limit: 10,
				});
				setError(e.message || "Marketplace scan failed.");
			} finally {
				setLoading(false);
			}
		};

		fetchListings();
	}, [location.search]);

	const heading = category || (q ? "Search Results" : "All Hardware");
	const hasSearchAndCategory = Boolean(q && category);

	const goToPage = (nextPage) => {
		const next = new URLSearchParams(location.search);
		next.set("page", String(nextPage));
		navigate({ pathname: "/marketplace", search: `?${next.toString()}` });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const pageButtons = useMemo(() => {
		const total = pageInfo.totalPages;
		const current = pageInfo.page;
		if (total <= 1) return [];

		const pages = new Set([1, total, current]);
		for (let p = current - 2; p <= current + 2; p++) {
			if (p >= 1 && p <= total) pages.add(p);
		}
		return Array.from(pages).sort((a, b) => a - b);
	}, [pageInfo.page, pageInfo.totalPages]);

	return (
		<section className="w-full bg-[#050505] py-12 px-6 pb-16 relative">
			<div className="max-w-7xl mx-auto relative z-10">
				{/* Header Section */}
				<header className="mb-12 space-y-4">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
						<div>
							<h1 className="text-white text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
								{heading}
							</h1>
							<div className="flex items-center gap-4 mt-4">
								<div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md">
									<p className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">
										{loading
											? "Scanning..."
											: `Found Listings: ${pageInfo.totalCount}`}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="h-px w-full bg-gradient-to-r from-fuchsia-500/50 via-white/10 to-transparent" />
				</header>

				{/* Grid Section */}
				<motion.div
					layout
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
				>
					<AnimatePresence mode="popLayout">
						{!loading &&
							displayListings.map((item) => (
								<motion.div
									key={item.id}
									layout
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.4, ease: "circOut" }}
								>
									<ListingCard {...item} theme="dark" />
								</motion.div>
							))}
					</AnimatePresence>
				</motion.div>

				{/* Pagination */}
				{!loading && pageInfo.totalPages > 1 && (
					<div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
						<button
							type="button"
							onClick={() => goToPage(Math.max(1, pageInfo.page - 1))}
							disabled={pageInfo.page <= 1}
							className="h-10 px-4 rounded-lg border border-white/10 bg-white/5 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-fuchsia-500/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
						>
							Prev
						</button>

						{pageButtons.map((p, idx) => {
							const prev = idx > 0 ? pageButtons[idx - 1] : null;
							const showEllipsis = prev != null && p - prev > 1;
							return (
								<React.Fragment key={p}>
									{showEllipsis && (
										<span className="h-10 px-2 flex items-center text-slate-600 font-black">
											...
										</span>
									)}
									<button
										type="button"
										onClick={() => goToPage(p)}
										className={`h-10 w-10 rounded-lg border text-xs font-black uppercase tracking-widest transition-all ${
											p === pageInfo.page
												? "border-fuchsia-500 bg-fuchsia-500/15 text-fuchsia-400"
												: "border-white/10 bg-white/5 text-slate-400 hover:border-fuchsia-500/40 hover:text-white"
										}`}
									>
										{p}
									</button>
								</React.Fragment>
							);
						})}

						<button
							type="button"
							onClick={() =>
								goToPage(Math.min(pageInfo.totalPages, pageInfo.page + 1))
							}
							disabled={pageInfo.page >= pageInfo.totalPages}
							className="h-10 px-4 rounded-lg border border-white/10 bg-white/5 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-fuchsia-500/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
						>
							Next
						</button>

						<div className="w-full text-center mt-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
							Page {pageInfo.page} of {pageInfo.totalPages}
						</div>
					</div>
				)}

				{/* Empty State */}
				<AnimatePresence>
					{!loading && (error || displayListings.length === 0) && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
						>
							<FilterX size={48} className="text-slate-700 mb-4" />
							<h2 className="text-slate-400 font-black uppercase tracking-widest text-xl">
								{error ? "Scan Failed" : "No Active Listings Found"}
							</h2>
							<p className="text-slate-600 text-xs uppercase tracking-widest mt-2">
								{error
									? error
									: hasSearchAndCategory
										? `No ${category} listings match "${q}".`
										: "Adjust your frequency (filters) to scan again."}
							</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
}
