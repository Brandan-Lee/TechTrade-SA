import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

export default function LaunchDisputePage() {
  // Form State
  const [disputeReason, setDisputeReason] = useState("");
  const [detailsText, setDetailsText] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | null

  // Core transaction info for context
  const transaction = {
    id: "TX-9082314",
    itemTitle: "RTX 3080 Gaming OC",
    agreedPrice: "8500.00",
    counterpartyName: "CryptoHardware SA",
    role: "Seller"
  };

  // Plain-language reasons
  const disputeReasons = [
    { id: "damaged", label: "Product is damaged or broken", hint: "Visible physical damage, scratches, cracks, or fails to turn on" },
    { id: "incorrect", label: "Received the wrong product", hint: "The item delivered is completely different from the listing description" },
    { id: "missing", label: "Missing parts or accessories", hint: "Crucial cables, boxes, or components are absent from the package" },
    { id: "performance", label: "Performance issues / Hidden defects", hint: "Turns on, but crashes under load, overheats, or has artifacting problems" }
  ];

  // Handle Mock Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (uploadedImages.length + files.length > 6) {
      alert("You can only upload a maximum of 6 images.");
      return;
    }

    // Creating object URLs for mock previewing
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  // Remove uploaded image preview
  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!disputeReason || detailsText.trim().length < 15) return;

    setIsSubmitting(true);
    
    // Simulate server submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-fuchsia-500/30">
      
      {/* Decorative Cyber Background Matrix */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-md border border-purple-900/40 rounded-xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Top Status Border Accent */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600" />

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* HEADER HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-fuchsia-400 bg-clip-text text-transparent">
              Open Escrow Dispute
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Something wrong with your order? Open a dispute to securely pause the payout timeline. Funds stay locked safely in the vault while we sort it out.
            </p>
          </div>

          {/* DISSENT CONTEXT METADATA BOX */}
          <div className="bg-slate-950/80 border border-purple-950/60 rounded-lg p-3.5 text-xs space-y-1">
            <div className="flex justify-between text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              <span>Dispute Target: {transaction.id}</span>
              <span className="text-amber-400">STATUS: HOLD PENDING</span>
            </div>
            <div className="text-sm font-bold text-slate-200">{transaction.itemTitle}</div>
            <div className="text-slate-400 pt-0.5">
              Escrow Value: <span className="text-fuchsia-400 font-bold">R{transaction.agreedPrice}</span> • Seller: {transaction.counterpartyName}
            </div>
          </div>

          {/* SUCCESS OUTPUT BANNER */}
          {submitStatus === 'success' ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="inline-flex p-3 bg-amber-950/30 border border-amber-500/30 text-amber-400 rounded-full animate-bounce">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-400 uppercase tracking-wide">Dispute Formally Launched</h3>
                <p className="text-[11px] text-slate-500 font-mono">CASE ID: #DISP-{Math.floor(200000 + Math.random() * 700000)}</p>
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Funds are frozen securely. {transaction.counterpartyName} has been formally notified and has 48 hours to reply. A platform mediator is assigned to review your upload files.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => { setSubmitStatus(null); setDisputeReason(""); setDetailsText(""); setUploadedImages([]); }}
                  className="btn btn-outline btn-sm border-purple-900/60 text-purple-300 hover:bg-purple-950 hover:border-purple-500 font-bold tracking-wider uppercase text-[10px]"
                >
                  View Case Room
                </button>
              </div>
            </div>
          ) : (

            /* INTERACTIVE DISPUTE SUBMIT PLATFORM */
            <form onSubmit={handleDisputeSubmit} className="space-y-5">
              
              {/* REASON DROP SELECTION MENU */}
              <div className="form-control w-full space-y-1.5">
                <label htmlFor="dispute-reason" className="label-text text-xs uppercase tracking-widest text-slate-400 font-bold block">
                  What is the primary fault?
                </label>
                <select
                  id="dispute-reason"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="select select-bordered bg-slate-950/60 border-purple-950/80 focus:border-fuchsia-500/80 focus:outline-none text-xs text-slate-200 w-full rounded-lg transition-colors"
                >
                  <option value="" disabled>-- Select a category descriptive option --</option>
                  {disputeReasons.map((reason) => (
                    <option key={reason.id} value={reason.id}>
                      {reason.label}
                    </option>
                  ))}
                </select>
                {disputeReason && (
                  <p className="text-[10px] text-purple-400/90 italic px-1">
                    💡 {disputeReasons.find(r => r.id === disputeReason)?.hint}
                  </p>
                )}
              </div>

              {/* DETAILS EXPLAIN STATEMENT */}
              <div className="form-control w-full space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="dispute-details" className="label-text text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                    <FileText size={12} className="text-fuchsia-400" /> Explain the defect
                  </label>
                  <span className={`text-[10px] font-mono ${detailsText.length < 15 ? 'text-amber-500' : 'text-slate-600'}`}>
                    {detailsText.length}/1000
                  </span>
                </div>
                <textarea
                  id="dispute-details"
                  maxLength={1000}
                  value={detailsText}
                  onChange={(e) => setDetailsText(e.target.value)}
                  placeholder="Please describe exactly how the item behaves, any diagnostic testing you completed, or details about parts that are missing. (Minimum 15 characters)"
                  className="textarea textarea-bordered bg-slate-950/60 border-purple-950/80 focus:border-fuchsia-500/80 focus:outline-none text-slate-200 text-xs w-full h-24 leading-relaxed rounded-lg placeholder:text-slate-600 resize-none transition-colors"
                />
              </div>

              {/* VISUAL IMAGE UPLOAD SYSTEM (UP TO 6) */}
              <div className="form-control w-full space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="label-text text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                    <ImageIcon size={12} className="text-fuchsia-400" /> Upload Fault Evidence
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {uploadedImages.length}/6 items
                  </span>
                </div>

                {/* Upload Trigger Drop Block Wrapper */}
                {uploadedImages.length < 6 && (
                  <label className="relative flex flex-col items-center justify-center border border-dashed border-purple-950/80 hover:border-fuchsia-500/50 bg-slate-950/40 hover:bg-slate-950/80 rounded-lg py-4 cursor-pointer transition-all group">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                    <Upload size={18} className="text-slate-500 group-hover:text-fuchsia-400 mb-1.5 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-300">Click to add photos</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">Show broken seals, cracks, error codes (Max 6)</span>
                  </label>
                )}

                {/* Grid Previews Display Container */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="relative aspect-square rounded-md bg-slate-950 border border-purple-950/60 overflow-hidden group">
                        <img src={img.url} alt="Uploaded item defect overview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                          aria-label="Remove photo attachment"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TIMELINE SECURITY BANNER ADVISORY */}
              <div className="flex items-start gap-2.5 bg-fuchsia-950/10 border border-fuchsia-500/10 rounded-lg p-3 text-[10px] text-slate-400 leading-relaxed">
                <ShieldAlert size={14} className="text-fuchsia-400 shrink-0 mt-0.5" />
                <p>
                  Opening a case flags our verification systems instantly. Keep interactions polite. The seller has the option to offer a partial discount refund settlement or authorize a free product return.
                </p>
              </div>

              {/* PRIMARY ACTION TRIGGER SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={!disputeReason || detailsText.trim().length < 15 || isSubmitting}
                className="w-full btn bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-transparent text-slate-950 border-none font-bold uppercase tracking-widest text-xs h-11 min-h-0 rounded-lg transition-all active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-xs text-slate-900" />
                ) : !disputeReason ? (
                  "Select Fault Category"
                ) : detailsText.trim().length < 15 ? (
                  "Provide Detailed Explanation"
                ) : (
                  "Confirm & Open Case"
                )}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}