import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ShieldAlert,
	AlertTriangle,
	CheckCircle2,
	Upload,
	X,
	FileText,
	Image as ImageIcon,
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import CyberAlert from "../../components/ui/CyberAlert";

export default function LaunchDisputePage() {
	const { transactionId } = useParams();
	const navigate = useNavigate();

	const [disputeReason, setDisputeReason] = useState("");
	const [detailsText, setDetailsText] = useState("");
	const [uploadedImages, setUploadedImages] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState(null);
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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name === "reason") setDisputeReason(value);
		if (name === "details") setDetailsText(value);

		setAlert({ show: false, message: "", type: "error" });
		if (errorField === name) {
			setErrorField("");
		}
	};

	const [transaction, setTransaction] = useState(null);

	useEffect(() => {
		const loadTransaction = async () => {
			try {
				const response = await apiFetch(
					`/transactions/get_tracker_details.php?transaction_id=${transactionId}`,
				);
				const data = await response.json();
				setTransaction(data.data);
			} catch (err) {
				console.error("Error fetching transaction", err);
			}
		};
		loadTransaction();
	}, [transactionId]);

	const disputeReasons = [
		{
			id: "damaged",
			label: "Product is damaged or broken",
			hint: "Visible physical damage, scratches, cracks, or fails to turn on",
		},
		{
			id: "incorrect",
			label: "Received the wrong product",
			hint: "The item delivered is completely different from the listing description",
		},
		{
			id: "missing",
			label: "Missing parts or accessories",
			hint: "Crucial cables, boxes, or components are absent from the package",
		},
		{
			id: "performance",
			label: "Performance issues / Hidden defects",
			hint: "Turns on, but crashes under load, overheats, or has artifacting problems",
		},
	];

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		if (uploadedImages.length + files.length > 6) {
			triggerStatus("You can only upload a maximum of 6 images.", "error");
			return;
		}

		const newImages = files.map((file) => ({
			id: Math.random().toString(36).substring(2, 9),
			url: URL.createObjectURL(file),
			name: file.name,
			file: file,
		}));

		setUploadedImages((prev) => [...prev, ...newImages]);
	};

	const removeImage = (id) => {
		setUploadedImages((prev) => prev.filter((img) => img.id !== id));
	};

	const handleDisputeSubmit = async (e) => {
		e.preventDefault();

		if (!disputeReason) {
			triggerStatus(
				"Please select a fault category.",
				"error",
				"dispute-reason",
			);
			return;
		}
		if (detailsText.trim().length < 15) {
			triggerStatus(
				"Explanation must be at least 15 characters.",
				"error",
				"dispute-details",
			);
			return;
		}

		setIsSubmitting(true);

		const formData = new FormData();
		formData.append("transaction_id", transactionId);
		formData.append("reason", disputeReason);
		formData.append("details", detailsText);
		uploadedImages.forEach((img, index) => {
			formData.append(`image_${index}`, img.file);
		});

		try {
			const res = await apiFetch("/transactions/submit_dispute.php", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();

			if (res.ok) {
				setSubmitStatus("success");
				triggerStatus(
					data.message || "Dispute successfully launched.",
					"success",
				);
			} else {
				throw new Error(data.error || "Submission failed.");
			}
		} catch (err) {
			triggerStatus(
				err.message || "There was an error submitting the dispute.",
				"error",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-fuchsia-500/30 text-xs sm:text-sm md:text-base">
			<main className="w-full max-w-lg bg-slate-900/60 backdrop-blur-md border border-purple-900/40 rounded-xl shadow-2xl overflow-hidden relative z-10">
				<div className="h-1 bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600" />

				<div className="p-6 sm:p-8 space-y-6">
					<header className="text-center space-y-2">
						<h1 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-fuchsia-400 bg-clip-text text-transparent">
							Report an Issue
						</h1>
						<p className="text-[10px] sm:text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
							Something wrong with your order? Open a report to pause the
							payout. Your money stays safe while we review your claim.
						</p>
					</header>

					<section className="bg-slate-950/80 border border-purple-950/60 rounded-lg p-3.5 text-[11px] sm:text-xs space-y-1">
						<div className="flex justify-between text-slate-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
							<span>Order Number: {transactionId}</span>
							<span className="text-amber-400">STATUS: ON HOLD</span>
						</div>
						<div className="text-xs sm:text-sm font-bold text-slate-200">
							{transaction?.title || "Loading..."}
						</div>
						<div className="text-slate-400 pt-0.5 text-[10px] sm:text-xs">
							Total Value:{" "}
							<span className="text-fuchsia-400 font-bold">
								R{" "}
								{transaction
									? (transaction.agreed_price_cents / 100).toFixed(2)
									: "..."}
							</span>
						</div>
					</section>

					{alert.show && (
						<div className="mb-6">
							<CyberAlert
								type={alert.type}
								message={alert.message}
								onClose={() => setAlert({ ...alert, show: false })}
							/>
						</div>
					)}

					{submitStatus === "success" ? (
						<section className="py-8 text-center space-y-4">
							<div className="inline-flex p-3 bg-amber-950/30 border border-amber-500/30 text-amber-400 rounded-full animate-bounce">
								<AlertTriangle size={32} />
							</div>
							<div>
								<h2 className="text-sm sm:text-base font-bold text-amber-400 uppercase tracking-wide">
									Issue Submitted
								</h2>
								<p className="text-[9px] sm:text-[10px] text-slate-500 font-mono">
									CASE NUMBER: #DISP-
									{Math.floor(200000 + Math.random() * 700000)}
								</p>
							</div>
							<p className="text-[11px] sm:text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
								Payouts are frozen. A member of our support team is assigned to
								review your uploaded details and help resolve the situation.
							</p>
							<div className="pt-2">
								<button
									onClick={() => navigate(`/tracker/${transactionId}`)}
									className="btn btn-outline btn-sm border-purple-900/60 text-purple-300 hover:bg-purple-950 hover:border-purple-500 font-bold tracking-wider uppercase text-[9px] sm:text-[10px]"
								>
									View Chat Room
								</button>
							</div>
						</section>
					) : (
						<form onSubmit={handleDisputeSubmit} className="space-y-5">
							<div className="w-full space-y-1.5">
								<label
									htmlFor="dispute-reason"
									className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold block"
								>
									What is the main problem?
								</label>
								<select
									id="dispute-reason"
									value={disputeReason}
									onChange={(e) => setDisputeReason(e.target.value)}
									className="bg-slate-950/60 border border-purple-950/80 focus:border-fuchsia-500/80 focus:outline-none text-[11px] sm:text-xs text-slate-200 w-full h-11 px-3 rounded-lg transition-colors appearance-none"
								>
									<option value="" disabled>
										Select a reason below
									</option>
									{disputeReasons.map((reason) => (
										<option key={reason.id} value={reason.id}>
											{reason.label}
										</option>
									))}
								</select>
								{disputeReason && (
									<p className="text-[9px] sm:text-[10px] text-purple-400/90 italic px-1">
										ℹ️{" "}
										{disputeReasons.find((r) => r.id === disputeReason)?.hint}
									</p>
								)}
							</div>

							<div className="w-full space-y-1.5">
								<div className="flex justify-between items-center px-1">
									<label
										htmlFor="dispute-details"
										className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5"
									>
										<FileText size={12} className="text-fuchsia-400" /> Explain
										the problem
									</label>
									<span
										className={`text-[9px] sm:text-[10px] font-mono ${detailsText.length < 15 ? "text-amber-500" : "text-slate-600"}`}
									>
										{detailsText.length}/1000
									</span>
								</div>
								<textarea
									id="dispute-details"
									maxLength={1000}
									value={detailsText}
									onChange={(e) => setDetailsText(e.target.value)}
									placeholder="Please describe what is wrong with the item, any testing you did, or what is missing. (Minimum 15 characters)"
									className="bg-slate-950/60 border border-purple-950/80 focus:border-fuchsia-500/80 focus:outline-none text-slate-200 text-[11px] sm:text-xs w-full h-24 p-3 leading-relaxed rounded-lg placeholder:text-slate-600 resize-none transition-colors"
								/>
							</div>

							<div className="w-full space-y-2">
								<div className="flex justify-between items-center px-1">
									<label className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
										<ImageIcon size={12} className="text-fuchsia-400" /> Upload
										Evidence
									</label>
									<span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">
										{uploadedImages.length}/6 pictures
									</span>
								</div>

								{uploadedImages.length < 6 && (
									<label className="relative flex flex-col items-center justify-center border border-dashed border-purple-950/80 hover:border-fuchsia-500/50 bg-slate-950/40 hover:bg-slate-950/80 rounded-lg py-4 cursor-pointer transition-all">
										<input
											type="file"
											multiple
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
										<Upload
											size={18}
											className="text-slate-500 mb-1.5 transition-colors"
										/>
										<span className="text-[10px] sm:text-[11px] font-bold text-slate-300">
											Add photos
										</span>
										<span className="text-[9px] text-slate-500 mt-0.5">
											Show package condition, cracks, or damage (Max 6)
										</span>
									</label>
								)}

								{uploadedImages.length > 0 && (
									<div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
										{uploadedImages.map((img) => (
											<div
												key={img.id}
												className="relative aspect-square rounded-md bg-slate-950 border border-purple-950/60 overflow-hidden group"
											>
												<img
													src={img.url}
													alt="Uploaded proof"
													className="w-full h-full object-cover"
												/>
												<button
													type="button"
													onClick={() => removeImage(img.id)}
													className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
													aria-label="Remove photo"
												>
													<X size={14} />
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="flex items-start gap-2.5 bg-fuchsia-950/10 border border-fuchsia-500/10 rounded-lg p-3 text-[9px] sm:text-[10px] text-slate-400 leading-relaxed">
								<ShieldAlert
									size={14}
									className="text-fuchsia-400 shrink-0 mt-0.5"
								/>
								<p>
									Opening a case updates our support desk instantly. Please keep
									communication friendly. The seller can offer a discount
									partial refund or accept a return.
								</p>
							</div>

							<button
								type="submit"
								disabled={
									!disputeReason ||
									detailsText.trim().length < 15 ||
									isSubmitting
								}
								className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold uppercase tracking-widest text-[11px] sm:text-xs h-11 rounded-lg transition-all active:scale-[0.99]"
							>
								{isSubmitting
									? "Submitting..."
									: !disputeReason
										? "Select Problem Category"
										: detailsText.trim().length < 15
											? "Provide More Information"
											: "Confirm & Open Case"}
							</button>
						</form>
					)}
				</div>
			</main>
		</div>
	);
}
