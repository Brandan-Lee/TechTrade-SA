import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, User, ChevronRight, CornerDownRight } from 'lucide-react';

export default function ReportUser() {
  // Core Form State
  const [selectedReason, setSelectedReason] = useState("");
  const [detailsText, setDetailsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | null

  // User details for context
  const targetUser = {
    name: "Thabo Mthembu",
    role: "Buyer",
    item: "RTX 3080 Gaming OC"
  };

  // Plain language options with clear real-world examples
  const reportCategories = [
    { id: "payment", label: "Payment Issues", hint: "Fake payment proofs, chargeback threats, or refused to pay" },
    { id: "communication", label: "Harassment or Abuse", hint: "Using offensive language, threats, or demanding off-platform chat" },
    { id: "item_issue", label: "Counterfeit or Damaged Item", hint: "Item sent was broken, completely different, or missing parts" },
    { id: "no_show", label: "No-Show / Ghosting", hint: "Stopped responding completely or failed to meet up at the agreed spot" },
    { id: "other", label: "Other Suspicious Behavior", hint: "Trying to alter terms last minute or forcing payment outside escrow" }
  ];

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!selectedReason || detailsText.trim().length < 10) return;

    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-fuchsia-500/30">
      
      {/* Cyber Grid Background Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-md border border-red-950/40 rounded-xl shadow-2xl shadow-red-950/10 overflow-hidden relative z-10">
        
        {/* Top Status Edge Indicator (Red/Crimson tint for reporting alerts) */}
        <div className="h-1 bg-gradient-to-r from-red-600 via-fuchsia-600 to-purple-600" />

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* HEADER SECTION */}
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-red-400 to-fuchsia-300 bg-clip-text text-transparent">
              Submit Incident Report
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Flag suspicious activity or violations. Our security moderation team reviews every report manually within 24 hours.
            </p>
          </div>

          {/* TARGET USER PROFILE BANNER */}
          <div className="bg-slate-950/80 border border-red-950/40 rounded-lg p-4 flex items-center gap-4">
            <div className="avatar placeholder">
              <div className="bg-red-950/30 text-red-400 border border-red-500/20 w-12 rounded-lg flex items-center justify-center">
                <User size={20} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold tracking-widest text-red-400">
                Reporting Account
              </div>
              <h2 className="text-sm font-bold text-slate-200 truncate">{targetUser.name}</h2>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">Associated Item: {targetUser.item}</p>
            </div>
          </div>

          {/* SUCCESS STATE OVERLAY */}
          {submitStatus === 'success' ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="inline-flex p-3 bg-red-950/30 border border-red-500/30 text-red-400 rounded-full animate-pulse">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-red-400 uppercase tracking-wide">Incident Successfully Logged</h3>
                <p className="text-[11px] text-slate-500 font-mono">TICKET: #INC-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Thank you for keeping the network safe. Your report has been submitted to escrow security. The current transaction hold is frozen pending review.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => { setSubmitStatus(null); setSelectedReason(""); setDetailsText(""); }}
                  className="btn btn-outline btn-sm border-red-950/60 text-red-300 hover:bg-red-950 hover:border-red-500 font-bold tracking-wider uppercase text-[10px]"
                >
                  Return to Pipeline
                </button>
              </div>
            </div>
          ) : (

            /* ACCESSIBLE REPORT FORM */
            <form onSubmit={handleReportSubmit} className="space-y-6">
              
              {/* ACCESSIBLE RADIO GROUP - REASON SELECTION */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-xs uppercase tracking-widest text-slate-400 font-bold block">
                  Select the main problem
                </label>
                
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {reportCategories.map((category) => {
                    const isChecked = selectedReason === category.id;
                    return (
                      <label 
                        key={category.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.05)]' 
                            : 'bg-slate-950/40 border-slate-900 hover:bg-slate-950/80 hover:border-purple-950/60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reportReason"
                          value={category.id}
                          checked={isChecked}
                          onChange={(e) => setSelectedReason(e.target.value)}
                          className="radio radio-xs radio-error mt-0.5 border-slate-700"
                        />
                        <div className="space-y-0.5">
                          <span className={`text-xs font-bold block ${isChecked ? 'text-red-400' : 'text-slate-300'}`}>
                            {category.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block leading-normal">
                            {category.hint}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* DETAILS TEXTAREA TEXTFIELD */}
              <div className="form-control w-full space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="details-textarea" className="label-text text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle size={12} className="text-red-400" /> Provide explicit details
                  </label>
                  <span className={`text-[10px] font-mono ${detailsText.length < 10 ? 'text-amber-600' : 'text-slate-600'}`}>
                    {detailsText.length}/1000
                  </span>
                </div>
                
                <textarea
                  id="details-textarea"
                  maxLength={1000}
                  value={detailsText}
                  onChange={(e) => setDetailsText(e.target.value)}
                  placeholder="Please describe exactly what happened. Include timestamps, delivery attempts, tracking IDs, or specifics about communication discrepancies. (Minimum 10 characters)"
                  className="textarea textarea-bordered bg-slate-950/60 border-purple-950/80 focus:border-red-500/80 focus:outline-none text-slate-200 text-xs w-full h-24 leading-relaxed rounded-lg placeholder:text-slate-600 resize-none transition-colors"
                />
              </div>

              {/* PROTECTION NOTICE */}
              <div className="flex items-start gap-2.5 bg-red-950/10 border border-red-500/10 rounded-lg p-3 text-[10px] text-slate-400 leading-relaxed">
                <ShieldAlert size={14} className="text-red-400 shrink-0 mt-0.5" />
                <p>
                  Filing a malicious or intentionally fraudulent report against an honest user violates system terms and can result in the restriction of your own trading node credentials.
                </p>
              </div>

              {/* ACTION SUBMIT TRIGGER BUTTON */}
              <button
                type="submit"
                disabled={!selectedReason || detailsText.trim().length < 10 || isSubmitting}
                className="w-full btn bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-transparent text-white border-none font-bold uppercase tracking-widest text-xs h-11 min-h-0 rounded-lg transition-all shadow-[0_4px_12px_rgba(239,68,68,0.1)] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-xs text-slate-400" />
                ) : !selectedReason ? (
                  "Select a Reason to Flag"
                ) : detailsText.trim().length < 10 ? (
                  "Provide More Details Below"
                ) : (
                  "Transmit Incident Report"
                )}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}