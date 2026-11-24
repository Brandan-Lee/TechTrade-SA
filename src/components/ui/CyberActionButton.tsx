import type { ButtonHTMLAttributes, ReactNode } from "react";
import Button from "@/components/ui/Button";

interface CyberActionButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	label?: ReactNode;
	isLoading?: boolean;
}

const CyberActionButton = ({
	label,
	isLoading = false,
	className = "",
	...props
}: CyberActionButtonProps) => {
	return (
		<Button
			{...props}
			isLoading={isLoading}
			variant="primary"
			size="large"
			className={`w-full ${className}`}
		>
			{label}
		</Button>
	);
};

export default CyberActionButton;
