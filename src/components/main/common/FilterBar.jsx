import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, ChevronDown, Banknote, X, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterBar() {
	const navigate = useNavigate();
	const location = useLocation();
	const [openDropdown, setOpenDropdown] = useState(null);
	const [menuPos, setMenuPos] = useState({ left: 0, top: 0 });
	const [tempPrice, setTempPrice] = useState({ min: "", max: "" });
	const [filters, setFilters] = useState({
		category: null,
		priceMin: "",
		priceMax: "",
		condition: null,
	});
	const [appliedFilters, setAppliedFilters] = useState({
		category: null,
		priceMin: "",
		priceMax: "",
		condition: null,
	});
	const dropdownRef = useRef(null);

	const navConfig = [
		{
			id: "components",
			label: "Components",
			type: "list",
			items: ["GPUs", "CPUs", "Motherboards", "PSUs", "Memory"],
		},
		{
			id: "cooling",
			label: "Cooling",
			type: "list",
			items: ["AIO", "Air Coolers", "Case Fans"],
		},
		{ id: "storage", label: "Storage", type: "list", items: ["SSDs", "HDDs"] },
		{ id: "price", label: "Price", type: "price", icon: Banknote },
		{
			id: "condition",
			label: "Condition",
			type: "list",
			items: ["New", "Like New", "Good", "Fair"],
		},
	];

	const toQueryString = (nextFilters, nextPage = 1) => {
		const params = new URLSearchParams();
		const current = new URLSearchParams(location.search);
		const q = current.get("q");
		if (q) params.set("q", q);
		if (nextFilters.category) params.set("category", nextFilters.category);
		if (nextFilters.condition) params.set("condition", nextFilters.condition);
		if (nextFilters.priceMin)
			params.set("priceMin", String(nextFilters.priceMin));
		if (nextFilters.priceMax)
			params.set("priceMax", String(nextFilters.priceMax));
		params.set("page", String(nextPage));
		return params.toString();
	};

	const syncUrl = (nextFilters, nextPage = 1) => {
		const search = toQueryString(nextFilters, nextPage);
		navigate({ pathname: "/marketplace", search: search ? `?${search}` : "" });
	};

	const applyFilter = (updates) => {
		setFilters((prev) => ({ ...prev, ...updates }));
		setOpenDropdown(null);
	};

	const clearFilters = () => {
		const next = {
			category: null,
			priceMin: "",
			priceMax: "",
			condition: null,
		};
		setFilters(next);
		setAppliedFilters(next);
		setTempPrice({ min: "", max: "" });
		setOpenDropdown(null);
		navigate("/marketplace");
	};

	useEffect(() => {
		if (location.pathname !== "/marketplace") return;
		const params = new URLSearchParams(location.search);
		const next = {
			category: params.get("category") || null,
			condition: params.get("condition") || null,
			priceMin: params.get("priceMin") || "",
			priceMax: params.get("priceMax") || "",
		};
		setFilters(next);
		setAppliedFilters(next);
		setTempPrice({
			min: next.priceMin || "",
			max: next.priceMax || "",
		});
	}, [location.pathname, location.search]);

	const applySelectedFilters = () => {
		syncUrl(filters, 1);
		setAppliedFilters(filters);
		setOpenDropdown(null);
	};

	const hasPendingChanges =
		filters.category !== appliedFilters.category ||
		filters.condition !== appliedFilters.condition ||
		(filters.priceMin || "") !== (appliedFilters.priceMin || "") ||
		(filters.priceMax || "") !== (appliedFilters.priceMax || "");

	// --- LOGIC: The "Portal" Positioning Fix ---
	const updatePosition = useCallback((el) => {
		if (el) {
			const rect = el.getBoundingClientRect();
			setMenuPos({
				left: rect.left,
				top: rect.bottom + 8,
			});
		}
	}, []);

	const handleToggle = (e, id) => {
		e.stopPropagation();
		if (openDropdown === id) {
			setOpenDropdown(null);
		} else {
			updatePosition(e.currentTarget);
			setOpenDropdown(id);
		}
	};

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				if (!event.target.closest(".portal-dropdown")) {
					setOpenDropdown(null);
				}
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const urlQ = (() => {
		const params = new URLSearchParams(location.search);
		return params.get("q") || "";
	})();

	const activeFiltersList = [
		urlQ ? `Search: ${urlQ}` : null,
		filters.category,
		filters.condition,
		(() => {
			if (!filters.priceMin && !filters.priceMax) return null;
			if (filters.priceMin && !filters.priceMax)
				return `Min: R${filters.priceMin}`;
			if (!filters.priceMin && filters.priceMax)
				return `Max: R${filters.priceMax}`;
			return `R${filters.priceMin} - R${filters.priceMax}`;
		})(),
	].filter(Boolean);

	const isAnyFilterActive = activeFiltersList.length > 0;
	const activeConfig = navConfig.find((d) => d.id === openDropdown);

	return (
		<div
			ref={dropdownRef}
			className="w-full sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10"
		>
			<nav className="max-w-[1440px] mx-auto h-16 px-4 flex items-center gap-4">
				{/* Branding Icon */}
				<div className="flex items-center gap-2 pr-4 border-r border-white/10 shrink-0">
					<SlidersHorizontal className="w-4 h-4 text-fuchsia-500" />
					<span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hidden md:block">
						FILTER
					</span>
				</div>

				{/* Scrollable Nav Area */}
				<div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 grow">
					<button
						onClick={clearFilters}
						className={`h-9 px-4 rounded-md text-[11px] font-black uppercase tracking-widest transition-all shrink-0 border ${
							!isAnyFilterActive
								? "bg-fuchsia-600 text-white border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
								: "bg-white/5 text-slate-400 border-white/10 hover:border-fuchsia-500/50"
						}`}
					>
						[ ALL HARDWARE ]
					</button>

					{navConfig.map((dropdown) => {
						const isSet =
							(dropdown.id === "condition" && filters.condition) ||
							(dropdown.id === "price" &&
								(filters.priceMin || filters.priceMax)) ||
							(dropdown.type === "list" &&
								dropdown.id !== "condition" &&
								!!filters.category &&
								dropdown.items.includes(filters.category));

						return (
							<button
								key={dropdown.id}
								onClick={(e) => handleToggle(e, dropdown.id)}
								className={`h-9 px-4 rounded-md flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 border ${
									isSet || openDropdown === dropdown.id
										? "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.2)]"
										: "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
								}`}
							>
								{dropdown.label}
								<ChevronDown
									size={12}
									className={`transition-transform duration-300 ${openDropdown === dropdown.id ? "rotate-180" : ""}`}
								/>
							</button>
						);
					})}
				</div>
			</nav>

			{/* Active Filters Bar */}
			<AnimatePresence>
				{isAnyFilterActive && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="bg-fuchsia-500/5 border-t border-white/5"
					>
						<div className="max-w-[1440px] mx-auto px-4 py-2 flex items-center justify-between gap-3">
							{/* Active Parameters List */}
							<div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
								<span className="text-fuchsia-500/50 text-[9px] font-black uppercase tracking-widest shrink-0">
									Active Filters:
								</span>
								<div className="flex flex-wrap gap-2">
									{activeFiltersList.map((f, i) => (
										<div
											key={i}
											className="flex items-center gap-2 px-2 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded text-fuchsia-400 text-[10px] font-bold uppercase"
										>
											{f}
										</div>
									))}
								</div>
							</div>

							{/* Control Actions Container */}
							<div className="flex items-center gap-2 shrink-0">
								<button
									type="button"
									onClick={applySelectedFilters}
									disabled={!hasPendingChanges}
									className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[9px] font-black uppercase tracking-widest transition-all group ${
										!hasPendingChanges
											? "bg-white/5 text-slate-600 border-white/10 cursor-not-allowed opacity-60"
											: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30 hover:border-fuchsia-500 text-fuchsia-400"
									}`}
								>
									<Zap
										size={10}
										className="transition-transform group-hover:scale-110"
									/>
									<span>APPLY_FILTERS</span>
								</button>

								<button
									type="button"
									onClick={clearFilters}
									className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-400 text-[9px] font-black uppercase tracking-widest transition-all group"
								>
									<X
										size={10}
										className="transition-transform group-hover:rotate-90"
									/>
									<span>CLEAR_ALL</span>
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* THE PORTAL: Dropdown Overlay */}
			{openDropdown &&
				activeConfig &&
				createPortal(
					<div className="portal-dropdown fixed inset-0 z-[55] pointer-events-none">
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.15 }}
							style={{
								position: "fixed",
								left: `${menuPos.left}px`,
								top: `${menuPos.top}px`,
								pointerEvents: "auto",
							}}
							className="w-64"
						>
							<div className="bg-[#0c0c0e] border border-fuchsia-500/40 rounded-lg shadow-[0_15px_50px_rgba(0,0,0,0.8)] p-2 relative overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-[1px] bg-fuchsia-500/30 animate-[scan_3s_linear_infinite]" />

								{activeConfig.type === "list" ? (
									<div className="flex flex-col gap-1">
										{activeConfig.items.map((item, idx) => (
											<button
												key={idx}
												onClick={() =>
													applyFilter(
														activeConfig.id === "condition"
															? { condition: item }
															: { category: item },
													)
												}
												className="w-full h-10 flex items-center justify-between px-3 rounded text-slate-300 text-[11px] font-bold uppercase hover:bg-fuchsia-600 hover:text-white transition-all group"
											>
												{item}
												<Zap
													size={10}
													className="opacity-0 group-hover:opacity-100"
												/>
											</button>
										))}
									</div>
								) : (
									<div className="p-2 flex flex-col gap-3">
										<div className="flex gap-2">
											<input
												autoFocus
												type="text"
												value={tempPrice.min}
												onChange={(e) =>
													setTempPrice((p) => ({
														...p,
														min: e.target.value.replace(/\D/g, ""),
													}))
												}
												placeholder="MIN_ZAR"
												className="w-full h-9 bg-black border border-white/10 rounded px-2 text-[10px] font-mono text-fuchsia-400 focus:border-fuchsia-500 outline-none"
											/>
											<input
												type="text"
												value={tempPrice.max}
												onChange={(e) =>
													setTempPrice((p) => ({
														...p,
														max: e.target.value.replace(/\D/g, ""),
													}))
												}
												placeholder="MAX_ZAR"
												className="w-full h-9 bg-black border border-white/10 rounded px-2 text-[10px] font-mono text-fuchsia-400 focus:border-fuchsia-500 outline-none"
											/>
										</div>
										<button
											onClick={() =>
												applyFilter({
													priceMin: tempPrice.min,
													priceMax: tempPrice.max,
												})
											}
											className="w-full h-9 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded text-[10px] font-black uppercase tracking-widest transition-colors"
										>
											EXECUTE_FILTER
										</button>
									</div>
								)}
							</div>
						</motion.div>
					</div>,
					document.body,
				)}
		</div>
	);
}
