import React, { useState } from "react";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import GradientButton from "../../ui/PurpleGradientButton";
import PasswordStrengthMeter from "../../ui/PasswordStrengthMeter";
import AuthFooter from "./AuthFooter";

export const ResetModal = ({
    isOpen,
    onClose,
    onSwitchToOTP,
    onSwitchToLogin,
}) => {
    const [newShowPassword, newSetShowPassword] = useState(false);
    const [confirmShowPassword, confirmSetShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        setIsLoading(true);
        // PHP API Call here
        console.log("Updating password...");
        
        setTimeout(() => {
            setIsLoading(false);
            onSwitchToLogin(); // Send them back to login after success
        }, 2000);
    };

    return (
        <AuthModalWrapper 
            isOpen={isOpen} 
            onClose={onClose} 
            onBack={onSwitchToOTP}
        >
            <div className="space-y-8">
                <h1 className="text-purple-600 text-4xl md:text-5xl font-black uppercase tracking-tighter">
                    Reset Password
                </h1>

                <form onSubmit={handleReset} className="space-y-5">
                    {/* New Password */}
                    <div className="space-y-3">
                        <AuthInput
                            label="New Password"
                            type="password"
                            isPassword={true}
                            showPassword={newShowPassword}
                            togglePassword={() => newSetShowPassword(!newShowPassword)}
                        />

						<PasswordStrengthMeter password={password} />
                    </div>

                    {/* Confirm Password */}
                    <AuthInput
                            label="Confirm Password"
                            type="password"
                            isPassword={true}
                            showPassword={confirmShowPassword}
                            togglePassword={() => confirmSetShowPassword(!confirmPassword)}
                        />

                    {/* Actions */}
                    <div className="space-y-4 pt-2">
                        <GradientButton 
                            label="UPDATE PASSWORD" 
                            type="submit" 
                            isLoading={isLoading} 
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

export default ResetModal;