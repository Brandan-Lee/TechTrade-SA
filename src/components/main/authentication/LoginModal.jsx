import React, { useState } from "react";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import PurpleGradientButton from "../../ui/PurpleGradientButton";

export const LoginModal = ({
    isOpen,
    onClose,
    onSwitchToForgot,
    onSwitchToRegister,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        
    };

    return (
        <AuthModalWrapper 
            isOpen={isOpen} 
            onClose={onClose}
            onBack={onClose}
        >
            <div className="space-y-8">
                {/* Header Section */}
                <h1 className="text-purple-600 text-5xl font-black uppercase tracking-tighter">
                    User Login
                </h1>

                {/* Form Section */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <AuthInput
                        label="Email Address"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <div className="space-y-2">
                        <AuthInput
                            label="Password"
                            type="password"
                            isPassword={true}
                            showPassword={showPassword}
                            togglePassword={() => setShowPassword(!showPassword)}
                            value={formData.password}
                        />
                        <button
                            type="button"
                            onClick={onSwitchToForgot}
                            className="text-violet-800 text-xs font-bold uppercase tracking-widest w-full text-right py-1 hover:text-pink-600 transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <PurpleGradientButton 
                        label="LOG IN" 
                        type="submit"
                        isLoading={isLoading} 
                    />
                </form>

                {/* Footer Section */}
                <div className="pt-8 border-t border-gray-200 flex flex-col items-center gap-4">
                    <span className="text-slate-400 text-xs font-bold uppercase">
                        New to TechTrade?
                    </span>
                    <button
                        onClick={onSwitchToRegister}
                        className="text-violet-800 font-black uppercase tracking-widest border-b-2 border-violet-800 hover:text-pink-600 hover:border-pink-600 transition-all"
                    >
                        Register Account
                    </button>
                </div>
            </div>
        </AuthModalWrapper>
    );
};

export default LoginModal;