import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ChevronRight,
	Clock,
	Eye,
	Info,
	MapPin,
	ShieldCheck,
	Star,
	Terminal,
	Cpu,
	Coins,
	AlertTriangle,
} from "lucide-react";
import CyberActionButton from "../../components/ui/CyberActionButton";
import AuthInput from "../../components/ui/AuthInput";
import AlternateButton from "../../components/ui/AlternateButton";
import ActiveListingCard from "../../components/main/profile/ActiveListingCard";

export default function ViewListing() {
	const [offerValue, setOfferValue] = useState("");
	const [description, setDescription] = useState("");
	const [activeImg, setActiveImg] = useState(0);
	const navigate = useNavigate();

	const productImages = [
		"https://placehold.co/600x600/1e1b4b/38bdf8?text=MAIN_VIEW_01",
		"https://placehold.co/600x600/311042/f43f5e?text=FRONT_ANGLE_02",
		"https://placehold.co/600x600/1e1b4b/38bdf8?text=REAR_PORTS_03",
		"https://placehold.co/600x600/311042/f43f5e?text=PROFILE_04",
		"https://placehold.co/600x600/1e1b4b/38bdf8?text=PACKAGING_05",
		"https://placehold.co/600x600/311042/f43f5e?text=SERIAL_DATA_06",
	];

	const specs = [
		{ label: "Brand", value: "NVIDIA" },
		{ label: "Model", value: "GeForce RTX 3080 Ti FE" },
		{ label: "Memory", value: "12GB GDDR6X" },
		{ label: "Core Clock", value: "1665 MHz" },
		{ label: "Boost Clock", value: "1770 MHz" },
		{ label: "Interface", value: "PCIe 4.0 x16" },
		{ label: "Power Connectors", value: "2x 8-pin" },
		{ label: "TDP", value: "350W" },
		{ label: "Outputs", value: "3x DP 1.4a, 1x HDMI 2.1" },
		{ label: "Warranty", value: "None (Private Uplink)" },
	];

	const handleViewListing = (e) => {
		e.stopPropagation();
		navigate(`/view-listing`);
	};

	const handleViewProfile = (e) => {
		e.stopPropagation();
		navigate(`/profile`);
	};

	const handleReport = (e) => {
		e.stopPropagation();
		navigate(`/listing-report`);
	};

	return (
		<div className="min-h-screen bg-[#050506] text-slate-300 pb-20 font-mono selection:bg-fuchsia-500/30 selection:text-white relative">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808002_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

			<main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
				<div className="lg:col-span-7 flex flex-col gap-6 min-w-0">
					<section
						aria-label="Product Media Gallery"
						className="flex flex-col gap-3"
					>
						<div className="aspect-square w-full bg-[#0c0c0e] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)] border border-white/10 relative group">
							<img
								src={productImages[activeImg]}
								alt="Hardware module capture primary profile display"
								className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102 filter brightness-90 group-hover:brightness-100"
							/>

							<div className="absolute top-4 right-4 bg-[#050506]/80 border border-white/10 backdrop-blur-md px-3 py-1 rounded text-fuchsia-400 text-xs font-black tracking-widest">
								[{activeImg + 1} // {productImages.length}]
							</div>

							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
								{productImages.map((_, i) => (
									<div
										key={i}
										className={`h-1 transition-all duration-300 rounded ${
											activeImg === i ? "w-6 bg-fuchsia-500" : "bg-white/20 w-2"
										}`}
									/>
								))}
							</div>
						</div>

						<div className="grid grid-cols-6 gap-2">
							{productImages.map((img, i) => (
								<button
									key={i}
									onClick={() => setActiveImg(i)}
									aria-label={`Switch main asset module feed display index to ${i + 1}`}
									className={`aspect-square rounded-lg overflow-hidden border transition-all bg-[#0c0c0e] ${
										activeImg === i
											? "border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.2)] scale-95"
											: "border-white/10 opacity-40 hover:opacity-100"
									}`}
								>
									<img
										src={img}
										alt={`Asset packet preview frame ${i + 1}`}
										className="w-full h-full object-cover"
									/>
								</button>
							))}
						</div>
					</section>

					<section className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden">
						<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-500/50 via-transparent to-transparent" />

						<div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
							<div>
								<h1 className="text-white text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">
									NVIDIA RTX 3080 Ti <br className="hidden sm:inline" />{" "}
									Founders Edition
								</h1>
							</div>

							<div className="sm:text-right shrink-0">
								<p className="text-fuchsia-400 text-2xl sm:text-3xl font-black tracking-tight">
									R12,500
								</p>
								<span className="inline-block mt-1.5 px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded text-emerald-400 text-[10px] font-black tracking-wider uppercase">
									EXCELLENT
								</span>
							</div>
						</div>

						{/* Node Diagnostic telemetry meters */}
						<div className="flex gap-5 mb-6 text-slate-500 border-b border-white/5 pb-4 text-xs">
							<div className="flex items-center gap-1.5 uppercase font-bold tracking-wider">
								<Eye size={12} className="text-fuchsia-500/60" />{" "}
								<span>143 TOTAL VIEWS</span>
							</div>
							<div className="flex items-center gap-1.5 uppercase font-bold tracking-wider">
								<Clock size={12} className="text-fuchsia-500/60" />{" "}
								<span>UPLOADED 2D ago</span>
							</div>
						</div>

						<div className="space-y-2">
							<h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
								<Info size={14} className="text-fuchsia-500" />{" "}
								DESCRIPTION
							</h3>
							<p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
								Private deployment offering for clean NVIDIA GeForce RTX 3080 Ti
								Founders Edition module. Maintained exclusively inside clean
								structural node terminal boundaries. Never configured under
								unauthorized clock cycles or stress metrics. Peak functional
								target matching for extreme production workloads.
							</p>
						</div>
					</section>

					{/* Structural Technical Parameter Data Matrix */}
					<section className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-5 md:p-6 shadow-xl relative">
						<div className="flex items-center gap-2 mb-4">
							<Cpu size={16} className="text-fuchsia-400" />
							<h2 className="text-white text-sm sm:text-base font-black uppercase tracking-wider">
								TECHNICAL SPECIFICATIONS
							</h2>
						</div>

						<div className="border border-white/5 rounded-lg overflow-hidden bg-black/20">
							<table className="w-full border-collapse text-left text-xs sm:text-sm">
								<tbody>
									{specs.map((spec, idx) => (
										<tr
											key={idx}
											className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
										>
											<td className="p-3 font-semibold text-slate-500 uppercase tracking-wider max-w-[120px] sm:max-w-none truncate">
												{spec.label}
											</td>
											<td className="p-3 font-bold text-white text-right break-words">
												{spec.value}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>
				</div>

				<div className="lg:col-span-5 flex flex-col gap-6">
					<section
						aria-label="Merchant Protocol Signature"
						className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-5 md:p-6 shadow-xl relative"
					>
						<div className="flex items-center gap-4 mb-6">
							<div className="relative w-12 h-12 rounded-lg border border-white/10 flex justify-center items-center overflow-hidden bg-fuchsia-950 shadow-md shrink-0">
								<img
									src="https://placehold.co/100x100/311042/f43f5e?text=OP_IMG"
									alt="Merchant Profile Terminal Anchor"
									className="w-full h-full object-cover filter brightness-90"
								/>
							</div>
							<div className="min-w-0">
								<h4 className="font-black text-white text-sm sm:text-base uppercase tracking-wide truncate">
									Brandan-Lee James S.
								</h4>
								<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] mt-1 font-bold text-slate-500 uppercase tracking-widest">
									<span className="flex items-center gap-1 text-fuchsia-400">
										<ShieldCheck size={10} /> VERIFIED
									</span>
									<span className="flex items-center gap-1">
										<MapPin size={10} /> GAUTENG
									</span>
								</div>
							</div>
						</div>

						<CyberActionButton
							onClick={handleViewProfile}
							label="VIEW PROFILE"
							className="w-full"
						/>

						{/* Interactive Data Integrity Trust Score Matrix Array */}
						<div className="grid grid-cols-3 gap-1 text-center bg-black/40 border border-white/5 rounded-lg py-3 mt-4">
							<div>
								<div className="flex items-center justify-center gap-1 text-white text-sm sm:text-base font-black">
									<Star size={12} className="text-amber-400 fill-amber-400" />{" "}
									4.9
								</div>
								<p className="text-[8px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">
									TRUST RATING
								</p>
							</div>
							<div>
								<p className="text-white text-sm sm:text-base font-black">24</p>
								<p className="text-[8px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">
									COMPLETED TRADES
								</p>
							</div>
							<div>
								<p className="text-emerald-400 text-sm sm:text-base font-black">
									100%
								</p>
								<p className="text-[8px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">
									POSITIVE FEEDBACK
								</p>
							</div>
						</div>
					</section>

					{/* Operational Value Negotiation Negotiation Terminal Gateway */}
					<section
						aria-label="Bidding Payload Interface"
						className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-5 md:p-6 shadow-xl relative"
					>
						<div className="flex items-center gap-2 mb-4">
							<Coins size={16} className="text-fuchsia-400" />
							<h3 className="text-white text-sm sm:text-base font-black uppercase tracking-wider">
								Make an Offer
							</h3>
						</div>

						<div className="flex flex-col gap-4">
							{/* Input Form Box Area Wrapper */}
							<div className="relative flex flex-col gap-1.5">
								<label
									htmlFor="offer-amount"
									className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1"
								>
									Enter Offer Amount
								</label>
								<div className="relative">
									<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-black text-sm z-10">
										R
									</span>
									<AuthInput
										id="offer-amount"
										type="number"
										value={offerValue}
										onChange={(e) => setOfferValue(e.target.value)}
										className="pl-10 font-mono text-sm"
										placeholder="0.00"
									/>
								</div>
							</div>

							{/* Operational Notes Container Field Area */}
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="buyer-note"
									className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1"
								>
									Buyers Note
								</label>
								<textarea
									id="buyer-note"
									className="w-full h-32 bg-[#121214] rounded-lg p-3 border border-white/10 transition-all text-white focus:outline-none focus:border-fuchsia-500/50 text-xs sm:text-sm font-mono leading-relaxed shadow-inner placeholder:text-slate-700 resize-none"
									placeholder="Input secure operational transmission message packet tags..."
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>

							<CyberActionButton
								label="SUBMIT OFFER"
								className="mt-2"
							/>
						</div>
					</section>

					{/* Console Pipeline Route Modifiers */}
					<nav
						aria-label="Supplementary Listing Utilities"
						className="flex flex-col gap-3"
					>
						<button
							onClick={handleReport}
							className="w-full h-[48px] rounded-lg border border-red-500/20 text-red-400 font-mono font-bold text-xs tracking-widest uppercase hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-2 outline-none focus-visible:ring-1 focus-visible:ring-red-500"
						>
							<AlertTriangle size={14} />
							<span>REPORT THIS LISTING</span>
						</button>
					</nav>

					{/* Network Mirror Pipeline Links */}
					<section
						aria-label="Similar Asset Listings Routing"
						onClick={handleViewListing}
						className="flex flex-col gap-4 mt-2"
					>
						<h3 className="text-white text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer group">
							<span className="group-hover:text-fuchsia-400 transition-colors">
								MATCHING_ASSET_DIAGNOSTICS
							</span>
							<ChevronRight
								size={14}
								className="text-fuchsia-500 transition-transform group-hover:translate-x-1"
							/>
						</h3>
						<div className="flex flex-col gap-3">
							<ActiveListingCard
								title="NVIDIA RTX 3080 Ti FE Module"
								price="12,500"
								condition="Excellent"
								time="Uplink 2 days ago"
								views="143"
								image="https://placehold.co/200/1e1b4b/38bdf8?text=SYS_ASSET"
							/>
							<ActiveListingCard
								title="AMD Ryzen 9 7950X Node"
								price="9,800"
								condition="Brand New"
								time="Uplink 5 days ago"
								views="98"
								image="https://placehold.co/200/311042/f43f5e?text=SYS_ASSET"
							/>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
