import React, { useState, useEffect } from "react";
import { apiFetch } from "../../lib/api";
import { Search, X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import HardwareSpecCard from "../../components/admin/hardware/HardwareSpecCard";
import { useNavigate } from "react-router-dom";

export default function HardwareDatabase() {
	const [categories, setCategories] = useState([
		{ slug: "all", name: "All Inventory" },
		{ slug: "cpus", name: "Processors" },
		{ slug: "gpus", name: "Graphics Cards" },
		{ slug: "motherboards", name: "Motherboards" },
		{ slug: "memory", name: "Memory / RAM" },
		{ slug: "ssds", name: "Solid State Drives" },
		{ slug: "psus", name: "Power Supply Units" },
		{ slug: "aios", name: "Liquid System Coolers" },
		{ slug: "air-coolers", name: "Air System Coolers" },
		{ slug: "case-fans", name: "Case Cooling Fans" },
		{ slug: "hdds", name: "Hard Disk Drives" },
		{ slug: "pc-cases", name: "Computer PC Cases" },
	]);

	const [activeCategory, setActiveCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [appliedSearch, setAppliedSearch] = useState("");
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const itemsPerPage = 10;
	const navigate = useNavigate();

	const handleCategoryChange = (slug) => {
		setActiveCategory(slug);
		setAppliedSearch("");
		setSearchQuery("");
		setCurrentPage(1);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			setAppliedSearch(searchQuery);
			setCurrentPage(1);
		}
	};

	const handleClearSearch = () => {
		setSearchQuery("");
		setAppliedSearch("");
		setCurrentPage(1);
	};

	useEffect(() => {
		const loadHardware = async () => {
			setIsLoading(true);
			setError("");
			try {
				const params = new URLSearchParams();

				if (activeCategory !== "all") {
					params.append("category", activeCategory);
				}
				if (appliedSearch.trim() !== "") {
					params.append("search", appliedSearch.trim());
				}

				params.append("page", currentPage);
				params.append("limit", itemsPerPage);

				const url = `/hardware_intelligence/hardware/get_hardware.php?${params.toString()}`;
				const response = await apiFetch(url);
				const result = await response.json();

				if (result.success) {
					setItems(result.items || []);
					const totalCount = result.total_items || result.items.length;
					setTotalPages(Math.max(1, Math.ceil(totalCount / itemsPerPage)));
				} else {
					setError(result.error || "Could not load items.");
				}
			} catch (err) {
				setError("Failed to communicate with the hardware database server.");
			} finally {
				setIsLoading(false);
			}
		};

		loadHardware();
	}, [activeCategory, appliedSearch, currentPage]);

	const formatPrice = (cents) => {
		if (!cents) return "MSRP Unavailable";
		return new Intl.NumberFormat("en-ZA", {
			style: "currency",
			currency: "ZAR",
		}).format(cents / 100);
	};

	const handleEditSpec = (item) => {
		const categorySlug = item.category || activeCategory;
		navigate(`/admin/hardware-database/edit/${categorySlug}/${item.id}`);
	};

	const handleAddComponent = () => {
		navigate("/admin/hardware-database/create");
	};

	return (
		<div className="space-y-6 font-mono text-slate-300 p-4">
			<header className="border-b border-white/5 pb-4 space-y-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
							Hardware{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
								Inventory
							</span>
						</h1>
					</div>

					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
						<div className="relative w-full sm:w-64 md:w-72 lg:w-80">
							<Search
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
							/>

							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Type query and hit Enter..."
								className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-mono"
							/>

							{searchQuery.length > 0 && (
								<button
									onClick={handleClearSearch}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer transition-colors"
								>
									<X size={14} />
								</button>
							)}
						</div>

						<button
							onClick={handleAddComponent}
							className="h-8 sm:h-9 px-2.5 sm:px-3 bg-amber-500/5 hover:bg-amber-500/10 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl border border-amber-500/20 transition-all flex items-center gap-1.5"
						>
							<Plus size={14} />
							Add Component
						</button>
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5 content-start">
					{categories.map((cat) => (
						<button
							key={cat.slug}
							onClick={() => handleCategoryChange(cat.slug)}
							className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer truncate text-center md:text-left ${
								activeCategory === cat.slug
									? "bg-purple-600 text-white shadow-md"
									: "text-slate-400 hover:bg-white/5 hover:text-white"
							}`}
						>
							{cat.name}
						</button>
					))}
				</div>
			</header>

			<main className="space-y-6 min-h-[400px] relative">
				{isLoading && items.length > 0 && (
					<div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center transition-all">
						<div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
					</div>
				)}

				{isLoading && items.length === 0 ? (
					<div className="flex items-center justify-center py-24 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-500 animate-pulse">
						Reading catalog records...
					</div>
				) : error ? (
					<div className="text-center py-12 text-rose-400 text-xs sm:text-sm md:text-base border border-rose-500/10 bg-rose-500/5 rounded-xl">
						{error}
					</div>
				) : items.length === 0 ? (
					<div className="text-center py-12 text-slate-500 text-xs sm:text-sm md:text-base">
						No components found matching your layout targets.
					</div>
				) : (
					<div
						className={`transition-opacity duration-150 ${isLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{items.map((item) => (
								<HardwareSpecCard
									key={item.id}
									item={item}
									category={item.category || activeCategory}
									priceFormatter={formatPrice}
									onEdit={() => handleEditSpec(item)}
									isGlobal={!item.category || activeCategory === "all"}
								/>
							))}
						</div>

						<div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs sm:text-sm text-slate-500 mt-6">
							<span>
								Page <strong className="text-white">{currentPage}</strong> of{" "}
								<strong className="text-white">{totalPages}</strong>
							</span>
							<div className="flex gap-2">
								<button
									disabled={currentPage === 1 || isLoading}
									onClick={() => setCurrentPage((prev) => prev - 1)}
									className="p-2 rounded-lg bg-white/5 border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors cursor-pointer"
								>
									<ChevronLeft size={16} />
								</button>
								<button
									disabled={currentPage === totalPages || isLoading}
									onClick={() => setCurrentPage((prev) => prev + 1)}
									className="p-2 rounded-lg bg-white/5 border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors cursor-pointer"
								>
									<ChevronRight size={16} />
								</button>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
