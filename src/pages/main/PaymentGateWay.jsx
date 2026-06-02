import React, { useState } from "react";
import { CreditCard, AlertCircle } from "lucide-react";
import { apiFetch } from "../../lib/api";

export default function PaymentGateWay({
	transactionId,
	itemTitle,
	agreedPrice,
	onSuccess,
}) {
	const [isProcessing, setIsProcessing] = useState(false);

	const triggerSecureRedirect = async (e) => {
		e.preventDefault();

		if (isProcessing) return;
		setIsProcessing(true);

		try {
			const response = await apiFetch("/payments/initiate_checkout.php", {
				method: "POST",
				body: JSON.stringify({ transaction_id: Number(transactionId) }),
			});

			const data = await response.json();

			// 🚀 FIX: Read the backend error signature format ('data.error' instead of 'data.message')
			if (!response.ok || data.status === "error") {
				throw new Error(data.error || "Payment authorization failed.");
			}

			// 1. Create form dynamically
			const form = document.createElement("form");
			form.method = "POST";
			// 🚀 FIX: Match your PHP key 'redirect_url' instead of 'form_action'
			form.action = data.redirect_url;

			// 2. Append fields
			// 🚀 FIX: Match your PHP key 'checkout_details' instead of 'payload'
			Object.entries(data.checkout_details).forEach(([key, value]) => {
				const input = document.createElement("input");
				input.type = "hidden";
				input.name = key;
				input.value = value;
				form.appendChild(input);
			});

			// 3. Append to body and submit
			document.body.appendChild(form);
			form.submit();

			// Clean up form reference from document flow
			document.body.removeChild(form);

			if (onSuccess) onSuccess();
		} catch (err) {
			// Informative client alert handling
			alert(`TRANSACTION PROCESS REFUSED: ${err.message.toUpperCase()}`);
			setIsProcessing(false);
		}
	};

	const displayAmount = agreedPrice ? parseFloat(agreedPrice) : 0;

	return (
		<div className="w-full max-w-lg mx-auto bg-[#090614] border border-purple-500/20 rounded-xl p-5 sm:p-8 text-slate-300 font-mono">
			<div className="bg-[#0e0a1f] border border-purple-500/10 rounded-lg p-4 mb-6">
				<span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
					Contract Target
				</span>
				<p className="text-white text-xs sm:text-sm font-bold">{itemTitle}</p>
			</div>

			<div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-lg flex gap-3 mb-6">
				<AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />
				<p className="text-slate-400 text-[11px] leading-relaxed uppercase">
					Signatures verified on backend. Click authorization below to route
					processing vaults to the sandbox gateway securely.
				</p>
			</div>

			<button
				type="button"
				onClick={triggerSecureRedirect}
				disabled={isProcessing || displayAmount <= 0}
				className="w-full py-3 px-4 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase bg-fuchsia-600 hover:bg-fuchsia-500 text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
			>
				{isProcessing ? (
					<>
						<span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
						Signing Security Protocols...
					</>
				) : (
					<>
						<CreditCard size={16} />
						Authorize R{" "}
						{displayAmount.toLocaleString("en-ZA", {
							minimumFractionDigits: 2,
						})}
					</>
				)}
			</button>
		</div>
	);
}
