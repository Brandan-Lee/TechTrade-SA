import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { FilterX } from "lucide-react";
import ListingCard from "../market/ListingCard";
import { apiFetch } from "../../../lib/api";

export default function MarketPlace() {
	const location = useLocation();
	const navigate = useNavigate();
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pageData, setPageData] = useState({
		currentPage: 1,
		totalPageCount: 1,
		totalItemCount: 0,
	});
	const [message, setMessage] = useState(null);

	const settings = useMemo(
		() => new URLSearchParams(location.search),
		[location.search],
	);
	const currentPage = Math.max(1, parseInt(settings.get("page") || "1", 10));
	const category = settings.get("category") || "";
	const condition = settings.get("condition") || "";
	const minPrice = settings.get("priceMin") || "";
	const maxPrice = settings.get("priceMax") || "";
	const searchPhrase = settings.get("q") || "";

	useEffect(() => {
		const loadListings = async () => {
			setIsLoading(true);
			setMessage(null);
			try {
				const queryDetails = new URLSearchParams();
				queryDetails.set("page", String(currentPage));
				queryDetails.set("limit", "10");
				if (category) queryDetails.set("category", category);
				if (condition) queryDetails.set("condition", condition);
				if (minPrice) queryDetails.set("priceMin", minPrice);
				if (maxPrice) queryDetails.set("priceMax", maxPrice);
				if (searchPhrase) queryDetails.set("q", searchPhrase);

				const response = await apiFetch(
					`/marketplace/get_marketplace_listings.php?${queryDetails.toString()}`,
				);
				const data = await response.json();

				if (!response.ok)
					throw new Error(data?.error || "Could not load items.");

				setItems(Array.isArray(data.items) ? data.items : []);
				setPageData({
					currentPage: data.page ?? currentPage,
					totalPageCount: data.totalPages ?? 1,
					totalItemCount: data.totalCount ?? 0,
				});
			} catch (e) {
				setItems([]);
				setPageData({
					currentPage: currentPage,
					totalPageCount: 1,
					totalItemCount: 0,
				});
				setMessage(e.message || "Could not load items.");
			} finally {
				setIsLoading(false);
			}
		};

		loadListings();
	}, [location.search]);

	const pageTitle =
		category || (searchPhrase ? "Search Results" : "All Hardware");

	const goToPage = (pageNumber) => {
		const nextSettings = new URLSearchParams(location.search);
		nextSettings.set("page", String(pageNumber));
		navigate({
			pathname: "/marketplace",
			search: `?${nextSettings.toString()}`,
		});
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const getPageNumbers = useMemo(() => {
		const total = pageData.totalPageCount;
		const current = pageData.currentPage;
		if (total <= 1) return [];

		const pages = new Set([1, total, current]);
		for (let p = current - 2; p <= current + 2; p++) {
			if (p >= 1 && p <= total) pages.add(p);
		}
		return Array.from(pages).sort((a, b) => a - b);
	}, [pageData.currentPage, pageData.totalPageCount]);

	return (
		<section className="w-full bg-[#050505] py-12 px-6 pb-16 relative text-xs sm:text-sm md:text-base lg:text-lg">
			<div className="max-w-7xl mx-auto relative z-10">
				<header className="mb-12 space-y-4">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
						<div>
							<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
								{pageTitle}
							</h1>
							<div className="flex items-center gap-4 mt-4">
								<div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md">
									<p className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest">
										{isLoading
											? "Loading..."
											: `Items Found: ${pageData.totalItemCount}`}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="h-px w-full bg-gradient-to-r from-fuchsia-500/50 via-white/10 to-transparent" />
				</header>

				<motion.div
					layout
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
				>
					<AnimatePresence mode="popLayout">
						{!isLoading &&
							items.map((item) => (
								<motion.div
									key={item.id}
									layout
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.4 }}
								>
									<ListingCard {...item} />
								</motion.div>
							))}
					</AnimatePresence>
				</motion.div>

				{!isLoading && pageData.totalPageCount > 1 && (
					<nav className="mt-10 flex items-center justify-center gap-2 flex-wrap">
						<button
							onClick={() => goToPage(Math.max(1, pageData.currentPage - 1))}
							disabled={pageData.currentPage <= 1}
							className="h-10 px-4 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-fuchsia-500/40 transition-all text-[10px] sm:text-xs font-black uppercase"
						>
							Previous
						</button>

						{getPageNumbers.map((p, idx) => {
							const previousPage = idx > 0 ? getPageNumbers[idx - 1] : null;
							const showDots = previousPage != null && p - previousPage > 1;
							return (
								<React.Fragment key={p}>
									{showDots && (
										<span className="h-10 px-2 flex items-center text-slate-600 font-black text-[10px] sm:text-xs">
											...
										</span>
									)}
									<button
										onClick={() => goToPage(p)}
										className={`h-10 w-10 rounded-lg border text-[10px] sm:text-xs font-black uppercase transition-all ${
											p === pageData.currentPage
												? "border-fuchsia-500 bg-fuchsia-500/15 text-fuchsia-400"
												: "border-white/10 bg-white/5 text-slate-400 hover:border-fuchsia-500/40"
										}`}
									>
										{p}
									</button>
								</React.Fragment>
							);
						})}

						<button
							onClick={() =>
								goToPage(
									Math.min(pageData.totalPageCount, pageData.currentPage + 1),
								)
							}
							disabled={pageData.currentPage >= pageData.totalPageCount}
							className="h-10 px-4 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-fuchsia-500/40 transition-all text-[10px] sm:text-xs font-black uppercase"
						>
							Next
						</button>
					</nav>
				)}

				<AnimatePresence>
					{!isLoading && (message || items.length === 0) && (
						<div className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
							<FilterX size={48} className="text-slate-700 mb-4" />
							<h2 className="text-slate-400 font-black uppercase tracking-widest text-lg sm:text-xl">
								{message ? "Error Loading" : "No Items Found"}
							</h2>
							<p className="text-slate-600 text-[10px] sm:text-xs uppercase tracking-widest mt-2">
								{message || "Try changing your search or filters."}
							</p>
						</div>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
}
