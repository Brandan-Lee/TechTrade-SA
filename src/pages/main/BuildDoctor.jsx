import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
	Cpu,
	Monitor,
	Zap,
	Search,
	ShieldCheck,
	Trash2,
	Loader2,
	Layers,
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import CyberActionButton from "../../components/ui/CyberActionButton";
import { apiFetch } from "../../lib/api";
import CyberAlert from "../../components/ui/CyberAlert";

const API_CATEGORY_NAMES = {
	CPU: "CPUs",
	GPU: "GPUs",
	PSU: "PSUs",
};

function RenderModule({
	title,
	icon: Icon,
	category,
	value,
	specLines,
	dropdown,
	onValueChange,
	onSearch,
	onSelectComponent,
	onCloseDropdown,
	onFocusCategory,
	error,
	shakeTick,
}) {
	const isOpen = dropdown.category === category && dropdown.list.length > 0;

	return (
		<section
			key={
				error
					? `shake-${category.toLowerCase()}-${shakeTick}`
					: `normal-${category.toLowerCase()}`
			}
			className={`w-full bg-[#0c0c0e]/90 backdrop-blur-md rounded-2xl p-6 border ${
				error
					? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
					: "border-white/10"
			} ${error ? "animate-shake" : ""}`}
		>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-4 w-full">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-lg flex items-center justify-center text-fuchsia-400">
							<Icon size={18} />
						</div>
						<h3 className="text-white font-black uppercase tracking-wider text-sm sm:text-base md:text-lg">
							{title}
						</h3>
					</div>

					<div className="relative">
						<div className="flex gap-2">
							<input
								value={value || ""}
								onChange={(e) => onValueChange(e.target.value)}
								onFocus={() => onFocusCategory(category)}
								className={`w-full h-12 px-4 bg-black border ${
									error
										? "border-red-500/30 focus:ring-red-500"
										: "border-white/10 focus:ring-fuchsia-500"
								} rounded-xl text-xs sm:text-sm outline-none focus:ring-1`}
								placeholder={`Search ${title}...`}
							/>
							<button
								type="button"
								onClick={() => onSearch(value)}
								className="p-3 bg-fuchsia-600 rounded-xl shrink-0 text-white"
							>
								<Search size={18} />
							</button>
						</div>

						{isOpen && (
							<>
								<div
									className="fixed inset-0 z-[80]"
									aria-hidden
									onClick={onCloseDropdown}
								/>
								<div className="absolute top-[calc(100%+8px)] left-0 w-full z-[85] animate-in fade-in slide-in-from-top-2 duration-150">
									<div className="bg-[#09090b] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-fuchsia-500/30 p-2 max-h-[250px] overflow-y-auto">
										{dropdown.list.map((item) => (
											<button
												key={item.id}
												type="button"
												onMouseDown={(e) => e.preventDefault()}
												onClick={() => onSelectComponent(item)}
												className="w-full p-3 text-left hover:bg-fuchsia-600/20 text-xs sm:text-sm -slate-300 hover:text-white rounded-lg border-b border-white/5 last:border-0"
											>
												{item.full_name}
											</button>
										))}
									</div>
								</div>
							</>
						)}
					</div>
				</div>
				<div className="w-full bg-black/50 border border-fuchsia-500/10 rounded-xl p-4 min-h-[120px]">
					<div className="flex items-center gap-2 mb-3">
						<ShieldCheck size={14} className="text-fuchsia-500" />
						<span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">
							Verified Details
						</span>
					</div>
					<div className="space-y-1">
						{specLines.map((line, i) => (
							<div
								key={i}
								className="text-[11px] sm:text-xs md:text-sm text-fuchsia-400/90 font-mono py-1 border-b border-white/[0.03] last:border-0"
							>
								{line}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default function BuildDoctor() {
	const { user, isLoading: authLoading } = useAuth();
	const containerRef = useRef(null);

	const [editingBuildId, setEditingBuildId] = useState(null);
	const [buildName, setBuildName] = useState("");
	const [isDataFetching, setIsDataFetching] = useState(false);

	const [formData, setFormData] = useState({
		cpu: { name: "", id: null },
		gpu: { name: "", id: null },
		psu: { name: "", id: null },
	});

	const [dropdown, setDropdown] = useState({ category: null, list: [] });
	const [specs, setSpecs] = useState({
		cpu: ["Please search for your CPU to add its details"],
		gpu: ["Please search for your GPU to add its details"],
		psu: ["Please search for your PSU to add its details"],
	});

	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});

	const triggerStatus = (message, type = "error", fieldName = "") => {
		if (containerRef.current) {
			containerRef.current.scrollIntoView({ behavior: "smooth" });
		}
		setAlert({ show: true, message, type });

		if (type === "error" && fieldName) {
			setErrorField("");
			setShakeTick((tick) => tick + 1);
			requestAnimationFrame(() => setErrorField(fieldName));
		} else {
			setErrorField("");
		}
	};

	const closeDropdown = () => setDropdown({ category: null, list: [] });

	useEffect(() => {
		const fetchUserBuild = async () => {
			if (!user) return;
			setIsDataFetching(true);
			try {
				const response = await apiFetch("/build_doctor/get_user_build.php", {
					method: "GET",
					headers: { Accept: "application/json" },
				});

				if (response.ok) {
					const data = await response.json();
					if (data && data.id) {
						setEditingBuildId(data.id);
						setBuildName(data.name || "Untitled Build");
						setFormData({
							cpu: { name: data.cpu_display_name || "", id: data.cpu_id },
							gpu: { name: data.gpu_display_name || "", id: data.gpu_id },
							psu: { name: data.psu_display_name || "", id: data.psu_id },
						});
						setSpecs({
							cpu: data.cpu_specs || ["Verified details could not be loaded."],
							gpu: data.gpu_specs || ["Verified details could not be loaded."],
							psu: data.psu_specs || ["Verified details could not be loaded."],
						});
					}
				}
			} catch (err) {
				console.error("Failed to fetch current user configuration:", err);
			} finally {
				setIsDataFetching(false);
			}
		};

		if (!authLoading) {
			fetchUserBuild();
		}
	}, [user, authLoading]);

	const titleForCategory = (category) => {
		switch (category) {
			case "CPU":
				return "CPUs";
			case "GPU":
				return "GPUs";
			case "PSU":
				return "PSUs";
			default:
				return "components";
		}
	};

	const handleSearch = async (category, query) => {
		const q = (query ?? "").trim();
		const apiCategory = API_CATEGORY_NAMES[category];

		if (!q) {
			triggerStatus(
				"Enter a search term before searching.",
				"error",
				category.toLowerCase(),
			);
			return;
		}

		if (!apiCategory) {
			triggerStatus("Unknown category.", "error");
			return;
		}

		setAlert((prev) => ({ ...prev, show: false }));

		try {
			const response = await apiFetch("/hardware_intelligence/search.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ q, category: apiCategory }),
			});
			const data = await response.json();

			if (!response.ok || data?.error) {
				triggerStatus(
					data?.error || "Search failed. Try again.",
					"error",
					category.toLowerCase(),
				);
				return;
			}

			const list = Array.isArray(data) ? data : [];

			if (list.length === 0) {
				triggerStatus(
					`No matching ${titleForCategory(category)} found in the list.`,
					"error",
					category.toLowerCase(),
				);
				return;
			}

			setDropdown({ category, list });
		} catch (err) {
			console.error("Search failed", err);
			triggerStatus(
				"Connection to the list failed.",
				"error",
				category.toLowerCase(),
			);
		}
	};

	const selectComponent = (component, category) => {
		const dbSpecs = component.specs || {};
		const catKey = category.toLowerCase();

		const specLines = [
			`MAKER: ${component.brand.toUpperCase()}`,
			`MODEL: ${component.model.toUpperCase()}`,
		];

		switch (category.toUpperCase()) {
			case "GPU":
				if (dbSpecs.chipset) specLines.push(`CHIPSET: ${dbSpecs.chipset}`);
				if (dbSpecs.vram_gb)
					specLines.push(
						`MEMORY: ${parseFloat(dbSpecs.vram_gb)} GB ${dbSpecs.vram_type || ""}`,
					);
				if (dbSpecs.boost_clock_mhz)
					specLines.push(
						`SPEED: ${dbSpecs.core_clock_mhz || "—"} MHz BASE / ${dbSpecs.boost_clock_mhz} MHz BOOST`,
					);
				if (dbSpecs.pcie_version)
					specLines.push(`INTERFACE: ${dbSpecs.pcie_version}`);
				if (dbSpecs.power_connectors)
					specLines.push(`POWER CONNECTORS: ${dbSpecs.power_connectors}`);
				if (dbSpecs.tdp_watts)
					specLines.push(`POWER USAGE: ${dbSpecs.tdp_watts}W`);
				if (dbSpecs.outputs) specLines.push(`PORTS: ${dbSpecs.outputs}`);
				if (dbSpecs.length_mm)
					specLines.push(
						`SIZE: ${dbSpecs.length_mm}mm LENGTH / ${dbSpecs.slot_width || "—"} SLOT WIDTH`,
					);
				break;
			case "CPU":
				if (dbSpecs.socket) specLines.push(`SOCKET: ${dbSpecs.socket}`);
				if (dbSpecs.architecture)
					specLines.push(`ARCHITECTURE: ${dbSpecs.architecture}`);
				if (dbSpecs.cores)
					specLines.push(
						`CORES: ${dbSpecs.cores} CORES / ${dbSpecs.threads || dbSpecs.cores * 2} THREADS`,
					);
				if (dbSpecs.boost_clock_ghz)
					specLines.push(
						`SPEED: ${parseFloat(dbSpecs.base_clock_ghz) || "—"} GHz BASE / ${parseFloat(dbSpecs.boost_clock_ghz)} GHz BOOST`,
					);
				if (dbSpecs.tdp_watts)
					specLines.push(`POWER USAGE: ${dbSpecs.tdp_watts}W`);
				if (dbSpecs.integrated_graphics)
					specLines.push(`BUILT-IN GRAPHICS: ${dbSpecs.integrated_graphics}`);
				specLines.push(
					`OVERCLOCKING: ${dbSpecs.unlocked ? "UNLOCKED" : "LOCKED"}`,
				);
				break;
			case "PSU":
				if (dbSpecs.wattage)
					specLines.push(`TOTAL POWER: ${dbSpecs.wattage} WATTS`);
				if (dbSpecs.efficiency_rating)
					specLines.push(
						`EFFICIENCY: 80 PLUS ${dbSpecs.efficiency_rating.replace("80+", "").trim()}`,
					);
				if (dbSpecs.modular_type)
					specLines.push(
						`CABLES: ${dbSpecs.modular_type.replace("_", " ").toUpperCase()}`,
					);
				if (dbSpecs.form_factor) specLines.push(`SIZE: ${dbSpecs.form_factor}`);
				if (dbSpecs.pcie_connectors || dbSpecs.sata_connectors)
					specLines.push(
						`CONNECTIONS: ${dbSpecs.pcie_connectors || 0}x PCIe / ${dbSpecs.sata_connectors || 0}x SATA`,
					);
				break;
			default:
				specLines.push("COMPONENT RECOGNIZED");
				break;
		}

		setSpecs((prev) => ({ ...prev, [catKey]: specLines }));
		setFormData((prev) => ({
			...prev,
			[catKey]: { name: component.full_name, id: component.id },
		}));
		closeDropdown();
		if (errorField === catKey) {
			setErrorField("");
		}
	};

	const updateField = (category, value) => {
		const catKey = category.toLowerCase();
		setAlert({ show: false, message: "", type: "error" });
		if (errorField === catKey) {
			setErrorField("");
		}
		setFormData((prev) => ({
			...prev,
			[catKey]: { name: value, id: null },
		}));
	};

	const handleFocusCategory = (category) => {
		setDropdown((prev) =>
			prev.category && prev.category !== category
				? { category: null, list: [] }
				: prev,
		);
	};

	const handleSaveOrUpdateBuild = async () => {
		setAlert({ show: false, message: "", type: "error" });
		setErrorField("");

		if (!user) {
			triggerStatus(
				"Please log in or create an account to save custom lists.",
				"error",
			);
			return;
		}

		if (!formData.cpu.id && !formData.gpu.id && !formData.psu.id) {
			triggerStatus(
				"Your list must contain at least one component",
				"error",
				"cpu",
			);
			return;
		}

		let activeName = buildName;
		if (!activeName || activeName.trim() === "") {
			const requestedName = prompt(
				"Enter a name for your custom list:",
				"My Custom List",
			);
			if (!requestedName || requestedName.trim() === "") {
				triggerStatus("A list name is required.", "error");
				return;
			}
			activeName = requestedName.trim();
			setBuildName(activeName);
		}

		const targetEndpoint = editingBuildId
			? "/build_doctor/update_user_build.php"
			: "/build_doctor/save_user_build.php";

		try {
			const response = await apiFetch(targetEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					build_id: editingBuildId,
					name: activeName,
					cpu_id: formData.cpu.id,
					gpu_id: formData.gpu.id,
					psu_id: formData.psu.id,
					cpu_display_name: formData.cpu.name,
					gpu_display_name: formData.gpu.name,
					psu_display_name: formData.psu.name,
					cpu_specs: specs.cpu,
					gpu_specs: specs.gpu,
					psu_specs: specs.psu,
				}),
			});

			const data = await response.json();

			if (response.ok && (data.success || data.build_id)) {
				triggerStatus(
					editingBuildId
						? "Changes saved!"
						: "Your Custom List has been added successfully",
					"success",
				);
				if (!editingBuildId && data.build_id) {
					setEditingBuildId(data.build_id);
				}
			} else {
				throw new Error(
					data.error || "There was a problem processing your details.",
				);
			}
		} catch (err) {
			triggerStatus(err.message || "Failed to finalize changes.", "error");
		}
	};

	const handleDeleteBuild = async () => {
		if (!editingBuildId) return;

		setAlert({ show: false, message: "", type: "error" });
		setErrorField("");

		const confirmed = window.confirm(
			`Are you sure you want to delete "${buildName || "this list"}"?`,
		);
		if (!confirmed) return;

		try {
			const response = await apiFetch("/build_doctor/delete_user_build.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ build_id: editingBuildId }),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				triggerStatus("The list has been removed from the system", "success");
				setEditingBuildId(null);
				setBuildName("");
				setFormData({
					cpu: { name: "", id: null },
					gpu: { name: "", id: null },
					psu: { name: "", id: null },
				});
				setSpecs({
					cpu: ["Please search for your CPU to add its details"],
					gpu: ["Please search for your GPU to add its details"],
					psu: ["Please search for your PSU to add its details"],
				});
			} else {
				throw new Error(data.error || "Failed to delete.");
			}
		} catch (err) {
			triggerStatus(err.message, "error");
		}
	};

	if (authLoading || isDataFetching) {
		return (
			<div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs sm:text-sm uppercase tracking-widest">
				<Loader2 className="animate-spin text-fuchsia-500" size={24} />
				Loading your list...
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="min-h-screen bg-[#050505] text-slate-300 p-6 scroll-mt-6 text-xs sm:text-sm md:text-base lg:text-lg"
		>
			<header className="max-w-3xl mx-auto py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						Build{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Doctor
						</span>
					</h1>
				</div>

				<div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl self-start sm:self-center">
					<Layers size={14} className="text-fuchsia-400" />
					<div className="flex flex-col">
						<span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-bold">
							Current List
						</span>
						<span className="text-xs sm:text-sm text-slate-200 font-mono font-bold truncate max-w-[180px]">
							{buildName ? buildName : "Unsaved List"}
						</span>
					</div>
				</div>
			</header>

			<main className="max-w-3xl mx-auto space-y-5">
				{alert.show && (
					<div className="mb-6">
						<CyberAlert
							type={alert.type}
							message={alert.message}
							onClose={() => setAlert({ ...alert, show: false })}
						/>
					</div>
				)}

				<RenderModule
					title="CPU"
					icon={Cpu}
					category="CPU"
					value={formData.cpu?.name || ""}
					specLines={specs.cpu}
					dropdown={dropdown}
					onValueChange={(value) => updateField("CPU", value)}
					onSearch={(query) => handleSearch("CPU", query)}
					onSelectComponent={(item) => selectComponent(item, "CPU")}
					onCloseDropdown={closeDropdown}
					onFocusCategory={handleFocusCategory}
					error={errorField === "cpu"}
					shakeTick={shakeTick}
				/>
				<RenderModule
					title="GPU"
					icon={Monitor}
					category="GPU"
					value={formData.gpu?.name || ""}
					specLines={specs.gpu}
					dropdown={dropdown}
					onValueChange={(value) => updateField("GPU", value)}
					onSearch={(query) => handleSearch("GPU", query)}
					onSelectComponent={(item) => selectComponent(item, "GPU")}
					onCloseDropdown={closeDropdown}
					onFocusCategory={handleFocusCategory}
					error={errorField === "gpu"}
					shakeTick={shakeTick}
				/>
				<RenderModule
					title="PSU"
					icon={Zap}
					category="PSU"
					value={formData.psu?.name || ""}
					specLines={specs.psu}
					dropdown={dropdown}
					onValueChange={(value) => updateField("PSU", value)}
					onSearch={(query) => handleSearch("PSU", query)}
					onSelectComponent={(item) => selectComponent(item, "PSU")}
					onCloseDropdown={closeDropdown}
					onFocusCategory={handleFocusCategory}
					error={errorField === "psu"}
					shakeTick={shakeTick}
				/>

				<div className="flex flex-col md:flex-row gap-4 w-full pt-4">
					<CyberActionButton
						label={editingBuildId ? "UPDATE MY LIST" : "SAVE MY LIST"}
						onClick={handleSaveOrUpdateBuild}
						className="flex-1 py-5 text-xs sm:text-sm uppercase font-black"
					/>

					{editingBuildId && (
						<button
							type="button"
							onClick={handleDeleteBuild}
							className="md:w-1/4 h-[62px] border border-red-500/30 bg-red-950/10 hover:bg-red-600/20 text-red-400 hover:text-red-200 transition-all rounded-xl text-xs uppercase font-black tracking-wider flex items-center justify-center gap-2"
						>
							<Trash2 size={16} />
							Delete List
						</button>
					)}
				</div>
			</main>
		</div>
	);
}
