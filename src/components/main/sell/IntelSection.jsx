import React, { useState } from "react";
import { Cpu, ShieldCheck, ChevronDown, Check, Search } from "lucide-react";

export default function IntelSection({ formData, setFormData }) {
  const [isOpen, setIsOpen] = useState(false);

  const categoryGroups = [
    { label: "COMPONENTS", items: ["GPUs", "CPUs", "Motherboards", "PSUs", "Memory"] },
    { label: "COOLING", items: ["AIOs", "Air Coolers", "Case Fans"] },
    { label: "STORAGE", items: ["SSDs", "HDDs"] },
    { label: "CHASSIS", items: ["PC Cases"]}
  ];

  const specs = [
    "Component architecture verified via image recognition",
    "Serial number cross-referenced with manufacturer database",
    "Performance benchmarks auto-populated from global registry",
    "Compatibility matrix generated for tri-vector builds",
    "Market velocity analysis applied for pricing intelligence"
  ];

  return (
    <div className="bg-gradient-to-br from-violet-900 via-purple-700 to-violet-900 rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-pink-500/30 w-full relative">
      
      {/* 1. CATEGORY DROPDOWN (Same style as FilterBar) */}
      <div className="form-control w-full relative mb-8">
        <h2 className="text-white text-2xl font-black uppercase tracking-tighter italic mb-8">
            Component Intelligence
        </h2>
        <label className="label text-pink-200 text-[10px] font-black uppercase tracking-[0.25em] mb-2 ml-1">
          Select Category
        </label>
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white h-16 rounded-2xl flex items-center justify-between px-6 text-gray-900 font-bold text-sm shadow-lg"
        >
          <span>{formData.category || "Choose Category..."}</span>
          <ChevronDown className={`w-5 h-5 text-purple-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
            <div className="absolute top-[105%] left-0 w-full z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="bg-gradient-to-b from-pink-600 via-pink-500 to-pink-600 rounded-2xl shadow-2xl border border-white/30 p-3 max-h-[400px] overflow-y-auto">
                {categoryGroups.map((group) => (
                  <div key={group.label} className="flex flex-col gap-1 mb-4 last:mb-0">
                    <div className="flex items-center gap-3 px-4 py-1 mb-1">
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-md">{group.label}</span>
                      <div className="flex-1 h-[1px] bg-white/20" />
                    </div>
                    {group.items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => { setFormData({ ...formData, category: item }); setIsOpen(false); }}
                        className="w-full h-11 flex items-center px-4 rounded-xl text-white text-sm font-bold hover:bg-white/10 transition-all text-left"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. COMPONENT NAME INPUT */}
      <div className="form-control w-full mb-10">
        <label className="label text-pink-200 text-[10px] font-black uppercase tracking-[0.25em] mb-2 ml-1">
          Component Name
        </label>
        <div className="flex gap-3">
          <input 
            type="text"
            placeholder="e.g., RTX 4090, Ryzen 9 7950X"
            className="flex-1 bg-white h-16 rounded-2xl px-6 text-gray-900 font-bold text-sm focus:outline-none focus:ring-4 ring-pink-500/30 shadow-lg"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <button className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Search className="w-7 h-7 fill-white" />
          </button>
        </div>
      </div>

      {/* 3. VERIFIED SPECS BOX (Optimized & Static) */}
      <div className="w-full bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 rounded-2xl p-[2px] shadow-xl">
        <div className="bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 rounded-[14px] p-6 border-2 border-violet-800">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-white" />
            <h3 className="text-white text-xl font-bold tracking-tight uppercase italic drop-shadow-sm">
              Verified Specifications
            </h3>
          </div>

          {/* Static List */}
          <div className="flex flex-col gap-4">
            {specs.map((spec, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center border border-white/40 shadow-inner">
                  <Check className="w-3 h-3 text-white stroke-[4]" />
                </div>
                <p className="text-white text-base font-medium leading-tight tracking-tight drop-shadow-sm">
                  {spec}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}