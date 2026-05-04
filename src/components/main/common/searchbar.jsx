import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ className }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            console.log("Searching for:", searchTerm);
        }
    };

    return (
        <div className={`relative w-full lg:max-w-[672px] h-12 ${className}`}>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10' />

            <input 
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={handleSearch}
                placeholder='Search RTX 4090, Ryzen 9, SSDs...'
                className="w-full h-full pl-12 pr-4 bg-white/95 rounded-xl shadow-lg text-gray-800 placeholder-gray-400 outline outline-2 outline-offset-[-2px] outline-white/50 focus:outline-pink-500 transition-all font-medium font-['Inter']"
            />

            {/* Clear Button */}
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm("")}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold'>
                    CLEAR
                </button>
            )}
        </div>
    );
}