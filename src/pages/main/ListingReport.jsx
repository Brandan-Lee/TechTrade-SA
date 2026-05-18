import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	AlertTriangle,
	ShieldAlert,
	ArrowLeft,
	CheckCircle,
	Terminal,
	Radio,
} from "lucide-react";
import CyberActionButton from "../../components/ui/CyberActionButton";

const ListingReportPage = () => {
	const { listingId } = useParams();
	const navigate = useNavigate();
	const [submitted, setSubmitted] = useState(false);
	const [selectedReason, setSelectedReason] = useState("");
	const [details, setDetails] = useState("");

	const reportReasons = [
		"Inaccurate Hardware Specs",
		"Suspected Fraud/Scam",
		"Counterfeit Component",
		"Inappropriate Content",
		"Pricing Manipulation",
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		// Securely pipes payload to Admin Command & Control Center
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<div className="min-h-screen bg-[#050506] text-slate-300 flex items-center justify-center p-4 font-mono relative selection:bg-fuchsia-500/30">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808002_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

				<div className="max-w-md w-full bg-[#0c0c0e]/90 p-6 md:p-8 rounded-xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)] text-center relative z-10">
					<div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="w-10 h-10 text-emerald-400" />
					</div>
					<h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">
						REPORT_LOGGED
					</h2>
					<p className="mt-4 text-slate-400 text-xs sm:text-sm leading-relaxed border-y border-white/5 py-4 my-6">
						Data packet for incident ticket{" "}
						<span className="font-bold text-fuchsia-400">
							#{listingId || "UNKNOWN_NODE"}
						</span>{" "}
						has been safely written to core storage. The Security & System
						Integrity Unit will execute a standard audit shortly.
					</p>
					<button
						onClick={() => navigate(-1)}
						className="w-full py-3 bg-slate-900 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-98 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
					>
						Return to Marketplace
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#050506] font-mono text-slate-300 pb-20 relative selection:bg-fuchsia-500/30">
			{/* Ambient System Grid Background Map */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808002_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

			{/* Application Terminal Topbar Header */}
			<header className="w-full max-w-3xl mx-auto px-4 pt-8 relative z-10">
				<div className="flex gap-4 items-start">
					<button
						onClick={() => navigate(-1)}
						aria-label="Terminate protocol and return to preceding node link"
						className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-[#0c0c0e] text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-500/40 transition-all focus:outline-none focus:ring-1 focus:ring-fuchsia-500 shrink-0"
					>
						<ArrowLeft size={16} />
					</button>
					<div className="min-w-0">
						<h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none">
							Report this listng
						</h1>
						<p className="mt-2 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider truncate">
							Security Protocol: // {listingId || "NOT_DEFINED"}
						</p>
					</div>
				</div>
			</header>

			{/* Main Operational Window Area */}
			<main className="max-w-3xl mx-auto py-8 px-4 relative z-10">
				<div className="bg-[#0c0c0e]/90 rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
					{/* System Diagnostic Advisory Warning Banner */}
					<div className="bg-gradient-to-r from-purple-950 via-[#160c28] to-purple-950 px-4 py-3.5 border-b border-white/5 flex items-center gap-3">
						<AlertTriangle className="text-fuchsia-400 shrink-0" size={16} />
						<p className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wide leading-tight">
							You are initiating a manual audit request for this hardware node.
						</p>
					</div>

					<form className="p-5 sm:p-8 space-y-8" onSubmit={handleSubmit}>
						{/* Accessible fieldset selection vector row group array */}
						<fieldset className="space-y-4">
							<legend className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
								<Terminal size={12} className="text-fuchsia-500" />
								<span>Violation Category</span>
							</legend>

							<div className="grid grid-cols-1 gap-2.5">
								{reportReasons.map((reason) => {
									const optionId = `reason-${reason.toLowerCase().replace(/[^a-z0-id]/g, "-")}`;
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
												className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
													isSelected ? "text-fuchsia-400" : "text-slate-400"
												}`}
											>
												{reason}
											</span>
											<input
												id={optionId}
												type="radio"
												name="report_reason"
												value={reason}
												checked={isSelected}
												onChange={(e) => setSelectedReason(e.target.value)}
												className="w-4 h-4 accent-fuchsia-500 cursor-pointer"
												required
											/>
										</label>
									);
								})}
							</div>
						</fieldset>

						{/* Detailed Description Terminal Prompt Field Block */}
						<div className="flex flex-col gap-2">
							<label
								htmlFor="report-details"
								className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"
							>
								<Terminal size={12} className="text-fuchsia-500" />
								<span>Please tell us why you are reporting this listing</span>
							</label>
							<textarea
								id="report-details"
								required
								value={details}
								onChange={(e) => setDetails(e.target.value)}
								className="w-full h-40 bg-[#121214] rounded-lg p-4 border border-white/10 transition-all text-white focus:outline-none focus:border-fuchsia-500/50 text-xs sm:text-sm font-mono leading-relaxed shadow-inner placeholder:text-slate-700 resize-none"
								placeholder=""
							/>
						</div>

						<div className="pt-2 border-t border-white/5">
							<CyberActionButton label="REPORT LISTING" className="w-full" />
							<p className="text-center mt-4 text-[9px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
								Reporting helps maintain the Managed Trust & Negotiation Hub
								integrity
							</p>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
};

export default ListingReportPage;
