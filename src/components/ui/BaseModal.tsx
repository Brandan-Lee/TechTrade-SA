import {
	useEffect,
	useId,
	useRef,
	type KeyboardEvent,
	type ReactNode,
} from "react";
import { X } from "lucide-react";

interface BaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	icon?: ReactNode;
	children: ReactNode;
	headerAction?: ReactNode;
	footerText?: string;
	centerContent?: boolean;
	className?: string;
}

const BaseModal = ({
	isOpen,
	onClose,
	title,
	icon,
	children,
	headerAction,
	footerText = "",
	centerContent = false,
	className = "",
}: BaseModalProps) => {
	const titleId = useId();
	const dialogRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		const previousOverflow = document.body.style.overflow;
		const previouslyFocused =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		document.body.style.overflow = "hidden";
		dialogRef.current?.focus();
		return () => {
			document.body.style.overflow = previousOverflow;
			previouslyFocused?.focus();
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen && scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, [isOpen]);

	const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Escape") {
			event.preventDefault();
			onClose();
			return;
		}

		if (event.key !== "Tab" || !dialogRef.current) return;

		const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
		);
		const first = focusableElements[0];
		const last = focusableElements[focusableElements.length - 1];

		if (
			event.shiftKey &&
			(document.activeElement === first || document.activeElement === dialogRef.current)
		) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[350] flex items-center justify-center p-3 sm:p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			tabIndex={-1}
			ref={dialogRef}
			onKeyDown={handleDialogKeyDown}
		>
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm"
				onClick={onClose}
				aria-hidden="true"
			/>

			<div
				className={`relative z-10 flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-base-200 shadow-2xl ${className}`}
			>
				<header className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] px-4 sm:px-6">
					<div className="flex items-center gap-2.5 min-w-0">
						{icon && (
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.08] text-primary">
								{icon}
							</div>
						)}
						<h2
							id={titleId}
							className="truncate text-base font-semibold text-base-content"
						>
							{title || "Dialog"}
						</h2>
					</div>

					<div className="flex items-center gap-2 sm:gap-3 shrink-0">
						{headerAction && (
							<div className="inline-flex items-center">{headerAction}</div>
						)}

						<button
							type="button"
							onClick={onClose}
							aria-label="Close dialog"
							className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<X size={18} aria-hidden="true" />
						</button>
					</div>
				</header>

				<div
					ref={scrollRef}
					className={`min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 ${
						centerContent ? "flex flex-col items-center justify-center" : ""
					}`}
				>
					{children}
				</div>

				{footerText && (
					<footer className="flex min-h-10 shrink-0 items-center border-t border-white/[0.08] px-4 text-xs text-slate-400 sm:px-6">
						<span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
						{footerText}
					</footer>
				)}
			</div>
		</div>
	);
};

export default BaseModal;
