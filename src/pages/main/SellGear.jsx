import React, { useState } from "react";
import { motion } from "framer-motion";
import IntelSection from "../../components/main/sell/IntelSection";
import GallerySection from "../../components/main/sell/GallerySection";
import ContextSection from "../../components/main/sell/ContextSection";
import PurpleGradientButton from "../../components/ui/PurpleGradientButton";

export default function SellGear() {
	const [formData, setFormData] = useState({
		category: "",
		name: "",
		condition: "",
		description: "",
		images: [],
	});

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-neutral-100 pb-20"
		>
			{/* Left-Aligned Header */}
			<div className="w-full px-6 md:px-10 py-8">
				<h1 className="text-purple-600 text-4xl font-black uppercase tracking-tighter">
					Add Listing
				</h1>
			</div>

			{/* MAIN CONTENT GRID: Fills the screen width */}
			<div className="w-full px-6 md:px-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
					{/* LEFT COLUMN: Intelligence & Context */}
					<div className="flex flex-col gap-6">
						<IntelSection formData={formData} setFormData={setFormData} />

						{/* On Desktop, we put Context here. On Mobile it stays in order */}
						<div className="hidden lg:block">
							<ContextSection formData={formData} setFormData={setFormData} />
						</div>
					</div>

					{/* RIGHT COLUMN: Hardware Gallery */}
					<div className="flex flex-col gap-6">
						<GallerySection formData={formData} setFormData={setFormData} />

						{/* On Mobile, Context Section usually goes after Gallery. 
                            So we show it here ONLY on small screens */}
						<div className="lg:hidden">
							<ContextSection formData={formData} setFormData={setFormData} />
						</div>

						<div className="flex flex-col items-center gap-4 pt-10">
							<div className="w-full max-w-sm">
								<PurpleGradientButton
									label="PUBLISH TO TECHTRADE"
								/>
							</div>
							<p className="text-gray-400 text-xs text-center max-w-xs leading-relaxed">
								By publishing, you agree to TechTrade SA's verification
								protocols and escrow terms.
							</p>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
