import React from "react";
import {
	Mail,
	Phone,
	MapPin,
	Send,
	MessageSquare,
	ChevronDown,
} from "lucide-react";
import AuthInput from "../../components/ui/AuthInput";
import PurpleGradientButton from "../../components/ui/PurpleGradientButton";

export default function ContactUs() {
	return (
		<div className="min-h-screen bg-slate-50 py-12 px-4 font-inter text-slate-900">
			{/* Hero Section */}
			<header className="w-full px-6 md:px-12 py-8">
				<h1 className="text-purple-600 sm:text-xl md:text-2xl lg:text-4xl font-black uppercase tracking-tighter">
					Contact Us
				</h1>
				<p className="mt-4 text-sm md:text-base lg:text-lg font-bold text-slate-500 uppercase tracking-widest">
					TechTrade SA Support & Inquiry Hub
				</p>
			</header>

			<main className="max-w-[1200px] mx-auto py-12 px-4 md:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
					{/* Left Column: Contact Intelligence */}
					<div className="lg:col-span-5 space-y-8">
						<div>
							<h2
								className="text-sm md:text-base lg:text-lg
 font-black uppercase italic border-l-4 border-purple-600 pl-4 mb-6"
							>
								Contact Information
							</h2>
							<p
								className="text-slate-600 text-base lg:text-lg
 leading-relaxed"
							>
								Our Managed Trust & Negotiation Hub is standing by to assist
								with your hardware transactions and technical inquiries.
							</p>
						</div>

						<div className="space-y-4">
							{[
								{
									icon: <Mail className="text-purple-600" />,
									label: "Email Our Team",
									value: "support@techtradesa.co.za",
								},
								{
									icon: <Phone className="text-purple-600" />,
									label: "Call Us Directly",
									value: "+27 (0) 62 821 2494",
								},
								{
									icon: <MapPin className="text-purple-600" />,
									label: "Our Head Office",
									value: "Roodepoort, Johannesburg, ZA",
								},
							].map((item, i) => (
								<div
									key={i}
									className="flex items-center gap-4 p-4 bg-white rounded-xl border border-purple-100 shadow-sm transition-all hover:border-purple-400"
								>
									<div className="p-3 bg-purple-50 rounded-lg shrink-0">
										{item.icon}
									</div>
									<div>
										<p className="text-base font-black uppercase text-purple-600 tracking-tighter">
											{item.label}
										</p>
										<p className="text-lg font-bold text-slate-800">
											{item.value}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Status Indicator Card */}
						<div className="p-6 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 text-white rounded-2xl shadow-xl shadow-purple-500/20 relative overflow-hidden">
							<div className="relative z-10">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
									<span className="text-xs md:text-base lg:text-xl font-black tracking-widest uppercase">
										Admin Nuke Suite: Online
									</span>
								</div>
								<p className="text-base font-medium">
									Typical response time:{" "}
									<span className="text-white font-bold">
										Response within 24 hours
									</span>
								</p>
							</div>
							<MessageSquare className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
						</div>
					</div>

					{/* Right Column: Transmission Form */}
					<div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-2xl relative">
						<div className="absolute top-0 right-10 w-20 h-1 bg-purple-600" />

						<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="form-control w-full">
									<AuthInput
										label="First Name"
										name="firstName"
										type="text"
										placeholder="Brandan-Lee"
										required
									/>
								</div>
								<div className="form-control w-full">
									<AuthInput
										label="Last Name"
										name="text"
										type="text"
										placeholder="Sherbrooke"
										required
									/>
								</div>
							</div>

							<div className="form-control w-full">
								<label className="text-violet-600 text-base font-black uppercase tracking-widest ml-1">
									Subject
								</label>
								<div className="relative">
									<select
										name="province"
										className="w-full h-12 bg-slate-100 rounded-xl px-4 border transition-all text-gray-500 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm appearance-none px-4"
										required
									>
										<option disabled selected>
											Select Inquiry Type
										</option>
										<option>Marketplace Support</option>
										<option>Escrow Dispute</option>
										<option>Hardware Intelligence</option>
										<option>General Inquiries</option>
									</select>
									<ChevronDown
										className="absolute right-4 top-3.5 text-slate-500 pointer-events-none"
										size={18}
									/>
								</div>
							</div>

							<div className="form-control w-full">
								<label className="text-violet-600 text-base font-black uppercase tracking-[0.2em] ml-1">
									Message
								</label>
								<textarea
									className="w-full h-48 bg-slate-100 rounded-xl px-4 py-4 border transition-all text-gray-900 pr-12 focus:outline-none focus:ring-2 ring-pink-500 text-sm leading-relaxed rounded-[2rem] shadow-inner placeholder:text-gray-500"
									placeholder="Enter your message here..."
								/>
							</div>

							

							{/* Communication Preference - Added for TechTrade SA */}
							<div className="form-control w-full p-4 bg-slate-50 rounded-2xl border border-slate-100">
								<label className="text-violet-600 text-sm font-black uppercase tracking-[0.2em] ml-1">
                                    Preferred Contact Method
								</label>
								<div className="flex flex-col sm:flex-row gap-6 mt-2">
									{/* Email Option */}
									<label className="label cursor-pointer flex items-center gap-3">
										<input
											type="radio"
											name="contact_pref"
											className="w-4 h-4 accent-pink-600"
											defaultChecked
										/>
										<span className="text-violet-600 text-base font-black tracking-[0.2em] ml-1">
											Email
										</span>
									</label>

									{/* WhatsApp Option */}
									<label className="label cursor-pointer flex items-center gap-3">
										<input
											type="radio"
											name="contact_pref"
											className="w-4 h-4 accent-pink-600"
										/>
										<span className="text-base lg:text-l font-bold text-violet-600 capitalize">
											WhatsApp (Phone)
										</span>
									</label>
								</div>
							</div>

                            <PurpleGradientButton label="SEND MESSAGE" />
						</form>
					</div>
				</div>
			</main>
		</div>
	);
}
