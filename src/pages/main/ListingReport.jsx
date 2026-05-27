import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { AlertTriangle, ShieldAlert, ArrowLeft, Terminal } from "lucide-react";
import CyberActionButton from "../../components/ui/CyberActionButton";
import CyberAlert from "../../components/ui/CyberAlert";

const ListingReportPage = () => {
	const { listingId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const [listingTitle, setListingTitle] = useState(
		location.state?.listingTitle || "Loading...",
	);
	const [selectedReason, setSelectedReason] = useState("");
	const [details, setDetails] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);

	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});

	const triggerStatus = (message, type = "error", fieldName = "") => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setAlert({ show: true, message, type });

		if (type === "error" && fieldName) {
			setErrorField("");
			setShakeTick((tick) => tick + 1);
			requestAnimationFrame(() => setErrorField(fieldName));
		} else {
			setErrorField("");
		}
	};

	useEffect(() => {
		if (!listingId) {
			navigate("/marketplace", { replace: true });
			return;
		}

		if (!location.state?.listingTitle) {
			const fetchTitle = async () => {
				try {
					const response = await apiFetch(
						`/listings/get_listing.php?id=${encodeURIComponent(listingId)}`,
					);
					const data = await response.json().catch(() => ({}));
					if (response.ok && data.listing?.title) {
						setListingTitle(data.listing.title);
					} else {
						setListingTitle(`Listing #${listingId}`);
					}
				} catch {
					setListingTitle(`Listing #${listingId}`);
				}
			};
			fetchTitle();
		}
	}, [listingId, location.state?.listingTitle, navigate]);

	const reportReasons = [
		"Suspected Fraud/Scam",
		"Counterfeit Component",
		"Inappropriate Content",
		"Pricing Manipulation",
	];

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!selectedReason) {
			triggerStatus("Please select a violation category.", "error", "reason");
			return;
		}

		if (!details.trim()) {
			triggerStatus("Please provide report details.", "error", "details");
			return;
		}

		// --- API SUBMISSION ---
		setIsSubmitting(true);
		try {
			const response = await apiFetch("/reports/report_listing.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					listing_id: parseInt(listingId, 10),
					reason: selectedReason,
					details: details,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.error ||
						result.message ||
						"Failed to submit report.",
				);
			}

			triggerStatus(
				`Report logged successfully for "${listingTitle}".`,
				"success",
			);
			setSelectedReason("");
			setDetails("");
		} catch (error) {
			triggerStatus(
				error.message || "Something went wrong while sending the report.",
				"error",
				"details",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!listingId) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#050506] font-mono text-slate-300 pb-20 relative selection:bg-fuchsia-500/30">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808002_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

			<header className="w-full max-w-3xl mx-auto px-4 pt-8 relative z-10">
				<div className="flex gap-4 items-start">
					<button
						onClick={() => navigate(-1)}
						aria-label="Go back"
						className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-[#0c0c0e] text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-500/40 transition-all focus:outline-none focus:ring-1 focus:ring-fuchsia-500 shrink-0"
					>
						<ArrowLeft size={16} />
					</button>
					<div className="min-w-0 flex-1">
						<h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none break-words">
							Report: {listingTitle}
						</h1>
						<p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-slate-500 uppercase tracking-wider truncate">
							Listing Reference: // #{listingId || "NOT_DEFINED"}
						</p>
					</div>
				</div>
			</header>

			<main className="max-w-3xl mx-auto py-8 px-4 relative z-10">
				<div className="bg-[#0c0c0e]/90 rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
					<div className="bg-gradient-to-r from-purple-950 via-[#160c28] to-purple-950 px-4 py-3.5 border-b border-white/5 flex items-center gap-3">
						<AlertTriangle className="text-fuchsia-400 shrink-0" size={16} />
						<p className="sm:text-xs md:text-sm font-bold text-slate-300 uppercase tracking-wide leading-tight">
							You are submitting a formal report request for this marketplace
							item.
						</p>
					</div>

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
						className="p-5 sm:p-8 space-y-8"
						onSubmit={handleSubmit}
						noValidate
					>
						<fieldset className="space-y-4">
							<legend className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
								<Terminal size={12} className="text-fuchsia-500" />
								<span>Violation Category</span>
							</legend>

							<div
								className={`grid grid-cols-1 gap-2.5 ${errorField === "reason" ? "animate-shake" : ""}`}
							>
								{reportReasons.map((reason) => {
									const optionId = `reason-${reason.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
									const isSelected = selectedReason === reason;
									return (
										<label
											key={reason}
											htmlFor={optionId}
											className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer bg-black/20 ${
												isSelected
													? "border-fuchsia-500 bg-fuchsia-500/[0.03] shadow-[0_0_15px_rgba(217,70,239,0.05)]"
													: "border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
											} focus-within:ring-1 focus-within:ring-fuchsia-500`}
										>
											<span
												className={`text-xs sm:text-sm md:text-sm font-bold uppercase tracking-wider transition-colors ${
													isSelected ? "text-fuchsia-400" : "text-slate-400"
												}`}
											>
												{reason}
											</span>
											<input
												id={optionId}
												key={
													errorField === "reason"
														? `shake-${shakeTick}`
														: "normal"
												}
												type="radio"
												name="report_reason"
												value={reason}
												checked={isSelected}
												onChange={(e) => {
													setAlert({ show: false, message: "", type: "error" });
													setSelectedReason(e.target.value);
													setErrorField("");
												}}
												className="w-4 h-4 accent-fuchsia-500 cursor-pointer"
												disabled={isSubmitting}
											/>
										</label>
									);
								})}
							</div>
						</fieldset>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="report-details"
								className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"
							>
								<Terminal size={12} className="text-fuchsia-500" />
								<span>Please tell us why you are reporting this listing</span>
							</label>
							<textarea
								id="report-details"
								value={details}
								disabled={isSubmitting}
								onChange={(e) => {
									setAlert({ show: false, message: "", type: "error" });
									setDetails(e.target.value);
									if (errorField === "details") setErrorField("");
								}}
								className={`w-full h-40 bg-[#121214] rounded-lg p-4 border transition-all text-white focus:outline-none focus:border-fuchsia-500/50 text-xs sm:text-sm font-mono leading-relaxed shadow-inner placeholder:text-slate-700 resize-none ${
									errorField === "details"
										? "border-red-500/50 animate-shake"
										: "border-white/10"
								}`}
								placeholder="Provide specific details here regarding why this listing should be reviewed..."
							/>
						</div>

						<div className="pt-2 border-t border-white/5">
							<CyberActionButton
								label={isSubmitting ? "SENDING REPORT..." : "REPORT LISTING"}
								className="w-full"
								disabled={isSubmitting}
								type="submit"
							/>
							<p className="text-center mt-4 text-xs sm:text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">
								Reporting helps maintain marketplace safety and item validity.
							</p>
						</div>
					</form>
				</div>
			</main>

			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes shake {
					0%, 100% { transform: translateX(0); }
					20%, 60% { transform: translateX(-6px); }
					40%, 80% { transform: translateX(6px); }
				}
				.animate-shake {
					animation: shake 0.4s ease-in-out;
				}
			`,
				}}
			/>
		</div>
	);
};

export default ListingReportPage;
