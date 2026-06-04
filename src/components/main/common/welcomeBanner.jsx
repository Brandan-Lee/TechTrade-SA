import React from "react";
import { Terminal } from "lucide-react";
import { useAuth } from "../../AuthContext";

export default function WelcomeBanner() {
	const { user } = useAuth();

	return (
		<aside className="relative w-full bg-[#050505] overflow-hidden border-b border-fuchsia-500/30 p-3 text-xs sm:text-sm md:text-base lg:text-lg">
			<div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

			<div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-fuchsia-500/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

			<div className="max-w-[1440px] mx-auto h-10 lg:h-11 flex items-center justify-between px-4 lg:px-8 relative z-10">
				<div className="flex items-center gap-2 mx-auto md:mx-0">
					<h2 className="text-white text-[11px] sm:text-xs md:text-sm font-black tracking-[0.3em] uppercase italic">
						{user ? (
							<>
								Welcome Back,{" "}
								<span className="text-fuchsia-400">{user.fullName}</span>
							</>
						) : (
							<>
								Welcome to{" "}
								<span className="text-fuchsia-400">TechTrade ZA</span>
							</>
						)}
					</h2>
				</div>
			</div>
		</aside>
	);
}
