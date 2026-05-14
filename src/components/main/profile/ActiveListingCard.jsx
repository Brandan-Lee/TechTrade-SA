import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActiveListingCard = ({ title, price, condition, time, views, img }) => {
	const navigate = useNavigate();

	const handleViewListing = (e) => {
		e.stopPropagation();
		navigate(`/view-listing`);
	};

	return (
		<div
			onClick={handleViewListing}
			className="w-full p-4 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-xl border border-pink-600 flex gap-4 transition-transform hover:scale-[1.02] cursor-pointer"
		>
			<img
				src={img}
				alt="title"
				className="w-24 h-24 rounded-lg object-cover bg-gray-200 shrink-0"
			/>
			<div className="flex flex-col justify-between flex-1">
				<h3 className="text-white font-bold text-sm md:text-base leading-snug line-clamp-2">
					{title}
				</h3>
				<div className="flex items-center gap-3 my-1">
					<span className="text-pink-400 font-black text-lg">R{price}</span>
					<span className="px-2 py-0 5 bg-emerald-500 text-white text-sm md:text-base font-bold rounded uppercase">
						{condition}
					</span>
				</div>
				<div className="flex justify-between items-center text-white/70 text-sm md:text-base">
					<span>{time}</span>
					<div className="flex items-center gap-1 font-bold">
						<Eye size={12} /> {views}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ActiveListingCard;
