import React, { useRef, useState } from "react";
import { User, ChevronDown, Check } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import GradientButton from "../../ui/PurpleGradientButton";
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
        agreedToTerms: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ 
            ...prev, 
            [name]: type === "checkbox" ? checked : value 
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setProfileImage(previewUrl);
            setFormData(prev => ({ ...prev, profilePhoto: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreedToTerms) {
            alert("Please accept the terms and conditions.");
            return;
        }
        setIsLoading(true);
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

                <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <form onSubmit={handleSubmit} className="space-y-6 pb-10">
                    {/* Profile Image Section */}
                    <div className="w-full p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-slate-100 outline outline-[3px] outline-pink-600 flex items-center justify-center overflow-hidden">
                            {profileImage ? (
                                <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-violet-600 w-8 h-8" />
                            )}
                        </div>
                        <GradientButton 
                            label={profileImage ? "Change Photo" : "Add Profile Photo"} 
                            type="button"
                            onClick={() => fileInputRef.current.click()} 
                        />
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AuthInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                        <AuthInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>

                    <AuthInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} required />

                    <div className="space-y-4">
                        <AuthInput
                            label="New Password"
                            type="password"
                            name="password"
                            isPassword={true}
                            showPassword={showPassword}
                            value={formData.password}
                            onChange={handleInputChange}
                            togglePassword={() => setShowPassword(!showPassword)}
                        />
                        <PasswordStrengthMeter password={formData.password} />
                        <AuthInput
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            isPassword={true}
                            showPassword={confirmShowPassword}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            togglePassword={() => setConfirmShowPassword(!confirmShowPassword)}
                        />
                    </div>

                    <AuthInput label="Mobile Number" name="mobile" placeholder="061 123 4567" value={formData.mobile} onChange={handleInputChange} required />

                    {/* Province Selector */}
                    <div className="space-y-1.5">
                        <label className="text-violet-600 text-[10px] font-black uppercase tracking-widest ml-1">Province</label>
                        <div className="relative">
                            <select
                                name="province"
                                value={formData.province}
                                onChange={handleInputChange}
                                className="w-full h-12 bg-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm text-gray-900 appearance-none px-4 font-medium"
                                required
                            >
                                <option value="" disabled>Select your province</option>
                                <option value="GP">Gauteng</option>
                                <option value="WC">Western Cape</option>
                                {/* ... other options ... */}
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-500 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Terms and Conditions Section */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            {/* Checkbox Wrapper */}
                            <div className="relative flex items-center pt-1 shrink-0">
                                <input
                                    type="checkbox"
                                    name="agreedToTerms"
                                    checked={formData.agreedToTerms}
                                    onChange={handleInputChange}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 bg-white checked:bg-pink-600 checked:border-pink-600 transition-all"
                                    required
                                />
                                <Check 
                                    className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-[3px] pointer-events-none transition-opacity" 
                                    strokeWidth={4} 
                                />
                            </div>
                            
                            <span className="text-sm font-medium text-slate-600 leading-relaxed">
                                I agree to the{" "}
                                <button
                                    type="button"
                                    onClick={onSwitchToTOS}
                                    className="inline-block text-purple-600 font-black uppercase tracking-wider hover:text-pink-600 transition-colors duration-200"
                                >
                                    Terms and Conditions
                                </button>
                            </span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4 pt-4">
                        <GradientButton label="REGISTER ACCOUNT" type="submit" isLoading={isLoading} />
                        <AuthFooter label="Back to Login" onClick={onSwitchToLogin} />
                    </div>
                </form>
            </div>
        </AuthModalWrapper>
    );
};

export default RegisterModal;