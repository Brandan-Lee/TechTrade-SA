import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, ChevronDown } from "lucide-react";
import AuthInput from "../../components/ui/AuthInput";
import CyberActionButton from "../../components/ui/CyberActionButton";
import CyberAlert from "../../components/ui/CyberAlert";
import { useAuth } from "../../components/AuthContext";
import { apiFetch } from "../../lib/api";

export default function ContactUs() {
	const { user } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		inquiryType: "",
		message: "",
		contactPreference: "Email",
	});

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
		setFormData((prev) => ({ ...prev, [name]: value }));

		setAlert({ show: false, message: "", type: "error" });
		if (errorField === name) {
			setErrorField("");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.firstName.trim()) {
			triggerStatus(
				"Please enter your first name before sending.",
				"error",
				"firstName",
			);
			return;
		}

		if (!formData.lastName.trim()) {
			triggerStatus(
				"Please enter your last name before sending.",
				"error",
				"lastName",
			);
			return;
		}

		if (!formData.inquiryType) {
			triggerStatus("Please select an inquiry type.", "error", "inquiryType");
			return;
		}

		if (!formData.message.trim()) {
			triggerStatus(
				"Please provide a message outlining your request.",
				"error",
				"message",
			);
			return;
		}

		setIsSubmitting(true);
		setAlert({ show: false, message: "", type: "error" });

		try {
			const response = await apiFetch("/support/submit_support_message.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to submit support message.");
			}

			triggerStatus(
				data.message || "Your message has been sent successfully.",
				"success",
			);

			setFormData({
				firstName: "",
				lastName: "",
				inquiryType: "",
				message: "",
				contactPreference: "Email",
			});
			setErrorField("");
		} catch (err) {
			triggerStatus(
				err.message || "An unexpected error occurred.",
				"error",
				"message",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-[#050505] text-slate-300 py-12 px-4 relative overflow-x-hidden selection:bg-fuchsia-500/30 text-xs sm:text-sm md:text-base lg:text-lg">
			<header className="w-full max-w-[1200px] mx-auto px-4 md:px-8 mb-12 relative z-10">
				<h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none">
					Contact <span className="text-fuchsia-500">Us</span>
				</h1>
				<p className="mt-2 text-[10px] sm:text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
					TechTrade SA Support Hub
				</p>
			</header>

			<main className="w-full max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
					<div className="lg:col-span-5 space-y-6">
						<section className="bg-[#0c0c0e]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
							<h2 className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.25em] text-fuchsia-400 font-mono mb-4 flex items-center gap-2">
								<span className="w-1.5 h-3 bg-fuchsia-500 inline-block" />
								Help Center
							</h2>
							<p className="text-slate-400 font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed uppercase">
								Our support team is standing by to assist with your listings,
								orders, accounts, or general inquiries.
							</p>
						</section>

						<div className="space-y-3">
							{[
								{
									icon: <Mail size={16} />,
									label: "Email Our Team",
									value: "support@techtradesa.co.za",
								},
								{
									icon: <Phone size={16} />,
									label: "Call Us Directly",
									value: "+27 (0) 62 821 2494",
								},
								{
									icon: <MapPin size={16} />,
									label: "Our Head Office",
									value: "Roodepoort, JHB, ZA",
								},
							].map((item, i) => (
								<section
									key={i}
									className="flex items-center gap-4 p-4 bg-[#0c0c0e]/90 rounded-xl border border-white/10 hover:border-fuchsia-500/30 transition-all group font-mono"
								>
									<div className="p-3 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-lg text-fuchsia-400 group-hover:bg-fuchsia-500/10 transition-colors shrink-0">
										{item.icon}
									</div>
									<div className="min-w-0">
										<h3 className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 tracking-widest">
											{item.label}
										</h3>
										<p className="text-xs sm:text-sm font-bold text-slate-200 truncate">
											{item.value}
										</p>
									</div>
								</section>
							))}
						</div>

						<section className="p-5 bg-gradient-to-r from-purple-950/40 via-fuchsia-950/20 to-purple-950/40 border border-fuchsia-500/20 text-white rounded-xl relative overflow-hidden">
							<div className="relative z-10 font-mono">
								<div className="flex items-center gap-2 mb-1.5">
									<div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
									<span className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase">
										Support Desk Active
									</span>
								</div>
								<p className="text-slate-400 text-[10px] sm:text-[11px] uppercase tracking-wide">
									Average response time{" "}
									<span className="text-white font-bold">within 24 hours</span>
								</p>
							</div>
							<MessageSquare className="absolute -right-4 -bottom-4 w-20 h-20 text-fuchsia-500/[0.03] rotate-12 pointer-events-none" />
						</section>
					</div>

					<section className="lg:col-span-7 bg-[#0c0c0e]/90 border border-white/10 p-6 md:p-8 rounded-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
						<div className="absolute top-0 right-8 w-16 h-[2px] bg-fuchsia-500 shadow-[0_0_10px_#d946ef]" />

						{alert.show && (
							<div className="mb-6">
								<CyberAlert
									type={alert.type}
									message={alert.message}
									onClose={() => setAlert({ ...alert, show: false })}
								/>
							</div>
						)}

						<form className="space-y-6" onSubmit={handleSubmit} noValidate>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div
									className={errorField === "firstName" ? "animate-shake" : ""}
								>
									<AuthInput
										key={
											errorField === "firstName"
												? `shake-${shakeTick}`
												: "fn-normal"
										}
										label="First Name"
										name="firstName"
										type="text"
										placeholder="e.g. John"
										value={formData.firstName}
										onChange={handleInputChange}
										className={
											errorField === "firstName" ? "border-red-500/50" : ""
										}
										required
									/>
								</div>
								<div
									className={errorField === "lastName" ? "animate-shake" : ""}
								>
									<AuthInput
										key={
											errorField === "lastName"
												? `shake-${shakeTick}`
												: "ln-normal"
										}
										label="Last Name"
										name="lastName"
										type="text"
										placeholder="e.g. Doe"
										value={formData.lastName}
										onChange={handleInputChange}
										className={
											errorField === "lastName" ? "border-red-500/50" : ""
										}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="inquiryType"
									className="block text-slate-400 text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.3em] ml-1"
								>
									Select Inquiry Type
								</label>
								<div
									className={`relative ${errorField === "inquiryType" ? "animate-shake" : ""}`}
								>
									<select
										key={
											errorField === "inquiryType"
												? `shake-${shakeTick}`
												: "sel-normal"
										}
										id="inquiryType"
										name="inquiryType"
										value={formData.inquiryType}
										onChange={handleInputChange}
										className={`w-full h-12 md:h-14 bg-black rounded-xl px-4 border text-slate-400 focus:text-slate-200 transition-all focus:outline-none focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/20 text-[10px] sm:text-xs md:text-sm font-mono appearance-none ${
											errorField === "inquiryType"
												? "border-red-500/50"
												: "border-white/10"
										}`}
										required
									>
										<option value="" disabled>
											CHOOSE INQUIRY TYPE...
										</option>
										<option value="marketplace">MARKETPLACE SUPPORT</option>
										<option value="escrow">ESCROW DISPUTE</option>
										<option value="technical">TECHNICAL ASSISTANCE</option>
										<option value="general">GENERAL INQUIRIES</option>
										<option value="feedback">FEEDBACK & SUGGESTIONS</option>
									</select>
									<ChevronDown
										className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
										size={16}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="message"
									className="block text-slate-400 text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.3em] ml-1"
								>
									Message
								</label>
								<textarea
									key={
										errorField === "message"
											? `shake-${shakeTick}`
											: "msg-normal"
									}
									id="message"
									name="message"
									value={formData.message}
									disabled={isSubmitting}
									onChange={handleInputChange}
									className={`w-full h-40 bg-black rounded-xl px-4 py-4 border text-slate-200 focus:outline-none focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/20 text-[10px] sm:text-xs md:text-sm font-mono leading-relaxed placeholder:text-slate-700 resize-none ${
										errorField === "message"
											? "border-red-500/50 animate-shake"
											: "border-white/10"
									}`}
									placeholder="Type your message details here..."
									required
								/>
							</div>

							<fieldset className="p-4 bg-black rounded-xl border border-white/5 space-y-3">
								<legend className="px-1 text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.25em] text-fuchsia-500/80">
									Preferred Contact Method
								</legend>
								<div className="flex flex-col sm:flex-row gap-6">
									<label className="cursor-pointer flex items-center gap-2.5 group font-mono text-[10px] sm:text-xs text-slate-400 select-none">
										<input
											type="radio"
											name="contactPreference"
											value="Email"
											checked={formData.contactPreference === "Email"}
											onChange={handleInputChange}
											className="w-3.5 h-3.5 accent-fuchsia-500"
											disabled={isSubmitting}
										/>
										<span className="uppercase tracking-widest group-hover:text-slate-200 transition-colors">
											Email
										</span>
									</label>

									<label className="cursor-pointer flex items-center gap-2.5 group font-mono text-[10px] sm:text-xs text-slate-400 select-none">
										<input
											type="radio"
											name="contactPreference"
											value="WhatsApp"
											checked={formData.contactPreference === "WhatsApp"}
											onChange={handleInputChange}
											className="w-3.5 h-3.5 accent-fuchsia-500"
											disabled={isSubmitting}
										/>
										<span className="uppercase tracking-widest group-hover:text-slate-200 transition-colors">
											WhatsApp
										</span>
									</label>
								</div>
							</fieldset>

							<CyberActionButton
								label={isSubmitting ? "SENDING..." : "SEND MESSAGE"}
								className="w-full text-xs sm:text-sm md:text-base"
								disabled={isSubmitting}
								type="submit"
							/>
						</form>
					</section>
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
}
