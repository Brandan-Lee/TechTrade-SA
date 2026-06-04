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
import CyberActionButton from "../../ui/CyberActionButton";

const TOSModal = ({ isOpen, onClose }) => {
	const lastUpdated = "13 May 2026";
	const docVersion = "1.0";

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Terms Of Service"
			icon={<ShieldCheck className="w-4 h-4 text-fuchsia-400" />}
			footerText={`v${docVersion} | Last Updated: ${lastUpdated}`}
			centerContent={false}
		>
			<div className="flex flex-col gap-10 sm:gap-14 py-4 max-w-2xl mx-auto px-1 select-none font-mono selection:bg-fuchsia-500/30 text-xs sm:text-sm md:text-base lg:text-lg">
				<div className="relative overflow-hidden bg-[#0d0915] border-l-2 border-fuchsia-500 p-4 sm:p-5 rounded-r-lg shadow-md shadow-black/40">
					<p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed relative z-10 font-medium">
						These terms are legally binding and rule how you use
						<span className="font-black text-fuchsia-400 ml-1.5 tracking-wider">
							TECHTRADE SA
						</span>
						. By using this platform, you agree to follow all safety measures
						and guidelines.
					</p>
					<div
						className="absolute top-[-20%] right-[-5%] opacity-[0.02] pointer-events-none"
						aria-hidden="true"
					>
						<ShieldCheck size={140} className="text-purple-500" />
					</div>
				</div>

				<ProtocolSection
					title="The Escrow Process"
					icon={<ShieldCheck className="text-fuchsia-400" size={16} />}
				>
					<div className="space-y-5">
						<p className="text-slate-300 leading-relaxed text-[10px] sm:text-xs md:text-sm font-medium">
							When a trade begins, the buyer's money and the seller's item enter
							a
							<span className="mx-1.5 px-2 py-0.5 bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-[9px] sm:text-xs font-black rounded uppercase tracking-widest">
								Held State
							</span>
							within our secure system. This ensures neither side can back out
							without platform approval or help resolving a conflict.
						</p>

						<div className="bg-[#0c0915] rounded-lg p-4 sm:p-5 border border-purple-500/20 shadow-md">
							<h1 className="font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] text-purple-400 mb-4 flex items-center gap-2">
								<Clock size={12} className="text-purple-400 animate-pulse" />{" "}
								Conditions For Release
							</h1>
							<ol className="grid grid-cols-1 gap-4 sm:gap-5 list-none">
								{[
									{
										id: "01",
										t: "Buyer Confirmation",
										d: "After checking the item, the buyer must confirm they received it within 24 hours to hand over the funds.",
									},
									{
										id: "02",
										t: "Seller Protection",
										d: "Funds are sent automatically if the review window ends without any active complaints.",
									},
									{
										id: "03",
										t: "Conflict Resolution",
										d: "Support team reviews all messages and sent photo proof to settle any issues.",
									},
									{
										id: "04",
										t: "Mutual Cancellation",
										d: "Full refund goes to the buyer and the item listing resets when both agree to cancel.",
									},
								].map((item) => (
									<li key={item.id} className="flex gap-3.5 group items-start">
										<span className="text-fuchsia-500/50 font-black text-xs sm:text-sm group-hover:text-fuchsia-400 transition-colors leading-none pt-0.5">
											{item.id}
										</span>
										<div className="min-w-0">
											<p className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-0.5">
												{item.t}
											</p>
											<p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed font-medium">
												{item.d}
											</p>
										</div>
									</li>
								))}
							</ol>
						</div>

						<div
							className="flex items-center gap-3 px-1 py-2"
							aria-hidden="true"
						>
							<div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
							<p className="text-[8px] sm:text-[10px] text-slate-600 font-bold uppercase tracking-[0.25em]">
								Secure Ledger Activity
							</p>
							<div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
						</div>
					</div>
				</ProtocolSection>

				<ProtocolSection
					title="The WhatsApp Chat Window"
					icon={<MessageSquare className="text-fuchsia-400" size={16} />}
				>
					<div className="space-y-6">
						<GradientHighlightBox
							title="24-HOUR PRIVACY WINDOW"
							icon={<MessageSquare size={14} />}
						>
							Once a trade is confirmed, a temporary secure WhatsApp chat is
							created. This chat lasts for exactly 24 hours. After time runs
							out, the link stops working and all contact info is permanently
							erased from the active database.
						</GradientHighlightBox>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 px-1">
							{[
								{
									t: "Automatic Activation",
									d: "Starts right away when a trade is approved.",
								},
								{
									t: "Private Channel",
									d: "Sent through safe lines to hide private phone numbers.",
								},
								{
									t: "Countdown Timer",
									d: "Live clock visible to both users.",
								},
								{
									t: "Zero Data Retention",
									d: "Only basic trade history is saved to handle any future issues.",
								},
							].map((item, i) => (
								<div
									key={i}
									className="relative pl-3.5 border-l border-purple-500/20 hover:border-fuchsia-500/50 transition-colors"
								>
									<p className="font-black text-xs sm:text-sm text-fuchsia-400 uppercase mb-1 tracking-wider">
										{item.t}
									</p>
									<p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed font-medium">
										{item.d}
									</p>
								</div>
							))}
						</div>
					</div>
				</ProtocolSection>

				<ProtocolSection
					title="Account Rules and Ban System"
					icon={<AlertTriangle className="text-amber-400" size={16} />}
				>
					<div className="space-y-5">
						<p className="text-slate-300 leading-relaxed text-[10px] sm:text-xs md:text-sm font-medium">
							TechTrade enforces a
							<span className="font-black text-red-400 mx-1.5 underline decoration-red-500/40 underline-offset-4 tracking-wide uppercase">
								Strict Penalty System
							</span>
							tied directly to user devices to protect our marketplace
							community.
						</p>

						<div className="flex flex-col gap-3">
							<StrikeCard
								title="Strike 1: Warning"
								description="Small mistakes like late shipping or ignoring messages. Account profile flagged."
								variant="warning"
								icon={<AlertCircle />}
							/>
							<StrikeCard
								title="Strike 2: Suspension"
								description="Lying about item details or getting multiple complaints. 30-day lockout from your account."
								variant="danger"
								icon={<ShieldAlert />}
							/>
							<StrikeCard
								title="Strike 3: Device Ban"
								description="Proven scams or trying to bypass our payment system. Your specific phone or computer is permanently blocked from the network."
								variant="critical"
								icon={<UserX />}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
							<div className="flex items-start gap-3 p-4 bg-[#0c0915] border border-purple-500/20 rounded-lg shadow-sm">
								<div
									className="w-6 h-6 rounded bg-purple-950/30 border border-purple-500/30 flex justify-center items-center shrink-0 text-fuchsia-400"
									aria-hidden="true"
								>
									<ShieldCheck size={14} />
								</div>
								<div className="min-w-0">
									<span className="font-black text-xs text-white block mb-0.5 uppercase tracking-wider">
										Hardware Review
									</span>
									<p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed font-medium">
										Valuable items{" "}
										<span className="text-fuchsia-400 font-bold font-mono">
											Over R5,000
										</span>{" "}
										must pass hardware inspection checks.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 p-4 bg-[#0c0915] border border-purple-500/20 rounded-lg shadow-sm">
								<div
									className="w-6 h-6 rounded bg-amber-950/30 border border-amber-500/30 flex justify-center items-center shrink-0 text-amber-400"
									aria-hidden="true"
								>
									<AlertTriangle size={14} />
								</div>
								<div className="min-w-0">
									<span className="font-black text-xs text-white block mb-0.5 uppercase tracking-wider">
										Scam Review
									</span>
									<p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed font-medium">
										Confirmed rule violations lead to quick decisions and
										instant account penalties.
									</p>
								</div>
							</div>
						</div>
					</div>
				</ProtocolSection>

				<ProtocolSection
					title="Item Testing"
					icon={<CircleCheck className="text-emerald-400" size={16} />}
				>
					<div className="space-y-5">
						<div className="bg-[#0a1410] border border-emerald-500/20 rounded-lg p-3.5 shadow-inner">
							<p className="text-slate-300 text-[10px] sm:text-xs md:text-sm leading-relaxed font-medium">
								We run automatic checks to give you details about items, but
								this is only meant to assist you, not replace your own careful
								inspections.
							</p>
						</div>

						<div className="space-y-4">
							<h1 className="font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] text-purple-400 px-1">
								User Responsibility Guidelines
							</h1>
							<ul className="space-y-3.5 list-none">
								{[
									{
										t: "In-Person Checks",
										d: "Buyers must carefully check items during meetups and within the first 48 hours after receiving them.",
									},
									{
										t: "High-Value Verification",
										d: "For expensive items over R5,000, running live hardware diagnostic tests during the trade is highly recommended.",
									},
									{
										t: "Review Window",
										d: "Users have exactly 48 hours after a trade to open a support ticket if they have proof of an issue.",
									},
									{
										t: "Platform Limits",
										d: "TechTrade cannot guarantee how well or how long an item will work after our initial checkout tests.",
									},
								].map((item, i) => (
									<li key={i} className="flex items-start gap-3 group">
										<div
											className="h-4 w-4 rounded border border-purple-500/30 bg-purple-950/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-fuchsia-400 transition-colors"
											aria-hidden="true"
										>
											<div className="h-1.5 w-1.5 bg-purple-500 group-hover:bg-fuchsia-400 rounded-sm transition-colors"></div>
										</div>
										<p className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
											<span className="font-black text-white uppercase tracking-wider mr-1.5">
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

				<div className="mt-4 pt-6 border-t border-purple-500/10">
					<div className="max-w-md mx-auto text-center space-y-6">
						<p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed font-medium tracking-wide italic px-4">
							"The final check of all items is up to the users; TechTrade SA
							helps match buyers and sellers but does not guarantee trades."
						</p>
					</div>
				</div>
			</div>
		</BaseModal>
	);
};

export default TOSModal;
