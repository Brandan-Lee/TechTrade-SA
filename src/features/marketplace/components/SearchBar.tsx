import { useEffect, useState, type FormEvent } from "react";
import { Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchBarProps {
	className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const queryFromUrl = new URLSearchParams(location.search).get("q") ?? "";
	const [searchTerm, setSearchTerm] = useState(queryFromUrl);

	useEffect(() => {
		// Keep the field in sync with browser back/forward navigation.
		setSearchTerm(queryFromUrl);
	}, [queryFromUrl]);

	const submitSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const query = searchTerm.trim();
		if (!query) return;

		const params =
			location.pathname === "/marketplace"
				? new URLSearchParams(location.search)
				: new URLSearchParams();
		params.set("q", query);
		params.set("page", "1");
		navigate({
			pathname: "/marketplace",
			search: `?${params.toString()}`,
		});
	};

	const clearSearch = () => {
		setSearchTerm("");
		if (location.pathname !== "/marketplace") return;

		const params = new URLSearchParams(location.search);
		params.delete("q");
		params.set("page", "1");
		navigate({
			pathname: "/marketplace",
			search: params.toString() ? `?${params.toString()}` : "",
		});
	};

	return (
		<form
			role="search"
			onSubmit={submitSearch}
			className={`relative mx-auto flex min-h-11 w-full max-w-3xl items-center ${className}`}
		>
			<label htmlFor="marketplace-search" className="sr-only">
				Search marketplace listings
			</label>
			<Search
				className="pointer-events-none absolute left-4 h-4 w-4 text-slate-500"
				aria-hidden="true"
			/>
			<input
				id="marketplace-search"
				type="search"
				value={searchTerm}
				onChange={(event) => setSearchTerm(event.target.value)}
				placeholder="Search PC hardware"
				autoComplete="off"
				className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-24 text-sm text-base-content outline-none transition-colors placeholder:text-slate-500 hover:border-white/20 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
			/>
			<div className="absolute right-1.5 flex items-center gap-1">
				{searchTerm && (
					<button
						type="button"
						onClick={clearSearch}
						aria-label="Clear search"
						className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					>
						<X size={15} aria-hidden="true" />
					</button>
				)}
				<button
					type="submit"
					disabled={!searchTerm.trim()}
					aria-label="Search"
					className="rounded-lg bg-primary p-2 text-primary-content transition-colors hover:bg-accent disabled:bg-white/[0.06] disabled:text-slate-500"
				>
					<Search size={15} aria-hidden="true" />
				</button>
			</div>
		</form>
	);
}
