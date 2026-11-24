import { useId, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: boolean | string;
	isPassword?: boolean;
	showPassword?: boolean;
	togglePassword?: () => void;
}

const AuthInput = ({
	label,
	error = false,
	isPassword = false,
	showPassword = false,
	togglePassword,
	id,
	className = "",
	...props
}: AuthInputProps) => {
	const generatedId = useId();
	const inputId = id || generatedId;
	const errorId = `${inputId}-error`;

	return (
		<div className="w-full space-y-2">
			{label ? (
				<label
					htmlFor={inputId}
					className="ml-0.5 block text-sm font-medium text-slate-200"
				>
					{label}
				</label>
			) : null}

			<div className={`relative group ${className}`}>
				<input
					{...props}
					id={inputId}
					aria-label={
						label ? props["aria-label"] : props["aria-label"] || props.placeholder
					}
					type={isPassword ? (showPassword ? "text" : "password") : props.type}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={error ? errorId : undefined}
					className={`min-h-12 w-full rounded-xl border bg-base-200 px-4 text-sm text-base-content shadow-sm transition-[border-color,box-shadow] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 ${
						isPassword ? "pr-12" : ""
					} ${
						error
							? "border-rose-400/70 focus:border-rose-400"
							: "border-white/10 hover:border-white/20 focus:border-primary"
					}`}
				/>

				{isPassword && togglePassword && (
					<button
						type="button"
						onClick={togglePassword}
						aria-label={showPassword ? "Hide password" : "Show password"}
						aria-pressed={showPassword}
						className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
					>
						{showPassword ? (
							<EyeOff size={16} aria-hidden="true" />
						) : (
							<Eye size={16} aria-hidden="true" />
						)}
					</button>
				)}
			</div>

			{error && typeof error === "string" && (
				<div
					role="alert"
					className="flex items-center gap-1.5 text-sm text-rose-300"
				>
					<ShieldAlert size={14} aria-hidden="true" />
					<span>{error}</span>
				</div>
			)}
		</div>
	);
};

export default AuthInput;
