import { Radio, ShieldCheck, Activity, Cpu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/logo.png";

export default function AuthHeader() {
	const [currentSlide, setCurrentSlide] = useState(0);

	const messages = [
		"Escrow Protocol Engaged. The Transactional State Machine is monitoring all active negotiations.",
		"Hardware Intelligence Active. All local nodes are verified via the Managed Trust Hub.",
		"Multi-point credential audit complete. Mitigating regional risk in the SA tech market.",
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % messages.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [messages.length]);

	return (
		<div className="w-full h-full bg-[#050505] flex flex-col items-center justify-center py-12 lg:py-16 px-6 gap-10 relative overflow-hidden">
			{/* Background Aesthetic: Grid & Glow */}
			<div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
			<div className="absolute -top-24 -left-24 w-64 h-64 bg-fuchsia-600/10 blur-[100px] rounded-full" />

			{/* Branding Section */}
			<div className="flex flex-col items-center gap-6 relative z-10">
				<div className="relative group">
					{/* Multi-layered Glow */}
					<div className="absolute inset-0 bg-fuchsia-500/30 rounded-full blur-2xl group-hover:bg-fuchsia-500/50 transition-all duration-500" />
					<div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />

					<div className="relative bg-black rounded-full p-2 border border-white/10 shadow-2xl">
						<img
							src={logo}
							alt="TechTrade Logo"
							className="w-20 h-20 lg:w-28 lg:h-28 object-contain brightness-110"
						/>
					</div>
				</div>

				<div className="text-center space-y-2">
					<h1 className="text-white text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none">
						TechTrade
						<span className="ml-2 text-fuchsia-500 not-italic font-light">
							SA
						</span>
					</h1>
					<div className="flex items-center justify-center gap-2">
						<span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-fuchsia-500/50" />
						<span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-fuchsia-500/50" />
					</div>
				</div>
			</div>

			{/* Status Terminal (Tablet and Desktop) */}
			<div className="hidden md:flex flex-col items-center w-full max-w-lg bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
				{/* Decorative Tech Corners */}
				<div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-fuchsia-500/30 rounded-tl-xl" />
				<div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500/30 rounded-br-xl" />

				<div className="flex items-center justify-between w-full mb-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-fuchsia-500/10 rounded-lg border border-fuchsia-500/20">
							<ShieldCheck className="w-5 h-5 text-fuchsia-500" />
						</div>
						<div className="flex flex-col">
							<span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">
								System Status
							</span>
							<span className="text-xs text-white font-bold flex items-center gap-1.5">
								<span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
								ONLINE / ENCRYPTED
							</span>
						</div>
					</div>
					<Activity className="text-slate-800 w-8 h-8" />
				</div>

				{/* Message Slider with Framer Motion for better UX */}
				<div className="w-full h-20 overflow-hidden relative flex items-center justify-center">
					<AnimatePresence mode="wait">
						<motion.p
							key={currentSlide}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.4 }}
							className="text-slate-400 text-sm font-medium leading-relaxed italic text-center px-4"
						>
							{messages[currentSlide]}
						</motion.p>
					</AnimatePresence>
				</div>

				{/* Pagination (Terminal Style) */}
				<div className="flex gap-3 mt-6">
					{messages.map((_, i) => (
						<button
							key={i}
							onClick={() => setCurrentSlide(i)}
							className={`h-1 transition-all duration-500 rounded-full ${
								currentSlide === i
									? "bg-fuchsia-500 w-8 shadow-[0_0_10px_#d946ef]"
									: "bg-white/10 w-4 hover:bg-white/20"
							}`}
							aria-label={`Go to slide ${i + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
