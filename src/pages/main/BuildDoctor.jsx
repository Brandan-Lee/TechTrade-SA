import React, { useState } from "react";
import { motion } from "framer-motion";
import ComponentCard from "../../components/main/build-doctor/ComponentCard";
import { Cpu, Monitor, Zap } from "lucide-react";

export default function BuildDoctor() {
    const [build, setBuild] = useState({
        cpu: '',
        gpu: '',
        psu: ''
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-neutral-100 font-['Inter']"
        >
            <header className="w-full px-6 md:px-12 py-8">
                <h2 className="text-purple-600 text-3xl font-black uppercase tracking-tighter">
                    Build Doctor
                </h2>
            </header>

            <div className="max-w-4xl mx-auto px-6 pb-20 flex flex-col gap-6">
                <ComponentCard
                    title="CPU (Processor)"
                    icon={Cpu}
                    placeholder="e.g., AMD Ryzen 5 3600"
                    value={build.cpu}
                    onChange={(e) => setBuild({ ...build, cpu: e.target.value })} 
                />
                <ComponentCard
                    title="GPU (Graphics Card)"
                    icon={Monitor}
                    placeholder="e.g., NVIDIA RTX 3060 TI"
                    value={build.gpu}
                    onChange={(e) => setBuild({ ...build, gpu: e.target.value })} 
                />
                <ComponentCard
                    title="PSU (Power Supply)"
                    icon={Zap}
                    placeholder="e.g., EVGA SuperNOVA 750W"
                    value={build.psu}
                    onChange={(e) => setBuild({ ...build, psu: e.target.value })} 
                />

                <button className="w-full h-14 mt-4 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-xl outline outline-2 outline-pink-600 text-white text-lg font-bold uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-2xl">
                    Save my build
                </button>
            </div>
        </motion.div>
    );
}