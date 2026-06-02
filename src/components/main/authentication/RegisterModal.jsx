import React, { useRef, useState, useEffect } from "react";
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
import CyberAlert from "../../ui/CyberAlert";
import { useAuthModalScroll } from "./AuthModalScrollContext";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../AuthContext";
import { mediaUrl } from "../../../lib/api";

const saPhoneRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;

const RegisterModal = ({
	isOpen,
	mode = "create",
	onClose,
	onSwitchToLogin,
	onSwitchToTOS,
}) => (
	<AuthModalWrapper
		isOpen={isOpen}
		onClose={onClose}
		onBack={mode === "edit" ? onClose : onSwitchToLogin}
	>
		<RegisterModalContent
			mode={mode}
			onClose={onClose}
			onSwitchToLogin={onSwitchToLogin}
			onSwitchToTOS={onSwitchToTOS}
		/>
	</AuthModalWrapper>
);

const RegisterModalContent = ({
	mode = "create",
	onClose,
	onSwitchToLogin,
	onSwitchToTOS,
}) => {
	const { refreshAuth } = useAuth();
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
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);
	const scrollToTop = useAuthModalScroll();
	const [deviceIdentifier, setDeviceIdentifier] = useState("");

	useEffect(() => {
		if (mode !== "edit") return;

		const fetchUserData = async () => {
			setIsLoading(true);
			try {
				const response = await apiFetch("/user/get_current_user.php", {
					method: "GET",
					headers: { Accept: "application/json" },
				});
				const data = await response.json();

				if (response.ok && data.status === "success" && data.user) {
					setFormData({
						firstName: data.user.first_name || "",
						lastName: data.user.last_name || "",
						email: data.user.email || "",
						password: "",
						confirmPassword: "",
						mobile: data.user.mobile || "",
						province: data.user.province || "",
						regType: data.user.reg_type || "buyer",
						profilePhoto: null,
						agreedToTerms: true,
					});

					if (data.user.avatar_url) {
						setProfileImage(mediaUrl(data.user.avatar_url));
					}
				} else {
					triggerStatus(
						data.message || "We could not load your profile information.",
						"error",
					);
				}
			} catch (error) {
				triggerStatus(
					"Unable to load profile data. Please try again.",
					"error",
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [mode]);

	useEffect(() => {
		const generateId = () => {
			const info = [
				navigator.userAgent,
				navigator.language,
				screen.colorDepth,
				navigator.deviceMemory || "unknown",
				new Date().getTimezoneOffset(),
			];
			return btoa(info.join("||")).substring(0, 32);
		};
		setDeviceIdentifier(generateId());
	}, []);

	const triggerStatus = (message, type = "error", fieldName = "") => {
		scrollToTop?.();
		setAlert({ show: true, message, type });
		if (type === "error" && fieldName) {
			setErrorField("");
			setShakeTick((tick) => tick + 1);
			requestAnimationFrame(() => setErrorField(fieldName));
		} else {
			setErrorField("");
		}
	};

	const calculateStrength = (password) => {
		const checks = {
			length: password.length >= 8,
			uppercase: /[A-Z]/.test(password),
			number: /[0-9]/.test(password),
			symbol: /[^A-Za-z0-9]/.test(password),
		};
		return Object.values(checks).filter(Boolean).length;
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setAlert({ show: false, message: "", type: "error" });
		if (errorField === name) {
			setErrorField("");
		}
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

		setErrorField("");
		setAlert({ show: false, message: "", type: "error" });

		const cleanPhone = formData.mobile.replace(/\s/g, "");

		if (!formData.firstName.trim()) {
			triggerStatus("Please enter your first name.", "error", "firstName");
			return;
		}

		if (!formData.lastName.trim()) {
			triggerStatus("Please enter your last name.", "error", "lastName");
			return;
		}

		if (!formData.email.trim()) {
			triggerStatus("Please enter your email address.", "error", "email");
			return;
		}

		if (mode !== "edit") {
			if (!formData.password) {
				triggerStatus("Please enter a password.", "error", "password");
				return;
			}

			if (formData.password !== formData.confirmPassword) {
				triggerStatus("Passwords do not match.", "error", "confirmPassword");
				return;
			}

			if (calculateStrength(formData.password) < 4) {
				triggerStatus(
					"Password is too weak. Please ensure it meets security guidelines.",
					"error",
					"password",
				);
				return;
			}
		}

		if (!saPhoneRegex.test(cleanPhone)) {
			triggerStatus(
				"Please enter a valid South African mobile number.",
				"error",
				"mobile",
			);
			return;
		}

		if (!formData.province) {
			triggerStatus("Please select your province.", "error", "province");
			return;
		}

		if (!formData.agreedToTerms) {
			triggerStatus(
				"You must agree to the terms and conditions to continue.",
				"error",
				"agreedToTerms",
			);
			return;
		}

		setIsLoading(true);

		try {
			const payload = new FormData();
			payload.append("firstName", formData.firstName);
			payload.append("lastName", formData.lastName);
			payload.append("email", formData.email);
			payload.append("mobile", cleanPhone);
			payload.append("province", formData.province);
			payload.append("regType", formData.regType);
			payload.append("hardwareId", deviceIdentifier);

			if (mode !== "edit") {
				payload.append("password", formData.password);
			}

			if (formData.profilePhoto) {
				payload.append("profilePhoto", formData.profilePhoto);
			}

			const targetEndpoint =
				mode === "edit"
					? "/user/update_profile.php"
					: "/authentication/register.php";

			const response = await apiFetch(targetEndpoint, {
				method: "POST",
				body: payload,
			});

			const data = await response.json();

			if (!response.ok) {
				const fieldTarget = data.field || "serverError";
				throw new Error(
					JSON.stringify({
						field: fieldTarget,
						message: data.message || "An error occurred. Please try again.",
					}),
				);
			}

			if (mode === "edit") {
				triggerStatus("Profile updated successfully!", "success");
				await refreshAuth();
				setTimeout(() => {
					setIsLoading(false);
					onClose();
				}, 1500);
			} else {
				triggerStatus(
					"Registration successful! Redirecting to login...",
					"success",
				);
				setTimeout(() => {
					setFormData({
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
					setProfileImage(null);
					onSwitchToLogin();
					setIsLoading(false);
				}, 2000);
			}
		} catch (err) {
			try {
				const parsedErr = JSON.parse(err.message);
				triggerStatus(parsedErr.message, "error", parsedErr.field);
			} catch {
				triggerStatus(err.message, "error", "serverError");
			}
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-5 sm:space-y-6 p-1 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl selection:bg-fuchsia-500/30">
			<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
				{mode === "edit" ? "Edit" : "Create"}{" "}
				<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
					{mode === "edit" ? "Profile" : "Account"}
				</span>
			</h1>

			{alert.show && (
				<CyberAlert
					type={alert.type}
					message={alert.message}
					onClose={() => setAlert({ ...alert, show: false })}
				/>
			)}

			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				accept="image/*"
				onChange={handleFileChange}
			/>

			<form
				onSubmit={handleSubmit}
				className="space-y-4 sm:space-y-5"
				noValidate
			>
				<div className="w-full p-4 bg-black/20 rounded-lg border border-white/5 flex flex-col sm:flex-row items-center gap-4">
					<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#121214] border-2 border-fuchsia-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(217,70,239,0.1)]">
						{profileImage ? (
							<img
								src={profileImage}
								alt="User Avatar"
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
							className="inline-flex items-center gap-2 sm:text-xs md:text-base font-black uppercase tracking-widest text-fuchsia-400 border border-fuchsia-500/20 bg-fuchsia-500/[0.02] hover:bg-fuchsia-500/[0.05] hover:border-fuchsia-500/50 px-3 py-1.5 rounded transition-all focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
						>
							<Image size={12} />
							<span>{profileImage ? "Change Photo" : "Add Profile Photo"}</span>
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<AuthInput
						key={
							errorField === "firstName" ? `shake-fn-${shakeTick}` : "norm-fn"
						}
						label="FIRST NAME"
						name="firstName"
						value={formData.firstName}
						onChange={handleInputChange}
						required
						error={errorField === "firstName"}
						className={errorField === "firstName" ? "animate-shake" : ""}
					/>
					<AuthInput
						key={
							errorField === "lastName" ? `shake-ln-${shakeTick}` : "norm-ln"
						}
						label="LAST NAME"
						name="lastName"
						value={formData.lastName}
						onChange={handleInputChange}
						required
						error={errorField === "lastName"}
						className={errorField === "lastName" ? "animate-shake" : ""}
					/>
				</div>

				<AuthInput
					key={errorField === "email" ? `shake-em-${shakeTick}` : "norm-em"}
					label="EMAIL"
					type="email"
					name="email"
					value={formData.email}
					onChange={handleInputChange}
					required
					error={errorField === "email"}
					className={errorField === "email" ? "animate-shake" : ""}
				/>

				{mode !== "edit" && (
					<div className="space-y-3">
						<AuthInput
							key={
								errorField === "password" ? `shake-pw-${shakeTick}` : "norm-pw"
							}
							label="PASSWORD"
							type={showPassword ? "text" : "password"}
							name="password"
							isPassword={true}
							showPassword={showPassword}
							value={formData.password}
							onChange={handleInputChange}
							togglePassword={() => setShowPassword(!showPassword)}
							error={errorField === "password"}
							className={errorField === "password" ? "animate-shake" : ""}
						/>
						<div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
							<PasswordStrengthMeter password={formData.password} />
						</div>
						<AuthInput
							key={
								errorField === "confirmPassword"
									? `shake-cpw-${shakeTick}`
									: "norm-cpw"
							}
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
							error={errorField === "confirmPassword"}
							className={
								errorField === "confirmPassword" ? "animate-shake" : ""
							}
						/>
					</div>
				)}

				<AuthInput
					key={errorField === "mobile" ? `shake-mo-${shakeTick}` : "norm-mo"}
					label="MOBILE NUMBER"
					type="text"
					inputMode="tel"
					pattern="[0-9]*"
					name="mobile"
					placeholder="0611234567"
					value={formData.mobile}
					onChange={handleInputChange}
					required
					error={errorField === "mobile"}
					className={errorField === "mobile" ? "animate-shake" : ""}
				/>

				<div
					key={
						errorField === "province"
							? `shake-province-${shakeTick}`
							: "norm-province"
					}
					className={`space-y-1.5 ${errorField === "province" ? "animate-shake" : ""}`}
				>
					<label className="text-fuchsia-500/80 text-sm sm:text-xs md:text-base font-bold uppercase tracking-widest ml-0.5">
						PROVINCE
					</label>
					<div className="relative">
						<select
							name="province"
							value={formData.province}
							onChange={handleInputChange}
							className={`w-full h-11 bg-[#121214] rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-fuchsia-500/50 appearance-none px-4 font-mono transition-all border ${errorField === "province" ? "border-rose-500 bg-rose-500/[0.02]" : "border-white/10"}`}
							required
						>
							<option value="" disabled className="bg-[#0c0c0e] text-slate-600">
								Select your province
							</option>
							<option value="Gauteng" className="bg-[#0c0c0e] text-slate-300">
								Gauteng
							</option>
							<option
								value="Eastern Cape"
								className="bg-[#0c0c0e] text-slate-300"
							>
								Eastern Cape
							</option>
							<option
								value="Free State"
								className="bg-[#0c0c0e] text-slate-300"
							>
								Free State
							</option>
							<option
								value="KwaZulu-Natal"
								className="bg-[#0c0c0e] text-slate-300"
							>
								KwaZulu-Natal
							</option>
							<option value="Limpopo" className="bg-[#0c0c0e] text-slate-300">
								Limpopo
							</option>
							<option
								value="Mpumalanga"
								className="bg-[#0c0c0e] text-slate-300"
							>
								Mpumalanga
							</option>
							<option
								value="North West"
								className="bg-[#0c0c0e] text-slate-300"
							>
								North West
							</option>
							<option
								value="Northern Cape"
								className="bg-[#0c0c0e] text-slate-300"
							>
								Northern Cape
							</option>
							<option
								value="Western Cape"
								className="bg-[#0c0c0e] text-slate-300"
							>
								Western Cape
							</option>
						</select>
						<ChevronDown
							className="absolute right-4 top-3.5 text-slate-500 pointer-events-none"
							size={14}
						/>
					</div>
				</div>

				<div className="p-4 bg-black/20 rounded-lg border border-white/5 space-y-3">
					<h3 className="text-fuchsia-500/80 text-sm sm:text-xs md:text-base font-bold uppercase tracking-widest">
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

				{mode !== "edit" && (
					<div
						key={
							errorField === "agreedToTerms"
								? `shake-terms-${shakeTick}`
								: "norm-terms"
						}
						className={`p-3.5 bg-fuchsia-500/[0.01] rounded-lg border transition-[color,background-color,border-color] ${errorField === "agreedToTerms" ? "border-red-500/50 bg-red-500/[0.02] animate-shake" : "border-fuchsia-500/10"}`}
					>
						<label className="flex items-start gap-3 cursor-pointer group select-none">
							<div className="relative flex items-center pt-0.5 shrink-0">
								<input
									type="checkbox"
									name="agreedToTerms"
									checked={formData.agreedToTerms}
									onChange={handleInputChange}
									className={`peer h-4.5 w-4.5 cursor-pointer appearance-none rounded border bg-[#121214] checked:bg-fuchsia-500 checked:border-fuchsia-500 transition-all focus:outline-none ${errorField === "agreedToTerms" ? "border-red-500/50" : "border-white/10"}`}
									required
								/>
								<Check
									className="absolute h-3.5 w-3.5 text-black opacity-0 peer-checked:opacity-100 left-[2px] pointer-events-none transition-opacity"
									strokeWidth={4}
								/>
							</div>

							<span className="text-sm sm:text-xs md:text-base font-bold text-slate-500 uppercase tracking-wide leading-normal">
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
				)}

				<div className="space-y-4 pt-2 border-t border-white/5">
					<GradientButton
						label={
							isLoading
								? "Processing..."
								: mode === "edit"
									? "Save Changes"
									: "Register Account"
						}
						type="submit"
						isLoading={isLoading}
						className="w-full text-xs sm:text-sm tracking-widest font-black"
					/>

					{mode !== "edit" && (
						<div className="flex justify-center items-center gap-1.5 text-sm md:text-base sm:text-xs text-slate-600 font-bold uppercase tracking-wide">
							<ShieldAlert size={11} className="text-slate-700" />
							<AuthFooter
								label="Back to Login"
								onClick={onSwitchToLogin}
								className="hover:text-fuchsia-400 transition-colors focus:outline-none focus:underline"
							/>
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

export default RegisterModal;
