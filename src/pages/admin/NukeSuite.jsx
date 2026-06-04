import React from "react";

export default function NukeSuite() {
	return (
		<main className="space-y-2">
			<header>
				<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
					Nuke{" "}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
						Suite
					</span>
				</h1>
			</header>
			<p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-slate-500 mt-1 uppercase tracking-wider">
				This part of the admin dashboard is still being built. Please wait for
				the next update.
			</p>
		</main>
	);
}
