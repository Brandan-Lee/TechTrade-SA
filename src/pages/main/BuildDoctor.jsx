import React, { useState } from "react";
import { motion } from "framer-motion";
import ComponentCard from "../../components/main/build-doctor/ComponentCard";
import { Cpu, Monitor, Zap, Activity } from "lucide-react";
import CyberActionButton from "../../components/ui/CyberActionButton";

export default function BuildDoctor() {
    const [build, setBuild] = useState({
        cpu: "",
        gpu: "",
        psu: "",
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#050505] text-slate-300 relative overflow-x-hidden"
        >
            {/* Background Digital Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800b_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[150px] rounded-full pointer-events-none" />

            {/* HEADER INTERFACE */}
            <header className="w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-12 pb-6 relative z-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
                        Build <span className="text-fuchsia-500">Doctor</span>
                    </h1>
                    <div className="h-[2px] w-16 bg-gradient-to-r from-fuchsia-500 to-transparent mt-4" />
                </div>
            </header>

            {/* MAIN DIAGNOSTIC CONTAINER */}
            <main className="w-full max-w-3xl mx-auto px-6 pb-24 relative z-10">
                <div className="flex flex-col gap-5">
                    
                    <ComponentCard
                        title="CPU (Processor)"
                        icon={Cpu}
                        placeholder="E.G., AMD RYZEN 5 3600"
                        value={build.cpu}
                        onChange={(e) => setBuild({ ...build, cpu: e.target.value })}
                    />
                    
                    <ComponentCard
                        title="GPU (Graphics Card)"
                        icon={Monitor}
                        placeholder="E.G., NVIDIA RTX 3060 TI"
                        value={build.gpu}
                        onChange={(e) => setBuild({ ...build, gpu: e.target.value })}
                    />
                    
                    <ComponentCard
                        title="PSU (Power Supply)"
                        icon={Zap}
                        placeholder="E.G., EVGA SUPERNOVA 750W"
                        value={build.psu}
                        onChange={(e) => setBuild({ ...build, psu: e.target.value })}
                    />

                    {/* ACTION PANEL */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                        <div className="w-full max-w-sm">
                            <CyberActionButton
                                label="SAVE MY BUILD"
                                className="w-full py-5 text-sm uppercase tracking-widest font-black"
                            />
                        </div>
                    </div>

                </div>
            </main>
        </motion.div>
    );
}