import { ImageOff, MapPin, UserRound, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { mediaUrl } from "@/lib/api";
import type { ListingSummary } from "@/features/marketplace/types/listing";
import { formatZar } from "@/utils/currency";

interface ListingCardProps extends ListingSummary {
	isFeatured?: boolean;
}

const formatPrice = (price: string | number | undefined) => {
	if (price === undefined || price === "") return "Price on request";
	const amount = typeof price === "number" ? price : Number(price);
	if (!Number.isFinite(amount)) return String(price);

	return formatZar(amount, { maximumFractionDigits: 0 });
};

const statusStyles: Record<string, string> = {
	"Available Now": "bg-emerald-400/10 text-emerald-200",
	"Offer Received": "bg-amber-400/10 text-amber-200",
};

export default function ListingCard({
	id,
	sellerId,
	title,
	price,
	seller,
	location,
	status = "Available Now",
	condition,
	image,
	isFeatured = false,
}: ListingCardProps) {
	const listingUrl = `/view-listing/${id}`;
	const imageUrl = mediaUrl(image);

	return (
		<article className="surface-card group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-xl">
			<div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={title ? `${title} listing` : "PC hardware listing"}
						loading="lazy"
						decoding="async"
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
					/>
				) : (
					<div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
						<ImageOff size={28} aria-hidden="true" />
						<span className="text-xs">No image available</span>
					</div>
				)}

				{isFeatured && (
					<span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-content shadow-sm">
						<Zap size={13} aria-hidden="true" />
						Featured
					</span>
				)}
				{condition && (
					<span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
						{condition}
					</span>
				)}
			</div>

			<div className="flex flex-1 flex-col p-4">
				<div className="flex items-start justify-between gap-3">
					<h2 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-white transition-colors group-hover:text-primary">
						<Link to={listingUrl} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
							{title || "PC hardware"}
						</Link>
					</h2>
					<span
						className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[status] ?? "bg-white/[0.06] text-slate-300"}`}
					>
						{status}
					</span>
				</div>

				<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
					{sellerId ? (
						<Link
							to={`/profile/${sellerId}`}
							className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
						>
							<UserRound size={14} aria-hidden="true" />
							{seller || "Seller"}
						</Link>
					) : (
						<span className="inline-flex items-center gap-1.5">
							<UserRound size={14} aria-hidden="true" />
							{seller || "Seller"}
						</span>
					)}
					{location && (
						<span className="inline-flex items-center gap-1.5">
							<MapPin size={14} aria-hidden="true" />
							{location}
						</span>
					)}
				</div>

				<div className="mt-auto flex items-end justify-between gap-3 border-t border-white/[0.07] pt-4">
					<p className="text-xl font-semibold tracking-tight text-white">
						{formatPrice(price)}
					</p>
					<Link
						to={listingUrl}
						className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-content transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-200"
					>
						View details
					</Link>
				</div>
			</div>
		</article>
	);
}
