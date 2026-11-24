import { FilterBar, MarketPlace } from "@/features/marketplace";

export default function Market() {
	return (
		<div className="min-h-full bg-base-100">
			<FilterBar />
			<MarketPlace />
		</div>
	);
}
