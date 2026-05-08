import React, { useState } from "react";
import { User, ChevronDown } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import GradientButton from "../../ui/PurpleGradientButton";
import PasswordStrengthMeter from "../../ui/PasswordStrengthMeter";
import AuthFooter from "./AuthFooter";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		mobile: "",
		province: "",
		regType: "buyer",
	});
	const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		// PHP Registration API Call
		console.log("Registering:", formData);
		setTimeout(() => setIsLoading(false), 2000);
	};

	return (
		<AuthModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			onBack={onSwitchToLogin}
		>
			<div className="space-y-8">
				<h1 className="text-purple-600 text-4xl md:text-5xl font-black uppercase tracking-tighter">
					Create Account
				</h1>

				<form onSubmit={handleSubmit} className="space-y-6 pb-10">
					{/* Profile Image Upload */}
					<div className="w-full p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-4">
						<div className="w-20 h-20 rounded-full bg-slate-100 outline outline-[3px] outline-pink-600 flex items-center justify-center overflow-hidden">
							<User className="text-violet-600 w-8 h-8" />
						</div>
						<GradientButton label="Add Profile Photo" type="" />
					</div>

					{/* Name */}
					<div className="space-y-4">
						{/* Name */}
						<AuthInput
							label="First Name"
							name="firstName"
							placeholder="John"
							value={formData.firstName}
							onChange={handleInputChange}
							required
						/>

						{/* Lastname */}
						<AuthInput
							label="Last Name"
							name="lastName"
							placeholder="Doe"
							value={formData.lastName}
							onChange={handleInputChange}
							required
						/>
					</div>

					{/* Email */}
					<AuthInput
						label="Email Address"
						type="email"
						name="email"
						placeholder="john@example.com"
						value={formData.email}
						onChange={handleInputChange}
						required
					/>

					{/* Password Group */}
					<div className="space-y-4">
						<AuthInput
              label="New Password"
              type="password"
              isPassword={true}
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />

						<PasswordStrengthMeter password={formData.password} />

						<AuthInput
              label="Confirm Password"
              type="password"
              isPassword={true}
              showPassword={confirmShowPassword}
              togglePassword={() => setConfirmShowPassword(!confirmShowPassword)}
            />
					</div>

					{/* Phone Number */}
					<AuthInput
						label="Mobile Number"
						name="mobile"
						placeholder="061 123 4567"
						value={formData.mobile}
						onChange={handleInputChange}
						required
					/>

					{/* Province Selector */}
					<div className="space-y-1.5">
						<label className="text-violet-600 text-[10px] font-black uppercase tracking-widest ml-1">
							Province
						</label>
						<div className="relative">
							<select
								name="province"
								value={formData.province}
								onChange={handleInputChange}
								className="w-full h-12 bg-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm text-gray-900 appearance-none px-4 font-medium"
								required
							>
								<option value="" disabled>
									Select your province
								</option>
								<option value="GP">Gauteng</option>
								<option value="EC">Eastern Cape</option>
								<option value="FS">Free State</option>
								<option value="KZN">KwaZulu-Natal</option>
								<option value="LIM">Limpopo</option>
								<option value="MPU">Mpumalanga</option>
								<option value="NW">North West</option>
								<option value="NC">Northern Cape</option>
								<option value="WC">Western Cape</option>
							</select>
							<ChevronDown
								className="absolute right-4 top-3.5 text-slate-500 pointer-events-none"
								size={18}
							/>
						</div>
					</div>

					{/* Registration Options */}
					<div className="p-6 bg-white rounded-2xl border border-slate-100 space-y-4">
						<h3 className="text-violet-600 text-[10px] font-black uppercase tracking-widest">
							Register As:
						</h3>
						<div className="flex flex-wrap gap-4">
							{["buyer", "seller", "both"].map((type) => (
								<label
									key={type}
									className="flex items-center gap-2 cursor-pointer group"
								>
									<input
										type="radio"
										name="regType"
										className="w-4 h-4 accent-pink-600"
										checked={formData.regType === type}
										onChange={() => setFormData({ ...formData, regType: type })}
									/>
									<span className="text-xs font-bold text-violet-600 capitalize">
										{type}
									</span>
								</label>
							))}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-4 pt-4">
						<GradientButton
							label="REGISTER ACCOUNT"
							type="submit"
							isLoading={isLoading}
						/>

						<AuthFooter label="Back to Login" onClick={onSwitchToLogin} />
					</div>
				</form>
			</div>
		</AuthModalWrapper>
	);
};

export default RegisterModal;
