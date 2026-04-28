export default function ContextSection({ formData, setFormData }) {
  const conditions = ["New", "Like New", "Good", "Fair"];

  return (
    <div className="bg-gradient-to-br from-violet-900 via-purple-700 to-violet-900 rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-pink-500/30 w-full">
      <h2 className="text-white text-2xl font-black uppercase tracking-tighter italic mb-8">
        Condition & Context
      </h2>

      <div className="space-y-8">
        {/* CONDITION SELECTOR */}
        <div className="form-control">
          <label className="label text-pink-200 text-[10px] font-black uppercase tracking-[0.25em] mb-3 ml-1">
            Component Condition
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {conditions.map((c) => {
              const isSelected = formData.condition === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: c })}
                  className={`h-14 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg border-2
                    ${isSelected 
                      ? "bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 border-violet-800 text-white" 
                      : "bg-white border-gray-200 text-gray-500 hover:border-pink-300"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* DESCRIPTION AREA */}
        <div className="form-control">
          <label className="label text-pink-200 text-[10px] font-black uppercase tracking-[0.25em] mb-3 ml-1">
            Detailed Description
          </label>
          <textarea 
            className="w-full h-48 bg-white text-gray-900 p-6 focus:outline-none focus:ring-4 ring-pink-500/30 text-base font-medium leading-relaxed rounded-[2rem] shadow-inner placeholder:text-gray-500"
            placeholder="Usage history, overclocking details, included accessories..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}