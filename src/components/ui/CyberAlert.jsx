import React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const CyberAlert = ({ type = "error", message, onClose }) => {
	const isError = type === "error";

	const styles = {
		container: isError
			? "bg-rose-500/10 outline-rose-500/50 text-rose-400"
			: "bg-emerald-500/10 outline-emerald-500/50 text-emerald-400",
		icon: isError ? "text-rose-500" : "text-emerald-500",
		text: "text-slate-200",
	};

	return (
		<div
			className={`w-full px-4 py-3 rounded-lg outline outline-1 outline-offset-[-1px] flex items-center justify-between gap-3 ${styles.container} transition-all duration-300 animate-in fade-in slide-in-from-top-2`}
		>
			<div className="flex items-center gap-3">
				{isError ? (
					<AlertCircle className={styles.icon} size={20} />
				) : (
					<CheckCircle2 className={styles.icon} size={20} />
				)}
				<p
					className={`text-xs md:text-sm font-bold uppercase tracking-wider ${styles.text}`}
				>
					{message}
				</p>
			</div>

			{onClose && (
				<button
					onClick={onClose}
					className="opacity-50 hover:opacity-100 transition-opacity"
				>
					<X size={14} className={styles.text} />
				</button>
			)}
		</div>
	);
};

export default CyberAlert;
