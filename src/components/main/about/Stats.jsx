import React from "react";
import { LayoutGrid, ShieldCheck, Banknote } from "lucide-react";

export default function Stats() {
    const stats = [
    {
      label: "Active Listings",
      value: "12K+",
      icon: <LayoutGrid className="w-5 h-5 text-green-300" />,
    },
    {
      label: "Trust Score",
      value: "98.7%",
      icon: <ShieldCheck className="w-5 h-5 text-blue-300" />,
    },
    {
      label: "ZAR Secured",
      value: "5.2M",
      icon: <Banknote className="w-5 h-5 text-yellow-400" />,
    },
  ];

  return (
    <section className="w-full py-12 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-8">
                {stats.map((stat, index) => (
                    <div key={index}
                        className="w-full max-w-[240px] h-24 px-4 py-4 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-xl outline outline-1 outline-white/20 flex flex-col justify-center items-center gap-2 shadow-lg hover:scale-105 transition-transform duration-300"
                    >
                        <div className="flex items-center justify-center gap-3">
                            {stat.icon}
                            <span className="text-white text-2xl font-black tracking-tight leading-none">
                                {stat.value}
                            </span>
                        </div>

                        <div className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}