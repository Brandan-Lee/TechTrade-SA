import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
	loadingLabel?: string;
	children?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
	primary:
		"border border-primary bg-primary text-primary-content hover:border-accent hover:bg-accent",
	secondary:
		"border border-white/10 bg-white/[0.04] text-slate-100 hover:border-white/20 hover:bg-white/[0.08]",
	ghost:
		"border border-transparent bg-transparent text-slate-300 hover:bg-white/[0.06] hover:text-white",
	danger:
		"border border-rose-400/20 bg-rose-400/10 text-rose-200 hover:border-rose-400/40 hover:bg-rose-400/15",
};

const sizes: Record<ButtonSize, string> = {
	small: "min-h-9 rounded-lg px-3 text-xs",
	medium: "min-h-11 rounded-xl px-4 text-sm",
	large: "min-h-12 rounded-xl px-5 text-sm",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		variant = "primary",
		size = "medium",
		isLoading = false,
		loadingLabel = "Loading",
		disabled,
		className = "",
		children,
		...props
	},
	ref,
) {
	return (
		<button
			{...props}
			ref={ref}
			disabled={disabled || isLoading}
			aria-busy={isLoading || props["aria-busy"]}
			className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
		>
			{isLoading && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
			<span>{isLoading ? loadingLabel : children}</span>
		</button>
	);
});

export default Button;
