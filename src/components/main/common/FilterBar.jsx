import { useState, useEffect, useRef, useCallback } from "react";
import { SlidersHorizontal, ChevronDown, Banknote, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom"; // Uncomment this in your app

export default function FilterBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [menuPos, setMenuPos] = useState({ left: 0, top: 0});
    const [tempPrice, setTempPrice] = useState({ min: "", max: ""});
    const [filters, setFilters] = useState({
        category: null,
        priceMin: "",
        priceMax: "",
        condition: null
    })
    const dropdownRef = useRef(null);

    const navConfig = [
        { id: 'components', label: 'Components', type: 'list', items: ["GPUs", "CPUs", "Motherboards", "PSUs", "Memory"] },
        { id: 'cooling', label: 'Cooling', type: 'list', items: ["AIO", "Air Coolers", "Case Fans"] },
        { id: 'storage', label: 'Storage', type: 'list', items: ["SSDs", "HDDs"] },
        { id: 'price', label: 'price', type: 'price', icon: Banknote },
        { id: 'condition', label: 'condition', type: 'list', items: ["New", "Like New", "Good", "Fair"] },
    ];

    const applyFilter = (updates) => {
        setFilters(prev => ({...prev, ...updates}));
        setOpenDropdown(null);
    }

    const clearFilters = () => {
        setFilters({category: null, priceMin: "", priceMax: "", condition: null});
        setTempPrice({ min: "", max: ""});

        if (location.pathname !== '/marketplace') {
            navigate('/marketplace');
        }
    };

    useEffect(() => {
        const hasActiveFilters = filters.category || filters.condition || filters.priceMax || filters.priceMin;
        if (hasActiveFilters) {
            navigate('/marketplace', { state:  null });
        }
    }, [filters, navigate, location.pathname]);

    const updatePosition = useCallback((el) => {
        if (el) {
            const rect = el.getBoundingClientRect();
            setMenuPos({ left: rect.left, top: rect.bottom });
        }
    }, []);

    const handleToggle = (e, id) => {
        e.stopPropagation();
        if (openDropdown === id) {
            setOpenDropdown(null);
        } else {
            updatePosition(e.currentTarget);
            setOpenDropdown(id);
        }
    };

    const handlePriceInput = (e, key) => {
        const val = e.target.value.replace(/\D/g, ""); 
        setTempPrice(prev => ({...prev, [key]: val }));
    }

    const getPriceLabel = () => {
        const { priceMin: min, priceMax: max } = filters;
        if (!min && !max) return null;
        if (min && !max) return `Min: $${min}`;
        if (!min && max) return `Max: $${max}`;
        return `$${min} - $${max}`;
    }

    const activeFiltersList = [
        filters.category,
        filters.condition,
        getPriceLabel()
    ].filter(Boolean);

    const handleMouseEnter = (e, id) => {
        if (window.matchMedia("(pointer: fine)").matches) {
            updatePosition(e.currentTarget);
            setOpenDropdown(id);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeConfig = navConfig.find(d => d.id === openDropdown);
    const isAnyFilterActive = activeFiltersList.length > 0;

    return (
        <div ref={dropdownRef} className="w-full bg-white">
            <nav className="w-full bg-white/95 z-40 shadow-sm border-b border-gray-100">
                <div className="max-w-[1440px] mx-auto h-16 px-4 flex items-center gap-4 relative">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 grow">
                        
                        <div className="flex items-center gap-2 pr-4 border-r border-gray-200 shrink-0">
                            <SlidersHorizontal className="w-4 h-4 text-purple-700" />
                            <span className="text-gray-500 text-sm font-semibold uppercase">FILTER</span>
                        </div>

                        <button 
                            onClick={clearFilters}
                            className={`h-9 px-5 rounded-lg text-sm font-bold shrink-0 transition-all shadow-md ${
                                !isAnyFilterActive 
                                ? "bg-gradient-to-r from-purple-700 to-purple-600 text-white" 
                                : "bg-white border border-gray-200 text-gray-500 hover:text-purple-700"
                            }`}
                        >
                            ALL HARDWARE
                        </button>

                        {navConfig.slice(0, 3).map((dropdown) => (
                            <button
                                key={dropdown.id}
                                data-id={dropdown.id}
                                onClick={(e) => handleToggle(e, dropdown.id)}
                                onMouseEnter={(e) => handleMouseEnter(e, dropdown.id)}
                                className={`h-9 px-5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-md shrink-0 border ${
                                    filters.category === dropdown.label || openDropdown === dropdown.id
                                    ? "bg-gradient-to-r from-purple-700 to-purple-600 text-white border-transparent" 
                                    : "bg-white border-gray-200 text-gray-500 hover:text-purple-700"
                                }`}
                            >
                                {dropdown.label}
                                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === dropdown.id ? "rotate-180" : ""}`} />
                            </button>
                        ))}

                        <button 
                            onClick={() => applyFilter({ category: "PC Cases" })}
                            className={`h-9 px-5 rounded-lg text-sm font-bold shadow-md transition-all shrink-0 border ${
                                filters.category === "PC Cases"
                                ? "bg-gradient-to-r from-purple-700 to-purple-600 text-white border-transparent"
                                : "bg-white border-gray-200 text-gray-500 hover:text-purple-700"
                            }`}
                        >
                            PC Cases
                        </button>

                        <div className="w-px h-8 bg-pink-500 mx-1 shrink-0" />

                        {navConfig.slice(3).map((dropdown) => {
                            const isSet = (dropdown.id === 'condition' && filters.condition) || (dropdown.id === 'price' && (filters.priceMin || filters.priceMax));
                            return (
                                <button
                                    key={dropdown.id}
                                    data-id={dropdown.id}
                                    onClick={(e) => handleToggle(e, dropdown.id)}
                                    onMouseEnter={(e) => handleMouseEnter(e, dropdown.id)}
                                    className={`h-9 px-5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-md shrink-0 border ${
                                        isSet || openDropdown === dropdown.id
                                        ? "bg-gradient-to-r from-purple-700 to-purple-600 text-white border-transparent" 
                                        : "bg-white border border-gray-200 text-gray-500 hover:text-purple-700"
                                    }`}
                                >
                                    {dropdown.id === 'price' && <Banknote className="w-4 h-4" />}
                                    {dropdown.label}
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                            )
                        })}
                    </div>

                    {openDropdown && activeConfig && (
                        <div
                            onMouseEnter={() => setOpenDropdown(openDropdown)}
                            onMouseLeave={() => setOpenDropdown(null)}
                            style={{ left: `${menuPos.left}px`, top: `${menuPos.top}px` }}
                            className="fixed w-64 z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                            <div className="bg-gradient-to-b from-pink-600 via-pink-500 to-pink-600 rounded-2xl shadow-2xl border border-white/20 p-3">
                                {activeConfig.type === 'list' ? (
                                    <div className="flex flex-col gap-1">
                                        {activeConfig.items.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => applyFilter(activeConfig.id === 'condition' ? { condition: item } : { category: item })}
                                                className="w-full h-11 flex items-center px-4 rounded-xl text-white text-sm font-semibold hover:bg-white/20 transition-all"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 p-1">
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="text" value={tempPrice.min} onChange={(e) => handlePriceInput(e, 'min')}
                                                placeholder="Min" className="w-full h-10 bg-white/10 border border-white/20 rounded-lg px-3 text-white placeholder:text-white/50 text-sm outline-none" 
                                            />
                                            <input 
                                                type="text" value={tempPrice.max} onChange={(e) => handlePriceInput(e, 'max')}
                                                placeholder="Max" className="w-full h-10 bg-white/10 border border-white/20 rounded-lg px-3 text-white placeholder:text-white/50 text-sm outline-none" 
                                            />
                                        </div>
                                        <button 
                                            onClick={() => applyFilter({ priceMin: tempPrice.min, priceMax: tempPrice.max })}
                                            className="w-full h-10 bg-white text-pink-600 rounded-lg font-bold text-xs uppercase"
                                        >
                                            Apply Price
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {isAnyFilterActive && (
                <div className="max-w-[1440px] mx-auto w-full px-4 py-3 flex items-center gap-3 border-t border-gray-100 bg-gray-50/50">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest shrink-0">Filters Active:</span>
                    <div className="flex flex-wrap gap-2 items-center">
                        {activeFiltersList.map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-purple-100 rounded-full text-purple-700 text-[11px] font-bold shadow-sm">
                                {f}
                            </div>
                        ))}
                        <button onClick={clearFilters} className="flex items-center gap-1 ml-2 px-2 py-1 text-pink-600 hover:text-pink-700 text-[11px] font-bold">
                            <X className="w-3 h-3" /> Clear All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}