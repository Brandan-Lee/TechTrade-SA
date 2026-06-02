import React from "react";

export const DashBoardCard = ({ label, value, icon: Icon, colorClass }) => (
	<article className="card bg-base-100 shadow-xl border-l-4 border-l-primary hover:scale-[1.02] transition-transform duration-300">
		<section className="card-body p-4 sm:p-6 flex flex-row items-center gap-4">
			<div className={`text-3xl ${colorClass}`} aria-hidden="true">
				<Icon />
			</div>

			<header>
				<h3 className="text-xs sm:text-sm text-base-content/60 uppercase tracking-wider font-bold">
					{label}
				</h3>
				<p className="text-lg sm:text-2xl font-mono font-bold tracking-tight text-base-content">
					{value}
				</p>
			</header>
		</section>
	</article>
);
