import React, { useRef, useState } from "react";
import { Camera, ImagePlus, Trash2, ShieldAlert } from "lucide-react";

export default function GallerySection({ formData, setFormData }) {
    const [slots, setSlots] = useState([null, null, null, null, null, null]);
    const [currentActiveSlot, setCurrentActiveSlot] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && currentActiveSlot !== null) {
            const previewUrl = URL.createObjectURL(file);
            setSlots((prev) => {
                const next = [...prev];
                next[currentActiveSlot] = { file, preview: previewUrl };
                // Also update parent formData if necessary
                return next;
            });
            setCurrentActiveSlot(null);
            e.target.value = "";
        }
    };

    const removeImage = (index, e) => {
        e.stopPropagation();
        if (slots[index]) {
            URL.revokeObjectURL(slots[index].preview);
            setSlots((prev) => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
        }
    };

    return (
        <div className="bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 w-full relative">
            {/* HUD Header */}
            <div className="mb-8 border-l-2 border-fuchsia-600 pl-4">
                <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter italic">
                    Hardware_Gallery
                </h2>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
                    <p className="text-slate-400 text-[10px] md:text-xs font-mono uppercase tracking-widest">
                        Visual_Data_Input: 6_Slots_Available
                    </p>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload hardware image"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {slots.map((slot, index) => (
                    <div
                        key={index}
                        onClick={() =>
                            !slot &&
                            (setCurrentActiveSlot(index), fileInputRef.current.click())
                        }
                        className={`group relative aspect-square rounded-xl transition-all duration-500 flex items-center justify-center overflow-hidden border
                            ${index === 0 && !slot ? "ring-1 ring-fuchsia-500/50 ring-offset-2 ring-offset-black" : ""}
                            ${slot 
                                ? "border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.15)]" 
                                : "bg-black/40 border-white/5 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 cursor-pointer"
                            }`}
                    >
                        {slot ? (
                            <>
                                <img
                                    src={slot.preview}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={`Preview ${index + 1}`}
                                />
                                {/* Image Overlay for "Scan" effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <button
                                    onClick={(e) => removeImage(index, e)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-slate-400 hover:text-fuchsia-400 transition-colors"
                                    title="Purge Image"
                                >
                                    <Trash2 size={14} />
                                </button>

                                {index === 0 && (
                                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-fuchsia-600 text-white text-[8px] font-black uppercase tracking-tighter rounded">
                                        Primary_Array
                                    </span>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:translate-y-[-2px]">
                                <div className="relative">
                                    <ImagePlus size={20} className="text-slate-600 group-hover:text-fuchsia-500 transition-colors" />
                                    {index === 0 && (
                                         <Camera size={10} className="absolute -top-2 -right-2 text-fuchsia-400 animate-bounce" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <span className="block text-[10px] md:text-xs font-mono text-slate-700 group-hover:text-slate-400">
                                        SLOT_{index + 1}
                                    </span>
                                    {index === 0 && (
                                        <span className="text-[8px] text-fuchsia-500/60 font-bold uppercase tracking-tighter">Required</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* HUD Corner Decor for empty slots */}
                        {!slot && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-fuchsia-500" />
                                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-fuchsia-500" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Warning Text Area */}
            <div className="mt-6 flex items-start gap-3 p-4 bg-fuchsia-500/5 rounded-xl border border-fuchsia-500/10">
                <ShieldAlert className="text-fuchsia-500 shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] md:text-[11px] leading-relaxed text-slate-400 font-medium">
                    Ensure hardware is visible under <span className="text-slate-200 uppercase tracking-tighter">Clear_Light_Conditions</span>. 
                    Blurred or obstructed "Visuals" may result in <span className="text-fuchsia-400">Verification_Failure</span>.
                </p>
            </div>
        </div>
    );
}