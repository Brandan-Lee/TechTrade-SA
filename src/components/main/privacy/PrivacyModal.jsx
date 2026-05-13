import React from "react";
import BaseModal from "../../ui/BaseModal";
import { ProtocolSection } from "../tos/ProtocolSection";
import { AlertCircle, Cookie, Lock, Scale, ShieldCheck, Zap } from "lucide-react";
import DataCard from "./DataCard";

const PrivacyModal = ({ isOpen, onClose }) => {
	const lastUpdated = "13 May 2026";
	const docVersion = "1.0";

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Data Integrity and Privacy"
			icon={<ShieldCheck className="w-5 h-5 text-white" />}
			footerText={`v${docVersion} | ${lastUpdated}`}
			centerContent={false}
		>
			{/* Cookie Registry Section */}
			<ProtocolSection
				title="Cookie Registry"
				icon={<Cookie className="text-violet-600" size={24} />}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<DataCard
						label="Essential"
						title="Necessary Cookies: System Critical"
						badge="Always On"
						type="badge"
						gradient="bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800"
						description="These cookies power the Transactional State Machine and maintain secure user sessions. They enable core marketplace functions including escrow operations"
					/>
					<DataCard
						label="Optimization"
						title="Analytics and Performance Tracking"
						type="toggle"
						gradient="bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800"
						description="These cookies help us improve the Build Doctor algorithms and marketplace intelligence by collecting anonymized usage patterns"
					/>
				</div>
			</ProtocolSection>

			{/* Encryption Engine Section */}
			<ProtocolSection
				title="The Encryption Engine"
				icon={<Lock className="text-violet-600" size={24} />}
			>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="p-4 bg-emerald-500 text-white rounded-lg">
						<h4 className="font-bold text-sm mb-2">AES-256 Encryption</h4>
						<p className="text-xs leading-5">
							All personal data and Build Doctor profiles are encrypted using
							military-grade AES-256 standards
						</p>
					</div>

					<div className="p-4 bg-blue-500 text-white rounded-lg">
						<h4 className="font-bold text-sm mb-2">TLS 1.3 Protocol</h4>
						<p className="text-xs leading-5">
							Data in transit is secured with perfect forward secrecy, ensuring
							intercepted data cannot be decrypted.
						</p>
					</div>

					<div className="p-4 bg-gradient-to-r from-violet-800 to-purple-600 text-white rounded-lg">
						<h4 className="font-bold text-sm mb-2">WhatsApp TTL Bridge</h4>
						<p className="text-xs leading-5">
							Phone numbers and relay metadata are purged from our systems
							immediately after the 24-hour timer.
						</p>
					</div>
				</div>
			</ProtocolSection>

			{/* Data Usage Section */}
			<ProtocolSection
				title="Data Usage Policy"
				icon={<Scale className="text-violet-600" size={24} />}
			>
				<div className="space-y-6">
					<div className="flex-gap-3">
						<ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />

						<div>
							<p className="text-slate-800 text-sm font-bold">
								We do not sell your data
							</p>
							<p className="text-slate-500 text-sm">
								TechTrade SA operates on a transaction fee model. Your info is
								never shared with third-party advertisers.
							</p>
						</div>
					</div>

					<div className="flex-gap-3">
						<Zap className="w-5 h-5 text-emerald-500 shrink-0" />

						<div>
							<p className="text-slate-800 text-sm font-bold">
								Hardware specs train our Intelligence Layer
							</p>
							<p className="text-slate-500 text-sm">
								GPU models and architectures improve Build Doctor compatibility
								without linking to your identity
							</p>
						</div>
					</div>
				</div>
			</ProtocolSection>

			<ProtocolSection
				title="Your Data Rights (GDPR/POPIA)"
				icon={<AlertCircle className="text-violet-600" size={24} />}
			>
				<p className="text-slate-600 text-sm">
					Under GDPR and POPIA, you have the following enforceable rights:
				</p>

				<ul className="list-disc list-inside text-slate-600 text-sm space-y-2 ml-2">
					<li>
						<strong>Right to Access:</strong> Request a copy of all personal
						data held about you.
					</li>
					<li>
						<strong>Right to Erasure:</strong> Request complete account deletion
						(subject to tax law)
					</li>
					<li>
						<strong>Right to Portability:</strong> Export your data in
						machine-readable JSON/CSV.
					</li>
				</ul>

				<div className="mt-4 p-4 bg-slate-100 rounded border border-slate-200">
					<p className="text-slate-500 text-[10px] font-bold uppercase mb-1">
						Data Retention Note:
					</p>
					<p className="text-slate-500 text-[11px] leading-4">
						Transaction records are retained for 7 years per SARS regulations
						for tax compliance and fraud prevention.
					</p>
				</div>
			</ProtocolSection>
		</BaseModal>
	);
};

export default PrivacyModal;
