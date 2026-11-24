import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import logo from "@/assets/logo.png";

interface FooterProps {
	onLoginClick: () => void;
	onTOSClick: () => void;
	onDataClick: () => void;
}

const tradingSteps = [
	"Browse",
	"Make an offer",
	"Agree on terms",
	"Complete the trade",
];

export default function Footer({
	onLoginClick,
	onTOSClick,
	onDataClick,
}: FooterProps) {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="mt-16 border-t border-white/[0.08] bg-base-200/50">
			<section className="page-container !py-12 sm:!py-14">
				<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="page-eyebrow">A better way to trade</p>
						<h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
							From browsing to your next build
						</h2>
					</div>
					<p className="max-w-xl text-sm leading-6 text-slate-400">
						Keep communication clear, agree on the details, and use the
						marketplace tools to manage your trade.
					</p>
				</div>

				<ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{tradingSteps.map((step, index) => (
						<li
							key={step}
							className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"
						>
							<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/[0.1] text-sm font-semibold text-primary">
								{index + 1}
							</span>
							<span className="text-sm font-medium text-slate-200">{step}</span>
						</li>
					))}
				</ol>
			</section>

			<div className="border-t border-white/[0.07]">
				<div className="page-container !py-10">
					<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
						<div>
							<Link to="/" className="inline-flex items-center gap-3">
								<img
									src={logo}
									alt=""
									className="h-10 w-10 rounded-xl object-cover"
									aria-hidden="true"
								/>
								<span className="text-lg font-semibold tracking-tight text-white">
									TechTrade <span className="text-primary">SA</span>
								</span>
							</Link>
							<p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
								A South African marketplace for buying and selling PC hardware.
							</p>
							<p className="mt-5 inline-flex items-center gap-2 text-xs text-slate-500">
								<ShieldCheck size={15} className="text-primary" aria-hidden="true" />
								Trade thoughtfully. Meet safely.
							</p>
						</div>

						<nav aria-label="Explore TechTrade">
							<h3 className="text-sm font-semibold text-white">Explore</h3>
							<ul className="mt-4 space-y-3 text-sm text-slate-400">
								<li><Link className="transition-colors hover:text-white" to="/marketplace">Marketplace</Link></li>
								<li><Link className="transition-colors hover:text-white" to="/sell">Sell your gear</Link></li>
								<li><Link className="transition-colors hover:text-white" to="/build-doctor">Build Doctor</Link></li>
								<li><Link className="transition-colors hover:text-white" to="/about">About us</Link></li>
							</ul>
						</nav>

						<nav aria-label="Help and policies">
							<h3 className="text-sm font-semibold text-white">Help & policies</h3>
							<ul className="mt-4 space-y-3 text-sm text-slate-400">
								<li><Link className="transition-colors hover:text-white" to="/contact-us">Contact support</Link></li>
								<li>
									<button type="button" onClick={onTOSClick} className="transition-colors hover:text-white">
										Terms of service
									</button>
								</li>
								<li>
									<button type="button" onClick={onDataClick} className="transition-colors hover:text-white">
										Privacy policy
									</button>
								</li>
							</ul>
						</nav>

						<div>
							<h3 className="text-sm font-semibold text-white">Your account</h3>
							<p className="mt-4 text-sm leading-6 text-slate-400">
								Sign in to manage listings, offers, and transactions.
							</p>
							<Button
								size="small"
								variant="secondary"
								onClick={onLoginClick}
								className="mt-4"
							>
								Sign in <ArrowRight size={14} aria-hidden="true" />
							</Button>
						</div>
					</div>

					<div className="mt-10 border-t border-white/[0.07] pt-5 text-xs text-slate-500">
						© {currentYear} TechTrade SA. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
}
