import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import CyberAlert from "../../components/ui/CyberAlert";
import {
	Save,
	ArrowLeft,
	Loader2,
	Cpu,
	FileText,
	Activity,
} from "lucide-react";

export default function HardwareEditForm() {
	const { category, id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const [alertConfig, setAlertConfig] = useState({
		show: false,
		type: "error",
		message: "",
	});

	const ignoredColumns = [
		"id",
		"hardware_id",
		"category_id",
		"created_at",
		"updated_at",
		"slug",
	];

	const masterRegistryColumns = [
		"brand",
		"model",
		"full_name",
		"msrp_cents",
		"is_active",
	];

	useEffect(() => {
		const fetchItemDetails = async () => {
			setIsLoading(true);
			setAlertConfig((prev) => ({ ...prev, show: false }));
			try {
				const response = await apiFetch(
					`/hardware_intelligence/hardware/get_item_details.php?category=${category}&id=${id}`,
				);
				const result = await response.json();

				if (result.success) {
					setFormData(result.data);
				} else {
					setAlertConfig({
						show: true,
						type: "error",
						message: result.error || "Failed to load component profiles.",
					});
				}
			} catch (err) {
				setAlertConfig({
					show: true,
					type: "error",
					message: "Communications breakdown while hitting core servers.",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchItemDetails();
	}, [category, id]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? (checked ? 1 : 0) : value,
		}));
	};

	const handleRandPriceChange = (e) => {
		const randValue = e.target.value;
		setFormData((prev) => ({
			...prev,
			msrp_cents:
				randValue === "" ? null : Math.round(parseFloat(randValue) * 100),
		}));
	};

	const formatLabel = (key) => {
		return key
			.replace(/_cents$/, "")
			.replace(/_/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		setAlertConfig((prev) => ({ ...prev, show: false }));

		try {
			const response = await apiFetch(
				`/hardware_intelligence/hardware/update_hardware.php`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ category, id, fields: formData }),
				},
			);
			const result = await response.json();

			if (result.success) {
				setAlertConfig({
					show: true,
					type: "success",
					message: result.message || "Hardware specifications updated cleanly!",
				});
				setTimeout(() => navigate(-1), 1500);
			} else {
				setAlertConfig({
					show: true,
					type: "error",
					message:
						result.error || "Could not preserve hardware specs updating state.",
				});
			}
		} catch (err) {
			setAlertConfig({
				show: true,
				type: "error",
				message: "Failed to execute updates package on backend tables.",
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 font-mono gap-4">
				<Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
				<p className="uppercase tracking-widest text-xs sm:text-sm animate-pulse">
					Retrieving item profile...
				</p>
			</div>
		);
	}

	const specColumns = formData
		? Object.keys(formData).filter(
				(key) =>
					!masterRegistryColumns.includes(key) && !ignoredColumns.includes(key),
			)
		: [];

	const currentRandDisplayValue =
		formData &&
		formData.msrp_cents !== null &&
		formData.msrp_cents !== undefined
			? (formData.msrp_cents / 100).toString()
			: "";

	return (
		<div className="max-w-5xl mx-auto p-4 font-mono text-slate-300 space-y-6">
			<header className="flex items-center justify-between border-b border-white/5 pb-4">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
				>
					<ArrowLeft size={14} /> Back to Database
				</button>
				<h2 className="text-white font-black uppercase text-base sm:text-lg md:text-xl xl:text-2xl flex items-center gap-2">
					<Cpu className="text-purple-500" size={20} />
					<span>
						Edit Selected Component specs &middot;{" "}
						<span className="text-purple-400">{category.toUpperCase()}</span>
					</span>
				</h2>
			</header>

			{alertConfig.show && (
				<div className="mb-4">
					<CyberAlert
						type={alertConfig.type}
						message={alertConfig.message}
						onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
					/>
				</div>
			)}

			{formData && (
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="bg-black/20 border border-white/5 p-6 rounded-xl space-y-4">
						<h3 className="text-purple-400 text-xs sm:text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
							<FileText size={14} /> Retrieved Hardware Specs
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-xs sm:text-sm uppercase font-bold text-slate-500 mb-1">
									Brand
								</label>
								<input
									type="text"
									name="brand"
									value={formData.brand || ""}
									onChange={handleChange}
									className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
								/>
							</div>
							<div>
								<label className="block text-xs sm:text-sm uppercase font-bold text-slate-500 mb-1">
									Model
								</label>
								<input
									type="text"
									name="model"
									value={formData.model || ""}
									onChange={handleChange}
									className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
								/>
							</div>
							<div className="md:col-span-2">
								<label className="block text-xs sm:text-sm uppercase font-bold text-slate-500 mb-1">
									Full System Name
								</label>
								<input
									type="text"
									name="full_name"
									value={formData.full_name || ""}
									onChange={handleChange}
									className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
								/>
							</div>

							<div>
								<label className="block text-xs sm:text-sm uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
									Reference MSRP (ZAR)
								</label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-slate-500 font-bold">
										R
									</span>
									<input
										type="number"
										step="0.01"
										name="msrp_rand"
										value={currentRandDisplayValue}
										onChange={handleRandPriceChange}
										placeholder="0.00"
										className="w-full bg-black/40 border border-white/5 rounded-lg pl-8 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
									/>
								</div>
							</div>
						</div>

						<div className="pt-2 flex items-center gap-3">
							<label className="relative inline-flex items-center cursor-pointer select-none">
								<input
									type="checkbox"
									name="is_active"
									checked={Boolean(Number(formData.is_active))}
									onChange={handleChange}
									className="sr-only peer"
								/>
								<div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white" />
								<span className="ml-3 text-xs sm:text-sm uppercase font-bold text-slate-400 flex items-center gap-1">
									<Activity size={12} /> Component Active Status
								</span>
							</label>
						</div>
					</div>

					{specColumns.length > 0 && (
						<div className="bg-black/20 border border-white/5 p-6 rounded-xl space-y-4">
							<h3 className="text-purple-400 text-xs sm:text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-2 mb-4">
								Retrieved Category Specs ({category})
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{specColumns.map((key) => {
									const isNumberInput =
										key.endsWith("_mhz") ||
										key.endsWith("_gb") ||
										key.endsWith("_watts") ||
										key.endsWith("_mm") ||
										key.includes("width");

									return (
										<div key={key} className="space-y-1">
											<label className="block text-xs sm:text-sm uppercase font-bold text-slate-500 truncate">
												{formatLabel(key)}
											</label>
											<input
												type={isNumberInput ? "number" : "text"}
												name={key}
												value={formData[key] ?? ""}
												onChange={handleChange}
												step={key.endsWith("_gb") ? "0.1" : "1"}
												className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
											/>
										</div>
									);
								})}
							</div>
						</div>
					)}

					<footer className="pt-4 flex justify-end">
						<button
							type="submit"
							disabled={isSaving}
							className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs sm:text-sm px-5 py-3 rounded-lg shadow-md transition-all cursor-pointer"
						>
							{isSaving ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								<Save size={14} />
							)}
							Update Component Specs
						</button>
					</footer>
				</form>
			)}
		</div>
	);
}
