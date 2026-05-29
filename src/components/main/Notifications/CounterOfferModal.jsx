import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BaseModal from "../../ui/BaseModal";
import { Handshake } from "lucide-react";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";
import CyberAlert from "../../ui/CyberAlert";
import { apiFetch } from "../../../lib/api";

const CounterOfferModal = ({
	isOpen,
	onClose,
	onSubmit,
	listingName,
	offerId,
	onSuccess
}) => {
	const [amount, setAmount] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});

	const triggerStatus = (message, type = "error", fieldName = "") => {
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
		const { value } = e.target;

		setAlert({ show: false, message: "", type: "error" });
		if (errorField === "amount") {
			setErrorField("");
		}
		setAmount(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		setErrorField("");
		setAlert({ show: false, message: "", type: "error" });

		if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
			triggerStatus(
				"Please enter a valid offer amount higher than R0.",
				"error",
				"amount",
			);
			return;
		}

		if (!offerId) {
			triggerStatus(
				"Could not identify the original offer tracking ID.",
				"error",
				"amount",
			);
			return;
		}

		setIsLoading(true);

		try {
			const response = await apiFetch("/marketplace/send_counter_offer.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					offer_id: offerId,
					amount: parseFloat(amount),
				}),
			});

			const resData = await response.json();

			if (!response.ok) {
				throw new Error(resData.error || "The server rejected your offer.");
			}

			triggerStatus(resData.message || "Offer sent successfully!", "success");

			// Clear form, notify parent layout to refresh data, and close window after delay
			setTimeout(() => {
				setIsLoading(false);
				if (typeof onSubmit === "function") {
					onSubmit(amount);
				}
				setAmount("");
				onClose();
				setAlert({ show: false, message: "", type: "error" });
			}, 2000);
		} catch (error) {
			triggerStatus(
				error.message ||
					"Could not send your offer. Please check your connection and try again.",
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
			{/* Main Modal Content Wrapper */}
			<div className="w-full flex justify-center p-5 sm:p-8 font-mono bg-[#0c0c0e] text-slate-300 select-none selection:bg-fuchsia-500/30">
				{/* Inner Content Box */}
				<form
					onSubmit={handleSubmit}
					className="w-full max-w-sm flex flex-col items-start gap-6 sm:gap-7"
				>
					{/* Feedback Banner Display Placement */}
					{alert.show && (
						<div className="w-full">
							<CyberAlert
								type={alert.type}
								message={alert.message}
								onClose={() => setAlert({ ...alert, show: false })}
							/>
						</div>
					)}

					{/* Amount Input Section */}
					<div className="w-full flex flex-col gap-2">
						<label
							htmlFor="counter-amount"
							className="text-purple-400 text-[10px] sm:text-xs font-black uppercase tracking-widest pl-1"
						>
							Your Offer Amount
						</label>

						<div className="relative group w-full flex items-stretch">
							{/* Currency Symbol */}
							<span
								className="absolute left-4 top-0 h-full flex items-center text-slate-400 group-focus-within:text-fuchsia-400 font-black text-xs sm:text-sm z-10 pointer-events-none transition-colors duration-200"
								aria-hidden="true"
							>
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
								inputMode="decimal"
								placeholder="0.00"
								value={amount}
								onChange={handleInputChange}
								required
								disabled={isLoading}
								error={errorField === "amount"}
								className={`pl-9 w-full bg-[#0d091a] border border-purple-500/20 focus:border-fuchsia-500/80 rounded-lg text-white text-xs sm:text-sm font-bold tracking-wide py-2.5 sm:py-3 transition-all duration-200 ${
									errorField === "amount" ? "animate-shake" : ""
								}`}
							/>
						</div>
					</div>

					{/* Submit Action Button */}
					<div className="w-full pt-2 border-t border-white/5">
						<CyberActionButton
							type="submit"
							disabled={isLoading}
							isLoading={isLoading}
							label={isLoading ? "SENDING..." : "SEND COUNTER OFFER"}
							className="w-full transition-all duration-200 font-black tracking-widest text-xs sm:text-sm bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-950/30"
						/>
					</div>
				</form>
			</div>
		</BaseModal>
	);
};

export default CounterOfferModal;
