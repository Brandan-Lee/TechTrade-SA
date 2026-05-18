import React, { useState } from "react";
import { ShieldCheck, Fingerprint, Lock, Mail } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";

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
        e.preventDefault();
        setIsLoading(true);
        // Add auth logic here
        setTimeout(() => setIsLoading(false), 2000); // Simulate lag
    };

    return (
        <AuthModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            onBack={onClose}
        >
            <div className="space-y-10 py-4">
                {/* Header Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Fingerprint className="text-fuchsia-500 animate-pulse" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-fuchsia-500/80">
                            Identity Verification
                        </span>
                    </div>
                    <h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
                        Login <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">Secure</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[80%]">
                        Access the TechTrade network to manage your <span className="text-slate-300">hardware logs</span> and active transfers.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1 group">
                        <AuthInput
                            label="EMAIL"
                            type="email"
                            placeholder="user@network.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <AuthInput
                            label="PASSWORD"
                            type="password"
                            isPassword={true}
                            showPassword={showPassword}
                            togglePassword={() => setShowPassword(!showPassword)}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onSwitchToForgot}
                                className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-fuchsia-400 transition-all flex items-center gap-2"
                            >
                                <Lock size={10} />
                                Lost Access?
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <CyberActionButton
                            label="Authorize Access"
                            type="submit"
                            isLoading={isLoading}
                        />
                    </div>
                </form>

                {/* Footer Section */}
                <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                            New to TechTrade?
                        </span>
                        <button
                            onClick={onSwitchToRegister}
                            className="group relative px-6 py-2"
                        >
                            <span className="relative z-10 text-violet-400 font-black uppercase text-xs tracking-[0.3em] group-hover:text-fuchsia-400 transition-colors">
                                REGISTER NOW
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </AuthModalWrapper>
    );
};

export default LoginModal;