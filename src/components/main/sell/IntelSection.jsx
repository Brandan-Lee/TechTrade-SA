import React, { useState } from "react";
import {
	Cpu,
	ShieldCheck,
	ChevronDown,
	Check,
	Search,
	Terminal,
} from "lucide-react";

export default function IntelSection({ formData, setFormData }) {
	const [isOpen, setIsOpen] = useState(false);

	const categoryGroups = [
		{
			label: "COMPONENTS",
			items: ["GPUs", "CPUs", "Motherboards", "PSUs", "Memory"],
		},
		{ label: "COOLING", items: ["AIOs", "Air Coolers", "Case Fans"] },
		{ label: "STORAGE", items: ["SSDs", "HDDs"] },
		{ label: "CHASSIS", items: ["PC Cases"] },
	];

	const specs = [
		"Component architecture verified via image recognition",
		"Serial number cross-referenced with manufacturer database",
		"Performance benchmarks auto-populated from global registry",
		"Compatibility matrix generated for tri-vector builds",
		"Market velocity analysis applied for pricing intelligence",
	];

	return (
		<div className="bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 w-full relative">
			<h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
				<span className="w-2 h-6 bg-fuchsia-500 inline-block" />
				Component Intelligence
			</h2>

			<div className="space-y-8">
				{/* 1. CATEGORY DROPDOWN */}
				<div className="form-control w-full relative">
					<label className="label text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-3 block">
						Select Category
					</label>
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className={`w-full bg-black h-14 md:h-16 rounded-xl flex items-center justify-between px-5 text-sm font-medium transition-all duration-300 border
                            ${
								isOpen
									? "border-fuchsia-500 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)]"
									: "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
							}`}
					>
						<span className="font-mono tracking-wide">
							{formData.category || "SELECT_HARDWARE_CLASS..."}
						</span>
						<ChevronDown
							className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-fuchsia-400" : ""}`}
						/>
					</button>

					{isOpen && (
						<>
							<div
								className="fixed inset-0 z-[90]"
								onClick={() => setIsOpen(false)}
							/>
							<div className="absolute top-[105%] left-0 w-full z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
								<div className="bg-[#09090b] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-fuchsia-500/30 p-2 max-h-[320px] overflow-y-auto custom-scrollbar">
									{categoryGroups.map((group) => (
										<div
											key={group.label}
											className="flex flex-col gap-0.5 mb-3 last:mb-0"
										>
											<div className="flex items-center gap-2 px-3 py-1 mb-1">
												<span className="text-[10px] font-mono font-black text-fuchsia-500/60 uppercase tracking-widest">
													{group.label}
												</span>
												<div className="flex-1 h-[1px] bg-fuchsia-500/10" />
											</div>
											{group.items.map((item) => (
												<button
													key={item}
													type="button"
													onClick={() => {
														setFormData({ ...formData, category: item });
														setIsOpen(false);
													}}
													className="w-full h-9 flex items-center px-3 rounded-lg text-slate-400 text-xs md:text-sm font-semibold hover:bg-fuchsia-600 hover:text-white transition-all text-left"
												>
													{item}
												</button>
											))}
										</div>
									))}
								</div>
							</div>
						</>
					)}
				</div>

				{/* 2. COMPONENT NAME INPUT */}
				<div className="form-control w-full">
					<label className="label text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-3 block">
						Enter Component Name
					</label>
					<div className="flex gap-3 relative group">
						<div className="relative flex-1">
							<input
								type="text"
								placeholder="E.G., RTX 4090, RYZEN 9 7950X"
								className="w-full bg-black h-14 md:h-16 rounded-xl px-5 border border-white/10 text-slate-200 font-medium text-sm md:text-base focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/30 transition-all placeholder:text-slate-800 placeholder:font-mono placeholder:text-xs"
								value={formData.name || ""}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
							<div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/10 group-focus-within:border-fuchsia-500/40" />
						</div>
						<button
							type="button"
							className="w-14 h-14 md:w-16 md:h-16 bg-fuchsia-600 hover:bg-fuchsia-500 active:scale-95 text-white rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(217,70,239,0.2)] shrink-0"
							aria-label="Query Database"
						>
							<Search className="w-5 h-5 md:w-6 md:h-6" />
						</button>
					</div>
				</div>

				{/* 3. ASKING PRICE INPUT */}
				<div className="form-control w-full">
					<label className="label text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-3 block">
						Enter your asking price:
					</label>
					<div className="relative rounded-xl overflow-hidden group">
						<div className="absolute left-5 top-1/2 -translate-y-1/2 text-fuchsia-500 font-mono font-black text-sm md:text-base select-none pointer-events-none z-10">
							R
						</div>
						<input
							type="number"
							placeholder="0.00"
							className="w-full bg-black h-14 md:h-16 rounded-xl pl-10 pr-5 border border-white/10 text-slate-200 font-mono text-sm md:text-base focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/30 transition-all placeholder:text-slate-800"
							value={formData.price || ""}
							onChange={(e) =>
								setFormData({ ...formData, price: e.target.value })
							}
						/>
					</div>
				</div>

				{/* 4. VERIFIED SPECS BOX */}
				<div className="w-full bg-[#050506] rounded-xl p-5 md:p-6 border border-fuchsia-500/20 relative overflow-hidden">
					{/* Corner Accent Graphic */}
					<div className="absolute top-0 right-0 w-2 h-2 bg-fuchsia-500/40 [clip-path:polygon(100%_0,100%_100%,0_0)]" />

					<div className="flex items-center gap-2.5 mb-5">
						<ShieldCheck className="w-4 h-4 text-fuchsia-400 shrink-0" />
						<h3 className="text-white text-xs md:text-sm font-black tracking-widest uppercase">
							Verified Specifications
						</h3>
					</div>

					<div className="flex flex-col gap-3">
						{specs.map((spec, idx) => (
							<div key={idx} className="flex items-start gap-3">
								<div className="mt-0.5 shrink-0 w-4 h-4 rounded border border-fuchsia-500/30 bg-fuchsia-500/5 flex items-center justify-center">
									<Check className="w-2.5 h-2.5 text-fuchsia-400 stroke-[3]" />
								</div>
								<p className="text-slate-400 font-mono text-[10px] md:text-xs leading-normal tracking-tight">
									{spec.toUpperCase()}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
