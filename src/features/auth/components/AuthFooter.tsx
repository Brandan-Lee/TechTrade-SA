import AlternateButton from "@/components/ui/AlternateButton";

interface AuthFooterProps {
	label: string;
	onClick: () => void;
	showDivider?: boolean;
	dividerText?: string;
	className?: string;
}

const AuthFooter = ({
	label,
	onClick,
	showDivider = true,
	dividerText = "OR",
	className = "",
}: AuthFooterProps) => {
	return (
		<footer className="w-full pt-2 flex flex-col items-center text-sm">
			{showDivider && (
				<div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100">
					<span className="text-slate-400 text-xs sm:text-sm md:text-base lg:text-xl font-black uppercase tracking-[0.3em] mb-4">
						{dividerText}
					</span>
				</div>
			)}

			<AlternateButton
				label={label}
				onClick={onClick}
				className={className}
			/>
		</footer>
	);
};

export default AuthFooter;
