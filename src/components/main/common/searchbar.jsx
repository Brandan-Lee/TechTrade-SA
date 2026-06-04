import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchBar({ className }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchTerm, setSearchTerm] = useState("");

	const goToMarketplace = (queryValue) => {
		const query = (queryValue ?? "").trim();
		if (!query) return;

		const params =
			location.pathname === "/marketplace"
				? new URLSearchParams(location.search)
				: new URLSearchParams();

		params.set("q", query);
		params.set("page", "1");
		navigate({
			pathname: "/marketplace",
			search: params.toString() ? `?${params.toString()}` : "",
		});
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			goToMarketplace(searchTerm);
			setSearchTerm("");
		}
	};

	return (
		<search
			role="search"
			className={`relative w-full lg:max-w-[672px] h-11 sm:h-12 group select-none text-xs sm:text-sm md:text-base lg:text-lg ${className}`}
		>
			<Search
				className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/60 group-focus-within:text-fuchsia-400 w-4 h-4 sm:w-5 sm:h-5 z-10 pointer-events-none transition-colors duration-200"
				aria-hidden="true"
			/>

			<input
				type="text"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				onKeyDown={handleKeyPress}
				placeholder="Search for hardware (e.g., Graphics Cards, Processors...)"
				aria-label="Search for products"
				className="w-full h-full pl-11 sm:pl-12 pr-20 bg-[#0d0915] border border-purple-500/20 focus:border-fuchsia-500/80 rounded-lg text-white placeholder-slate-600 outline-none transition-all duration-200 text-[10px] sm:text-xs md:text-sm font-medium tracking-wide shadow-md shadow-black/50"
			/>

			{searchTerm && (
				<button
					type="button"
					onClick={() => {
						setSearchTerm("");

						if (location.pathname === "/marketplace") {
							const params = new URLSearchParams(location.search);
							params.delete("q");
							params.set("page", "1");

							const remaining = params.toString();
							navigate({
								pathname: "/marketplace",
								search: remaining ? `?${remaining}` : "",
							});
						} else {
							navigate("/marketplace");
						}
					}}
					aria-label="Clear search"
					className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 rounded border border-purple-500/10 hover:border-fuchsia-500/40 bg-[#120d1e] hover:bg-[#1a122b] text-slate-400 hover:text-fuchsia-400 transition-all duration-150 flex items-center gap-1.5 active:scale-95 text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase"
				>
					<span>Clear</span>
					<X size={12} />
				</button>
			)}
		</search>
	);
}
