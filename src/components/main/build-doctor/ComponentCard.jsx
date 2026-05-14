import React from "react";

export default function ComponentCard({
	title,
	icon: Icon,
	placeholder,
	value,
	onChange,
}) {
	const specs = [
		{ label: "Brand", value: "NVIDIA" },
		{ label: "Model", value: "GeForce RTX 3080 Ti Founders Edition" },
		{ label: "Memory", value: "12GB GDDR6X" },
		{ label: "Core Clock", value: "1665 MHz" },
		{ label: "Boost Clock", value: "1770 MHz" },
		{ label: "Interface", value: "PCIe 4.0 x16" },
		{ label: "Power Connectors", value: "2x 8-pin" },
		{ label: "TDP", value: "350W" },
		{ label: "Outputs", value: "3x DisplayPort 1.4a, 1x HDMI 2.1" },
		{ label: "Warranty", value: "No Warranty (Private Sale)" },
	];

	return (
		<>
			<div className="grid grid-cols-1">
				<div className="w-full grid grid-cols-1 md:grid- p-px bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-2xl shadow-xl outline outline-1 outline-pink-600 overflow-hidden">
			{/* Card Header */}
			<div className="h-16 px-5 border-b border-pink-600/50 flex items-center gap-3">
				<div className="w-10 h-10 bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
					<Icon className="w-5 h-5 text-white" />
				</div>

				<h3 className="text-white text-lg font-bold tracking-tight">{title}</h3>
			</div>

			{/* Input Area */}
			<div className="p-6 bg-gradient-to-br from-violet-800 to-purple-700">
				<div className="space-y-2">
					<label
						htmlFor=""
						className="text-pink-200 text-sm md:text-base font-black uppercase tracking-[0.2em]"
					>
						Component Name
					</label>
					<input
						type="text"
						value={value}
						onChange={onchange}
						placeholder={placeholder}
						className="w-full h-12 px-4 bg-gray-100 rounded-xl border border-gray-300 text-gray-800 placeholder:text-gray-400 font-medium focus:outline-none focus:ring-2 ring-pink-500 transition-all"
					/>
				</div>
			</div>
		</div>

		{/* Technical Specifications */}
			<div className="hidden bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-xl p-6 shadow-xl text-white">
				<h2 className="text-xl font-black mb-6 uppercase tracking-tight">
					Technical Specifications
				</h2>
				<div className="grid grid-cols-1 gap-1">
					{specs.map((spec, idx) => (
						<div
							key={idx}
							className="flex justify-between items-center py-3 border-b border-pink-600/30 last:border-0 hover:bg-white/5 transition-colors px-2 rounded"
						>
							<span className="text-white text-sm md:text-base font-semibold">
								{spec.label}
							</span>
							<span className="text-white text-sm md-text-base font-bold text-right ml-4">
								{spec.value}
							</span>
						</div>
					))}
				</div>
			</div>
			</div>
		
		</>
		
		
	);
}
