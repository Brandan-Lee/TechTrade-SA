const StatCard = ({ icon, label, value }) => (
    <div className="flex-1 min-w-[100px] h-40 bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 rounded-lg shadow-lg border border-white/40 flex flex-col items-center justify-center p-4 text-white">
        <div className="mb-3">
            {icon}
        </div>

        <div className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight mb-2">
            {label}
        </div>
        
        <div className="text-2xl font-black">
            {value}
        </div>
    </div>
);

export default StatCard;