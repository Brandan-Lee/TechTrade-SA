import React from "react";

const CyberActionButton = ({ label, isLoading, className = "", ...props }) => {
	return (
		<div className="relative group w-full">
			{/* The "Ghost" Glow - Layer behind the button for that neon depth */}
			<div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-lg blur opacity-30 group-hover:opacity-100 group-active:opacity-70 transition duration-300"></div>

			<button
				{...props}
				disabled={isLoading}
				className={`
                    relative w-full h-14 md:h-16 
                    bg-[#0a0a0a] 
                    border border-fuchsia-500/50
                    text-white font-black text-sm md:text-base tracking-[0.3em] uppercase italic
                    flex items-center justify-center overflow-hidden
                    transition-all duration-200
                    hover:border-fuchsia-400 hover:text-fuchsia-500
                    active:scale-[0.97] active:bg-fuchsia-950/20
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale
                    ${className}
                `}
				style={{
					// Creates a subtle "cut-corner" cyberpunk aesthetic
					clipPath: "polygon(5% 0, 100% 0, 100% 70%, 95% 100%, 0 100%, 0 30%)",
				}}
			>
				{/* Scanning Light Effect on Hover */}
				<div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-fuchsia-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

				{isLoading ? (
					<div className="flex items-center gap-3">
						<span className="w-4 h-4 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></span>
						<span className="text-sm md:text-base tracking-widest animate-pulse">
							UPLOADING...
						</span>
					</div>
				) : (
					<span className="relative z-10 flex items-center gap-2">{label}</span>
				)}
			</button>

			{/* CSS for the Shimmer Animation */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `,
				}}
			/>
		</div>
	);
};

export default CyberActionButton;
