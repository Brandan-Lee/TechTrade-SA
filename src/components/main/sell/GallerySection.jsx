import React, { useRef, useState } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";

export default function GallerySection({ formData, setFormData }) {
  const [slots, setSlots] = useState([null, null, null, null, null, null]);
  const [currentActiveSlot, setCurrentActiveSlot] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Fixed: changed 'event' to 'e'
    if (file && currentActiveSlot !== null) {
      const previewUrl = URL.createObjectURL(file);
      setSlots((prev) => {
        const next = [...prev];
        next[currentActiveSlot] = { file, preview: previewUrl };
        return next;
      });
      setCurrentActiveSlot(null);
      e.target.value = "";
    }
  };

  const removeImage = (index, e) => {
    e.stopPropagation(); // Fixed typo: stopPropogation -> stopPropagation
    URL.revokeObjectURL(slots[index].preview);
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  return (
    <div className="bg-gradient-to-br from-violet-900 via-purple-700 to-violet-900 rounded-[2rem] p-6 md:p-8 shadow-xl border border-pink-500/50">
      <div className="mb-6">
        <h2 className="text-white text-2xl font-bold uppercase tracking-tight">Hardware Gallery</h2>
        <p className="text-pink-300/80 text-xs mt-1 font-semibold">Primary photo will be the first slot.</p>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slots.map((slot, index) => (
          <div
            key={index}
            onClick={() => !slot && (setCurrentActiveSlot(index), fileInputRef.current.click())}
            className={`group relative aspect-square rounded-2xl transition-all duration-300 flex items-center justify-center overflow-hidden
              ${slot ? "border-4 border-pink-600 shadow-lg" : "bg-white/10 border-2 border-dashed border-white/20 hover:border-pink-500 hover:bg-white/20 cursor-pointer"}`}
          >
            {slot ? (
              <>
                <img src={slot.preview} className="w-full h-full object-cover" alt="Preview" />
                <button onClick={(e) => removeImage(index, e)} className="absolute top-2 right-2 btn btn-circle btn-xs bg-pink-600 border-none text-white hover:scale-110">
                  <Trash2 size={12} />
                </button>
              </>
            ) : (
              <div className="text-center text-white/40">
                <ImagePlus size={24} className="mx-auto mb-1" />
                <span className="text-[10px] font-bold">SLOT {index + 1}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}