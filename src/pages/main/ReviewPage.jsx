import React, { useState } from "react";
import {
	Star,
	MessageSquare,
	ShieldAlert,
	CheckCircle2,
	User,
} from "lucide-react";

export default function ReviewPage() {
	// Core State for the Review Form
	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [reviewText, setReviewText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

	// User details for context
	const targetUser = {
		name: "Thabo Mthembu",
		role: "Buyer",
		item: "RTX 3080 Gaming OC",
	};

	const handleReviewSubmit = (e) => {
		e.preventDefault();
		if (rating === 0) return;

		setIsSubmitting(true);

		// Simulate API database submission
		setTimeout(() => {
			setIsSubmitting(false);
			setSubmitStatus("success");
		}, 1200);
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-fuchsia-500/30">
			{/* Decorative Cyber Grid Background Accent */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

			<div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-md border border-fuchsia-900/40 rounded-xl shadow-2xl shadow-fuchsia-950/20 overflow-hidden relative z-10">
				{/* Top Status Edge Indicator */}
				<div className="h-1 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600" />

				<div className="p-6 sm:p-8 space-y-6">
					{/* HEADER SECTION */}
					<div className="text-center space-y-2">
						<h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
							Rate Your Experience
						</h1>
						<p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
							Your honest feedback helps keep our peer-to-peer network safe,
							transparent, and secure.
						</p>
					</div>

					{/* TARGET CONTEXT BANNER */}
					<div className="bg-slate-950/80 border border-purple-950/60 rounded-lg p-4 flex items-center gap-4">
						<div className="avatar placeholder">
							<div className="bg-purple-950/50 text-purple-400 border border-purple-500/30 w-12 rounded-lg flex items-center justify-center">
								<User size={20} />
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<div className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
								Deal with {targetUser.role}
							</div>
							<h2 className="text-sm font-bold text-slate-200 truncate">
								{targetUser.name}
							</h2>
							<p className="text-[11px] text-slate-400 truncate mt-0.5">
								Item: {targetUser.item}
							</p>
						</div>
					</div>

					{/* SUCCESS STATE OVERLAY */}
					{submitStatus === "success" ? (
						<div className="py-8 text-center space-y-3 animate-fade-in">
							<div className="inline-flex p-3 bg-fuchsia-950/30 border border-fuchsia-500/30 text-fuchsia-400 rounded-full animate-bounce">
								<CheckCircle2 size={32} />
							</div>
							<h3 className="text-base font-bold text-fuchsia-400 uppercase tracking-wide">
								Review Published Successfully
							</h3>
							<p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
								Thank you. Your rating has been logged securely and added to{" "}
								{targetUser.name}'s public reliability profile.
							</p>
							<div className="pt-2">
								<button
									onClick={() => {
										setSubmitStatus(null);
										setRating(0);
										setReviewText("");
									}}
									className="btn btn-outline btn-sm border-purple-900/60 text-purple-300 hover:bg-purple-950 hover:border-purple-500 font-bold tracking-wider uppercase text-[10px]"
								>
									Return to Dashboard
								</button>
							</div>
						</div>
					) : (
						/* ACCESSIBLE INTERACTIVE FORM */
						<form onSubmit={handleReviewSubmit} className="space-y-6">
							{/* STAR RATING INPUT COMPONENT */}
							<div className="space-y-2 text-center">
								<label className="label-text text-xs uppercase tracking-widest text-slate-400 font-bold block">
									Overall Score
								</label>

								<div className="flex items-center justify-center gap-2 py-2">
									{[1, 2, 3, 4, 5].map((starValue) => {
										const isStarred = starValue <= (hoveredRating || rating);
										return (
											<button
												key={starValue}
												type="button"
												onClick={() => setRating(starValue)}
												onMouseEnter={() => setHoveredRating(starValue)}
												onMouseLeave={() => setHoveredRating(0)}
												aria-label={`Rate ${starValue} out of 5 stars`}
												className="p-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-lg transition-transform active:scale-90"
											>
												<Star
													size={28}
													className={`transition-all duration-150 ${
														isStarred
															? "fill-fuchsia-500 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.4)]"
															: "text-slate-700 hover:text-slate-600"
													}`}
												/>
											</button>
										);
									})}
								</div>

								{/* Microcopy describing the selected rating value */}
								<div className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 h-4">
									{rating === 1 && "⚠️ Major complications during deal"}
									{rating === 2 && "⚠️ Below average experience"}
									{rating === 3 && "⚡ Average, successful transaction"}
									{rating === 4 && "✨ Great communication and fast response"}
									{rating === 5 && "💎 Perfect transaction, highly recommended"}
								</div>
							</div>

							{/* TEXT FIELD INPUT */}
							<div className="form-control w-full space-y-1.5">
								<div className="flex justify-between items-center px-1">
									<label
										htmlFor="review-textarea"
										className="label-text text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5"
									>
										<MessageSquare size={12} className="text-purple-400" />{" "}
										Share your experience
									</label>
									<span
										className={`text-[10px] font-mono ${reviewText.length > 400 ? "text-amber-500" : "text-slate-600"}`}
									>
										{reviewText.length}/500
									</span>
								</div>

								<textarea
									id="review-textarea"
									maxLength={500}
									value={reviewText}
									onChange={(e) => setReviewText(e.target.value)}
									placeholder="How did the interaction go? Was the communication clear? Was payment or handover on time? Write your thoughts here..."
									className="textarea textarea-bordered bg-slate-950/60 border-purple-950/80 focus:border-fuchsia-500/80 focus:outline-none text-slate-200 text-xs w-full h-28 leading-relaxed rounded-lg placeholder:text-slate-600 resize-none transition-colors"
								/>
							</div>

							{/* ACCESSIBILITY & SAFETY ADVISORY DISCLAIMER */}
							<div className="flex items-start gap-2.5 bg-purple-950/20 border border-purple-500/10 rounded-lg p-3 text-[10px] text-slate-400 leading-relaxed">
								<ShieldAlert
									size={14}
									className="text-purple-400 shrink-0 mt-0.5 animate-pulse"
								/>
								<p>
									Keep statements objective and clear. Do not post private
									contact records, tracking codes, addresses, or insulting
									comments.
								</p>
							</div>

							{/* SUBMISSION TRIGGER BUTTON */}
							<button
								type="submit"
								disabled={rating === 0 || isSubmitting}
								className="w-full btn bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-transparent text-white border-none font-bold uppercase tracking-widest text-xs h-11 min-h-0 rounded-lg transition-all shadow-[0_4px_12px_rgba(217,70,239,0.155)] active:scale-[0.99]"
							>
								{isSubmitting ? (
									<span className="loading loading-spinner loading-xs text-slate-400" />
								) : rating === 0 ? (
									"Select a Rating to Continue"
								) : (
									"Publish Review Protocol"
								)}
							</button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
