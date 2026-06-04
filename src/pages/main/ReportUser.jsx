import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { AlertTriangle, ShieldAlert, ArrowLeft, Terminal } from "lucide-react";
import CyberActionButton from "../../components/ui/CyberActionButton";
import CyberAlert from "../../components/ui/CyberAlert";

export default function ReportUser() {
	const { userId: routeUserId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const [targetUser, setTargetUser] = useState({
		name: location.state?.profile?.fullName || "Loading...",
		role: location.state?.profile?.reg_type || "User",
		avatar: location.state?.profile?.avatar || null,
	});

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
		if (!routeUserId) {
			navigate("/marketplace", { replace: true });
			return;
		}

		if (!location.state?.profile) {
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
		}
	}, [routeUserId, location.state?.profile, navigate]);

	const reportReasons = [
		{ id: "payment", label: "Payment Issues / Fraud" },
		{ id: "communication", label: "Harassment / Abuse" },
		{ id: "item_issue", label: "Damaged / Counterfeit Item Received" },
		{ id: "no_show", label: "No-Show / Ghosting" },
		{ id: "other", label: "Other Suspicious Behavior" },
	];

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!selectedReason) {
			triggerStatus("Please select a violation category.", "error", "reason");
			return;
		}

		if (!details.trim() || details.trim().length < 10) {
			triggerStatus(
				"Please provide detailed report text. (Minimum 10 letters required)",
				"error",
				"details",
			);
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await apiFetch("/reports/report_user.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					reported_user_id: parseInt(routeUserId, 10),
					reason: selectedReason,
					details: details,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.error || result.message || "Failed to submit report.",
				);
			}

			triggerStatus(
				`Report logged successfully for "${targetUser.name}".`,
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

	if (!routeUserId) {
		return null;
	}

	const avatarSrc =
		targetUser.avatar ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(targetUser.name)}&background=581c87&color=fff`;

	return (
		<div className="min-h-screen bg-[#050506] font-mono text-slate-300 pb-20 relative selection:bg-fuchsia-500/30 text-xs sm:text-sm md:text-base">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808002_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

			<header className="w-full max-w-3xl mx-auto px-4 pt-12 relative z-10">
				<div className="flex gap-4 items-start">
					<button
						onClick={() => navigate(-1)}
						aria-label="Go back"
						className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-[#0c0c0e] text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-500/40 transition-all focus:outline-none focus:ring-1 focus:ring-fuchsia-500 shrink-0"
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
								Report Account:{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
									{targetUser.name}
								</span>
							</h1>
							<p className="mt-2 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
								Account Type: {targetUser.role} (ID: #{routeUserId})
							</p>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-3xl mx-auto py-6 px-4 relative z-10">
				<article className="bg-[#0c0c0e]/90 rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
					<section className="bg-gradient-to-r from-purple-950 via-[#160c28] to-purple-950 px-4 py-3.5 border-b border-white/5 flex items-center gap-3">
						<AlertTriangle className="text-fuchsia-400 shrink-0" size={16} />
						<h2 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-300 uppercase tracking-wide leading-tight">
							You are submitting a report for this account.
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
						className="p-5 sm:p-8 space-y-8"
						onSubmit={handleSubmit}
						noValidate
					>
						<fieldset className="space-y-4">
							<legend className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
								<Terminal size={12} className="text-fuchsia-500" />
								<span>Violation Category</span>
							</legend>

							<div
								className={`grid grid-cols-1 gap-2.5 ${errorField === "reason" ? "animate-shake" : ""}`}
							>
								{reportReasons.map((reason) => {
									const optionId = `reason-${reason.id}`;
									const isSelected = selectedReason === reason.id;
									return (
										<label
											key={reason.id}
											htmlFor={optionId}
											className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer bg-black/20 ${
												isSelected
													? "border-fuchsia-500 bg-fuchsia-500/[0.03] shadow-[0_0_15px_rgba(217,70,239,0.05)]"
													: "border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
											} focus-within:ring-1 focus-within:ring-fuchsia-500`}
										>
											<span
												className={`text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${
													isSelected ? "text-fuchsia-400" : "text-slate-400"
												}`}
											>
												{reason.label}
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
												value={reason.id}
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
								className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"
							>
								<Terminal size={12} className="text-fuchsia-500" />
								<span>Please tell us why you are reporting this user</span>
							</label>

							<textarea
								id="report-details"
								key={errorField === "details" ? `shake-${shakeTick}` : "normal"}
								value={details}
								disabled={isSubmitting}
								onChange={(e) => {
									setAlert({ show: false, message: "", type: "error" });
									setDetails(e.target.value);
									if (errorField === "details") setErrorField("");
								}}
								className={`w-full h-40 bg-[#121214] rounded-lg p-4 border transition-all text-white focus:outline-none focus:border-fuchsia-500/50 text-[11px] sm:text-xs md:text-sm font-mono leading-relaxed shadow-inner placeholder:text-slate-700 resize-none ${
									errorField === "details"
										? "border-red-500/50 animate-shake"
										: "border-white/10"
								}`}
								placeholder="Provide details about why you are reporting this user..."
							/>
						</div>

						<section className="flex items-start gap-2.5 bg-purple-950/10 border border-purple-500/10 rounded-lg p-3 text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 leading-relaxed">
							<ShieldAlert size={14} className="text-fuchsia-500 shrink-0" />
							<p>
								Filing false reports breaks usage rules and may lead to
								restrictions on your account.
							</p>
						</section>

						<div className="pt-2 border-t border-white/5">
							<CyberActionButton
								label={
									isSubmitting ? "SENDING REPORT..." : "REPORT USER ACCOUNT"
								}
								className="w-full text-xs sm:text-sm"
								disabled={isSubmitting}
								type="submit"
							/>
							<p className="text-center mt-4 text-[10px] sm:text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">
								Reporting helps maintain a safe community.
							</p>
						</div>
					</form>
				</article>
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
}
