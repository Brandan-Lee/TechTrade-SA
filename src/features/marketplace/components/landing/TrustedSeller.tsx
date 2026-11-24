import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import TrustedSellerCard from "@/features/marketplace/components/TrustedSellerCard";
import { apiFetch } from "@/lib/api";

interface TrustedSellerSummary extends Record<string, unknown> {
	id: string | number;
	tier?: string;
	name?: string;
	rating?: number | string;
	reviews?: number | string;
	sales?: number | string;
	image?: string;
}

const isTrustedSeller = (value: unknown): value is TrustedSellerSummary =>
	typeof value === "object" &&
	value !== null &&
	"id" in value &&
	(typeof value.id === "string" || typeof value.id === "number");

export default function TrustedSeller() {
	const [sellers, setSellers] = useState<TrustedSellerSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		const fetchSellers = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await apiFetch(
					"/marketplace/get_trusted_sellers.php",
					{ signal: controller.signal },
				);
				if (!response.ok) throw new Error("Could not load trusted sellers.");

				const payload: unknown = await response.json();
				if (!Array.isArray(payload)) {
					throw new Error("The trusted sellers response was invalid.");
				}
				setSellers(payload.filter(isTrustedSeller));
			} catch (reason) {
				if (controller.signal.aborted) return;
				setError(
					reason instanceof Error
						? reason.message
						: "Could not load trusted sellers.",
				);
			} finally {
				if (!controller.signal.aborted) setIsLoading(false);
			}
		};

		void fetchSellers();
		return () => controller.abort();
	}, [retryCount]);

	return (
		<section className="page-container">
			<header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="page-eyebrow">Community</p>
					<h2 className="page-title mt-2">Trusted sellers</h2>
					<p className="page-description">
						Meet experienced traders in the TechTrade community.
					</p>
				</div>
				<Link
					to="/marketplace"
					className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-white"
				>
					Explore listings <ArrowRight size={16} aria-hidden="true" />
				</Link>
			</header>

			{isLoading ? (
				<div
					className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
					aria-label="Loading trusted sellers"
					aria-busy="true"
				>
					{Array.from({ length: 3 }, (_, index) => (
						<div key={index} className="surface-card h-52 animate-pulse" />
					))}
				</div>
			) : error ? (
				<div className="surface-card flex flex-col items-center gap-3 p-8 text-center">
					<p role="alert" className="text-sm text-rose-200">
						{error}
					</p>
					<button
						type="button"
						onClick={() => setRetryCount((count) => count + 1)}
						className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.06]"
					>
						<RotateCcw size={15} aria-hidden="true" />
						Try again
					</button>
				</div>
			) : sellers.length > 0 ? (
				<div
					className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
					aria-label="Trusted sellers"
				>
					{sellers.map((seller) => (
						<TrustedSellerCard
							key={seller.id}
							{...seller}
							isMaster={seller.tier === "Master Tier"}
						/>
					))}
				</div>
			) : (
				<div className="surface-card py-10 text-center text-sm text-slate-400">
					No trusted sellers are available right now.
				</div>
			)}
		</section>
	);
}
