import React, { useState } from "react";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import GradientButton from "../../ui/PurpleGradientButton";
import AuthFooter from "./AuthFooter";

export const ForgotModal = ({
    isOpen,
    onClose,
    onSwitchToOTP,
    onSwitchToLogin,
}) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestOTP = async (e) => {
        
    };

    return (
        <AuthModalWrapper 
            isOpen={isOpen} 
            onClose={onClose} 
            onBack={onSwitchToLogin}
        >
            <div className="space-y-8 md:space-y-10">
                <h1 className="text-purple-600 text-4xl md:text-5xl font-black uppercase tracking-tighter">
                    Forgot Password
                </h1>

                <form onSubmit={handleRequestOTP} className="space-y-6">
                    <AuthInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                    />

                    <div className="space-y-4 md:space-y-6">
                        <GradientButton 
                            label="REQUEST OTP" 
                            type="submit" 
                            isLoading={isLoading}
							onClick={onSwitchToOTP}
                        />
                        
                        <AuthFooter
							label="BACK TO LOGIN"
							onClick={onSwitchToLogin}
						/>
                    </div>
                </form>
            </div>
        </AuthModalWrapper>
    );
};

export default ForgotModal;