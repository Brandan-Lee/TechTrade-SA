import { motion } from "framer-motion";
import {
	FeaturedListings,
	HeroSection,
	TrustedSeller,
} from "@/features/marketplace";

export default function Home() {
	return (
		<div className="flex w-full flex-col">
			<HeroSection />
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.12 }}
				transition={{ duration: 0.48, ease: "easeOut" }}
			>
				<TrustedSeller />
			</motion.div>
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.12 }}
				transition={{ duration: 0.48, ease: "easeOut" }}
			>
				<FeaturedListings />
			</motion.div>
		</div>
	);
}