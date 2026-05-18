import React, { useState } from "react";
import { CreditCard, AlertCircle, ShieldCheck } from "lucide-react";

export default function PaymentGateWay({
    itemTitle = "RTX 3080 Gaming OC",
    buyerEmail = "thabo@node.co.za",
}) {
    const [isProcessing, setIsProcessing] = useState(false);
    // State to hold the user's custom payment amount
    const [amount, setAmount] = useState("8500.00");

    // PayFast Sandbox Environment Constants
    const PAYFAST_SANDBOX_URL = "https://sandbox.payfast.co.za/eng/process";
    const MERCHANT_ID = "10047176"; 
    const MERCHANT_KEY = "tngo2a5oceqs5";

    const RETURN_URL = `${window.location.origin}/transaction/success`;
    const CANCEL_URL = `${window.location.origin}/transaction/cancel`;
    const NOTIFY_URL = "https://yourdomain.com/api/v1/payments/payfast-webhook";

    const handleFormSubmit = () => {
        setIsProcessing(true);
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-[#090614] border border-purple-500/20 rounded-xl p-5 sm:p-8 text-slate-300 shadow-2xl shadow-black/80">
            {/* Header Status */}
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
                    <h2 className="text-white font-bold text-sm sm:text-base uppercase tracking-wide">
                        Secure Payment
                    </h2>
                </div>
                <span className="text-[10px] sm:text-xs text-purple-400 font-bold bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded uppercase">
                    Testing Mode
                </span>
            </div>

            {/* Item Summary Card */}
            <div className="bg-[#0e0a1f] border border-purple-500/10 rounded-lg p-4 mb-6">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">
                    Item Details
                </span>
                <p className="text-white text-xs sm:text-sm font-bold truncate">
                    {itemTitle}
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5 truncate">
                    Buyer Email: {buyerEmail}
                </p>
            </div>

            {/* PayFast Form */}
            <form
                action={PAYFAST_SANDBOX_URL}
                method="POST"
                onSubmit={handleFormSubmit}
            >
                {/* PayFast Required Hidden Fields */}
                <input type="hidden" name="merchant_id" value={MERCHANT_ID} />
                <input type="hidden" name="merchant_key" value={MERCHANT_KEY} />
                <input type="hidden" name="return_url" value={RETURN_URL} />
                <input type="hidden" name="cancel_url" value={CANCEL_URL} />
                <input type="hidden" name="notify_url" value={NOTIFY_URL} />
                <input type="hidden" name="email_address" value={buyerEmail} />
                <input type="hidden" name="item_name" value={itemTitle} />
                <input type="hidden" name="m_payment_id" value={`TX-${Date.now()}`} />

                {/* VISIBLE AMOUNT INPUT FIELD */}
                <div className="mb-6">
                    <label 
                        htmlFor="payment-amount" 
                        className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
                    >
                        Enter Payment Amount (ZAR)
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-fuchsia-400 font-bold text-sm">R</span>
                        </div>
                        <input
                            type="number"
                            name="amount" // PayFast reads this directly on form submit
                            id="payment-amount"
                            step="0.01"
                            min="1.00"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#0e0a1f] border border-purple-500/30 rounded-lg pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-fuchsia-500 font-bold transition-colors"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Helpful Information Notice */}
                <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-lg flex gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
                    <p className="text-slate-400 text-xs leading-relaxed">
                        Clicking the button below will open the official, secure PayFast testing site to complete your simulated payment.
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 text-white ${
                        isProcessing
                            ? "bg-[#120d22] text-slate-500 border border-purple-500/10 cursor-not-allowed"
                            : "bg-fuchsia-600 hover:bg-fuchsia-500 shadow-lg shadow-fuchsia-950/50"
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                            REDIRECTING TO PAYFAST...
                        </>
                    ) : (
                        <>
                            <CreditCard size={16} />
                            Pay R {amount ? parseFloat(amount).toLocaleString("en-ZA", { minimumFractionDigits: 2 }) : "0.00"}
                        </>
                    )}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-purple-500/10 flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                <span className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-purple-500/50" /> Secure Checkout
                </span>
                <span>Escrow Step 1</span>
            </div>
        </div>
    );
}