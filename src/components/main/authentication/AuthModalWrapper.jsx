import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ArrowLeft, Terminal, ShieldAlert } from "lucide-react";
import AuthHeader from "./AuthHeader";
import { AuthModalScrollContext } from "./AuthModalScrollContext";

const AuthModalWrapper = ({
	isOpen,
	onClose,
	onBack,
	children,
	showBackButton = true,
}) => {
	const scrollContainerRef = useRef(null);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

	const scrollToTop = useCallback(() => {
		scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 1024);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (!isOpen) return null;

	const SCANLINE_OVERLAY = (
		<div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
	);

	// --- MOBILE & TABLET (Full Terminal View) ---
	if (isMobile) {
		return (
			<AuthModalScrollContext.Provider value={scrollToTop}>
				<div className="fixed inset-0 z-[300] bg-[#050505] flex flex-col animate-in slide-in-from-bottom duration-500">
					{SCANLINE_OVERLAY}

					<div className="relative flex-shrink-0 border-b border-fuchsia-500/20">
						{showBackButton && (
							<button
								onClick={onBack || onClose}
								className="absolute top-6 left-6 z-[310] text-fuchsia-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] bg-fuchsia-500/10 px-3 py-1.5 rounded-md border border-fuchsia-500/20 active:scale-95 transition-all"
							>
								<ArrowLeft className="w-3 h-3" /> Back
							</button>
						)}
						<AuthHeader />
					</div>

					<div
						ref={scrollContainerRef}
						className="flex-grow p-6 overflow-y-auto flex flex-col relative custom-scrollbar"
					>
						<div className="max-w-md mx-auto w-full relative z-10">
							{children}
						</div>

						<div className="absolute bottom-4 right-4 opacity-20">
							<Terminal size={40} className="text-fuchsia-500" />
						</div>
					</div>
				</div>
			</AuthModalScrollContext.Provider>
		);
	}

	// --- DESKTOP MODAL (Data Vault View) ---
	return (
		<AuthModalScrollContext.Provider value={scrollToTop}>
			<div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
				<div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md" />

				<div className="relative flex w-full max-w-6xl h-[700px] bg-[#0a0a0c] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-300">
					{SCANLINE_OVERLAY}

					<div className="hidden lg:flex lg:flex-grow w-[40%] relative bg-black border-r border-fuchsia-500/30 flex-col items-stretch overflow-hidden">
						<div className="absolute -left-20 -top-20 w-64 h-64 bg-fuchsia-600/20 blur-[100px]" />
						<AuthHeader />
					</div>

					<div className="flex-grow h-full bg-[#0a0a0c] relative flex flex-col">
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />

						{showBackButton && (
							<button
								onClick={onBack || onClose}
								className="absolute top-8 left-8 z-20 text-fuchsia-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] bg-fuchsia-500/10 px-3 py-1.5 rounded-md border border-fuchsia-500/20 hover:bg-fuchsia-500/20 active:scale-95 transition-all cursor-pointer"
							>
								<ArrowLeft className="w-3 h-3" /> Back
							</button>
						)}

						<button
							onClick={onClose}
							className="absolute top-8 right-8 z-20 text-slate-500 hover:text-fuchsia-400 hover:rotate-90 transition-all duration-300 p-2 cursor-pointer"
							aria-label="Close Authentication Interface"
						>
							<X size={24} />
						</button>

						<div
							ref={scrollContainerRef}
							className="flex-grow overflow-y-auto flex flex-col custom-scrollbar"
						>
							<div className="max-w-md mx-auto px-12 pb-12 pt-24 w-full animate-in fade-in slide-in-from-right-4 duration-700">
								{children}
							</div>
						</div>

						<div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
							<div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-fuchsia-500/20 w-8 h-8 rounded-br-2xl" />
						</div>
					</div>
				</div>
			</div>
		</AuthModalScrollContext.Provider>
	);
};

export default AuthModalWrapper;