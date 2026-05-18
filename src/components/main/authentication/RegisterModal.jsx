import React, { useRef, useState } from "react";
import {
	User,
	ChevronDown,
	Check,
	ShieldAlert,
	Image,
	Layers,
} from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import GradientButton from "../../ui/CyberActionButton";
import PasswordStrengthMeter from "../../ui/PasswordStrengthMeter";
import AuthFooter from "./AuthFooter";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, onSwitchToTOS }) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		mobile: "",
		province: "",
		regType: "buyer",
		profilePhoto: null,
		agreedToTerms: false,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [confirmShowPassword, setConfirmShowPassword] = useState(false);
	const fileInputRef = useRef(null);
	const [profileImage, setProfileImage] = useState(null);
	const [validationError, setValidationError] = useState("");

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setValidationError(""); // Reset diagnostic logs on input mutation
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const previewUrl = URL.createObjectURL(file);
			setProfileImage(previewUrl);
			setFormData((prev) => ({ ...prev, profilePhoto: file }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setValidationError("");

		if (!formData.agreedToTerms) {
			setValidationError("REG_EXCEPTION: Handshake terms must be authorized.");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setValidationError("REG_EXCEPTION: Cipher strings do not match.");
			return;
		}

		setIsLoading(true);
		console.log("Transmitting terminal registration payload:", formData);

		setTimeout(() => {
			setIsLoading(false);
			// Callback hooks or login rerouting can execute here on success
		}, 2000);
	};

	return (
		<AuthModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			onBack={onSwitchToLogin}
		>
			<div className="space-y-5 sm:space-y-6 p-1 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl selection:bg-fuchsia-500/30">
				<div className="space-y-1">
					<h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
						Create Account
					</h1>
				</div>

				{validationError && (
					<div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 flex items-center gap-2 animate-pulse">
						<span className="text-[10px] sm:text-xs font-bold text-red-400 uppercase tracking-wide">
							{validationError}
						</span>
					</div>
				)}

				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept="image/*"
					onChange={handleFileChange}
				/>

				<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
					{/* Profile Visual Identity Input Cluster */}
					<div className="w-full p-4 bg-black/20 rounded-lg border border-white/5 flex flex-col sm:flex-row items-center gap-4">
						<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#121214] border-2 border-fuchsia-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(217,70,239,0.1)]">
							{profileImage ? (
								<img
									src={profileImage}
									alt="Ident Preview"
									className="w-full h-full object-cover"
								/>
							) : (
								<User className="text-fuchsia-500/50 w-6 h-6" />
							)}
						</div>
						<div className="text-center sm:text-left space-y-1.5 w-full">
							<button
								type="button"
								onClick={() => fileInputRef.current.click()}
								className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-fuchsia-400 border border-fuchsia-500/20 bg-fuchsia-500/[0.02] hover:bg-fuchsia-500/[0.05] hover:border-fuchsia-500/50 px-3 py-1.5 rounded transition-all focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
							>
								<Image size={12} />
								<span>
									{profileImage ? "Change Photo" : "Add Profile Photo"}
								</span>
							</button>
						</div>
					</div>

					{/* Personal Matrix Name Data Blocks */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<AuthInput
							label="FIRST NAME"
							name="firstName"
							value={formData.firstName}
							onChange={handleInputChange}
							required
							className="font-mono text-xs sm:text-sm bg-[#121214] border-white/10 text-white placeholder:text-slate-800"
						/>
						<AuthInput
							label="LAST NAME"
							name="lastName"
							value={formData.lastName}
							onChange={handleInputChange}
							required
							className="font-mono text-xs sm:text-sm bg-[#121214] border-white/10 text-white placeholder:text-slate-800"
						/>
					</div>

					<AuthInput
						label="EMAIL"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						required
						className="font-mono text-xs sm:text-sm bg-[#121214] border-white/10 text-white placeholder:text-slate-800"
					/>

					{/* Integrated Cipher Assignment Stack */}
					<div className="space-y-3">
						<AuthInput
							label="NEW PASSWORD"
							type={showPassword ? "text" : "password"}
							name="password"
							isPassword={true}
							showPassword={showPassword}
							value={formData.password}
							onChange={handleInputChange}
							togglePassword={() => setShowPassword(!showPassword)}
							className="font-mono text-xs sm:text-sm bg-[#121214] border-white/10 text-white placeholder:text-slate-800"
						/>
						<div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
							<PasswordStrengthMeter password={formData.password} />
						</div>
						<AuthInput
							label="CONFIRM PASSWORD"
							type={confirmShowPassword ? "text" : "password"}
							name="confirmPassword"
							isPassword={true}
							showPassword={confirmShowPassword}
							value={formData.confirmPassword}
							onChange={handleInputChange}
							togglePassword={() =>
								setConfirmShowPassword(!confirmShowPassword)
							}
							className="font-mono text-xs sm:text-sm bg-[#121214] border-white/10 text-white placeholder:text-slate-800"
						/>
					</div>

					{/* Telecom Comms String Input */}
					<AuthInput
						label="MOBILE NUMBER"
						type="text"
						inputMode="tel"
						pattern="[0-9]*"
						name="mobile"
						placeholder="0611234567"
						value={formData.mobile}
						onChange={handleInputChange}
						required
						className="font-mono text-xs sm:text-sm bg-[#121214] border-white/10 text-white placeholder:text-slate-800"
					/>

					{/* Selector Area Terminal Custom Menu */}
					<div className="space-y-1.5">
						<label className="text-fuchsia-500/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest ml-0.5">
							PROVINCE
						</label>
						<div className="relative">
							<select
								name="province"
								value={formData.province}
								onChange={handleInputChange}
								className="w-full h-11 bg-[#121214] border border-white/10 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-fuchsia-500/50 appearance-none px-4 font-mono transition-colors"
								required
							>
								<option
									value=""
									disabled
									className="bg-[#0c0c0e] text-slate-600"
								>
									Select Province
								</option>
								<option value="GP" className="bg-[#0c0c0e] text-slate-300">
									Gauteng [GP]
								</option>
								<option value="EC" className="bg-[#0c0c0e] text-slate-300">
									Eastern Cape [EC]
								</option>
								<option value="FS" className="bg-[#0c0c0e] text-slate-300">
									Free State [FS]
								</option>
								<option value="KZN" className="bg-[#0c0c0e] text-slate-300">
									KwaZulu-Natal [KZN]
								</option>
								<option value="LIM" className="bg-[#0c0c0e] text-slate-300">
									Limpopo [LIM]
								</option>
								<option value="MPU" className="bg-[#0c0c0e] text-slate-300">
									Mpumalanga [MPU]
								</option>
								<option value="NW" className="bg-[#0c0c0e] text-slate-300">
									North West [NW]
								</option>
								<option value="NC" className="bg-[#0c0c0e] text-slate-300">
									Northern Cape [NC]
								</option>
								<option value="WC" className="bg-[#0c0c0e] text-slate-300">
									Western Cape [WC]
								</option>
							</select>
							<ChevronDown
								className="absolute right-4 top-3.5 text-slate-500 pointer-events-none"
								size={14}
							/>
						</div>
					</div>

					{/* Operational Classification Access Toggles */}
					<div className="p-4 bg-black/20 rounded-lg border border-white/5 space-y-3">
						<h3 className="text-fuchsia-500/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
							REGISTER AS
						</h3>
						<div className="flex flex-wrap gap-5">
							{["buyer", "seller", "both"].map((type) => (
								<label
									key={type}
									className="flex items-center gap-2 cursor-pointer group select-none"
								>
									<input
										type="radio"
										name="regType"
										className="w-4 h-4 accent-fuchsia-500 cursor-pointer bg-black"
										checked={formData.regType === type}
										onChange={() => setFormData({ ...formData, regType: type })}
									/>
									<span className="text-xs font-bold text-slate-400 capitalize tracking-wide group-hover:text-fuchsia-400 transition-colors">
										{type}
									</span>
								</label>
							))}
						</div>
					</div>

					<div className="p-3.5 bg-fuchsia-500/[0.01] rounded-lg border border-fuchsia-500/10">
						<label className="flex items-start gap-3 cursor-pointer group select-none">
							<div className="relative flex items-center pt-0.5 shrink-0">
								<input
									type="checkbox"
									name="agreedToTerms"
									checked={formData.agreedToTerms}
									onChange={handleInputChange}
									className="peer h-4.5 w-4.5 cursor-pointer appearance-none rounded border border-white/10 bg-[#121214] checked:bg-fuchsia-500 checked:border-fuchsia-500 transition-all focus:outline-none"
									required
								/>
								<Check
									className="absolute h-3.5 w-3.5 text-black opacity-0 peer-checked:opacity-100 left-[2px] pointer-events-none transition-opacity"
									strokeWidth={4}
								/>
							</div>

							<span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide leading-normal">
								I AGREE TO THE{" "}
								<button
									type="button"
									onClick={onSwitchToTOS}
									className="inline-block text-fuchsia-500 hover:text-fuchsia-400 font-black underline transition-colors"
								>
									TERMS AND CONDITIONS
								</button>
							</span>
						</label>
					</div>

					{/* Core Executable Dispatch Stack Buttons */}
					<div className="space-y-4 pt-2 border-t border-white/5">
						<GradientButton
							label={isLoading ? "SUBMITTING REGISTRATION" : "REGISTER ACCOUNT"}
							type="submit"
							isLoading={isLoading}
							className="w-full text-xs sm:text-sm tracking-widest font-black"
						/>
						<div className="flex justify-center items-center gap-1.5 text-[10px] sm:text-xs text-slate-600 font-bold uppercase tracking-wide">
							<ShieldAlert size={11} className="text-slate-700" />
							<AuthFooter
								label="BACK TO LOGIN"
								onClick={onSwitchToLogin}
								className="hover:text-fuchsia-400 transition-colors focus:outline-none focus:underline"
							/>
						</div>
					</div>
				</form>
			</div>
		</AuthModalWrapper>
	);
};

export default RegisterModal;
