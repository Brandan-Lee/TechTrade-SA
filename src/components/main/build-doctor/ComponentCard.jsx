import React from "react";

export default function ComponentCard({ title, icon: Icon, placeholder, value, onChange }) {
    return (
        <div className="w-full p-px bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-2xl shadow-xl outline outline-1 outline-pink-600 overflow-hidden">
            {/* Card Header */}
            <div className="h-16 px-5 border-b border-pink-600/50 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-white text-lg font-bold tracking-tight">{title}</h3>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-gradient-to-br from-violet-800 to-purple-700">
                <div className="space-y-2">
                    <label htmlFor="" className="text-pink-200 text-[10px] font-black uppercase tracking-[0.2em]">
                        Component Name
                    </label>
                    <input 
                        type="text"
                        value={value}
                        onChange={onchange}
                        placeholder={placeholder}
                        className="w-full h-12 px-4 bg-gray-100 rounded-xl border border-gray-300 text-gray-800 placeholder:text-gray-400 font-medium focus:outline-none focus:ring-2 ring-pink-500 transition-all" 
                    />
                </div>
            </div>
        </div>
    );
}