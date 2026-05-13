import React from "react";
import BaseModal from "../../ui/BaseModal";
import {
	AlertCircle,
	AlertTriangle,
	CircleCheck,
	MessageSquare,
	ShieldAlert,
	ShieldCheck,
	UserX,
	Clock,
} from "lucide-react";
import { ProtocolSection } from "./ProtocolSection";
import { GradientHighlightBox } from "./GradientHighlightBox";
import { StrikeCard } from "./StrikeCard";
import PurpleGradientButton from "../../ui/PurpleGradientButton";

const TOSModal = ({ isOpen, onClose }) => {
	const lastUpdated = "13 May 2026";
	const docVersion = "1.0";

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Terms Of Service"
			icon={<ShieldCheck className="w-5 h-5 text-white" />}
			footerText={`v${docVersion} | ${lastUpdated}`}
            centerContent={false}
		>
			<div className="flex flex-col gap-16 py-8 max-w-2xl mx-auto px-4">
				{/* Intro/Hero Text */}
				<div className="relative overflow-hidden bg-gradient-to-r from-violet-50 to-white border-l-4 border-violet-600 p-6 rounded-r-2xl shadow-sm">
					<p className="text-violet-900 text-sm leading-relaxed relative z-10">
						These protocols are legally binding and constitute the operational
						framework of
						<span className="font-bold text-violet-700 ml-1">TechTrade SA</span>
						. By using this platform, you agree to comply with all outlined
						systems and procedures.
					</p>
					<div className="absolute top-[-20%] right-[-5%] opacity-10 pointer-events-none">
						<ShieldCheck size={120} className="text-violet-600" />
					</div>
				</div>

				{/* Escrow Section */}
				<ProtocolSection
					title="The Escrow Protocol"
					icon={<ShieldCheck className="text-violet-600" size={24} />}
				>
					<div className="space-y-6">
						<p className="text-slate-600 leading-relaxed text-[15px]">
							When a transaction is initiated, both the buyer's funds and the
							seller's hardware enter a
							<span className="mx-1.5 px-2 py-0.5 bg-violet-600 text-white text-xs font-bold rounded-md uppercase tracking-wider">
								Locked State
							</span>
							within our secure escrow system. This ensures neither party can
							unilaterally withdraw without consensus or mediation.
						</p>

						<div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
							<p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
								<Clock size={14} className="text-violet-400" /> Conditions for
								release
							</p>
							<ul className="grid grid-cols-1 gap-5">
								{[
									{
										id: "01",
										t: "Buyer Confirmation",
										d: "Upon inspection, the buyer must confirm receipt within 24 hours to release funds.",
									},
									{
										id: "02",
										t: "Seller Protection",
										d: "Auto-release occurs if the window expires without a dispute.",
									},
									{
										id: "03",
										t: "Dispute Resolution",
										d: "Command & Control reviews communication logs and photographic evidence during locks.",
									},
									{
										id: "04",
										t: "Mutual Cancellation",
										d: "Full refund to buyer and listing restoration upon mutual agreement.",
									},
								].map((item) => (
									<li key={item.id} className="flex gap-4 group">
										<span className="text-violet-300 font-black text-lg group-hover:text-violet-500 transition-colors leading-none">
											{item.id}
										</span>
										<div>
											<p className="text-sm font-bold text-slate-900 mb-1">
												{item.t}
											</p>
											<p className="text-sm text-slate-500 leading-snug">
												{item.d}
											</p>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="flex items-center gap-2 px-2">
							<div className="h-px flex-1 bg-slate-200"></div>
							<p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight italic">
								Cryptographic Ledger Timestamped
							</p>
							<div className="h-px flex-1 bg-slate-200"></div>
						</div>
					</div>
				</ProtocolSection>

				{/* WhatsApp TTL Bridge */}
				<ProtocolSection
					title="The WhatsApp TTL Bridge"
					icon={<MessageSquare className="text-violet-600" size={24} />}
				>
					<div className="space-y-8">
						<GradientHighlightBox
							title="24-HOUR-TIME-TO-LIVE PRIVACY WINDOW"
							icon={<MessageSquare size={20} />}
						>
							Once a transaction is confirmed, a temporary encrypted WhatsApp
							bridge is established. This channel exists for exactly 24 hours.
							<strong>
								{" "}
								After the TTL expires, the bridge is destroyed
							</strong>{" "}
							and all contact info is permanently removed.
						</GradientHighlightBox>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-2">
							{[
								{
									t: "Automatic Activation",
									d: "Activates immediately upon trading confirmation.",
								},
								{
									t: "Encrypted Channel",
									d: "Routed through secure relays to hide personal numbers.",
								},
								{
									t: "Self-Destruct Timer",
									d: "Live countdown visible to both parties.",
								},
								{
									t: "Zero Data Retention",
									d: "Only basic metadata stored for dispute resolution.",
								},
							].map((item, i) => (
								<div
									key={i}
									className="relative pl-4 border-l-2 border-violet-100 hover:border-violet-500 transition-colors"
								>
									<p className="font-bold text-[11px] text-violet-700 uppercase mb-1.5 tracking-wide">
										{item.t}
									</p>
									<p className="text-xs text-slate-500 leading-relaxed font-medium">
										{item.d}
									</p>
								</div>
							))}
						</div>
					</div>
				</ProtocolSection>

				{/* Integrity System */}
				<ProtocolSection
					title="Integrity and Ban System"
					icon={<AlertTriangle className="text-amber-500" size={24} />}
				>
					<div className="space-y-8">
						<p className="text-slate-600 leading-relaxed text-[15px]">
							TechTrade operates a{" "}
							<span className="font-extrabold text-pink-600 border-b-2 border-pink-200 pb-0.5">
								Zero-Tolerance Strike System
							</span>{" "}
							enforced through hardware-level identification (HWID) to maintain
							marketplace integrity.
						</p>

						<div className="flex flex-col gap-4">
							<StrikeCard
								title="Strike 1: Warning"
								description="Minor infractions like late shipments or unresponsive communication. Account flagged for review."
								variant="warning"
								icon={<AlertCircle />}
							/>
							<StrikeCard
								title="Strike 2: Temporary Suspension"
								description="Misrepresented component condition or repeated complaints. 30-day suspension."
								variant="danger"
								icon={<ShieldAlert />}
							/>
							<StrikeCard
								title="Strike 3: Permanent HWID Ban"
								description="Confirmed fraud or escrow manipulation. Permanent device-level ban from the Command and Control Center."
								variant="critical"
								icon={<UserX />}
							/>
						</div>

						<div className="grid grid-cols-1 gap-4">
							<div className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
								<div className="p-2 bg-violet-50 rounded-lg shrink-0">
									<ShieldCheck className="text-violet-600" size={20} />
								</div>
								<p className="text-[13px] text-slate-600 leading-snug">
									<span className="font-bold text-slate-900 block mb-1">
										Build-Doctor Integration
									</span>
									High-value transactions{" "}
									<span className="text-violet-700 font-bold px-1 bg-violet-50 rounded">
										Over R5,000
									</span>{" "}
									require a mandatory hardware verification scan.
								</p>
							</div>
							<div className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
								<div className="p-2 bg-amber-50 rounded-lg shrink-0">
									<AlertTriangle className="text-amber-500" size={20} />
								</div>
								<p className="text-[13px] text-slate-600 leading-snug">
									<span className="font-bold text-slate-900 block mb-1">
										Fraud Reporting
									</span>
									Verified reports result in immediate investigation and
									potential strikes.
								</p>
							</div>
						</div>
					</div>
				</ProtocolSection>

				{/* Hardware Verification */}
				<ProtocolSection
					title="Hardware Verification"
					icon={<CircleCheck className="text-emerald-500" size={24} />}
				>
					<div className="space-y-8">
						<div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
							<p className="text-slate-700 text-sm leading-relaxed">
								We provide{" "}
								<span className="font-bold italic text-emerald-700">
									Hardware Intelligence
								</span>{" "}
								data for every listing, but this is designed to assist, not
								replace, buyer due diligence.
							</p>
						</div>

						<div className="space-y-6">
							<p className="font-black text-[10px] uppercase tracking-[0.25em] text-slate-400 px-1">
								User Responsibility Matrix
							</p>
							<ul className="space-y-5">
								{[
									{
										t: "Physical Inspection",
										d: "Buyers must inspect hardware during the 24-hour window and 48 hours post-receipt.",
									},
									{
										t: "Build Doctor Validation",
										d: "For items Over R5,000, use real-time scans during meetup.",
									},
									{
										t: "Dispute Window",
										d: "You have 48 hours post-transaction to file a dispute with evidence.",
									},
									{
										t: "Platform Limitations",
										d: "We cannot guarantee performance beyond provided automated data.",
									},
								].map((item, i) => (
									<li key={i} className="flex items-start gap-4 group">
										<div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-violet-600 transition-colors">
											<div className="h-1.5 w-1.5 rounded-full bg-violet-600 group-hover:bg-white"></div>
										</div>
										<p className="text-sm text-slate-600">
											<span className="font-bold text-slate-900 mr-2">
												{item.t}:
											</span>
											{item.d}
										</p>
									</li>
								))}
							</ul>
						</div>
					</div>
				</ProtocolSection>

				{/* Legal Footer Section */}
				<div className="mt-8 pt-10 border-t-2 border-slate-100">
					<div className="max-w-md mx-auto text-center space-y-8">
						<p className="text-slate-500 text-[13px] font-medium leading-relaxed italic px-4">
							"Final hardware verification is your responsibility; TechTrade SA
							serves as a facilitator, not a guarantor."
						</p>

						<div className="space-y-6">
							<PurpleGradientButton
								label="CLOSE TERMS AND CONDITIONS"
								onClick={onClose}
							/>

							<div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
								<span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
									v{docVersion}
								</span>
								<div className="h-1 w-1 rounded-full bg-slate-300"></div>
								<span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
									Released: {lastUpdated}
								</span>
								<div className="h-1 w-1 rounded-full bg-slate-300"></div>
								<span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-violet-400">
									TECHTRADE-01-SECURE
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</BaseModal>
	);
};

export default TOSModal;
