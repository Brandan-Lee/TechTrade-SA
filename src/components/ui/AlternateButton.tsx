import type { ButtonHTMLAttributes, ReactNode } from "react";
import Button from "@/components/ui/Button";

interface AlternateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label?: ReactNode;
	disabled?: boolean;
}

const AlternateButton = ({
	label,
	disabled,
	className = "",
	...props
}: AlternateButtonProps) => (
	<Button
		{...props}
		disabled={disabled}
		variant="secondary"
		size="medium"
		className={`w-full ${className}`}
	>
		{label}
	</Button>
);

export default AlternateButton;
