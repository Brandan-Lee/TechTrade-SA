import React from "react";
import GradientButton from "../../ui/PurpleGradientButton";
import AlternateButton from "../../ui/AlternateButton";

const AuthFooter = ({ 
    label, 
    onClick, 
    showDivider = true, 
    dividerText = "OR" 
}) => {
    return (
        <div className="w-full pt-2 flex flex-col items-center">
            {/* Divider */}
            {showDivider && (
                <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        {dividerText}
                    </span>
                </div>
            )}

            {/* Secondary Action using our GradientButton */}
            <AlternateButton
                label={label}
                onClick={onClick}
            />
        </div>
    );
};

export default AuthFooter;