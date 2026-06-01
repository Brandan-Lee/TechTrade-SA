import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Truck,
	CheckCircle2,
	ShieldCheck,
	AlertCircle,
	HelpCircle,
	Package,
	ArrowRightLeft,
	Users,
} from "lucide-react";
import PaymentGateWay from "./PaymentGateWay";
import { apiFetch } from "../../lib/api";

export default function EscrowTrackerPage() {
	const { transactionId } = useParams();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true);
	const [userRole, setUserRole] = useState(null);
	const [error, setError] = useState(null);
	const [isInPersonHandover, setIsInPersonHandover] = useState(false);

	const [transaction, setTransaction] = useState({
		id: "",
		publicId: "",
		itemTitle: "",
		agreedPrice: "",
		buyerName: "",
		sellerName: "",
		currentStep: 1,
		status: "pending",
	});

	const stepsConfig = [
		{
			level: 1,
			name: "Securing Payment",
			desc: "Buyer selects method or deposits funds",
		},
		{
			level: 2,
			name: isInPersonHandover ? "Bypassed" : "Awaiting Dispatch",
			desc: isInPersonHandover ? "Not applicable" : "Seller packages item",
		},
		{
			level: 3,
			name: isInPersonHandover ? "Handover Pending" : "In Transit",
			desc: isInPersonHandover ? "Coordinate meeting" : "Package in transit",
		},
		{
			level: 4,
			name: "Hardware Inspection",
			desc: "Buyer verifies operational parameters",
		},
		{ level: 5, name: "Transaction Completed", desc: "Funds finalized" },
	];

	const fetchTransactionDetails = async () => {
		try {
			setIsLoading(true);
			const response = await apiFetch(
				`/transactions/get_tracker_details.php?transaction_id=${transactionId}`,
			);
			const data = await response.json();

			if (!response.ok || data.status === "error")
				throw new Error(data.message || "Failed to download data.");

			setTransaction({
				id: data.data.id,
				publicId: data.data.public_id,
				itemTitle: data.data.title,
				agreedPrice: (data.data.agreed_price_cents / 100).toFixed(2),
				buyerName: data.data.buyer_name,
				sellerName: data.data.seller_name,
				currentStep: parseInt(data.data.escrow_step),
				status: data.data.status,
				buyerId: data.data.buyer_id,
				sellerId: data.data.seller_id,
			});

			const hasHandoverBypass =
				data.data.events?.some((e) => e.event_type === "choose_handover") ||
				false;
			setIsInPersonHandover(hasHandoverBypass);
			setUserRole(data.data.assigned_role);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = async () => {
		const reason = prompt(
			"Please state the reason for canceling this transaction:",
		);
		if (reason) {
			await handleProcessAction("cancel", { reason });
            navigate(-1);
		}
	};

	useEffect(() => {
		if (transactionId) fetchTransactionDetails();
	}, [transactionId]);

	const handleProcessAction = async (actionType, additionalPayload = {}) => {
		try {
			setIsLoading(true);
			const response = await apiFetch("/transactions/update_tracker_step.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					transaction_id: transaction.id,
					action: actionType,
					...additionalPayload,
				}),
			});
			const data = await response.json();
			if (!response.ok || data.status === "error")
				throw new Error(data.message || "Action failed.");
			await fetchTransactionDetails();
		} catch (err) {
			alert(err.message.toUpperCase());
			setIsLoading(false);
		}
	};

	if (isLoading && !transaction.id) {
		return (
			<div className="w-screen h-screen flex flex-col items-center justify-center bg-[#07050e] font-mono gap-4">
				<div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
				<p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
					Reading Escrow Pipeline Logs...
				</p>
			</div>
		);
	}

	return (
		<div className="bg-[#07050e] text-slate-300 font-mono pb-16 px-4 sm:px-6 lg:px-8 select-none selection:bg-fuchsia-500/30">
			<div className="max-w-5xl mx-auto pt-8 sm:pt-12">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-500/10 pb-6 mb-8">
					<div>
						<h1 className="text-white text-xl sm:text-2xl font-black tracking-wider uppercase flex items-center gap-2.5">
							<ArrowRightLeft className="text-fuchsia-400 w-5 h-5" /> Escrow
							Ledger Tracker
						</h1>
						<p className="text-slate-500 text-xs mt-1">
							Transaction Node: {transaction.publicId}
						</p>
					</div>
					<div className="bg-purple-950/30 border border-purple-500/20 px-3 py-1.5 rounded text-[11px] font-bold text-purple-300 flex items-center gap-2">
						<Users size={12} /> AUTHORIZED AS:{" "}
						<span className="text-white underline tracking-widest uppercase">
							{userRole}
						</span>
					</div>
				</div>

				<div className="w-full bg-[#0c0919] border border-purple-500/10 rounded-xl p-6 mb-8 shadow-lg">
					<ul className="steps steps-vertical md:steps-horizontal w-full text-left md:text-center text-xs gap-4 md:gap-0">
						{stepsConfig.map((step) => {
							const isCompleted =
								transaction.currentStep > step.level ||
								transaction.status === "completed";
							const isActive =
								transaction.currentStep === step.level &&
								transaction.status !== "completed";
							return (
								<li
									key={step.level}
									data-content={isCompleted ? "✓" : step.level}
									className={`step transition-all duration-300 ${isCompleted ? "step-secondary text-fuchsia-400 font-bold" : ""} ${isActive ? "step-primary text-purple-300 font-black" : "text-slate-600"}`}
								>
									<div className="md:mt-2 text-left md:text-center px-2">
										<p
											className={`text-xs uppercase tracking-wide ${isActive ? "text-white" : ""}`}
										>
											{step.name}
										</p>
									</div>
								</li>
							);
						})}
					</ul>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					<div className="lg:col-span-7 flex flex-col gap-6">
						<div className="bg-[#0c0919] border border-purple-500/10 rounded-xl p-5 sm:p-6 shadow-md">
							<h3 className="text-white text-xs font-black uppercase tracking-widest border-b border-purple-500/10 pb-3 mb-4">
								Transaction Details
							</h3>
							<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
								<div>
									<dt className="text-slate-500 uppercase tracking-wider mb-0.5">
										Item
									</dt>
									<dd className="text-white font-bold text-sm">
										{transaction.itemTitle}
									</dd>
								</div>
								<div>
									<dt className="text-slate-500 uppercase tracking-wider mb-0.5">
										Amount
									</dt>
									<dd className="text-fuchsia-400 font-black text-sm">
										R {transaction.agreedPrice}
									</dd>
								</div>
							</dl>
						</div>

						<div className="p-4 bg-purple-950/10 border border-purple-500/20 rounded-xl flex gap-3.5 shadow-inner">
							<HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
							<div>
								<h4 className="text-white text-xs font-black uppercase tracking-wider mb-1">
									Pipeline Status Information
								</h4>
								<p className="text-slate-400 text-[11px] uppercase">
									{transaction.currentStep === 5
										? "Transaction complete."
										: "Standard operational pipeline active."}
								</p>
							</div>
						</div>
					</div>

					<div className="lg:col-span-5">
						<div className="bg-[#0a0616] border-2 border-purple-500/20 rounded-xl p-6 shadow-xl relative overflow-hidden">
							<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500" />
							<h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-4">
								Operational Control
							</h3>

							<div className="space-y-4">
								{transaction.currentStep === 1 && userRole === "buyer" && (
									<div className="grid gap-3">
										<button
											onClick={() => handleProcessAction("choose_handover")}
											className="btn w-full bg-purple-900/60 text-white text-[11px] font-bold uppercase h-11"
										>
											In-Person Handover
										</button>
										<PaymentGateWay
											transactionId={transaction.id}
											agreedPrice={transaction.agreedPrice}
											itemTitle={transaction.itemTitle}
											onSuccess={() => handleProcessAction("payment_escrow")}
										/>
									</div>
								)}

								{transaction.currentStep >= 2 &&
									transaction.status !== "completed" && (
										<button
											onClick={() => navigate(`/dispute/${transaction.id}`)}
											className="w-full border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase h-10 hover:bg-amber-950/20"
										>
											Open Dispute
										</button>
									)}

								{transaction.currentStep === 2 && userRole === "seller" && (
									<button
										onClick={() => handleProcessAction("mark_shipped")}
										className="btn w-full bg-fuchsia-600 text-white text-xs font-black uppercase h-11"
									>
										Confirm Dispatch
									</button>
								)}
								{transaction.currentStep === 3 && userRole === "buyer" && (
									<button
										onClick={() =>
											handleProcessAction(
												isInPersonHandover
													? "release_funds"
													: "confirm_delivery",
											)
										}
										className="btn w-full bg-purple-600 text-white text-xs font-black uppercase h-11"
									>
										Confirm Handover
									</button>
								)}
								{transaction.currentStep === 4 && userRole === "buyer" && (
									<button
										onClick={() => handleProcessAction("release_funds")}
										className="btn w-full bg-emerald-600 text-white text-xs font-black uppercase h-11"
									>
										Release Funds
									</button>
								)}

								{/* STEP 5 ACTIONS: Completed State View */}
								{(transaction.currentStep === 5 ||
									transaction.status === "completed") && (
									<div className="space-y-4">
										<div className="text-center py-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-4">
											<ShieldCheck
												size={32}
												className="text-emerald-400 mx-auto mb-2"
											/>
											<h4 className="text-emerald-400 text-xs font-black tracking-widest uppercase">
												Transaction Finalized
											</h4>

											{/* Dynamic Review Button based on role */}
											<button
												onClick={() => {
													const reviewTargetId =
														userRole === "buyer"
															? transaction.sellerId
															: transaction.buyerId;
													navigate(`/review/${reviewTargetId}`);
												}}
												className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase h-10 transition-colors"
											>
												Rate & Review{" "}
												{userRole === "buyer" ? "Seller" : "Buyer"}
											</button>
										</div>
									</div>
								)}

								{transaction.status !== "completed" && (
									<button
										onClick={handleCancel}
										className="w-full mt-6 text-red-500 text-[10px] uppercase font-bold hover:text-red-300"
									>
										Cancel Transaction
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
