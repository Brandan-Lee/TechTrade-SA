import { CheckCircle2, ShieldCheck, Star, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { mediaUrl } from "@/lib/api";

interface TrustedSellerCardProps {
	id: string | number;
	name?: string;
	tier?: string;
	rating?: number | string;
	reviews?: number | string;
	sales?: number | string;
	image?: string;
	isMaster?: boolean;
}

export default function TrustedSellerCard({
	id,
	name,
	tier,
	rating,
	reviews,
	sales,
	image,
	isMaster = false,
}: TrustedSellerCardProps) {
	const profileUrl = `/profile/${id}`;
	const imageUrl = mediaUrl(image);
	const ratingNumber = Number(rating);
	const ratingLabel = Number.isFinite(ratingNumber)
		? ratingNumber.toFixed(1)
		: "New";

	return (
		<article
			className={`surface-card flex h-full flex-col p-5 ${
				isMaster ? "border-primary/20" : ""
			}`}
		>
			<div className="flex items-center gap-3">
				<div className="relative shrink-0">
					{imageUrl ? (
						<img
							src={imageUrl}
							alt={name ? `${name} profile` : "Seller profile"}
							loading="lazy"
							decoding="async"
							className="h-14 w-14 rounded-full border border-white/10 object-cover"
						/>
					) : (
						<div
							className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-lg font-semibold text-primary"
							aria-hidden="true"
						>
							{name?.trim().charAt(0).toUpperCase() || "T"}
						</div>
					)}
					<CheckCircle2
						size={18}
						className="absolute -bottom-1 -right-1 rounded-full bg-base-200 text-primary"
						aria-label="Trusted seller"
					/>
				</div>

				<div className="min-w-0">
					<h3 className="truncate text-base font-semibold text-white">
						{name || "TechTrade seller"}
					</h3>
					<p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-400">
						{isMaster ? (
							<Zap size={13} className="text-primary" aria-hidden="true" />
						) : (
							<ShieldCheck size={13} className="text-secondary" aria-hidden="true" />
						)}
						{tier || "Trusted seller"}
					</p>
				</div>
			</div>

			<div className="mt-5 grid grid-cols-2 gap-3">
				<div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
					<p className="flex items-center gap-1.5 text-sm font-semibold text-white">
						<Star
							size={14}
							className="fill-amber-300 text-amber-300"
							aria-hidden="true"
						/>
						{ratingLabel}
					</p>
					<p className="mt-1 text-xs text-slate-400">
						{reviews ?? 0} reviews
					</p>
				</div>
				<div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
					<p className="flex items-center gap-1.5 text-sm font-semibold text-white">
						<TrendingUp size={14} className="text-secondary" aria-hidden="true" />
						{sales ?? 0}
					</p>
					<p className="mt-1 text-xs text-slate-400">Completed trades</p>
				</div>
			</div>

			<Link
				to={profileUrl}
				className="mt-auto inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-medium text-slate-200 transition-colors hover:border-primary/30 hover:bg-primary/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
			>
				View seller profile
			</Link>
		</article>
	);
}
