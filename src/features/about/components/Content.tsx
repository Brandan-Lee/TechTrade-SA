import React from "react";
import { motion, type Variants } from "framer-motion";
import { Terminal, Eye, Cpu, ShieldCheck } from "lucide-react";

export default function Content() {
	const cardVariants: Variants = {
		offscreen: { opacity: 0, y: 30 },
		onscreen: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", bounce: 0.4, duration: 0.8 },
		},
	};

	return (
		<section className="w-full bg-base-200 py-20 px-4 sm:px-8 lg:px-24 overflow-hidden selection:bg-secondary selection:text-secondary-content text-sm">
			<div className="max-w-5xl mx-auto flex flex-col gap-20">
				<motion.div
					initial="offscreen"
					whileInView="onscreen"
					viewport={{ once: true, amount: 0.3 }}
					variants={cardVariants}
					className="relative group"
				>
					<div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-secondary rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

					<article className="relative bg-base-300 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
						<header className="flex items-center gap-4 mb-8">
							<div className="p-3 bg-violet-600/20 rounded-lg border border-violet-500/50">
								<Terminal className="text-secondary" size={28} />
							</div>
							<h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none">
								Our{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-secondary">
									Origin
								</span>
							</h2>
						</header>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-6">
								<p className="text-slate-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium">
									TechTrade SA was born from a critical need in South Africa's
									rapidly evolving technology landscape. As hardware
									enthusiasts, we witnessed the risks inherent in peer-to-peer
									component trading.
								</p>
								<p className="text-slate-400 text-sm leading-relaxed">
									Counterfeit GPUs and misrepresented specifications plagued the
									market. We knew there had to be a better way—a protocol-driven
									platform.
								</p>
							</div>
							<div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col justify-center">
								<p className="text-secondary text-base sm:text-lg md:text-xl lg:text-2xl font-bold italic mb-4">
									"Protecting your investment is our source code."
								</p>
								<div className="flex gap-2">
									<div className="h-1 w-12 bg-secondary rounded-full"></div>
									<div className="h-1 w-4 bg-violet-500 rounded-full"></div>
								</div>
							</div>
						</div>
					</article>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					className="relative py-12 px-8 rounded-3xl bg-gradient-to-br from-violet-900/20 to-secondary-content/20 border-x border-secondary/30 overflow-hidden"
				>
					<div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
					<blockquote className="relative z-10 max-w-3xl mx-auto text-center">
						<p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-200 font-bold leading-snug italic">
							"By integrating advanced{" "}
							<span className="text-secondary">Hardware Intelligence</span>{" "}
							with a custom State Machine, we've moved beyond 'classifieds' to
							create a protocol-driven marketplace."
						</p>
						<footer className="mt-6 flex flex-col items-center gap-2">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-secondary p-[2px]">
								<div className="w-full h-full bg-base-200 rounded-full flex items-center justify-center">
									<ShieldCheck size={20} className="text-secondary" />
								</div>
							</div>
							<cite className="not-italic">
								<span className="block text-white font-black uppercase text-xs sm:text-sm md:text-base tracking-widest">
									Brandan-Lee James Sherbrooke
								</span>
								<span className="text-secondary/70 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-tighter">
									Founder & System Architect
								</span>
							</cite>
						</footer>
					</blockquote>
				</motion.div>

				<motion.div
					initial="offscreen"
					whileInView="onscreen"
					viewport={{ once: true }}
					variants={cardVariants}
					className="relative group"
				>
					<div className="absolute -inset-1 bg-gradient-to-l from-violet-600 to-secondary rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
					<article className="relative bg-base-300 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
						<header className="flex items-center gap-4 mb-8 justify-end">
							<h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none text-right">
								Our{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-l from-violet-400 to-secondary">
									Vision
								</span>
							</h2>
							<div className="p-3 bg-secondary/20 rounded-lg border border-secondary/50">
								<Eye className="text-violet-400" size={28} />
							</div>
						</header>

						<div className="flex flex-col md:flex-row gap-8 items-center">
							<div className="flex-1 order-2 md:order-1">
								<p className="text-slate-300 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-center md:text-left font-medium">
									To empower every South African gamer and creator with a
									platform where{" "}
									<span className="text-white font-bold">
										{" "}
										transactions are bulletproof
									</span>
									, and the hardware lifecycle is maximised through absolute
									trust.
								</p>
							</div>
							<div className="w-full md:w-48 h-32 order-1 md:order-2 bg-gradient-to-br from-violet-600/10 to-secondary/10 rounded-2xl border border-white/5 flex items-center justify-center">
								<Cpu className="text-white/20 animate-pulse" size={64} />
							</div>
						</div>
					</article>
				</motion.div>
			</div>
		</section>
	);
}
