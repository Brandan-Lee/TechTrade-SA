import { motion } from "framer-motion";
import {
	AboutContent as Content,
	AboutHero as Hero,
	AboutPillars as Pillars,
	AboutStats as Stats,
} from "@/features/about";

export default function About({ openLogin }: { openLogin: () => void }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col w-full "
		>
			<Hero />
			<Stats />
			<Content />
			<Pillars onOpenLogin={openLogin} />
		</motion.div>
	);
}
