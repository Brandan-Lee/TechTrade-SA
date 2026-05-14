import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	AlertTriangle,
	ShieldAlert,
	ArrowLeft,
	Send,
	CheckCircle,
} from "lucide-react";
import PurpleGradientButton from "../../components/ui/PurpleGradientButton";

const ListingReportPage = () => {
	const { listingId } = useParams(); // Retrieves ID from URL
	const navigate = useNavigate();
	const [submitted, setSubmitted] = useState(false);

	const reportReasons = [
		"Inaccurate Hardware Specs",
		"Suspected Fraud/Scam",
		"Counterfeit Component",
		"Inappropriate Content",
		"Pricing Manipulation",
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		// Logic to send report to the Admin Command & Control Center
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
				<div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-emerald-500 text-center">
					<CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
					<h2 className="text-2xl font-black uppercase italic text-slate-900">
						Transmission Received
					</h2>
					<p className="mt-4 text-slate-500 text-sm leading-relaxed">
						The report for{" "}
						<span className="font-bold text-purple-600">#{listingId}</span> has
						been logged. Our Security & Technical Foundation team will
						investigate shortly.
					</p>
					<button
						onClick={() => navigate(-1)}
						className="btn btn-block mt-8 bg-slate-900 text-white border-none"
					>
						Return to Marketplace
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 font-inter text-slate-900">
			{/* Header */}
			<header className="w-full px-6 md:px-12 py-8">
				<div className="max-w-3xl flex gap-4">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-pink-600"
					>
						<ArrowLeft size={20} />
					</button>
					<div>
						<h1 className="text-purple-600 sm:text-xl md:text-2xl lg:text-4xl font-black uppercase tracking-tighter">
							Report this listing
						</h1>
						<p className="mt-4 text-sm md:text-base lg:text-lg font-bold text-slate-500 uppercase tracking-widest">
							Security Protocol: {listingId}
						</p>
					</div>
				</div>
			</header>

			<main className="max-w-3xl mx-auto py-12 px-4">
				<div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
					{/* Warning Banner */}
					<div className=" bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 p-4 border-b border-pink-100 flex items-center gap-3">
						<AlertTriangle className="text-white shrink-0" size={20} />
						<p className="text-xs md:text-sm font-bold text-white uppercase">
							You are initiating a manual audit request for this hardware node.
						</p>
					</div>

					<form className="p-6 md:p-10 space-y-8" onSubmit={handleSubmit}>
						{/* Reason Selection */}
						<div className="form-control">
							<label className="label">
								<span className="text-violet-600 text-base font-black uppercase tracking-[0.2em] ml-1 mb-5">
									Violation Category
								</span>
							</label>
							<div className="grid grid-cols-1 gap-5">
								{reportReasons.map((reason) => (
									<label
										key={reason}
										className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer hover:border-purple-300 transition-all"
									>
										<input
											type="radio"
											name="report_reason"
											className="w-4 h-4 accent-pink-600"
											required
										/>
										<span className="text-slate-500 text-base font-black tracking-[0.2em] ml-1">
											{reason}
										</span>
									</label>
								))}
							</div>
						</div>

						{/* Detailed Description */}
						<div className="form-control w-full">
							<label className="text-violet-600 text-base font-black uppercase tracking-[0.2em] ml-1">
								Please tell us why you are reporting this listing
							</label>
							<textarea
								className="w-full h-48 bg-slate-100 rounded-xl px-4 py-4 border transition-all text-gray-900 pr-12 focus:outline-none focus:ring-2 ring-pink-500 text-sm leading-relaxed rounded-[2rem] shadow-inner placeholder:text-gray-500"
								placeholder="Enter your message here..."
							/>
						</div>

						{/* Submit Action */}
						<div>
							<PurpleGradientButton label="REPORT LISTING" />
							<p className="text-center mt-4 text-sm md:text-base font-bold text-slate-400 uppercase tracking-tight">
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
