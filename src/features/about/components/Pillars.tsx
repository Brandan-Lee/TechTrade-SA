import React from "react";
import { Cpu, ShieldCheck, Lock, ChevronRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import CyberActionButton from "@/components/ui/CyberActionButton";

export default function Pillars({ onOpenLogin }: { onOpenLogin: () => void }) {
	const pillars = [
		{
			title: "Hardware Intelligence",
			desc: "Data-driven verification of device specifications and market value, neutralizing 'lemon' hardware threats.",
			icon: <Cpu className="w-8 h-8 text-secondary" />,
			glow: "group-hover:shadow-[0_0_30px_rgba(192,132,252,0.3)]",
		},
		{
			title: "Managed Trust",
			desc: "Every node and listing is vetted through our multi-point negotiation hub to ensure absolute integrity.",
			icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
			glow: "group-hover:shadow-[0_0_30px_rgba(192,132,252,0.3)]",
		},
		{
			title: "Transactional Security",
			desc: "Military-grade escrow with Argon2id encryption, built on a zero-trust architecture for total safety.",
			icon: <Lock className="w-8 h-8 text-secondary" />,
			glow: "group-hover:shadow-[0_0_30px_rgba(192,132,252,0.3)]",
		},
	];

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.15 },
		},
	};

	const cardVariants: Variants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
		},
	};

	return (
		<motion.section
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={containerVariants}
			className="w-full bg-base-200 py-24 px-4 relative overflow-hidden text-sm"
		>
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />

			<div className="max-w-6xl mx-auto relative z-10">
				<header>
					<motion.div
						variants={cardVariants}
						className="mb-16 text-center md:text-left"
					>
						<h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter">
							Our{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-secondary">
								Core Pillars
							</span>
						</h2>
						<div className="h-1 w-20 bg-secondary mt-4 rounded-full" />
					</motion.div>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
					{pillars.map((pillar, index) => (
						<motion.div
							key={index}
							variants={cardVariants}
							className="group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] border-1 border-white"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-secondary/20 group-hover:to-secondary/50 transition-all duration-500" />

							<article className="relative h-full p-8 bg-base-300 rounded-2xl flex flex-col gap-6">
								<div
									className={`relative w-14 h-14 flex items-center justify-center bg-violet-950/40 border border-violet-500/30 rounded-xl transition-all duration-500 ${pillar.glow}`}
								>
									<div className="absolute inset-0 bg-secondary/10 blur-sm rounded-xl" />
									<div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
										{pillar.icon}
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="text-slate-100 text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight group-hover:text-secondary transition-colors">
										{pillar.title}
									</h3>
									<p className="text-slate-400 text-sm leading-relaxed font-medium">
										{pillar.desc}
									</p>
								</div>

								<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
									<ChevronRight className="text-secondary w-5 h-5" />
								</div>
							</article>
						</motion.div>
					))}
				</div>

				<footer className="flex flex-col items-center gap-8 mt-12">
					<motion.div
						variants={cardVariants}
						className="w-full max-w-sm transform hover:scale-105 transition-transform duration-300"
					>
						<CyberActionButton label="GET STARTED NOW" onClick={onOpenLogin} />
					</motion.div>
				</footer>
			</div>
		</motion.section>
	);
}
