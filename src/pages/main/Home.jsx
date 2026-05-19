import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeaturedListings from "../../components/main/landing/FeaturedListings";
import TrustedSeller from "../../components/main/landing/TrustedSeller";

export default function Home() {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.1,
			},
		},
	};

	const sectionVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="flex flex-col w-full gap-4 p-4"
		>
			<motion.div variants={sectionVariants}>
				<TrustedSeller />
			</motion.div>

			<motion.div variants={sectionVariants}>
				<FeaturedListings />
			</motion.div>
		</motion.div>
	);
}