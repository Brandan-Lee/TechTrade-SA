import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
	Star,
	MessageSquare,
	ShieldAlert,
	ArrowLeft,
	Terminal,
	AlertOctagon,
	ChevronDown,
	Zap,
	Sparkles,
	Gem,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import CyberActionButton from "@/components/ui/CyberActionButton";
import CyberAlert, { type AlertType } from "@/components/ui/CyberAlert";

export default function ReviewPage() {
	const { userId: routeUserId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const [targetUser, setTargetUser] = useState({
		name: location.state?.profile?.fullName || "Loading...",
		role: location.state?.profile?.reg_type || "User",
		avatar: location.state?.profile?.avatar || null,
	});

	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [reviewText, setReviewText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [alert, setAlert] = useState<{ show: boolean; message: string; type: AlertType }>({
		show: false,
		message: "",
		type: "error",
	});

	const triggerStatus = (message: string, type: AlertType = "error") => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setAlert({ show: true, message, type });
	};

	useEffect(() => {
		if (!routeUserId) {
			navigate("/marketplace", { replace: true });
			return;
		}

		if (location.state?.profile) {
			const p = location.state.profile;
			setTargetUser({
				name: p.fullName || "Community Member",
				role: p.reg_type || "User",
				avatar: p.avatar || null,
			});
			return;
		}

		const fetchUserProfile = async () => {
			try {
				const response = await apiFetch(
					`/marketplace/get_user_profile.php?id=${encodeURIComponent(routeUserId)}`,
				);
				const data = await response.json().catch(() => ({}));
				if (response.ok && data.user) {
					setTargetUser({
						name: data.user.fullName || "Community Member",
						role: data.user.reg_type || "User",
						avatar: data.user.avatar || null,
					});
				} else {
					setTargetUser((prev) => ({
						...prev,
						name: `User #${routeUserId}`,
					}));
				}
			} catch {
				setTargetUser((prev) => ({ ...prev, name: `User #${routeUserId}` }));
			}
		};
		fetchUserProfile();
	}, [routeUserId, location.state?.profile, navigate]);

	if (!routeUserId) {
		return null;
	}

	const handleReviewSubmit = async (e) => {
		e.preventDefault();

		if (rating === 0) {
			triggerStatus("Please select a score rating before publishing.", "error");
			return;
		}

		if (!reviewText.trim()) {
			triggerStatus(
				"Please write a small summary of your experience.",
				"error",
			);
			return;
		}

		setIsSubmitting(true);
		setAlert({ show: false, message: "", type: "error" });

		try {
			const response = await apiFetch("/reports/submit_review.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					reviewed_user_id: parseInt(routeUserId, 10),
					rating: rating,
					text: reviewText,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.error || result.message || "Failed to submit review.",
				);
			}

			triggerStatus(
				"Your rating has been logged and published successfully!",
				"success",
			);
			setRating(0);
			setReviewText("");
		} catch (error) {
			triggerStatus(
				error.message || "Something went wrong while sending your review.",
				"error",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const avatarSrc =
		targetUser.avatar ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(targetUser.name)}&background=581c87&color=fff`;

	return (
		<div className="bg-base-100 font-mono text-slate-300 pb-20 relative selection:bg-secondary/30 text-xs sm:text-sm md:text-base">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808002_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

			<header className="w-full max-w-3xl mx-auto px-4 pt-12 relative z-10">
				<div className="flex gap-4 items-start">
					<button
						onClick={() => navigate(-1)}
						aria-label="Go back"
						className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-base-200 text-slate-400 hover:text-secondary hover:border-secondary/40 transition-all focus:outline-none focus:ring-1 focus:ring-secondary shrink-0"
					>
						<ArrowLeft size={16} />
					</button>

					<div className="min-w-0 flex-1 flex items-center gap-4">
						<img
							src={avatarSrc}
							alt={targetUser.name}
							className="w-12 h-12 rounded-lg border border-white/10 object-cover bg-black shrink-0 grayscale brightness-90 shadow-lg"
						/>
						<div className="min-w-0 flex-1">
							<h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight leading-none break-words">
								Rate Experience:{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-violet-500">
									{targetUser.name}
								</span>
							</h1>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-3xl mx-auto py-6 px-4 relative z-10">
				<article className="bg-base-200/90 rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
					<section className="bg-gradient-to-r from-purple-950 via-[#160c28] to-purple-950 px-4 py-3.5 border-b border-white/5 flex items-center gap-3">
						<MessageSquare className="text-secondary shrink-0" size={16} />
						<h2 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-300 uppercase tracking-wide leading-tight">
							Your review helps other users and shapes community trust scores.
						</h2>
					</section>

					{alert.show && (
						<div className="px-5 sm:px-8 pt-6">
							<CyberAlert
								type={alert.type}
								message={alert.message}
								onClose={() => setAlert({ ...alert, show: false })}
							/>
						</div>
					)}

					<form
						onSubmit={handleReviewSubmit}
						className="p-5 sm:p-8 space-y-8"
						noValidate
					>
						<fieldset className="space-y-4">
							<legend className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
								<Terminal size={12} className="text-secondary" />
								<span>Overall Rating</span>
							</legend>

							<div className="bg-black/20 border border-white/5 rounded-lg p-6 flex flex-col items-center justify-center gap-4">
								<div className="flex items-center gap-3">
									{[1, 2, 3, 4, 5].map((starValue) => {
										const isStarred = starValue <= (hoveredRating || rating);
										return (
											<button
												key={starValue}
												type="button"
												onClick={() => setRating(starValue)}
												onMouseEnter={() => setHoveredRating(starValue)}
												onMouseLeave={() => setHoveredRating(0)}
												disabled={isSubmitting}
												aria-label={`Rate ${starValue} out of 5`}
												className="p-1 focus:outline-none focus:ring-1 focus:ring-secondary rounded-md transition-transform active:scale-90 disabled:opacity-50"
											>
												<Star
													size={32}
													className={`transition-all duration-150 ${
														isStarred
															? "fill-secondary text-secondary drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]"
															: "text-slate-800 hover:text-slate-700"
													}`}
												/>
											</button>
										);
									})}
								</div>

								<div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center h-5 text-violet-400 flex items-center justify-center gap-2">
									{rating === 1 && (
										<>
											<AlertOctagon
												size={14}
												className="text-red-500 shrink-0"
											/>
											<span>Many problems during trade</span>
										</>
									)}
									{rating === 2 && (
										<>
											<ChevronDown
												size={14}
												className="text-orange-500 shrink-0"
											/>
											<span>Below average experience</span>
										</>
									)}
									{rating === 3 && (
										<>
											<Zap size={14} className="text-yellow-500 shrink-0" />
											<span>Average, successful trade</span>
										</>
									)}
									{rating === 4 && (
										<>
											<Sparkles
												size={14}
												className="text-secondary shrink-0"
											/>
											<span>Great communication and quick response</span>
										</>
									)}
									{rating === 5 && (
										<>
											<Gem size={14} className="text-accent shrink-0" />
											<span>Perfect trade, highly recommended</span>
										</>
									)}
								</div>
							</div>
						</fieldset>

						<div className="flex flex-col gap-2">
							<div className="flex justify-between items-center">
								<label
									htmlFor="review-textarea"
									className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"
								>
									<Terminal size={12} className="text-secondary" />
									<span>Write your review</span>
								</label>
								<span className="text-[9px] sm:text-[10px] font-mono text-slate-600">
									{reviewText.length}/500
								</span>
							</div>

							<textarea
								id="review-textarea"
								maxLength={500}
								value={reviewText}
								disabled={isSubmitting}
								onChange={(e) => setReviewText(e.target.value)}
								placeholder="How did the trade go? Was communication clear? Was payment or meetup on time?"
								className="w-full h-36 bg-base-300 rounded-lg p-4 border border-white/10 text-white focus:outline-none focus:border-secondary/50 text-[11px] sm:text-xs md:text-sm font-mono leading-relaxed shadow-inner placeholder:text-slate-700 resize-none transition-all"
							/>
						</div>

						<section className="flex items-start gap-2.5 bg-purple-950/10 border border-purple-500/10 rounded-lg p-3 text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 leading-relaxed">
							<ShieldAlert
								size={14}
								className="text-secondary shrink-0 mt-0.5"
							/>
							<p>
								Keep reviews accurate and fair. Do not post personal details,
								addresses, bank numbers, or offensive language.
							</p>
						</section>

						<div className="pt-2 border-t border-white/5">
							<CyberActionButton
								label={isSubmitting ? "PUBLISHING REVIEW..." : "PUBLISH REVIEW"}
								className="w-full text-xs sm:text-sm"
								disabled={isSubmitting || rating === 0}
								type="submit"
							/>
							<p className="text-center mt-4 text-[10px] sm:text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">
								Reviews help make the community safer.
							</p>
						</div>
					</form>
				</article>
			</main>
		</div>
	);
}
