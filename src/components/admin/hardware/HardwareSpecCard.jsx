import React from "react";
import {
	Cpu,
	Zap,
	Brain,
	Gauge,
	Flame,
	Image,
	HardDrive,
	Plug,
	Ruler,
	Maximize,
	Layers,
	GaugeCircle,
	Sparkles,
	Award,
	Binary,
	Monitor,
	Unlock,
	Lock,
	Sliders,
	Box,
	HardDriveDownload,
	Network,
	Cable,
	Grid,
	Activity,
	Wind,
	ListCollapse,
	ArrowUpRight,
	Volume2,
	TrendingUp,
	HardDriveUpload,
	RefreshCw,
	Layers3,
	Layout,
	View,
	MonitorUp,
	Info,
} from "lucide-react";

export default function HardwareSpecCard({
	item,
	category,
	priceFormatter,
	onEdit,
	isGlobal = false,
}) {
	const itemCategory = item.category || category;
	const showGlobalPlaceholder = isGlobal && Number(item.has_specs) === 0;

	return (
		<article className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-white/10 transition-all font-mono text-slate-300">
			<section>
				<header className="flex justify-between items-start gap-2 mb-1">
					<span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-500 uppercase tracking-widest">
						{item.brand}
					</span>
					<span className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-emerald-400">
						{priceFormatter(item.msrp_cents)}
					</span>
				</header>
				<h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black text-white uppercase tracking-wide leading-tight mb-3">
					{item.full_name}
				</h3>

				<div className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 bg-black/20 p-3 rounded-xl border border-white/[0.02] space-y-1.5">
					{showGlobalPlaceholder ? (
						<div className="flex flex-col items-center justify-center text-center py-6 px-2 space-y-2">
							<Info size={20} className="text-purple-400 animate-pulse" />
							<p className="text-xs sm:text-sm md:text-base font-medium uppercase tracking-wide">
								General Listing
							</p>
							<p className="text-xs sm:text-sm text-slate-500 max-w-[200px] leading-relaxed">
								Select the specific{" "}
								<strong className="text-purple-400 uppercase">
									"{itemCategory}"
								</strong>{" "}
								category above to see full details.
							</p>
						</div>
					) : (
						<>
							{itemCategory === "cpus" && (
								<>
									<p className="flex items-center gap-2">
										<Zap size={14} className="text-amber-400 shrink-0" />
										<span className="text-slate-500">Plug Type:</span>{" "}
										{item.cpu_socket || item.socket || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Binary size={14} className="text-teal-400 shrink-0" />
										<span className="text-slate-500">Build Style:</span>{" "}
										{item.architecture || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Brain size={14} className="text-purple-400 shrink-0" />
										<span className="text-slate-500">Brain Power:</span>{" "}
										{item.cores ? `${item.cores} Cores` : "N/A"} /{" "}
										{item.threads ? `${item.threads} Tasks` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Gauge size={14} className="text-blue-400 shrink-0" />
										<span className="text-slate-500">Speed:</span>{" "}
										{item.base_clock_ghz ? `${item.base_clock_ghz} GHz` : "N/A"}{" "}
										(Up to{" "}
										{item.boost_clock_ghz
											? `${item.boost_clock_ghz} GHz`
											: "N/A"}
										)
									</p>
									<p className="flex items-center gap-2">
										<Flame size={14} className="text-rose-500 shrink-0" />
										<span className="text-slate-500">Power Needs:</span>{" "}
										{item.tdp_watts ? `${item.tdp_watts}W` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Monitor size={14} className="text-sky-400 shrink-0" />
										<span className="text-slate-500">Visuals:</span>{" "}
										{item.integrated_graphics || "Needs Video Card"}
									</p>
									<p className="flex items-center gap-2">
										{Number(item.unlocked) === 1 ? (
											<>
												<Unlock
													size={14}
													className="text-emerald-400 shrink-0"
												/>
												<span className="text-slate-500">
													Adjustable Speed:
												</span>{" "}
												<span className="text-emerald-400 font-bold">Yes</span>
											</>
										) : (
											<>
												<Lock size={14} className="text-slate-500 shrink-0" />
												<span className="text-slate-500">
													Adjustable Speed:
												</span>{" "}
												<span>Fixed</span>
											</>
										)}
									</p>
								</>
							)}

							{itemCategory === "motherboards" && (
								<>
									<p className="flex items-center gap-2">
										<Cpu size={14} className="text-purple-400 shrink-0" />
										<span className="text-slate-500">Fits Processor:</span>{" "}
										{item.mobo_socket || item.socket || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Sliders size={14} className="text-amber-400 shrink-0" />
										<span className="text-slate-500">Main Chip:</span>{" "}
										{item.mobo_chipset || item.chipset || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Maximize size={14} className="text-blue-400 shrink-0" />
										<span className="text-slate-500">Board Size:</span>{" "}
										{item.mobo_form_factor || item.form_factor || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Layers size={14} className="text-teal-400 shrink-0" />
										<span className="text-slate-500">Memory Type:</span>{" "}
										{item.mobo_memory_type || item.memory_type || "N/A"} (
										{item.memory_slots || 0} Slots)
									</p>
									<p className="flex items-center gap-2">
										<Box size={14} className="text-indigo-400 shrink-0" />
										<span className="text-slate-500">Expansion:</span>{" "}
										{item.pcie_x16_slots || 0} Slot(s)
									</p>
									<p className="flex items-center gap-2">
										<HardDrive
											size={14}
											className="text-emerald-400 shrink-0"
										/>
										<span className="text-slate-500">Fast Storage:</span>{" "}
										{item.m2_slots || 0} Slot(s)
									</p>
									<p className="flex items-center gap-2">
										<Network size={14} className="text-cyan-400 shrink-0" />
										<span className="text-slate-500">Internet:</span>{" "}
										{Number(item.wifi) === 1 ? (
											<span className="text-emerald-400 font-bold">
												Built-In Wi-Fi
											</span>
										) : (
											"Wired Only"
										)}
									</p>
								</>
							)}

							{itemCategory === "memory" && (
								<>
									<p className="flex items-center gap-2">
										<Layers size={14} className="text-indigo-400 shrink-0" />
										<span className="text-slate-500">Generation:</span>{" "}
										{item.memory_type || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<HardDrive
											size={14}
											className="text-emerald-400 shrink-0"
										/>
										<span className="text-slate-500">Total Space:</span>{" "}
										{item.ram_capacity || item.capacity_gb
											? `${item.ram_capacity || item.capacity_gb}GB`
											: "N/A"}{" "}
										({item.kit_modules || 1} Stick
										{Number(item.kit_modules) !== 1 ? "s" : ""})
									</p>
									<p className="flex items-center gap-2">
										<GaugeCircle
											size={14}
											className="text-amber-400 shrink-0"
										/>
										<span className="text-slate-500">Speed Rating:</span>{" "}
										{item.speed_mhz ? `${item.speed_mhz}MHz` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Sparkles
											size={14}
											className={
												Number(item.ram_rgb || item.rgb) === 1
													? "text-fuchsia-400 shrink-0"
													: "text-slate-500 shrink-0"
											}
										/>
										<span className="text-slate-500">Lighting:</span>{" "}
										{Number(item.ram_rgb || item.rgb) === 1 ? (
											<span className="text-fuchsia-400 font-bold">
												Colorful Glow
											</span>
										) : (
											"None"
										)}
									</p>
								</>
							)}

							{itemCategory === "pc-cases" && (
								<>
									<p className="flex items-center gap-2">
										<Layout size={14} className="text-indigo-400 shrink-0" />
										<span className="text-slate-500">
											Fits Board Sizes:
										</span>{" "}
										{item.case_form_factor || item.form_factor || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<View size={14} className="text-teal-400 shrink-0" />
										<span className="text-slate-500">Side Material:</span>{" "}
										{item.side_panel || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Image size={14} className="text-sky-400 shrink-0" />
										<span className="text-slate-500">
											Max Card Length:
										</span>{" "}
										{item.max_gpu_length_mm
											? `${item.max_gpu_length_mm}mm`
											: "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<ArrowUpRight
											size={14}
											className="text-rose-400 shrink-0"
										/>
										<span className="text-slate-500">Max Cooler Height:</span>{" "}
										{item.max_cooler_height_mm
											? `${item.max_cooler_height_mm}mm`
											: "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<HardDrive size={14} className="text-amber-400 shrink-0" />
										<span className="text-slate-500">Storage Bays:</span>{" "}
										{item.drive_bays_3_5 || 0} Large /{" "}
										{item.drive_bays_2_5 || 0} Small
									</p>
									<p className="flex items-center gap-2">
										<Ruler size={14} className="text-purple-400 shrink-0" />
										<span className="text-slate-500">Dimensions:</span>{" "}
										{item.dimensions || "N/A"}
									</p>
								</>
							)}

							{itemCategory === "ssds" && (
								<>
									<p className="flex items-center gap-2">
										<HardDrive
											size={14}
											className="text-emerald-400 shrink-0"
										/>
										<span className="text-slate-500">Storage Capacity:</span>{" "}
										{item.ssd_capacity || item.capacity_gb
											? (item.ssd_capacity || item.capacity_gb) >= 1000
												? `${(item.ssd_capacity || item.capacity_gb) / 1000}TB`
												: `${item.ssd_capacity || item.capacity_gb}GB`
											: "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Plug size={14} className="text-zinc-400 shrink-0" />
										<span className="text-slate-500">Connection:</span>{" "}
										{item.ssd_interface || item.interface_type || "N/A"} (
										{item.ssd_form_factor || item.form_factor || "N/A"})
									</p>
									<p className="flex items-center gap-2">
										<Binary size={14} className="text-teal-400 shrink-0" />
										<span className="text-slate-500">Build Type:</span>{" "}
										{item.nand_type || "N/A"}
									</p>
									{item.pcie_gen && (
										<p className="flex items-center gap-2">
											<TrendingUp
												size={14}
												className="text-purple-400 shrink-0"
											/>
											<span className="text-slate-500">Speed Generation:</span>{" "}
											{item.pcie_gen}
										</p>
									)}
									<p className="flex items-center gap-2">
										<HardDriveDownload
											size={14}
											className="text-sky-400 shrink-0"
										/>
										<span className="text-slate-500">Read Speed:</span>{" "}
										{item.read_speed_mbps
											? `Up to ${item.read_speed_mbps} MB/s`
											: "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<HardDriveUpload
											size={14}
											className="text-amber-400 shrink-0"
										/>
										<span className="text-slate-500">Write Speed:</span>{" "}
										{item.write_speed_mbps
											? `Up to ${item.write_speed_mbps} MB/s`
											: "N/A"}
									</p>
								</>
							)}

							{itemCategory === "hdds" && (
								<>
									<p className="flex items-center gap-2">
										<HardDrive
											size={14}
											className="text-emerald-400 shrink-0"
										/>
										<span className="text-slate-500">Disk Space:</span>{" "}
										{item.hdd_capacity || item.capacity_gb
											? (item.hdd_capacity || item.capacity_gb) >= 1000
												? `${(item.hdd_capacity || item.capacity_gb) / 1000}TB`
												: `${item.hdd_capacity || item.capacity_gb}GB`
											: "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<RefreshCw size={14} className="text-amber-400 shrink-0" />
										<span className="text-slate-500">Spin Speed:</span>{" "}
										{item.rpm ? `${item.rpm} RPM` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Layers3 size={14} className="text-purple-400 shrink-0" />
										<span className="text-slate-500">Cache Memory:</span>{" "}
										{item.cache_mb ? `${item.cache_mb}MB` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Ruler size={14} className="text-sky-400 shrink-0" />
										<span className="text-slate-500">Drive Size:</span>{" "}
										{item.hdd_form_factor || item.form_factor || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Plug size={14} className="text-zinc-400 shrink-0" />
										<span className="text-slate-500">Connection:</span>{" "}
										{item.hdd_interface || item.interface_type || "N/A"}
									</p>
								</>
							)}

							{itemCategory === "case-fans" && (
								<>
									<p className="flex items-center gap-2">
										<Ruler size={14} className="text-sky-400 shrink-0" />
										<span className="text-slate-500">Fan Width:</span>{" "}
										{item.fan_size || item.size_mm
											? `${item.fan_size || item.size_mm}mm`
											: "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Gauge size={14} className="text-teal-400 shrink-0" />
										<span className="text-slate-500">Max Speed:</span>{" "}
										{item.max_rpm ? `${item.max_rpm} RPM` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Wind size={14} className="text-blue-400 shrink-0" />
										<span className="text-slate-500">Airflow Power:</span>{" "}
										{item.airflow_cfm ? `${item.airflow_cfm} CFM` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Volume2 size={14} className="text-amber-400 shrink-0" />
										<span className="text-slate-500">Loudness:</span>{" "}
										{item.noise_db ? `${item.noise_db} dBA` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Activity size={14} className="text-purple-400 shrink-0" />
										<span className="text-slate-500">Speed Control:</span>{" "}
										{Number(item.pwm) === 1
											? "Automatic Adjust"
											: "Fixed Speed"}
									</p>
									<p className="flex items-center gap-2">
										<Sparkles
											size={14}
											className={
												Number(item.fan_rgb || item.rgb) === 1
													? "text-fuchsia-400 shrink-0"
													: "text-slate-500 shrink-0"
											}
										/>
										<span className="text-slate-500">Lighting:</span>{" "}
										{Number(item.fan_rgb || item.rgb) === 1 ? (
											<span className="text-fuchsia-400 font-bold">
												Colorful Glow
											</span>
										) : (
											"None"
										)}
									</p>
								</>
							)}

							{itemCategory === "aios" && (
								<>
									<p className="flex items-center gap-2">
										<Ruler size={14} className="text-sky-400 shrink-0" />
										<span className="text-slate-500">Cooler Size:</span>{" "}
										{item.radiator_mm ? `${item.radiator_mm}mm` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Wind size={14} className="text-teal-400 shrink-0" />
										<span className="text-slate-500">Fan Setup:</span>{" "}
										{item.aio_fan_count || item.fan_count || 0}x{" "}
										{item.aio_fan_size || item.fan_size_mm || ""}mm Fan
										{Number(item.aio_fan_count || item.fan_count) !== 1
											? "s"
											: ""}
									</p>
									<p className="flex items-center gap-2">
										<ListCollapse
											size={14}
											className="text-purple-400 shrink-0"
										/>
										<span className="text-slate-500">Fits Processors:</span>{" "}
										<span
											className="truncate"
											title={item.aio_sockets || item.socket_compatibility}
										>
											{item.aio_sockets || item.socket_compatibility || "N/A"}
										</span>
									</p>
									<p className="flex items-center gap-2">
										<Sparkles
											size={14}
											className={
												Number(item.aio_rgb || item.rgb) === 1
													? "text-fuchsia-400 shrink-0"
													: "text-slate-500 shrink-0"
											}
										/>
										<span className="text-slate-500">Glow Lights:</span>{" "}
										{Number(item.aio_rgb || item.rgb) === 1 ? (
											<span className="text-fuchsia-400 font-bold">Yes</span>
										) : (
											"None"
										)}
									</p>
								</>
							)}

							{itemCategory === "air-coolers" && (
								<>
									<p className="flex items-center gap-2">
										<ArrowUpRight size={14} className="text-sky-400 shrink-0" />
										<span className="text-slate-500">Cooler Height:</span>{" "}
										{item.cooler_height || item.height_mm
											? `${item.cooler_height || item.height_mm}mm`
											: "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Wind size={14} className="text-teal-400 shrink-0" />
										<span className="text-slate-500">Fan Setup:</span>{" "}
										{item.cooler_fan_count || item.fan_count || 0}x{" "}
										{item.cooler_fan_size || item.fan_size_mm || ""}mm Fan
										{Number(item.cooler_fan_count || item.fan_count) !== 1
											? "s"
											: ""}
									</p>
									<p className="flex items-center gap-2">
										<Flame size={14} className="text-rose-500 shrink-0" />
										<span className="text-slate-500">
											Heat Management:
										</span>{" "}
										{item.tdp_rating_watts
											? `${item.tdp_rating_watts}W`
											: "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<ListCollapse
											size={14}
											className="text-purple-400 shrink-0"
										/>
										<span className="text-slate-500">Fits Processors:</span>{" "}
										<span
											className="truncate"
											title={item.cooler_sockets || item.socket_compatibility}
										>
											{item.cooler_sockets ||
												item.socket_compatibility ||
												"N/A"}
										</span>
									</p>
									<p className="flex items-center gap-2">
										<Sparkles
											size={14}
											className={
												Number(item.cooler_rgb || item.rgb) === 1
													? "text-fuchsia-400 shrink-0"
													: "text-slate-500 shrink-0"
											}
										/>
										<span className="text-slate-500">Fan Lights:</span>{" "}
										{Number(item.cooler_rgb || item.rgb) === 1 ? (
											<span className="text-fuchsia-400 font-bold">Yes</span>
										) : (
											"None"
										)}
									</p>
								</>
							)}

							{itemCategory === "psus" && (
								<>
									<p className="flex items-center gap-2">
										<Zap size={14} className="text-amber-400 shrink-0" />
										<span className="text-slate-500">Total Power:</span>{" "}
										{item.wattage ? `${item.wattage}W` : "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Award size={14} className="text-yellow-500 shrink-0" />
										<span className="text-slate-500">
											Efficiency Rating:
										</span>{" "}
										{item.efficiency_rating || "Unrated"}
									</p>
									<p className="flex items-center gap-2">
										<Grid size={14} className="text-blue-400 shrink-0" />
										<span className="text-slate-500">
											Removable Cables:
										</span>{" "}
										<span className="capitalize">
											{item.modular_type
												? item.modular_type.replace("_", " ")
												: "N/A"}
										</span>
									</p>
									<p className="flex items-center gap-2">
										<Maximize size={14} className="text-purple-400 shrink-0" />
										<span className="text-slate-500">Size Style:</span>{" "}
										{item.psu_form_factor || item.form_factor || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Plug size={14} className="text-rose-400 shrink-0" />
										<span className="text-slate-500">
											Video Card Links:
										</span>{" "}
										{item.pcie_connectors || 0}x Cables
									</p>
									<p className="flex items-center gap-2">
										<Cable size={14} className="text-teal-400 shrink-0" />
										<span className="text-slate-500">Drive Links:</span>{" "}
										{item.sata_connectors || 0}x Cables
									</p>
								</>
							)}

							{itemCategory === "gpus" && (
								<>
									<p className="flex items-center gap-2">
										<Image size={14} className="text-sky-400 shrink-0" />
										<span className="text-slate-500">Video Chip:</span>{" "}
										{item.gpu_chipset || item.chipset || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<HardDrive
											size={14}
											className="text-emerald-400 shrink-0"
										/>
										<span className="text-slate-500">Video Memory:</span>{" "}
										{item.vram_gb ? `${item.vram_gb}GB` : "N/A"}{" "}
										{item.vram_type || ""}
									</p>
									<p className="flex items-center gap-2">
										<Gauge size={14} className="text-teal-400 shrink-0" />
										<span className="text-slate-500">Running Speed:</span>{" "}
										{item.core_clock_mhz ? `${item.core_clock_mhz} MHz` : "N/A"}{" "}
										(Up to{" "}
										{item.boost_clock_mhz
											? `${item.boost_clock_mhz} MHz`
											: "N/A"}
										)
									</p>
									<p className="flex items-center gap-2">
										<TrendingUp
											size={14}
											className="text-purple-400 shrink-0"
										/>
										<span className="text-slate-500">Connection Style:</span>{" "}
										{item.pcie_version || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Plug size={14} className="text-indigo-400 shrink-0" />
										<span className="text-slate-500">Power Input:</span>{" "}
										{item.power_connectors || "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<Flame size={14} className="text-rose-500 shrink-0" />
										<span className="text-slate-500">Power Needs:</span>{" "}
										{item.gpu_tdp || item.tdp_watts
											? `${item.gpu_tdp || item.tdp_watts}W`
											: "N/A"}
									</p>
									<p className="flex items-center gap-2">
										<MonitorUp size={14} className="text-amber-400 shrink-0" />
										<span className="text-slate-500">Screen Ports:</span>{" "}
										<span className="truncate" title={item.outputs}>
											{item.outputs || "N/A"}
										</span>
									</p>
									<p className="flex items-center gap-2">
										<Ruler size={14} className="text-cyan-400 shrink-0" />
										<span className="text-slate-500">Card Length:</span>{" "}
										{item.length_mm ? `${item.length_mm}mm` : "N/A"} (
										{item.slot_width ? `${item.slot_width} Slots Wide` : "N/A"})
									</p>
								</>
							)}

							{![
								"cpus",
								"gpus",
								"motherboards",
								"memory",
								"ssds",
								"hdds",
								"psus",
								"aios",
								"air-coolers",
								"case-fans",
								"pc-cases",
							].includes(itemCategory) && (
								<p className="text-xs sm:text-sm text-slate-500 italic py-1 text-center">
									Details coming soon
								</p>
							)}
						</>
					)}
				</div>
			</section>

			<footer className="text-xs sm:text-sm md:text-base text-slate-600 border-t border-white/[0.02] pt-2 flex justify-between items-center gap-2">
				<div className="flex flex-col">
					<span>Model: {item.model}</span>
					<span className="uppercase tracking-widest text-[10px] sm:text-xs mt-1 px-1.5 py-0.5 rounded bg-white/5 w-max font-bold text-slate-400 border border-white/5">
						{itemCategory}
					</span>
				</div>

				{!showGlobalPlaceholder && (
					<button
						onClick={onEdit}
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs sm:text-sm text-white transition-colors cursor-pointer"
					>
						<Sliders size={12} className="text-slate-400" />
						<span>Edit Hardware Specs</span>
					</button>
				)}
			</footer>
		</article>
	);
}
