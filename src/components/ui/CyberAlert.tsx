import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X, TriangleAlert } from "lucide-react";

export type AlertType = "error" | "success" | "info" | "warning";

interface CyberAlertProps {
	type?: AlertType;
	message: ReactNode;
	onClose?: () => void;
}

const alertStyles: Record<AlertType, { classes: string; icon: typeof Info }> = {
	error: {
		classes: "border-rose-400/20 bg-rose-400/[0.08] text-rose-200",
		icon: AlertCircle,
	},
	success: {
		classes: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200",
		icon: CheckCircle2,
	},
	info: {
		classes: "border-info/20 bg-info/[0.08] text-info",
		icon: Info,
	},
	warning: {
		classes: "border-amber-400/20 bg-amber-400/[0.08] text-amber-100",
		icon: TriangleAlert,
	},
};

const CyberAlert = ({
	type = "error",
	message,
	onClose,
}: CyberAlertProps) => {
	const { classes, icon: Icon } = alertStyles[type];
	return (
		<div
			role={type === "error" || type === "warning" ? "alert" : "status"}
			aria-live={type === "error" || type === "warning" ? "assertive" : "polite"}
			className={`flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${classes}`}
		>
			<div className="flex min-w-0 items-start gap-3">
				<Icon className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
				<div className="min-w-0 leading-6">{message}</div>
			</div>

			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className="shrink-0 rounded-md p-1 text-current/70 transition-colors hover:bg-black/10 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
					aria-label="Close message"
				>
					<X size={16} aria-hidden="true" />
				</button>
			)}
		</div>
	);
};

export default CyberAlert;
