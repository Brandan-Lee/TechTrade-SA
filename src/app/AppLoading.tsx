export default function AppLoading() {
	return (
		<main
			className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-100"
			aria-busy="true"
			aria-label="Loading TechTrade"
		>
			<div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
			<p className="text-xs font-medium tracking-wide text-slate-400">
				Preparing your marketplace
			</p>
		</main>
	);
}
