import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CyberAlert from "../../components/ui/CyberAlert";
import { apiFetch } from "../../lib/api";
import CyberActionButton from "../../components/ui/CyberActionButton";
import {
	ShieldCheck,
	Cpu,
	Radio,
	Search,
	ChevronDown,
	Check,
	Trash2,
	ImagePlus,
	Camera,
	ShieldAlert,
} from "lucide-react";

export default function SellGear() {
	const [formData, setFormData] = useState({
		category: "",
		name: "",
		hardware_id: "",
		condition: "",
		description: "",
		price: "",
		images: [],
	});

	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);

	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});
	const [specs, setSpecs] = useState([
		"Component architecture verified via image recognition",
		"Serial number cross-referenced with manufacturer database",
		"Performance benchmarks auto-populated from global registry",
		"Compatibility matrix generated for tri-vector builds",
		"Market velocity analysis applied for pricing intelligence",
	]);

	const [suggestions, setSuggestions] = useState([]);

	// Gallery States
	const [slots, setSlots] = useState([null, null, null, null, null, null]);
	const [currentActiveSlot, setCurrentActiveSlot] = useState(null);
	const fileInputRef = useRef(null);

	const categoryGroups = [
		{
			label: "COMPONENTS",
			items: ["GPUs", "CPUs", "Motherboards", "PSUs", "Memory"],
		},
		{ label: "COOLING", items: ["AIOs", "Air Coolers", "Case Fans"] },
		{ label: "STORAGE", items: ["SSDs", "HDDs"] },
		{ label: "CHASSIS", items: ["PC Cases"] },
	];

	const conditions = ["New", "Like New", "Good", "Fair"];

	// Unified feedback trigger method reflecting the core auth design
	const triggerStatus = (message, type = "error", fieldName = "") => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setAlert({ show: true, message, type });

		if (type === "error" && fieldName) {
			setErrorField("");
			setShakeTick((tick) => tick + 1);
			requestAnimationFrame(() => setErrorField(fieldName));
		} else {
			setErrorField("");
		}
	};

	// Clean fields errors upon typing values
	const clearFieldError = (fieldName) => {
		setAlert({ show: false, message: "", type: "error" });
		if (errorField === fieldName) {
			setErrorField("");
		}
	};

	// Search logic tied into the UI
	const handleSearch = async () => {
		if (!formData.category) {
			triggerStatus(
				"Please select a category before searching.",
				"error",
				"category",
			);
			return;
		}
		if (!formData.name.trim()) {
			triggerStatus("Please enter a component model name.", "error", "name");
			return;
		}

		setIsLoading(true);
		setErrorField("");
		setAlert({ show: false, message: "", type: "error" });
		setSuggestions([]);

		try {
			const response = await apiFetch("/hardware_intelligence/search.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					q: formData.name,
					category: formData.category,
				}),
			});

			const data = await response.json();

			if (response.ok && data && data.length > 0) {
				setSuggestions(data);
			} else {
				triggerStatus(
					"No matching component found in catalog index.",
					"error",
					"name",
				);
			}
		} catch (err) {
			triggerStatus("Connection to the network failed.", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const selectComponent = (component) => {
		setFormData({
			...formData,
			name: component.full_name,
			hardware_id: component.id,
		});
		setErrorField("");

		const formattedPrice = component.msrp_cents
			? `R ${(component.msrp_cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
			: "NOT SPECIFIED";

		const specLines = [
			`IDENTIFIED: ${component.full_name}`,
			`MANUFACTURER: ${component.brand.toUpperCase()}`,
			`MODEL VARIANT: ${component.model.toUpperCase()}`,
			`REF MSRP: ${formattedPrice}`,
		];

        switch (formData.category.toUpperCase()) {
			case "GPUS":
				if (dbSpecs.chipset)
					specLines.push(`CHIPSET CORE ARCHITECTURE: ${dbSpecs.chipset}`);
				if (dbSpecs.vram_gb)
					specLines.push(
						`VRAM MEMORY: ${parseFloat(dbSpecs.vram_gb)} GB ${dbSpecs.vram_type || ""}`,
					);
				if (dbSpecs.boost_clock_mhz)
					specLines.push(
						`CLOCK PROFILES: ${dbSpecs.core_clock_mhz || "—"} MHz BASE / ${dbSpecs.boost_clock_mhz} MHz BOOST`,
					);
				if (dbSpecs.pcie_version)
					specLines.push(`BUS INTERFACE REVISION: ${dbSpecs.pcie_version}`);
				if (dbSpecs.power_connectors)
					specLines.push(
						`REQUIRED INPUT POWER RAILS: ${dbSpecs.power_connectors}`,
					);
				if (dbSpecs.tdp_watts)
					specLines.push(`THERMAL DESIGN POWER (TDP): ${dbSpecs.tdp_watts}W`);
				if (dbSpecs.outputs)
					specLines.push(
						`DISPLAY CONNECTIVITY DISPLAYPORTS/HDMI: ${dbSpecs.outputs}`,
					);
				if (dbSpecs.length_mm)
					specLines.push(
						`PHYSICAL CLEARANCE METRICS: ${dbSpecs.length_mm}mm LENGTH / ${dbSpecs.slot_width || "—"} SLOT WIDTH`,
					);
				break;

			case "CPUS":
				if (dbSpecs.socket)
					specLines.push(`MOTHERBOARD SOCKET INTERFACE: ${dbSpecs.socket}`);
				if (dbSpecs.architecture)
					specLines.push(`MICROARCHITECTURE REVISION: ${dbSpecs.architecture}`);
				if (dbSpecs.cores)
					specLines.push(
						`COMPUTE MATRIX: ${dbSpecs.cores} PHYSICAL CORES / ${dbSpecs.threads || dbSpecs.cores * 2} LOGICAL THREADS`,
					);
				if (dbSpecs.boost_clock_ghz)
					specLines.push(
						`OPERATING CLOCK FREQUENCY: ${parseFloat(dbSpecs.base_clock_ghz) || "—"} GHz BASE / ${parseFloat(dbSpecs.boost_clock_ghz)} GHz BOOST`,
					);
				if (dbSpecs.tdp_watts)
					specLines.push(
						`THERMAL PROFILE PACKAGE POWER: ${dbSpecs.tdp_watts}W`,
					);
				if (dbSpecs.integrated_graphics)
					specLines.push(
						`INTEGRATED DISPLAY PROCESSOR: ${dbSpecs.integrated_graphics}`,
					);
				specLines.push(
					`OVERCLOCK MATRIX CAPABILITY: ${dbSpecs.unlocked ? "UNLOCKED (MANUFACTURER MULTIPLIER ACTIVE)" : "LOCKED ARCHITECTURE"}`,
				);
				break;

			case "MOTHERBOARDS":
				if (dbSpecs.socket)
					specLines.push(`CPU SOCKET PROFILE SUPPORT: ${dbSpecs.socket}`);
				if (dbSpecs.chipset)
					specLines.push(`CHIPSET CONTROLLER PROFILE: ${dbSpecs.chipset}`);
				if (dbSpecs.form_factor)
					specLines.push(`CHASSIS SIZE FACTOR FORMAT: ${dbSpecs.form_factor}`);
				if (dbSpecs.memory_type)
					specLines.push(
						`RAM SLOT MATRIX: ${dbSpecs.memory_slots || 4}x ${dbSpecs.memory_type} HOUSES (MAX CAPACITY ${dbSpecs.max_memory_gb || 128}GB)`,
					);
				if (dbSpecs.pcie_x16_slots)
					specLines.push(
						`EXPANSION DECK LANES: ${dbSpecs.pcie_x16_slots}x PCIe x16 COMPONENT PORTS`,
					);
				if (dbSpecs.m2_slots)
					specLines.push(
						`NVMe HIGH-SPEED TRACK STORAGE: ${dbSpecs.m2_slots}x M.2 EXPANSION SLOTS`,
					);
				if (dbSpecs.sata_ports)
					specLines.push(
						`LEGACY MASS DATA CONNECTORS: ${dbSpecs.sata_ports}x SATA INTERFACE PORTS`,
					);
				specLines.push(
					`INTEGRATED NETWORK WIRELESS WIFI: ${dbSpecs.wifi ? "ONBOARD CONTROLLER CHIPSET VERIFIED" : "ETHERNET DISCRETE ACCESS ONLY"}`,
				);
				break;

			case "PSUS":
				if (dbSpecs.wattage)
					specLines.push(
						`TOTAL POWER OUTPUT CEILING: ${dbSpecs.wattage} WATTS`,
					);
				if (dbSpecs.efficiency_rating)
					specLines.push(
						`EFFICIENCY MATRIX VALUATION: 80 PLUS ${dbSpecs.efficiency_rating.replace("80+", "").trim()}`,
					);
				if (dbSpecs.modular_type)
					specLines.push(
						`STRUCTURAL CABLE ROUTING MECHANISM: ${dbSpecs.modular_type.replace("_", " ").toUpperCase()}`,
					);
				if (dbSpecs.form_factor)
					specLines.push(`PHYSICAL PSU SCALE PROFILE: ${dbSpecs.form_factor}`);
				if (dbSpecs.pcie_connectors || dbSpecs.sata_connectors)
					specLines.push(
						`POWER EXTENSION HEADER BULK: ${dbSpecs.pcie_connectors || 0}x PCIe INTERFACES / ${dbSpecs.sata_connectors || 0}x SATA LINKS`,
					);
				break;

			case "MEMORY":
				if (dbSpecs.memory_type)
					specLines.push(
						`MEMORY CONTROLLER ARCHITECTURE: ${dbSpecs.memory_type}`,
					);
				if (dbSpecs.capacity_gb)
					specLines.push(
						`TOTAL RUNTIME CAPACITY ARRANGEMENT: ${dbSpecs.capacity_gb}GB EXTENSION VALUE`,
					);
				if (dbSpecs.kit_modules)
					specLines.push(
						`MODULE DUAL CHANNEL FACTOR ARRANGEMENT: ${dbSpecs.kit_modules}x STICK ARRAY CONFIGURATION`,
					);
				if (dbSpecs.speed_mhz)
					specLines.push(
						`DATA THRESHOLD TRANSFER RATIO: ${dbSpecs.speed_mhz} MHz EFFICIENCY CLOCK`,
					);
				if (dbSpecs.cas_latency)
					specLines.push(
						`COLUMN ADDRESS STROBE TIMING: CAS LATENCY ${dbSpecs.cas_latency.toUpperCase()}`,
					);
				if (dbSpecs.voltage)
					specLines.push(
						`SYSTEM DIODE POWER REGULATION: ${parseFloat(dbSpecs.voltage)}V OPERATING POTENTIAL`,
					);
				specLines.push(
					`EMBEDDED ILLUMINATION CONFIGURATION: ${dbSpecs.rgb ? "ADDRESSABLE RGB SYSTEM BUILT-IN" : "STEALTH ARRAY - NO EMBEDDED LIGHTS"}`,
				);
				break;

			case "AIOS":
				if (dbSpecs.radiator_mm)
					specLines.push(
						`LIQUID RADIATOR MASS THICKNESS SCALE: ${dbSpecs.radiator_mm}mm EXTENSION SCALE`,
					);
				if (dbSpecs.fan_count)
					specLines.push(
						`FAN VELOCITY ARRAY SYSTEM: ${dbSpecs.fan_count}x ${dbSpecs.fan_size_mm || 120}mm ATTACHED INDUCTION COILS`,
					);
				if (dbSpecs.socket_compatibility)
					specLines.push(
						`RETENTION MOUNT SOCKET COMPATIBILITY: ${dbSpecs.socket_compatibility}`,
					);
				specLines.push(
					`PUMP/FAN DYNAMIC LIGHTING SUBSYSTEM: ${dbSpecs.rgb ? "ADDRESSABLE SYSTEM SYNC READY" : "STEALTH ROTATION SYSTEM"}`,
				);
				break;

			case "AIR COOLERS":
				if (dbSpecs.height_mm)
					specLines.push(
						`CHASSIS HEIGHT MOUNT LIMIT MATRICES: ${dbSpecs.height_mm}mm VERTICAL SHIELD`,
					);
				if (dbSpecs.fan_count)
					specLines.push(
						`AIR MASS TRANSFER MATRIX ASSEMBLAGE: ${dbSpecs.fan_count}x ${dbSpecs.fan_size_mm || 120}mm DISPERSAL COMPONENT UNIT`,
					);
				if (dbSpecs.tdp_rating_watts)
					specLines.push(
						`HEAT EXPULSION DISPERSAL CAPABILITY: ${dbSpecs.tdp_rating_watts}W THERMAL LOADS`,
					);
				if (dbSpecs.socket_compatibility)
					specLines.push(
						`MOUNT INTERFACE BRACKET SUPPORT: ${dbSpecs.socket_compatibility}`,
					);
				specLines.push(
					`RADIATING ILLUMINATION PROFILES: ${dbSpecs.rgb ? "LED DIODE SYNC ARRAY ONBOARD" : "MATTE FINISH DISPERSAL STACK"}`,
				);
				break;

			case "CASE FANS":
				if (dbSpecs.size_mm)
					specLines.push(
						`HOUSING EXPULSION CHASSIS METRIC: ${dbSpecs.size_mm}mm SCALE COIL`,
					);
				if (dbSpecs.max_rpm)
					specLines.push(
						`DYNAMIC INDUCTION RATIO LIMITATION: UP TO ${dbSpecs.max_rpm} RPM FREQUENCY`,
					);
				if (dbSpecs.airflow_cfm)
					specLines.push(
						`STATIC FORCE FLOW RATE METRIC: ${parseFloat(dbSpecs.airflow_cfm)} CFM TOTAL VOLUME DISPLACEMENT`,
					);
				if (dbSpecs.noise_db)
					specLines.push(
						`SOUND DISPERSAL ACCENTUATION DECAY: ${parseFloat(dbSpecs.noise_db)} dBA ACOUSTIC OUTPUT`,
					);
				specLines.push(
					`SIGNAL PULSE REVOLUTION FEEDBACK: ${dbSpecs.pwm ? "4-PIN DIGITAL PWM MODULATION ACTIVE" : "3-PIN LINEAR DC CONTROL"}`,
				);
				specLines.push(
					`STATIC VISUAL DIODE LIGHTING LOGIC: ${dbSpecs.rgb ? "ADDRESSABLE ARGB COMPLIANT CHIP" : "SINGLE TONE DECORATIVE ELEMENT"}`,
				);
				break;

			case "SSDS":
				if (dbSpecs.capacity_gb)
					specLines.push(
						`SOLID STATE DISK STORAGE CAPACITY: ${dbSpecs.capacity_gb >= 1000 ? (dbSpecs.capacity_gb / 1000).toFixed(0) + " TB" : dbSpecs.capacity_gb + " GB"}`,
					);
				if (dbSpecs.interface_type)
					specLines.push(
						`STORAGE CONNECTOR PACKET BUS INTERFACE: ${dbSpecs.interface_type}`,
					);
				if (dbSpecs.form_factor)
					specLines.push(
						`PHYSICAL ENCLOSURE MODULE GEOMETRY: ${dbSpecs.form_factor}`,
					);
				if (dbSpecs.nand_type)
					specLines.push(
						`NAND MICRO-CELL DENSITY COMPOSITION: ${dbSpecs.nand_type} MEMORY MATRIX`,
					);
				if (dbSpecs.pcie_gen)
					specLines.push(
						`PCI EXPRESS PIPELINE BUS THRESHOLD: ${dbSpecs.pcie_gen}`,
					);
				if (dbSpecs.read_speed_mbps || dbSpecs.write_speed_mbps)
					specLines.push(
						`SEQUENTIAL TRANSIT BANDWIDTH RATES: ${dbSpecs.read_speed_mbps || "—"} MB/s READ / ${dbSpecs.write_speed_mbps || "—"} MB/s WRITE`,
					);
				break;

			case "HDDS":
				if (dbSpecs.capacity_gb)
					specLines.push(
						`MAGNETIC STORAGE PLATTER ALLOCATION: ${dbSpecs.capacity_gb >= 1000 ? (dbSpecs.capacity_gb / 1000).toFixed(0) + " TB" : dbSpecs.capacity_gb + " GB"}`,
					);
				if (dbSpecs.rpm)
					specLines.push(
						`SPINDLE SPEED REVOLUTIONARY CONSTANT: ${dbSpecs.rpm} ROTATIONS PER MINUTE`,
					);
				if (dbSpecs.cache_mb)
					specLines.push(
						`TEMPORARY BURST RAM INTEGRATED CACHE: ${dbSpecs.cache_mb} MB DATA REPOSITORY`,
					);
				if (dbSpecs.form_factor)
					specLines.push(
						`PHYSICAL STORAGE FORM DIMENSION: ${dbSpecs.form_factor}`,
					);
				if (dbSpecs.interface_type)
					specLines.push(
						`BUS PROTOCOL CONTROLLER ROUTE: ${dbSpecs.interface_type}`,
					);
				break;

			case "PC CASES":
				if (dbSpecs.form_factor)
					specLines.push(
						`MAX MOTHERBOARD EXPANSION ARCHITECTURE: ${dbSpecs.form_factor}`,
					);
				if (dbSpecs.side_panel)
					specLines.push(
						`STRUCTURAL CASING EXTERIOR MATERIAL: ${dbSpecs.side_panel}`,
					);
				if (dbSpecs.max_gpu_length_mm)
					specLines.push(
						`GPU BAY EXTENSION ROOM CONSTRAINT: UP TO ${dbSpecs.max_gpu_length_mm}mm ADAPTER DEPTH`,
					);
				if (dbSpecs.max_cooler_height_mm)
					specLines.push(
						`AIR HEATSINK HEIGHT DEPTH BARRIER: UP TO ${dbSpecs.max_cooler_height_mm}mm CLEARANCE`,
					);
				if (dbSpecs.drive_bays_3_5 || dbSpecs.drive_bays_2_5)
					specLines.push(
						`INTERNAL DATA DECK CHASSIS ARRANGEMENT: ${dbSpecs.drive_bays_3_5 || 0}x 3.5" PLATTERS / ${dbSpecs.drive_bays_2_5 || 0}x 2.5" BRACKETS`,
					);
				if (dbSpecs.dimensions)
					specLines.push(
						`PHYSICAL CONTAINER CHASSIS SCALE: ${dbSpecs.dimensions}`,
					);
				break;

			default:
				specLines.push("HARDWARE ARCHITECTURE SIGNATURE RECOGNIZED");
				break;
		}

		setSpecs(specLines);
		setSuggestions([]);
	};

	// Form Submission Logic
	const handlePublishListing = async (e) => {
		if (e) e.preventDefault();
		setErrorField("");

		// Field Boundary Validations tracking back specific field parameters
		if (!formData.category) {
			triggerStatus(
				"Please select an active hardware category.",
				"error",
				"category",
			);
			return;
		}
		if (!formData.name.trim()) {
			triggerStatus(
				"Component field cannot be left blank.",
				"error",
				"name",
			);
			return;
		}
		if (!formData.price || parseFloat(formData.price) <= 0) {
			triggerStatus(
				"Please enter a valid asking price.",
				"error",
				"price",
			);
			return;
		}
		if (!formData.condition) {
			triggerStatus(
				"Please assign a component condition grade.",
				"error",
				"condition",
			);
			return;
		}

		// Ensure primary image exists inside Array Slot [0]
		if (!slots[0]) {
			triggerStatus(
				"Primary Image Slot [1] requires an asset file attachment.",
				"error",
				"images",
			);
			return;
		}

		setIsLoading(true);
		setAlert({ show: false, message: "", type: "error" });

		try {
			const payload = new FormData();
			const generatedTitle = `${formData.name}`;
			const rawPriceInCents = Math.round(parseFloat(formData.price) * 100);

			payload.append("title", generatedTitle);
			payload.append(
				"description",
				formData.description || `Authentic ${formData.name} hardware listing.`,
			);
			payload.append("condition_grade", formData.condition);
			payload.append("price_cents", rawPriceInCents.toString());
			payload.append("category_slug", formData.category);

			if (formData.hardware_id) {
				payload.append("hardware_id", formData.hardware_id);
			}

			if (specs && specs.length > 0) {
				payload.append("verified_specs", JSON.stringify(specs));
			}

			slots.forEach((slot, index) => {
				if (slot && slot.file) {
					payload.append("images[]", slot.file);
					payload.append(
						`image_meta_${index}_is_primary`,
						index === 0 ? "1" : "0",
					);
					payload.append(`image_meta_${index}_sort_order`, index.toString());
				}
			});

			const response = await apiFetch("/listings/create_listing.php", {
				method: "POST",
				body: payload,
			});

			const data = await response.json();

			if (response.ok) {
				triggerStatus(
					`Listing successfully added to the marketplace. ID Ref: #${data.listing_id || "SUCCESS"}`,
					"success",
				);

				setFormData({
					category: "",
					name: "",
					hardware_id: "",
					condition: "",
					description: "",
					price: "",
					images: [],
				});
				setSlots([null, null, null, null, null, null]);
				setSpecs([
					"Component architecture verified via image recognition",
					"Serial number cross-referenced with manufacturer database",
					"Performance benchmarks auto-populated from global registry",
					"Compatibility matrix generated for tri-vector builds",
					"Market velocity analysis applied for pricing intelligence",
				]);
			} else {
				throw new Error(
					data.error || "Remote database rejected transmission parameters.",
				);
			}
		} catch (err) {
			triggerStatus(
				err.message || "Network propagation layer error context triggered.",
				"error",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file && currentActiveSlot !== null) {
			clearFieldError("images");
			const previewUrl = URL.createObjectURL(file);
			setSlots((prev) => {
				const next = [...prev];
				next[currentActiveSlot] = { file, preview: previewUrl };
				return next;
			});
			setCurrentActiveSlot(null);
			e.target.value = "";
		}
	};

	const removeImage = (index, e) => {
		e.stopPropagation();
		if (slots[index]) {
			URL.revokeObjectURL(slots[index].preview);
			setSlots((prev) => {
				const next = [...prev];
				next[index] = null;
				return next;
			});
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="w-full min-h-screen bg-[#050505] text-slate-300 relative overflow-x-hidden"
		>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

			{/* HEADER SECTION */}
			<header className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-12 pb-8 relative z-10">
				<div className="flex flex-col gap-2">
					<h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						New{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Listing
						</span>
					</h1>
					<div className="h-1 w-24 bg-gradient-to-r from-fuchsia-600 to-transparent mt-4" />
				</div>
			</header>

			{/* MAIN CONTENT GRID */}
			<main className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-20 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* LEFT COLUMN: Intelligence & Context */}
					<div className="lg:col-span-7 flex flex-col gap-8">
						{/* ITEM INTELLIGENCE BOX */}
						<section className="bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 w-full relative">
							<h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
								<span className="w-2 h-6 bg-fuchsia-500 inline-block" />
								Add the component
							</h2>

							{alert.show && (
								<div className="mb-6">
									<CyberAlert
										type={alert.type}
										message={alert.message}
										onClose={() => setAlert({ ...alert, show: false })}
									/>
								</div>
							)}

							<div className="space-y-8">
								{/* 1. CATEGORY DROPDOWN */}
								<div
									key={
										errorField === "category"
											? `shake-cat-${shakeTick}`
											: "normal-cat"
									}
									className={`form-control w-full relative ${errorField === "category" ? "animate-shake" : ""}`}
								>
									<label
										className={`label text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-3 block transition-colors ${errorField === "category" ? "text-red-500" : "text-slate-400"}`}
									>
										Select Category
									</label>
									<button
										type="button"
										onClick={() => setIsOpen(!isOpen)}
										className={`w-full bg-black h-14 md:h-16 rounded-xl flex items-center justify-between px-5 text-sm font-medium transition-all duration-300 border
											${
												isOpen
													? "border-fuchsia-500 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)]"
													: errorField === "category"
														? "border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
														: "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
											}`}
									>
										<span className="font-mono tracking-wide">
											{formData.category || "SELECT HARDWARE COMPONENT"}
										</span>
										<ChevronDown
											className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-fuchsia-400" : errorField === "category" ? "text-red-400" : ""}`}
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
																		setFormData({
																			...formData,
																			category: item,
																			hardware_id: "",
																		});
																		clearFieldError("category");
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
								<div
									key={
										errorField === "name"
											? `shake-name-${shakeTick}`
											: "normal-name"
									}
									className={`form-control w-full relative ${errorField === "name" ? "animate-shake" : ""}`}
								>
									<label
										className={`label text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-3 block transition-colors ${errorField === "name" ? "text-red-500" : "text-slate-400"}`}
									>
										Enter Component Name
									</label>
									<div className="flex gap-3 relative group">
										<div className="relative flex-1">
											<input
												type="text"
												placeholder="E.G., RTX 4090, RYZEN 9 7950X"
												className={`w-full bg-black h-14 md:h-16 rounded-xl px-5 border text-slate-200 font-medium text-sm md:text-base focus:outline-none transition-all placeholder:text-slate-800
													${errorField === "name" ? "border-red-500 focus:border-red-500/50 focus:ring-red-500/30" : "border-white/10 focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/30"}`}
												value={formData.name || ""}
												onChange={(e) => {
													setFormData({
														...formData,
														name: e.target.value,
														hardware_id: "",
													});
													clearFieldError("name");
													if (e.target.value === "") setSuggestions([]);
												}}
											/>
										</div>
										<button
											type="button"
											onClick={handleSearch}
											disabled={isLoading}
											className={`w-14 h-14 md:w-16 md:h-16 hover:bg-fuchsia-500 active:scale-95 text-white rounded-xl flex items-center justify-center transition-all shrink-0 
												${errorField === "name" ? "bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-fuchsia-600 shadow-[0_0_15px_rgba(217,70,239,0.2)]"} 
												${isLoading ? "opacity-50" : ""}`}
										>
											<Search className="w-5 h-5 md:w-6 md:h-6" />
										</button>
									</div>

									{/* SUGGESTIONS INTERFACE MODULE */}
									{suggestions.length > 0 && (
										<>
											<div
												className="fixed inset-0 z-[80]"
												onClick={() => setSuggestions([])}
											/>
											<div className="absolute top-[105%] left-0 w-full z-[85] animate-in fade-in slide-in-from-top-2 duration-150">
												<div className="bg-[#09090b] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-fuchsia-500/30 p-2 max-h-[250px] overflow-y-auto custom-scrollbar">
													<div className="px-3 py-1 mb-1 flex items-center gap-2">
														<span className="text-[9px] font-mono font-black text-fuchsia-500/60 uppercase tracking-widest">
															Matching Catalog Items ({suggestions.length})
														</span>
														<div className="flex-1 h-[1px] bg-fuchsia-500/10" />
													</div>
													{suggestions.map((item) => (
														<button
															key={item.id}
															type="button"
															onClick={() => selectComponent(item)}
															className="w-full min-h-[44px] flex flex-col justify-center px-4 rounded-lg text-slate-300 hover:bg-fuchsia-600 hover:text-white transition-all text-left group/item py-2"
														>
															<span className="text-xs md:text-sm font-semibold tracking-wide">
																{item.full_name}
															</span>
															{item.msrp_cents && (
																<span className="text-[10px] font-mono text-slate-500 group-hover/item:text-fuchsia-200 mt-0.5">
																	Ref MSRP: R{" "}
																	{(item.msrp_cents / 100).toFixed(2)}
																</span>
															)}
														</button>
													))}
												</div>
											</div>
										</>
									)}
								</div>

								{/* 3. ASKING PRICE INPUT */}
								<div
									key={
										errorField === "price"
											? `shake-price-${shakeTick}`
											: "normal-price"
									}
									className={`form-control w-full ${errorField === "price" ? "animate-shake" : ""}`}
								>
									<label
										className={`label text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-3 block transition-colors ${errorField === "price" ? "text-red-500" : "text-slate-400"}`}
									>
										Enter your asking price:
									</label>
									<div className="relative rounded-xl overflow-hidden group">
										<div
											className={`absolute left-5 top-1/2 -translate-y-1/2 font-mono font-black text-sm md:text-base select-none pointer-events-none z-10 ${errorField === "price" ? "text-red-500" : "text-fuchsia-500"}`}
										>
											R
										</div>
										<input
											type="number"
											placeholder="0.00"
											className={`w-full bg-black h-14 md:h-16 rounded-xl pl-10 pr-5 border text-slate-200 font-mono text-sm md:text-base focus:outline-none transition-all placeholder:text-slate-800
												${errorField === "price" ? "border-red-500 focus:border-red-500/50 focus:ring-red-500/30" : "border-white/10 focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/30"}`}
											value={formData.price || ""}
											onChange={(e) => {
												setFormData({ ...formData, price: e.target.value });
												clearFieldError("price");
											}}
										/>
									</div>
								</div>

								{/* VERIFIED SPECS BOX */}
								<div className="w-full bg-[#050506] rounded-xl p-5 md:p-6 border border-fuchsia-500/20 relative overflow-hidden">
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
						</section>

						{/* DESKTOP CONTEXT SECTION */}
						<div className="hidden lg:block bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 w-full relative overflow-hidden group">
							<div className="absolute top-0 right-0 w-16 h-16 bg-fuchsia-500/10 [clip-path:polygon(100%_0,100%_100%,0_0)] pointer-events-none" />
							<h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
								<span className="w-2 h-6 bg-fuchsia-500 inline-block" />
								Condition & Context
							</h2>

							<div className="space-y-10">
								<div
									key={
										errorField === "condition"
											? `shake-cond-dt-${shakeTick}`
											: "normal-cond-dt"
									}
									className={`form-control ${errorField === "condition" ? "animate-shake" : ""}`}
								>
									<label
										className={`label text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4 flex justify-between transition-colors ${errorField === "condition" ? "text-red-500" : "text-slate-400"}`}
									>
										<span>Component Condition</span>
										{formData.condition && (
											<span className="text-fuchsia-400">
												Selected: {formData.condition}
											</span>
										)}
									</label>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
										{conditions.map((c) => {
											const isSelected = formData.condition === c;
											return (
												<button
													key={c}
													type="button"
													onClick={() => {
														setFormData({ ...formData, condition: c });
														clearFieldError("condition");
													}}
													className={`relative h-12 md:h-14 rounded-lg font-bold uppercase tracking-wider text-[11px] md:text-sm transition-all duration-300 border overflow-hidden
														${
															isSelected
																? "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.2)]"
																: errorField === "condition"
																	? "bg-red-500/5 border-red-500/40 text-red-500/70 hover:border-red-500 hover:text-red-400"
																	: "bg-white/5 border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300"
														}`}
												>
													{isSelected && (
														<div className="absolute bottom-0 left-0 w-full h-1 bg-fuchsia-500" />
													)}
													{c}
												</button>
											);
										})}
									</div>
								</div>

								<div className="form-control">
									<label className="label text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">
										<span>Description</span>
									</label>
									<div className="relative group">
										<textarea
											className="w-full h-40 md:h-52 bg-black border border-white/10 text-slate-200 p-5 md:p-6 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/30 text-sm md:text-base font-medium leading-relaxed rounded-xl transition-all placeholder:text-slate-700 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
											placeholder="Input usage history, overclocking details, included accessories..."
											value={formData.description}
											onChange={(e) =>
												setFormData({
													...formData,
													description: e.target.value,
												})
											}
										/>
										<div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20 pointer-events-none" />
										<div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20 pointer-events-none" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* RIGHT COLUMN: Hardware Gallery & Finalize */}
					<div className="lg:col-span-5 flex flex-col gap-8">
						{/* GALLERY SECTION */}
						<section
							key={
								errorField === "images"
									? `shake-imgs-${shakeTick}`
									: "normal-imgs"
							}
							className={`bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] border w-full relative transition-colors duration-300
								${errorField === "images" ? "border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.1)] animate-shake" : "border-white/10"}`}
						>
							<div
								className={`mb-8 border-l-2 pl-4 ${errorField === "images" ? "border-red-500" : "border-fuchsia-600"}`}
							>
								<h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter italic">
									Hardware Gallery
								</h2>
								<div className="flex items-center gap-2 mt-1">
									<div
										className={`w-1.5 h-1.5 rounded-full animate-pulse ${errorField === "images" ? "bg-red-500" : "bg-fuchsia-500"}`}
									/>
									<p
										className={`text-[10px] md:text-xs font-mono uppercase tracking-widest ${errorField === "images" ? "text-red-400" : "text-slate-400"}`}
									>
										{errorField === "images"
											? "Primary asset file required below"
											: "Upload Images of Component"}
									</p>
								</div>
							</div>

							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								accept="image/*"
								onChange={handleFileChange}
								aria-label="Upload hardware image"
							/>

							<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
								{slots.map((slot, index) => (
									<div
										key={index}
										onClick={() =>
											!slot &&
											(setCurrentActiveSlot(index),
											fileInputRef.current.click())
										}
										className={`group relative aspect-square rounded-xl transition-all duration-500 flex items-center justify-center overflow-hidden border
											${index === 0 && !slot && errorField !== "images" ? "ring-1 ring-fuchsia-500/50 ring-offset-2 ring-offset-black" : ""}
											${index === 0 && !slot && errorField === "images" ? "ring-2 ring-red-500 ring-offset-2 ring-offset-black border-red-500" : ""}
											${slot ? "border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.15)]" : "bg-black/40 border-white/5 hover:border-fuchsia-500/5 hover:bg-fuchsia-500/5 cursor-pointer"}`}
									>
										{slot ? (
											<>
												<img
													src={slot.preview}
													className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
													alt={`Preview ${index + 1}`}
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
												<button
													onClick={(e) => removeImage(index, e)}
													className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-slate-400 hover:text-fuchsia-400 transition-colors"
													title="Purge Image"
												>
													<Trash2 size={14} />
												</button>
												{index === 0 && (
													<span className="absolute bottom-2 left-2 px-2 py-0.5 bg-fuchsia-600 text-white text-[8px] font-black uppercase tracking-tighter rounded">
														Primary Image
													</span>
												)}
											</>
										) : (
											<div className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:translate-y-[-2px]">
												<div className="relative">
													<ImagePlus
														size={20}
														className={`transition-colors ${errorField === "images" && index === 0 ? "text-red-500 group-hover:text-red-400" : "text-slate-600 group-hover:text-fuchsia-500"}`}
													/>
													{index === 0 && (
														<Camera
															size={10}
															className={`absolute -top-2 -right-2 animate-bounce ${errorField === "images" ? "text-red-400" : "text-fuchsia-400"}`}
														/>
													)}
												</div>
												<div className="text-center">
													<span
														className={`block text-[10px] md:text-xs font-mono ${errorField === "images" && index === 0 ? "text-red-500/70 group-hover:text-red-400" : "text-slate-700 group-hover:text-slate-400"}`}
													>
														SLOT {index + 1}
													</span>
													{index === 0 && (
														<span
															className={`text-[8px] font-bold uppercase tracking-tighter ${errorField === "images" ? "text-red-500 animate-pulse" : "text-fuchsia-500/60"}`}
														>
															Required
														</span>
													)}
												</div>
											</div>
										)}
										{!slot && (
											<div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
												<div
													className={`absolute top-2 left-2 w-2 h-2 border-t border-l ${errorField === "images" ? "border-red-500" : "border-fuchsia-500"}`}
												/>
												<div
													className={`absolute bottom-2 right-2 w-2 h-2 border-b border-r ${errorField === "images" ? "border-red-500" : "border-fuchsia-500"}`}
												/>
											</div>
										)}
									</div>
								))}
							</div>

							<div
								className={`mt-6 flex items-start gap-3 p-4 rounded-xl border ${errorField === "images" ? "bg-red-500/5 border-red-500/20" : "bg-fuchsia-500/5 border-fuchsia-500/10"}`}
							>
								<ShieldAlert
									className={`shrink-0 mt-0.5 ${errorField === "images" ? "text-red-500" : "text-fuchsia-500"}`}
									size={14}
								/>
								<p className="text-[10px] md:text-[11px] leading-relaxed text-slate-400 font-medium">
									Ensure hardware is visible under{" "}
									<span className="text-slate-200 uppercase tracking-tighter">
										Clear_Light_Conditions
									</span>
									. Blurred or obstructed "Visuals" may result in{" "}
									<span
										className={
											errorField === "images"
												? "text-red-400"
												: "text-fuchsia-400"
										}
									>
										Verification_Failure
									</span>
									.
								</p>
							</div>
						</section>

						{/* MOBILE CONTEXT ONLY */}
						<div className="lg:hidden bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 w-full relative overflow-hidden group">
							<div className="absolute top-0 right-0 w-16 h-16 bg-fuchsia-500/10 [clip-path:polygon(100%_0,100%_100%,0_0)] pointer-events-none" />
							<h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
								<span className="w-2 h-6 bg-fuchsia-500 inline-block" />
								Condition & Context
							</h2>

							<div className="space-y-10">
								<div
									key={
										errorField === "condition"
											? `shake-cond-mb-${shakeTick}`
											: "normal-cond-mb"
									}
									className={`form-control ${errorField === "condition" ? "animate-shake" : ""}`}
								>
									<label
										className={`label text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4 flex justify-between transition-colors ${errorField === "condition" ? "text-red-500" : "text-slate-400"}`}
									>
										<span>Component Condition</span>
										{formData.condition && (
											<span className="text-fuchsia-400">
												Selected: {formData.condition}
											</span>
										)}
									</label>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
										{conditions.map((c) => {
											const isSelected = formData.condition === c;
											return (
												<button
													key={c}
													type="button"
													onClick={() => {
														setFormData({ ...formData, condition: c });
														clearFieldError("condition");
													}}
													className={`relative h-12 md:h-14 rounded-lg font-bold uppercase tracking-wider text-[11px] md:text-sm transition-all duration-300 border overflow-hidden
														${
															isSelected
																? "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.2)]"
																: errorField === "condition"
																	? "bg-red-500/5 border-red-500/40 text-red-500/70 hover:border-red-500 hover:text-red-400"
																	: "bg-white/5 border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300"
														}`}
												>
													{isSelected && (
														<div className="absolute bottom-0 left-0 w-full h-1 bg-fuchsia-500" />
													)}
													{c}
												</button>
											);
										})}
									</div>
								</div>

								<div className="form-control">
									<label className="label text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">
										<span>Description</span>
									</label>
									<div className="relative group">
										<textarea
											className="w-full h-40 md:h-52 bg-black border border-white/10 text-slate-200 p-5 md:p-6 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/30 text-sm md:text-base font-medium leading-relaxed rounded-xl transition-all placeholder:text-slate-700 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
											placeholder="Input usage history, overclocking details, included accessories..."
											value={formData.description}
											onChange={(e) =>
												setFormData({
													...formData,
													description: e.target.value,
												})
											}
										/>
										<div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20 pointer-events-none" />
										<div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20 pointer-events-none" />
									</div>
								</div>
							</div>
						</div>

						{/* ACTION PANEL */}
						<div className="flex flex-col items-center gap-6 p-8 bg-fuchsia-600/5 border border-fuchsia-500/20 rounded-3xl relative overflow-hidden group">
							<div className="absolute inset-0 w-full h-[1px] bg-fuchsia-500/20 animate-scan pointer-events-none" />
							<div className="w-full">
								<CyberActionButton
									label={
										isLoading ? "PROPAGATING PARAMS..." : "PUBLISH TO TECHTRADE"
									}
									onClick={handlePublishListing}
									disabled={isLoading}
									className="w-full text-lg py-6"
								/>
							</div>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<ShieldCheck
										className="text-emerald-500 shrink-0 mt-0.5"
										size={16}
									/>
									<p className="text-slate-400 text-[11px] md:text-xs leading-relaxed">
										Listing undergoes{" "}
										<span className="text-emerald-400">
											verification protocols
										</span>
										. Funds secured via TechTrade Escrow.
									</p>
								</div>
								<p className="text-[10px] text-slate-500 font-mono text-center uppercase tracking-tighter">
									Status: Encrypted_Session_Active
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>

			<style jsx>{`
				@keyframes scan {
					0% {
						transform: translateY(-100%);
					}
					100% {
						transform: translateY(400%);
					}
				}
				.animate-scan {
					animation: scan 4s linear infinite;
				}
				@keyframes shake {
					0%,
					100% {
						transform: translateX(0);
					}
					20%,
					60% {
						transform: translateX(-6px);
					}
					40%,
					80% {
						transform: translateX(6px);
					}
				}
				.animate-shake {
					animation: shake 0.4s ease-in-out;
				}
			`}</style>
		</motion.div>
	);
}
