import React from "react";
import { motion } from "framer-motion";
import MarketPlace from "../../components/main/market/MarketPlace";
import FilterBar from "../../components/main/common/FilterBar";

export default function Market() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -15 }} // Smooth exit if you use AnimatePresence
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="w-full min-h-screen bg-neutral-100"
		>
			<FilterBar />
			<MarketPlace />
		</motion.div>
	);
}
