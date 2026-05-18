import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const BaseModal = ({
	isOpen,
	onClose,
	title,
	icon,
	children,
	headerAction,
	footerText,
	centerContent = false,
}) => {
	const scrollRef = useRef(null);

	// Trap keyboard Escape events to safely execute onClose
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose?.();
			}
		};

		if (isOpen) {
			document.body.style.overflow = "hidden"; // Prevent background body scrolling when modal is open
			window.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	// Force internal container viewport scroll resets upon stream refresh
	useEffect(() => {
		if (isOpen && scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[350] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-segment-title"
		>
			{/* Dark Cyberpunk Backdrop Matrix Cover */}
			<div
				className="absolute inset-0 bg-[#040208]/80 backdrop-blur-md transition-opacity duration-300"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Main Operational Container Framework Terminal */}
			<div className="relative z-10 w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] bg-[#0b0813] border border-purple-500/30 rounded-lg flex flex-col shadow-[0_0_40px_rgba(147,51,234,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
				{/* Header Module Layer */}
				<div className="w-full min-h-[64px] sm:min-h-[72px] px-4 sm:px-5 border-b border-purple-500/20 bg-[#0e0a1a] flex justify-between items-center gap-4 shrink-0 font-mono">
					<div className="flex items-center gap-2.5 min-w-0">
						{icon && (
							<div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-purple-950/50 border border-purple-500/40 flex justify-center items-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
								{icon}
							</div>
						)}
						<h2
							id="modal-segment-title"
							className="text-white text-sm sm:text-base md:text-lg font-black tracking-wider uppercase truncate"
						>
							{title || "TERMINAL_WINDOW"}
						</h2>
					</div>

					{/* Meta Action Elements Cluster */}
					<div className="flex items-center gap-2 sm:gap-3 shrink-0">
						{headerAction && (
							<div className="inline-flex items-center">{headerAction}</div>
						)}

						{/* Core Abort Intercept Escape Button Trigger */}
						<button
							onClick={onClose}
							aria-label="Terminate interface window"
							className="p-1.5 rounded border border-transparent text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 hover:border-fuchsia-500/20 transition-all focus:outline-none focus:border-fuchsia-500/30"
						>
							<X size={16} />
						</button>
					</div>
				</div>

				<div
					ref={scrollRef}
					className={`flex-1 px-4 sm:px-6 py-5 overflow-y-auto flex flex-col bg-[#07050d] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
						centerContent ? "justify-center items-center" : "justify-start"
					}`}
				>
					<div className="w-full h-full">{children}</div>
				</div>

				<div className="w-full h-10 px-4 sm:px-5 bg-[#0e0a1a] border-t border-purple-500/20 flex items-center justify-between shrink-0 font-mono text-[10px] sm:text-xs tracking-wider">
					<div className="text-slate-500 flex items-center gap-1.5 font-bold uppercase">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
						<span>{footerText}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BaseModal;
