import React from "react";
import BaseModal from "../../ui/BaseModal";
import { ProtocolSection } from "../tos/ProtocolSection";
import { AlertCircle, Lock, Scale, ShieldCheck, Zap } from "lucide-react";

const PrivacyModal = ({ isOpen, onClose }) => {
	const lastUpdated = "13 May 2026";
	const docVersion = "1.0";

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Privacy and Data Security"
			icon={<ShieldCheck className="w-4 h-4 text-fuchsia-400" />}
			footerText={`Version ${docVersion} | Updated: ${lastUpdated}`}
			centerContent={false}
		>
			<div className="flex flex-col gap-10 py-4 max-w-2xl mx-auto px-1 select-none selection:bg-fuchsia-500/30">
				{/* Security Measures Section */}
				<ProtocolSection
					title="How We Protect Your Data"
					icon={<Lock className="text-fuchsia-400" size={16} />}
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
						{/* Data Encryption */}
						<div className="p-4 sm:p-5 bg-[#0c0915] border border-emerald-500/20 rounded-lg shadow-md flex flex-col transition-all hover:border-emerald-500/40 group">
							<h4 className="font-black text-xs sm:text-sm text-emerald-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
								Advanced Encryption
							</h4>
							<p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
								All your profile information and saved files are scrambled using
								high-level security standards, making them unreadable to anyone
								else.
							</p>
						</div>

						{/* Connection Security */}
						<div className="p-4 sm:p-5 bg-[#0c0915] border border-blue-500/20 rounded-lg shadow-md flex flex-col transition-all hover:border-blue-500/40 group">
							<h4 className="font-black text-xs sm:text-sm text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
								Secure Connection
							</h4>
							<p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
								Information you send while using our site is protected during
								transit, ensuring your data cannot be intercepted or tampered
								with.
							</p>
						</div>

						{/* Temporary Data Handling */}
						<div className="p-4 sm:p-5 bg-[#0c0915] border border-fuchsia-500/20 rounded-lg shadow-md flex flex-col sm:col-span-2 lg:col-span-1 transition-all hover:border-fuchsia-500/40 group">
							<h4 className="font-black text-xs sm:text-sm text-fuchsia-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
								Automatic Deletion
							</h4>
							<p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
								Temporary connection details and messaging information are
								automatically and permanently deleted every 24 hours.
							</p>
						</div>
					</div>
				</ProtocolSection>

				{/* Data Usage Section */}
				<ProtocolSection
					title="Data Usage Policy"
					icon={<Scale className="text-fuchsia-400" size={16} />}
				>
					<div className="flex flex-col gap-5 mt-2">
						<div className="flex items-start gap-3.5 p-4 bg-[#0c0915] border border-purple-500/10 rounded-lg">
							<div className="w-6 h-6 rounded bg-emerald-950/30 border border-emerald-500/30 flex justify-center items-center shrink-0 text-emerald-400">
								<ShieldCheck size={14} />
							</div>
							<div>
								<h4 className="text-white text-xs sm:text-sm font-black uppercase tracking-wider mb-1">
									No Selling Your Data
								</h4>
								<p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
									We do not sell, rent, or share your profile information with
									outside advertisers or data collectors. We only earn through
									transaction fees.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3.5 p-4 bg-[#0c0915] border border-purple-500/10 rounded-lg">
							<div className="w-6 h-6 rounded bg-fuchsia-950/30 border border-fuchsia-500/30 flex justify-center items-center shrink-0 text-fuchsia-400">
								<Zap size={14} />
							</div>
							<div>
								<h4 className="text-white text-xs sm:text-sm font-black uppercase tracking-wider mb-1">
									Improving Your Experience
								</h4>
								<p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
									We use anonymous hardware information to help our system
									understand and improve compatibility. This information is
									never linked to your personal identity.
								</p>
							</div>
						</div>
					</div>
				</ProtocolSection>

				{/* Rights Section */}
				<ProtocolSection
					title="Your Data Rights"
					icon={<AlertCircle className="text-fuchsia-400" size={16} />}
				>
					<div className="space-y-4 mt-1">
						<p className="text-slate-300 text-[11px] sm:text-xs md:text-sm font-medium leading-relaxed">
							Under privacy laws (GDPR/POPIA), you have the right to control
							your information:
						</p>

						<ul className="grid grid-cols-1 gap-3.5 list-none pl-0">
							{[
								{
									label: "Access",
									text: "Ask for a copy of the personal information we have about you.",
								},
								{
									label: "Deletion",
									text: "Request the permanent removal of your account and data (except for required tax records).",
								},
								{
									label: "Portability",
									text: "Take your information with you in an easy-to-use digital format.",
								},
							].map((item, idx) => (
								<li
									key={idx}
									className="flex gap-3 text-slate-400 text-[11px] sm:text-xs md:text-sm items-start"
								>
									<div className="h-4 w-4 rounded border border-purple-500/30 bg-purple-950/30 flex items-center justify-center shrink-0 mt-0.5">
										<div className="h-1.5 w-1.5 bg-purple-500 rounded-sm" />
									</div>
									<p className="leading-relaxed font-medium">
										<strong className="text-white font-black uppercase tracking-wider mr-1.5">
											{item.label}:
										</strong>
										{item.text}
									</p>
								</li>
							))}
						</ul>

						<div className="mt-6 p-4 sm:p-5 bg-[#0a0812] border border-purple-500/20 rounded-lg">
							<h4 className="text-purple-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2">
								Financial Records
							</h4>
							<p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed font-medium">
								By law, we must keep financial transaction records for 7 years
								to comply with tax and anti-fraud regulations.
							</p>
						</div>
					</div>
				</ProtocolSection>
			</div>
		</BaseModal>
	);
};

export default PrivacyModal;
