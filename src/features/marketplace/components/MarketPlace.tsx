import { Fragment, useEffect, useMemo, useState } from "react";
import { FilterX, RotateCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import ListingCard from "@/features/marketplace/components/ListingCard";
import {
	isListingSummary,
	type ListingSummary,
} from "@/features/marketplace/types/listing";
import { apiFetch } from "@/lib/api";

interface PageData {
	currentPage: number;
	totalPageCount: number;
	totalItemCount: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const getErrorMessage = (payload: unknown) =>
	isRecord(payload) && typeof payload.error === "string"
		? payload.error
		: "Could not load listings. Please try again.";

const getPageNumber = (value: unknown, fallback: number) =>
	typeof value === "number" && Number.isFinite(value) ? value : fallback;

function ListingGridSkeleton() {
	return (
		<div
			className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			aria-label="Loading listings"
			aria-busy="true"
		>
			{Array.from({ length: 8 }, (_, index) => (
				<div key={index} className="surface-card overflow-hidden">
					<div className="aspect-[4/3] animate-pulse bg-white/[0.05]" />
					<div className="space-y-3 p-4">
						<div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
						<div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
						<div className="mt-5 h-10 animate-pulse rounded-xl bg-white/[0.04]" />
					</div>
				</div>
			))}
		</div>
	);
}

export default function MarketPlace() {
	const location = useLocation();
	const navigate = useNavigate();
	const [items, setItems] = useState<ListingSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [pageData, setPageData] = useState<PageData>({
		currentPage: 1,
		totalPageCount: 1,
		totalItemCount: 0,
	});
	const [message, setMessage] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	const searchParams = new URLSearchParams(location.search);
	const parsedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
	const currentPage = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
	const category = searchParams.get("category") ?? "";
	const condition = searchParams.get("condition") ?? "";
	const minPrice = searchParams.get("priceMin") ?? "";
	const maxPrice = searchParams.get("priceMax") ?? "";
	const searchPhrase = searchParams.get("q") ?? "";

	useEffect(() => {
		const controller = new AbortController();
		const loadListings = async () => {
			setIsLoading(true);
			setMessage(null);

			try {
				const query = new URLSearchParams({ page: String(currentPage), limit: "10" });
				if (category) query.set("category", category);
				if (condition) query.set("condition", condition);
				if (minPrice) query.set("priceMin", minPrice);
				if (maxPrice) query.set("priceMax", maxPrice);
				if (searchPhrase) query.set("q", searchPhrase);

				const response = await apiFetch(
					`/marketplace/get_marketplace_listings.php?${query.toString()}`,
					{ signal: controller.signal },
				);
				const payload: unknown = await response.json();
				if (!response.ok) throw new Error(getErrorMessage(payload));
				if (!isRecord(payload)) throw new Error("The listings response was invalid.");

				setItems(
					Array.isArray(payload.items)
						? payload.items.filter(isListingSummary)
						: [],
				);
				setPageData({
					currentPage: getPageNumber(payload.page, currentPage),
					totalPageCount: Math.max(1, getPageNumber(payload.totalPages, 1)),
					totalItemCount: Math.max(0, getPageNumber(payload.totalCount, 0)),
				});
			} catch (error) {
				if (controller.signal.aborted) return;
				setItems([]);
				setPageData({
					currentPage,
					totalPageCount: 1,
					totalItemCount: 0,
				});
				setMessage(
					error instanceof Error
						? error.message
						: "Could not load listings. Please try again.",
				);
			} finally {
				if (!controller.signal.aborted) setIsLoading(false);
			}
		};

		void loadListings();
		return () => controller.abort();
	}, [
		category,
		condition,
		currentPage,
		location.search,
		maxPrice,
		minPrice,
		retryCount,
		searchPhrase,
	]);

	const pageTitle = category
		? category
		: searchPhrase
			? "Search results"
			: "All listings";

	const pageNumbers = useMemo(() => {
		const total = pageData.totalPageCount;
		const current = pageData.currentPage;
		if (total <= 1) return [];

		const pages = new Set([1, total, current]);
		for (let page = current - 2; page <= current + 2; page++) {
			if (page >= 1 && page <= total) pages.add(page);
		}
		return Array.from(pages).sort((a, b) => a - b);
	}, [pageData.currentPage, pageData.totalPageCount]);

	const goToPage = (page: number) => {
		const next = new URLSearchParams(location.search);
		next.set("page", String(page));
		navigate({ pathname: "/marketplace", search: `?${next.toString()}` });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<section className="page-container pt-8 sm:pt-10">
			<header className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="page-eyebrow">TechTrade marketplace</p>
					<h1 className="page-title mt-2">{pageTitle}</h1>
					<p className="page-description">
						Find the right hardware for your next build.
					</p>
				</div>
				<p
					className="text-sm text-slate-400"
					aria-live="polite"
					aria-busy={isLoading}
				>
					{isLoading
						? "Updating listings…"
						: `${pageData.totalItemCount} ${pageData.totalItemCount === 1 ? "listing" : "listings"}`}
				</p>
			</header>

			{isLoading ? (
				<ListingGridSkeleton />
			) : message ? (
				<div className="surface-card flex flex-col items-center gap-4 px-6 py-12 text-center">
					<p role="alert" className="max-w-lg text-sm leading-6 text-rose-200">
						{message}
					</p>
					<Button
						variant="secondary"
						onClick={() => setRetryCount((count) => count + 1)}
					>
						Try again
					</Button>
				</div>
			) : items.length > 0 ? (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{items.map((item) => (
						<ListingCard key={item.id} {...item} />
					))}
				</div>
			) : (
				<div className="surface-card flex flex-col items-center px-6 py-14 text-center">
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-slate-400">
						<FilterX size={22} aria-hidden="true" />
					</div>
					<h2 className="text-lg font-semibold text-white">No listings found</h2>
					<p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
						Try a different search or remove some filters to see more hardware.
					</p>
					<Button
						variant="secondary"
						onClick={() => navigate("/marketplace")}
						className="mt-5"
					>
						<RotateCcw size={15} aria-hidden="true" />
						Clear search and filters
					</Button>
				</div>
			)}

			{!isLoading && !message && pageNumbers.length > 0 && (
				<nav
					className="mt-8 flex flex-wrap items-center justify-center gap-2"
					aria-label="Marketplace pages"
				>
					<Button
						size="small"
						variant="secondary"
						onClick={() => goToPage(pageData.currentPage - 1)}
						disabled={pageData.currentPage <= 1}
					>
						Previous
					</Button>

					{pageNumbers.map((page, index) => {
						const previous = pageNumbers[index - 1];
						return (
							<Fragment key={page}>
								{previous !== undefined && page - previous > 1 && (
									<span className="px-1 text-slate-500" aria-hidden="true">
										…
									</span>
								)}
								<Button
									size="small"
									variant={
										page === pageData.currentPage ? "primary" : "secondary"
									}
									onClick={() => goToPage(page)}
									aria-label={`Go to page ${page}`}
									aria-current={
										page === pageData.currentPage ? "page" : undefined
									}
									className="min-w-9 px-2"
								>
									{page}
								</Button>
							</Fragment>
						);
					})}

					<Button
						size="small"
						variant="secondary"
						onClick={() => goToPage(pageData.currentPage + 1)}
						disabled={pageData.currentPage >= pageData.totalPageCount}
					>
						Next
					</Button>
				</nav>
			)}
		</section>
	);
}
