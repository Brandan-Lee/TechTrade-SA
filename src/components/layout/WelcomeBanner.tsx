import { MapPin } from "lucide-react";
import { useAuth } from "@/features/auth";

export default function WelcomeBanner() {
	const { user } = useAuth();

	return (
		<aside className="border-b border-white/[0.05] bg-base-200/60">
			<div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-7 lg:px-10">
				<p className="flex min-w-0 items-center gap-2 text-slate-300">
					<MapPin size={14} className="shrink-0 text-primary" aria-hidden="true" />
					<span className="truncate">
						{user?.fullName
							? `Welcome back, ${user.fullName}`
							: "A trusted marketplace for PC hardware in South Africa"}
					</span>
				</p>
				<span className="hidden shrink-0 items-center gap-2 text-slate-400 sm:inline-flex">
					<span className="h-1.5 w-1.5 rounded-full bg-primary" />
					Community-led. Hardware-focused.
				</span>
			</div>
		</aside>
	);
}
