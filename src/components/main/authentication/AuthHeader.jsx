import { Radio, ShieldCheck, Activity, Cpu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/logo.png";

export default function AuthHeader() {
	const [currentSlide, setCurrentSlide] = useState(0);

	const messages = [
		"Your payment is being held safely. We are tracking all the steps of your trade to make sure everything goes smoothly",
		"Our systems are ready. We have confirmed that all users involved are verified and secure.",
		"We have double-checked everyone's details to keep our local marketplace safe and secure.",
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % messages.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [messages.length]);

	return (
		<div className="w-full h-full bg-[#050505] flex flex-col items-center justify-center py-12 lg:py-16 px-6 gap-10 relative overflow-hidden">
			<div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
			<div className="absolute -top-24 -left-24 w-64 h-64 bg-fuchsia-600/10 blur-[100px] rounded-full" />

			{/* Branding Section */}
			<div className="flex flex-col items-center gap-6 relative z-10">
				<div className="relative group">
					<div className="absolute inset-0 bg-fuchsia-500/30 rounded-full blur-2xl group-hover:bg-fuchsia-500/50 transition-all duration-500" />
					<div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />

					<div className="relative flex items-center justify-center bg-black rounded-full p-2 border border-white/10 shadow-2xl w-24 h-24 lg:w-32 lg:h-32 aspect-square overflow-hidden">
						<img
							src={logo}
							alt="TechTrade Logo"
							className="w-[100%] h-[100%] max-w-none min-w-none min-h-none object-cover object-[center_60%] scale-100 brightness-110 mt-6"
						/>
					</div>
				</div>

				<div className="text-center space-y-2">
					<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
						TechTrade{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							ZA
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

				{/* Message Slider with Framer Motion for better UX */}
				<div className="w-full h-20 overflow-hidden relative flex items-center justify-center">
					<AnimatePresence mode="wait">
						<motion.p
							key={currentSlide}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.4 }}
							className="text-slate-400 text-sm md:text-base font-medium leading-relaxed italic text-center px-4"
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
