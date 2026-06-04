import React, { useState } from "react";
import BaseModal from "../../ui/BaseModal";
import { Handshake } from "lucide-react";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";
import CyberAlert from "../../ui/CyberAlert";
import { apiFetch } from "../../../lib/api";

const CounterOfferModal = ({ isOpen, onClose, onSubmit, offerId }) => {
	const [amount, setAmount] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});

	const showMessage = (message, type = "error", fieldName = "") => {
		setAlert({ show: true, message, type });
		if (type === "error" && fieldName) {
			setErrorField("");
			setShakeTick((tick) => tick + 1);
			requestAnimationFrame(() => setErrorField(fieldName));
		} else {
			setErrorField("");
		}
	};

	const handleAmountChange = (e) => {
		setAlert({ show: false, message: "", type: "error" });
		if (errorField === "amount") setErrorField("");
		setAmount(e.target.value);
	};

	const handleSendOffer = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
			showMessage("Please enter an amount higher than 0.", "error", "amount");
			return;
		}

		if (!offerId) {
			showMessage("Could not find the original offer.", "error", "amount");
			return;
		}

		setIsLoading(true);

		try {
			const response = await apiFetch("/offers/send_counter_offer.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					offer_id: offerId,
					amount: parseFloat(amount),
				}),
			});

			const data = await response.json();
			if (!response.ok)
				throw new Error(data.error || "The offer could not be sent.");

			showMessage("Offer sent successfully!", "success");

			setTimeout(() => {
				setIsLoading(false);
				if (typeof onSubmit === "function") onSubmit(amount);
				setAmount("");
				onClose();
				setAlert({ show: false, message: "", type: "error" });
			}, 2000);
		} catch (error) {
			showMessage(
				error.message || "Could not send your offer. Please try again.",
				"error",
				"amount",
			);
			setIsLoading(false);
		}
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Make a Counter Offer"
			icon={<Handshake className="w-4 h-4 text-fuchsia-400" />}
			centerContent={true}
		>
			<div className="w-full flex justify-center p-5 sm:p-8 bg-[#0c0c0e] text-slate-300 text-xs sm:text-sm md:text-base lg:text-lg">
				<form
					onSubmit={handleSendOffer}
					className="w-full max-w-sm flex flex-col items-start gap-6 sm:gap-7"
				>
					{alert.show && (
						<div className="w-full">
							<CyberAlert
								type={alert.type}
								message={alert.message}
								onClose={() => setAlert({ ...alert, show: false })}
							/>
						</div>
					)}

					<div className="w-full flex flex-col gap-2">
						<label className="text-purple-400 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest pl-1">
							Your Offer Amount
						</label>

						<div className="relative group w-full flex items-stretch">
							<span className="absolute left-4 top-0 h-full flex items-center text-slate-400 group-focus-within:text-fuchsia-400 font-black text-[10px] sm:text-xs md:text-sm z-10 pointer-events-none transition-colors duration-200">
								R
							</span>
							<AuthInput
								key={
									errorField === "amount"
										? `shake-amount-${shakeTick}`
										: "normal-amount"
								}
								id="counter-amount"
								type="number"
								placeholder="0.00"
								value={amount}
								onChange={handleAmountChange}
								required
								disabled={isLoading}
								error={errorField === "amount"}
								className={`pl-9 w-full bg-[#0d091a] border border-purple-500/20 rounded-lg text-white text-[10px] sm:text-xs md:text-sm font-bold tracking-wide py-2.5 sm:py-3 transition-all ${
									errorField === "amount" ? "animate-shake" : ""
								}`}
							/>
						</div>
					</div>

					<div className="w-full pt-2 border-t border-white/5">
						<CyberActionButton
							type="submit"
							disabled={isLoading}
							isLoading={isLoading}
							label={isLoading ? "Sending..." : "Send Counter Offer"}
							className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white"
						/>
					</div>
				</form>
			</div>
		</BaseModal>
	);
};

export default CounterOfferModal;
