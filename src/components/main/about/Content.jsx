import React from "react";
import { motion } from "framer-motion";

export default function Content() {
    return (
        <section className="w-full bg-neutral-50 py-16 px-4 sm:px-8 lg:px-24">
            <div className="max-w-4xl mx-auto flex flex-col gap-12">
                {/* Our Origin Section */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-6"
                >
                    <div className="border-l-4 border-purple-600 pl-4">
                        <h2 className="text-purple-600 text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                            Our  Origin
                        </h2>
                    </div>

                    <div className="bg-white p-6 md:10 rounded-2xl shadow-sm border border-neutral-200 space-y-6">
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium">
                            TechTrade SA was born from a critical need in South Africa's rapidly evolving technology landscape. As hardware enthusiasts and cybersecurity professionals, we witnessed firsthand the risks inherent in peer-to-peer component trading.
                        </p>
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                            Counterfeit GPUs, misrepresented specifications, and fraudulent transactions plagued the market. We knew there had to be a better way - a platform that could bring enterprise-grade security and transparency to consumer hardware trading.
                        </p>
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                            In 2026, we launched TechTrade SA with a singular mission: to create the most secure, intelligent, and trustworthy marketplace for high-end computer components in South Africa. Every line of code, every security protocol, and every verification algorithm is designed with one goal - protecting your investment.
                        </p>
                    </div>
                </motion.div>

                {/* Philosophy Section */}
               <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-neutral-100 p-8 rounded-2xl border-2 border-dashed border-purple-200"
                >
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed italic text-center">
                        "TechTrade SA is a specialized ecosystem designed to professionalize the second-hand hardware market. By integrating advanced Hardware Intelligence with a custom Transactional State Machine, we've moved beyond the 'classifieds' model to create a secure, protocol-driven marketplace for elite tech. ~ Brandan-Lee James Sherbrooke (Founder)"
                    </p>
                </motion.div>

                {/* Our Vision Section */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-6"
                >
                    <div className="border-r-4 border-purple-600 pr-4 text-right">
                        <h2 className="text-purple-600 text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                            Our Vision
                        </h2>
                    </div>

                    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-neutral-200">
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center md:text-left">
                            To empower every South African gamer, creator, student, and professional with a platform where innovation is accessible, transactions are bulletproof, and the hardware lifecycle is maximised through absolute trust.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}