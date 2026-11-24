import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero.png";

const trustPoints = [
	{ icon: ShieldCheck, label: "Safer peer-to-peer trades" },
	{ icon: BadgeCheck, label: "Built for South African gamers" },
];

export default function HeroSection() {
	return (
		<section className="relative isolate overflow-hidden border-b border-white/[0.06] bg-base-100">
			<div className="brand-glow pointer-events-none absolute inset-0 -z-10" />
			<div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-24">
				<motion.div
					initial={{ opacity: 0, y: 22 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.65, ease: "easeOut" }}
					className="relative z-10"
				>
					<p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-3.5 py-2 text-[11px] font-semibold tracking-[0.14em] text-primary sm:text-xs">
						<span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_#c084fc]" />
						PC HARDWARE, TRADED WITH CONFIDENCE
					</p>
					<h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
						Build better.
						<br />
						Trade <span className="text-primary">smarter.</span>
					</h1>
					<p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
						Find your next upgrade or give your old gear a new home. A
						South-African marketplace made for people who love PC hardware.
					</p>
					<div className="mt-9 flex flex-col gap-3 sm:flex-row">
						<Link
							to="/marketplace"
							className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-content shadow-[0_8px_30px_rgba(192,132,252,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-offset-4"
						>
							Explore marketplace
							<ArrowUpRight
								size={17}
								className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							/>
						</Link>
						<Link
							to="/about"
							className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 text-sm font-semibold text-slate-100 transition duration-200 hover:border-white/30 hover:bg-white/[0.07]"
						>
							How it works
							<ArrowDownRight size={17} />
						</Link>
					</div>
					<div className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
						{trustPoints.map(({ icon: Icon, label }) => (
							<div
								key={label}
								className="flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm"
							>
								<Icon size={16} className="text-primary" aria-hidden="true" />
								{label}
							</div>
						))}
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.97, x: 14 }}
					animate={{ opacity: 1, scale: 1, x: 0 }}
					transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
					className="relative mx-auto w-full max-w-[640px]"
				>
					<div className="absolute -inset-4 rounded-[2rem] bg-primary/[0.07] blur-2xl" />
					<div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-base-300 p-2 shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
						<img
							src={heroImage}
							alt="A gaming PC setup with a widescreen monitor and desktop"
							className="aspect-[1.45] w-full rounded-[1.15rem] object-cover"
							fetchPriority="high"
						/>
						<div className="absolute inset-x-2 bottom-2 flex items-end justify-between rounded-b-[1.15rem] bg-gradient-to-t from-base-100/95 via-base-100/60 to-transparent p-5 pt-20 sm:p-7 sm:pt-24">
							<div>
								<p className="text-[10px] font-semibold tracking-[0.2em] text-primary sm:text-xs">
									YOUR NEXT BUILD
								</p>
								<p className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
									Starts right here.
								</p>
							</div>
							<div className="hidden items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-2 text-[11px] font-medium text-slate-100 backdrop-blur-md sm:flex">
								<span className="h-1.5 w-1.5 rounded-full bg-primary" />
								Made for SA
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
