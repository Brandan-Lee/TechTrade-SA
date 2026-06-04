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

			if (!response.ok || data.status === "error") {
				throw new Error(data.error || "Payment failed.");
			}

			const form = document.createElement("form");
			form.method = "POST";
			form.action = data.redirect_url;

			Object.entries(data.checkout_details).forEach(([key, value]) => {
				const input = document.createElement("input");
				input.type = "hidden";
				input.name = key;
				input.value = value;
				form.appendChild(input);
			});

			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);

			if (onSuccess) onSuccess();
		} catch (err) {
			alert(`Payment Error: ${err.message}`);
			setIsProcessing(false);
		}
	};

	const displayAmount = agreedPrice ? parseFloat(agreedPrice) : 0;

	return (
		<div className="w-full max-w-lg mx-auto bg-[#090614] border border-purple-500/20 rounded-xl p-5 sm:p-8 text-slate-300 font-mono text-xs sm:text-sm md:text-base">
			<main>
				<section className="bg-[#0e0a1f] border border-purple-500/10 rounded-lg p-4 mb-6">
					<span className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-bold block mb-1">
						Item Name
					</span>
					<h1 className="text-white text-xs sm:text-sm md:text-base font-bold">
						{itemTitle}
					</h1>
				</section>

				<section className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-lg flex gap-3 mb-6">
					<AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />
					<p className="text-slate-400 text-[10px] sm:text-[11px] leading-relaxed uppercase">
						Your request is ready. Click below to continue to our safe payment
						provider.
					</p>
				</section>

				<button
					type="button"
					onClick={triggerSecureRedirect}
					disabled={isProcessing || displayAmount <= 0}
					className="w-full py-3 px-4 rounded-lg font-bold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase bg-fuchsia-600 hover:bg-fuchsia-500 text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
				>
					{isProcessing ? (
						<>
							<span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
							Loading...
						</>
					) : (
						<>
							<CreditCard size={16} />
							Pay R{" "}
							{displayAmount.toLocaleString("en-ZA", {
								minimumFractionDigits: 2,
							})}
						</>
					)}
				</button>
			</main>
		</div>
	);
}
