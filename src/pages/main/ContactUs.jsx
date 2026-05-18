import React from "react";
import {
	Mail,
	Phone,
	MapPin,
	MessageSquare,
	ChevronDown,
	Terminal,
} from "lucide-react";
import AuthInput from "../../components/ui/AuthInput";
import CyberActionButton from "../../components/ui/CyberActionButton";

export default function ContactUs() {
	return (
		<div className="min-h-screen bg-[#050505] text-slate-300 py-12 px-4 relative overflow-x-hidden">
			{/* Ambient Background Grid Matrix */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
			<div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

			{/* HEADER METADATA */}
			<header className="w-full max-w-[1200px] mx-auto px-4 md:px-8 mb-12 relative z-10">
				<h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none">
					Contact <span className="text-fuchsia-500">Us</span>
				</h1>
				<p className="mt-2 text-[10px] md:text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
					TechTrade SA Support & Inquiry Hub
				</p>
			</header>

			{/* CONTEXT DASHBOARD */}
			<main className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
					{/* LEFT COLUMN: TELEMETRY INTELLIGENCE */}
					<div className="lg:col-span-5 space-y-6">
						<div className="bg-[#0c0c0e]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
							<h2 className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-fuchsia-400 font-mono mb-4 flex items-center gap-2">
								<span className="w-1.5 h-3 bg-fuchsia-500 inline-block" />
								Core_Nodes
							</h2>
							<p className="text-slate-400 font-mono text-xs md:text-sm leading-relaxed uppercase">
								Our Managed Trust & Negotiation Hub is standing by to assist
								with your hardware transactions and technical inquiries.
							</p>
						</div>

						{/* Tactical Informational Rows */}
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
								<div
									key={i}
									className="flex items-center gap-4 p-4 bg-[#0c0c0e]/90 rounded-xl border border-white/10 hover:border-fuchsia-500/30 transition-all group font-mono"
								>
									<div className="p-3 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-lg text-fuchsia-400 group-hover:bg-fuchsia-500/10 transition-colors shrink-0">
										{item.icon}
									</div>
									<div className="min-w-0">
										<p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
											{item.label}
										</p>
										<p className="text-xs md:text-sm font-bold text-slate-200 truncate">
											{item.value}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Status System Plate */}
						<div className="p-5 bg-gradient-to-r from-purple-950/40 via-fuchsia-950/20 to-purple-950/40 border border-fuchsia-500/20 text-white rounded-xl relative overflow-hidden">
							<div className="relative z-10 font-mono">
								<div className="flex items-center gap-2 mb-1.5">
									<div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
									<span className="text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase">
										ADMIN NUKE SUITE ONLINE
									</span>
								</div>
								<p className="text-slate-400 text-[11px] uppercase tracking-wide">
									Response {" "}
									<span className="text-white font-bold">within 24h</span>
								</p>
							</div>
							<MessageSquare className="absolute -right-4 -bottom-4 w-20 h-20 text-fuchsia-500/[0.03] rotate-12 pointer-events-none" />
						</div>
					</div>

					{/* RIGHT COLUMN: SECURE TRANSMISSION PACKET */}
					<div className="lg:col-span-7 bg-[#0c0c0e]/90 border border-white/10 p-6 md:p-8 rounded-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
						{/* Interactive Design Accent Tab */}
						<div className="absolute top-0 right-8 w-16 h-[2px] bg-fuchsia-500 shadow-[0_0_10px_#d946ef]" />

						<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<AuthInput
									label="First Name"
									name="firstName"
									type="text"
									placeholder="BRANDAN-LEE"
									required
								/>
								<AuthInput
									label="Last Name"
									name="lastName" // Fixed: case assignment from 'name="text"'
									type="text"
									placeholder="SHERBROOKE"
									required
								/>
							</div>

							{/* Dropdown Menu Track */}
							<div className="space-y-2">
								<label className="block text-slate-400 text-[10px] font-mono font-black uppercase tracking-[0.3em] ml-1">
									Select Inquiry Type
								</label>
								<div className="relative">
									<select
										name="inquiry_type"
										className="w-full h-12 md:h-14 bg-black rounded-xl px-4 border border-white/10 text-slate-400 focus:text-slate-200 transition-all focus:outline-none focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/20 text-xs md:text-sm font-mono appearance-none"
										required
										defaultValue=""
									>
										<option value="" disabled>
											CHOOSE INQUIRY TYPE...
										</option>
										<option value="marketplace">MARKETPLACE SUPPORT</option>
										<option value="escrow">ESCROW DISPUTE</option>
										<option value="intel">HARDWARE INTELLIGENCE</option>
										<option value="general">GENERAL INQUIRIES</option>
										<option value="general">FEATURE RECOMMENDATION</option>
									</select>
									<ChevronDown
										className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
										size={16}
									/>
								</div>
							</div>

							{/* Deep Terminal Area Block */}
							<div className="space-y-2">
								<label className="block text-slate-400 text-[10px] font-mono font-black uppercase tracking-[0.3em] ml-1">
									Message
								</label>
								<textarea
									className="w-full h-40 bg-black rounded-xl px-4 py-4 border border-white/10 text-slate-200 focus:outline-none focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/20 text-xs md:text-sm font-mono leading-relaxed placeholder:text-slate-800"
									placeholder="WRITE PACKET INSTRUCTIONS HERE..."
									required
								/>
							</div>

							{/* Radio Toggles */}
							<div className="p-4 bg-black rounded-xl border border-white/5 space-y-3">
								<label className="block text-[10px] font-mono font-black uppercase tracking-[0.25em] text-fuchsia-500/80">
									Choose your preferred contact method
								</label>
								<div className="flex flex-col sm:flex-row gap-6">
									<label className="cursor-pointer flex items-center gap-2.5 group font-mono text-xs text-slate-400 select-none">
										<input
											type="radio"
											name="contact_pref"
											className="w-3.5 h-3.5 accent-fuchsia-500"
											defaultChecked
										/>
										<span className="uppercase tracking-widest group-hover:text-slate-200 transition-colors">
											Email
										</span>
									</label>

									<label className="cursor-pointer flex items-center gap-2.5 group font-mono text-xs text-slate-400 select-none">
										<input
											type="radio"
											name="contact_pref"
											className="w-3.5 h-3.5 accent-fuchsia-500"
										/>
										<span className="uppercase tracking-widest group-hover:text-slate-200 transition-colors">
											WhatsApp
										</span>
									</label>
								</div>
							</div>

							<CyberActionButton label="SEND MESSAGE" className="w-full" />
						</form>
					</div>
				</div>
			</main>
		</div>
	);
}
