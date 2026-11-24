import { useEffect, useState, type FormEvent } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";

type FilterKey = "category" | "condition" | "priceMin" | "priceMax";
type FilterUpdate = Partial<Record<FilterKey, string>>;

const categoryGroups = [
	{
		label: "Components",
		options: ["GPUs", "CPUs", "Motherboards", "PSUs", "Memory"],
	},
	{ label: "Cooling", options: ["AIO", "Air Coolers", "Case Fans"] },
	{ label: "Storage", options: ["SSDs", "HDDs"] },
];

const conditions = ["New", "Like New", "Good", "Fair"];

export default function FilterBar() {
	const [searchParams, setSearchParams] = useSearchParams();
	const category = searchParams.get("category") ?? "";
	const condition = searchParams.get("condition") ?? "";
	const priceMin = searchParams.get("priceMin") ?? "";
	const priceMax = searchParams.get("priceMax") ?? "";
	const searchQuery = searchParams.get("q") ?? "";
	const [priceRange, setPriceRange] = useState({ min: priceMin, max: priceMax });
	const [priceError, setPriceError] = useState<string | null>(null);

	useEffect(() => {
		// The URL is the source of truth when browser navigation changes filters.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setPriceRange({ min: priceMin, max: priceMax });
		setPriceError(null);
	}, [priceMax, priceMin]);

	const updateFilters = (updates: FilterUpdate) => {
		const next = new URLSearchParams(searchParams);
		for (const [key, value] of Object.entries(updates)) {
			if (value) next.set(key, value);
			else next.delete(key);
		}
		next.set("page", "1");
		setSearchParams(next);
	};

	const applyPriceRange = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const min = priceRange.min.trim();
		const max = priceRange.max.trim();
		if (min && max && Number(min) > Number(max)) {
			setPriceError("Maximum price must be greater than minimum price.");
			return;
		}
		setPriceError(null);
		updateFilters({ priceMin: min, priceMax: max });
	};

	const clearFilters = () => {
		const next = new URLSearchParams();
		if (searchQuery) next.set("q", searchQuery);
		next.set("page", "1");
		setPriceRange({ min: "", max: "" });
		setPriceError(null);
		setSearchParams(next);
	};

	const activeFilters: { label: string; remove: FilterUpdate }[] = [];
	if (category) activeFilters.push({ label: category, remove: { category: "" } });
	if (condition)
		activeFilters.push({ label: condition, remove: { condition: "" } });
	if (priceMin || priceMax) {
		activeFilters.push({
			label: `${priceMin ? `R${priceMin}` : "Any"} – ${priceMax ? `R${priceMax}` : "Any"}`,
			remove: { priceMin: "", priceMax: "" },
		});
	}

	return (
		<section className="page-container !py-4 sm:!py-5">
			<div className="surface-card p-4 sm:p-5">
				<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
					<h2 className="inline-flex items-center gap-2 text-sm font-semibold text-white">
						<SlidersHorizontal size={16} className="text-primary" aria-hidden="true" />
						Filter listings
					</h2>
					{activeFilters.length > 0 && (
						<Button
							type="button"
							variant="ghost"
							size="small"
							onClick={clearFilters}
							className="text-slate-400"
						>
							Clear filters
						</Button>
					)}
				</div>

				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] lg:items-end">
					<div className="space-y-1.5">
						<label
							htmlFor="market-category"
							className="text-xs font-medium text-slate-300"
						>
							Category
						</label>
						<select
							id="market-category"
							value={category}
							onChange={(event) =>
								updateFilters({ category: event.target.value })
							}
							className="min-h-11 w-full rounded-xl border border-white/10 bg-base-100 px-3 text-sm text-base-content outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
						>
							<option value="">All categories</option>
							{categoryGroups.map((group) => (
								<optgroup key={group.label} label={group.label}>
									{group.options.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</optgroup>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label
							htmlFor="market-condition"
							className="text-xs font-medium text-slate-300"
						>
							Condition
						</label>
						<select
							id="market-condition"
							value={condition}
							onChange={(event) =>
								updateFilters({ condition: event.target.value })
							}
							className="min-h-11 w-full rounded-xl border border-white/10 bg-base-100 px-3 text-sm text-base-content outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
						>
							<option value="">Any condition</option>
							{conditions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</div>

					<form
						onSubmit={applyPriceRange}
						className="grid grid-cols-[1fr_1fr_auto] items-end gap-2"
					>
						<div className="space-y-1.5">
							<label
								htmlFor="market-price-min"
								className="text-xs font-medium text-slate-300"
							>
								Minimum price
							</label>
							<input
								id="market-price-min"
								type="number"
								min="0"
								inputMode="numeric"
								value={priceRange.min}
								onChange={(event) => {
									setPriceRange((current) => ({ ...current, min: event.target.value }));
									setPriceError(null);
								}}
								placeholder="R0"
								className="min-h-11 w-full rounded-xl border border-white/10 bg-base-100 px-3 text-sm text-base-content outline-none transition-colors placeholder:text-slate-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
							/>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="market-price-max"
								className="text-xs font-medium text-slate-300"
							>
								Maximum price
							</label>
							<input
								id="market-price-max"
								type="number"
								min="0"
								inputMode="numeric"
								value={priceRange.max}
								onChange={(event) => {
									setPriceRange((current) => ({ ...current, max: event.target.value }));
									setPriceError(null);
								}}
								placeholder="No limit"
								className="min-h-11 w-full rounded-xl border border-white/10 bg-base-100 px-3 text-sm text-base-content outline-none transition-colors placeholder:text-slate-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
							/>
						</div>
						<Button type="submit" size="medium" className="min-h-11 px-4">
							Apply
						</Button>
					</form>
				</div>

				{priceError && (
					<p className="mt-2 text-sm text-rose-300" role="alert">
						{priceError}
					</p>
				)}

				{activeFilters.length > 0 && (
					<div
						className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-3"
						aria-label="Active filters"
					>
						<span className="text-xs text-slate-500">Active:</span>
						{activeFilters.map((filter) => (
							<button
								key={filter.label}
								type="button"
								onClick={() => updateFilters(filter.remove)}
								className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs text-slate-200 transition-colors hover:border-primary/30 hover:text-white"
								aria-label={`Remove ${filter.label} filter`}
							>
								{filter.label}
								<X size={13} aria-hidden="true" />
							</button>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
