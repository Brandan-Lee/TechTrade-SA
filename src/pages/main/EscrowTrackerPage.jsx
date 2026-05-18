import React, { useState } from "react";
import {
    Truck,
    CheckCircle2,
    ShieldCheck,
    AlertCircle,
    HelpCircle,
    Package,
    ArrowRightLeft,
    ExternalLink,
    AlertTriangle,
    Star
} from "lucide-react";
import PaymentGateWay from "./PaymentGateWay"; // Import the previous gateway component
import { useNavigate } from "react-router-dom";

export default function EscrowTrackerPage() {
    // Simulated user role for testing
    const [userRole, setUserRole] = useState("buyer"); // Switch between 'buyer' or 'seller' to test the interface
    const navigate = useNavigate();

    // Transaction data
    const [transaction, setTransaction] = useState({
        id: "TX-9082314",
        itemTitle: "RTX 3080 Gaming OC",
        agreedPrice: "8500.00",
        buyerName: "Thabo Mthembu",
        sellerName: "CryptoHardware SA",
        currentStep: 1, // 1: Awaiting Payment, 2: Secured/Awaiting Shipment, 3: In Transit, 4: Delivered/Testing, 5: Funds Released/Complete
    });

    // Step configuration
    const stepsConfig = [
        {
            level: 1,
            name: "Securing Payment",
            desc: "Buyer sends payment to escrow",
        },
        {
            level: 2,
            name: "Awaiting Dispatch",
            desc: "Seller packages item and adds tracking",
        },
        {
            level: 3,
            name: "In Transit",
            desc: "Package is being shipped",
        },
        {
            level: 4,
            name: "Hardware Inspection",
            desc: "Buyer tests the item",
        },
        {
            level: 5,
            name: "Transaction Completed",
            desc: "Funds released to Seller",
        },
    ];

    // State control functions
    const advanceStep = () => {
        if (transaction.currentStep < 5) {
            setTransaction((prev) => ({
                ...prev,
                currentStep: prev.currentStep + 1,
            }));
        }
    };

    const resetPipeline = () => {
        setTransaction((prev) => ({ ...prev, currentStep: 1 }));
    };

    // Handler placeholders for your navigation logic / modals
    const handleViewListing = () => {
        alert("Navigating to original listing marketplace record...");
    };

    const handleLaunchDispute = () => {
        e.stopPropagation();
        naviagate("\dispute")
    };

    const handleLeaveReview = () => {
        alert("Opening User Rating and Feedback sheet...");
    };

    return (
        <div className="min-h-screen bg-[#07050e] text-slate-300 font-mono pb-16 px-4 sm:px-6 lg:px-8 select-none selection:bg-fuchsia-500/30">
            <div className="max-w-5xl mx-auto pt-8 sm:pt-12">
                {/* Header System Panel */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-500/10 pb-6 mb-8">
                    <div>
                        <h1 className="text-white text-xl sm:text-2xl font-black tracking-wider uppercase flex items-center gap-2.5">
                            <ArrowRightLeft
                                className="text-fuchsia-400 w-5 h-5"
                                aria-hidden="true"
                            />
                            Listing Tracker
                        </h1>
                        <p className="text-slate-500 text-xs mt-1">
                            Transaction ID: {transaction.id}
                        </p>
                    </div>

                    {/* Demo Controls - Toggle view for testing */}
                    <div className="flex flex-wrap items-center gap-2.5 bg-[#0e0a1f] border border-purple-500/20 p-2 rounded-lg">
                        <span className="text-[10px] text-purple-400 font-black uppercase tracking-wider pl-1">
                            Demo Mode:
                        </span>
                        <button
                            onClick={() =>
                                setUserRole(userRole === "buyer" ? "seller" : "buyer")
                            }
                            className="px-2.5 py-1 bg-purple-950/60 border border-purple-500/30 rounded text-[11px] text-white font-bold uppercase tracking-wider hover:bg-purple-900 transition-colors"
                        >
                            Acting As:{" "}
                            <span className="text-fuchsia-400">{userRole.toUpperCase()}</span>
                        </button>
                        {transaction.currentStep === 5 && (
                            <button
                                onClick={resetPipeline}
                                className="px-2.5 py-1 bg-rose-950/40 border border-rose-500/30 rounded text-[11px] text-rose-400 font-bold uppercase tracking-wider hover:bg-rose-900/40 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* 5-Step Progress Tracker */}
                <div className="w-full bg-[#0c0919] border border-purple-500/10 rounded-xl p-6 mb-8 shadow-lg">
                    <h2 className="sr-only">Escrow State Progress</h2>
                    <ul className="steps steps-vertical md:steps-horizontal w-full text-left md:text-center text-xs gap-4 md:gap-0">
                        {stepsConfig.map((step) => {
                            const isCompleted = transaction.currentStep > step.level;
                            const isActive = transaction.currentStep === step.level;
                            return (
                                <li
                                    key={step.level}
                                    data-content={isCompleted ? "✓" : step.level}
                                    className={`step transition-all duration-300 ${
                                        isCompleted
                                            ? "step-secondary text-fuchsia-400 font-bold"
                                            : ""
                                    } ${isActive ? "step-primary text-purple-300 font-black tracking-wide" : "text-slate-600"}`}
                                >
                                    <div className="md:mt-2 text-left md:text-center px-2">
                                        <p
                                            className={`text-xs uppercase tracking-wide ${isActive ? "text-white" : ""}`}
                                        >
                                            {step.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5 max-w-[160px] md:mx-auto hidden sm:block">
                                            {step.desc}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Transaction Details */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <div className="bg-[#0c0919] border border-purple-500/10 rounded-xl p-5 sm:p-6 shadow-md">
                            <h3 className="text-white text-xs sm:text-sm font-black uppercase tracking-widest border-b border-purple-500/10 pb-3 mb-4">
                                Transaction Details
                            </h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-2">
                                    <div>
                                        <dt className="text-slate-500 uppercase tracking-wider mb-0.5">
                                            Item
                                        </dt>
                                        <dd className="text-white font-bold text-sm sm:text-base">
                                            {transaction.itemTitle}
                                        </dd>
                                    </div>
                                    {/* REQUESTED BUTTON: VIEW ORIGINAL LISTING */}
                                    <button
                                        onClick={handleViewListing}
                                        className="btn btn-outline btn-xs border-purple-500/20 text-purple-400 hover:bg-purple-950/40 hover:border-purple-400 text-[10px] uppercase tracking-wider rounded font-sans gap-1"
                                    >
                                        <ExternalLink size={10} />
                                        View Original Listing
                                    </button>
                                </div>
                                <div>
                                    <dt className="text-slate-500 uppercase tracking-wider mb-0.5">
                                        Amount
                                    </dt>
                                    <dd className="text-fuchsia-400 font-black text-sm sm:text-base">
                                        R{" "}
                                        {parseFloat(transaction.agreedPrice).toLocaleString(
                                            "en-ZA",
                                            { minimumFractionDigits: 2 },
                                        )}
                                    </dd>
                                </div>
                                <div className="pt-2 border-t border-purple-500/5">
                                    <dt className="text-slate-500 uppercase tracking-wider mb-0.5">
                                        Buyer
                                    </dt>
                                    <dd className="text-slate-300 font-medium">
                                        {transaction.buyerName}
                                    </dd>
                                </div>
                                <div className="pt-2 border-t border-purple-500/5">
                                    <dt className="text-slate-500 uppercase tracking-wider mb-0.5">
                                        Seller
                                    </dt>
                                    <dd className="text-slate-300 font-medium">
                                        {transaction.sellerName}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Help Notice */}
                        <div className="p-4 bg-purple-950/10 border border-purple-500/20 rounded-xl flex gap-3.5 shadow-inner">
                            <HelpCircle
                                className="w-5 h-5 text-purple-400 shrink-0 mt-0.5"
                                aria-hidden="true"
                            />
                            <div>
                                <h4 className="text-white text-xs font-black uppercase tracking-wider mb-1">
                                    Current Status
                                </h4>
                                <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                                    {transaction.currentStep === 1 &&
                                        "Waiting for the Buyer to complete payment."}
                                    {transaction.currentStep === 2 &&
                                        "Payment is secured. Seller must ship the item."}
                                    {transaction.currentStep === 3 &&
                                        "Package is being delivered."}
                                    {transaction.currentStep === 4 &&
                                        "Package delivered. Buyer has 48 hours to test the item."}
                                    {transaction.currentStep === 5 &&
                                        "Transaction complete. Funds have been released."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Action Center */}
                    <div className="lg:col-span-5">
                        <div className="bg-[#0a0616] border-2 border-purple-500/20 rounded-xl p-6 shadow-xl relative overflow-hidden">
                            <div
                                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500"
                                aria-hidden="true"
                            />

                            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2">
                                    <span
                                        className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping"
                                        aria-hidden="true"
                                    />
                                    Action Center
                                </span>
                            </h3>

                            {/* Actions based on current step */}
                            <div className="space-y-4">
                                {/* STEP 1 ACTION: Buyer pays via Gateway */}
                                {transaction.currentStep === 1 &&
                                    (userRole === "buyer" ? (
                                        <div className="space-y-4">
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Complete payment through the payment gateway to proceed.
                                            </p>
                                            <PaymentGateWay
                                                offerPrice={transaction.agreedPrice}
                                                itemTitle={transaction.itemTitle}
                                            />
                                            <button
                                                onClick={advanceStep}
                                                className="btn btn-xs btn-outline btn-purple w-full tracking-widest text-[9px] opacity-40 hover:opacity-100"
                                            >
                                                [Simulate Payment Confirmation]
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border border-dashed border-purple-500/20 rounded-lg">
                                            <AlertCircle
                                                size={24}
                                                className="text-purple-500/40 mx-auto mb-2"
                                            />
                                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                                                Waiting for Buyer to Pay
                                            </p>
                                        </div>
                                    ))}

                                {/* STEP 2 ACTION: Seller ships */}
                                {transaction.currentStep === 2 &&
                                    (userRole === "seller" ? (
                                        <div className="space-y-3">
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Confirm you have packed the GPU and added tracking information.
                                            </p>
                                            <button
                                                onClick={advanceStep}
                                                className="btn w-full bg-fuchsia-600 hover:bg-fuchsia-500 border-none text-white tracking-widest text-xs font-black uppercase h-11"
                                            >
                                                <Package size={14} className="mr-2" />
                                                MARK AS SHIPPED
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border border-dashed border-purple-500/20 rounded-lg">
                                            <ShieldCheck
                                                size={24}
                                                className="text-emerald-500/40 mx-auto mb-2"
                                            />
                                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider text-emerald-400/80">
                                                Payment Secured
                                            </p>
                                            <p className="text-slate-500 text-[10px] mt-1 px-4">
                                                Waiting for Seller to ship the package.
                                            </p>
                                        </div>
                                    ))}

                                {/* STEP 3 ACTION: Package in transit tracking */}
                                {transaction.currentStep === 3 &&
                                    (userRole === "buyer" ? (
                                        <div className="space-y-3">
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Has the package been delivered? Confirm delivery below.
                                            </p>
                                            <button
                                                onClick={advanceStep}
                                                className="btn w-full bg-purple-600 hover:bg-purple-500 border-none text-white tracking-widest text-xs font-black uppercase h-11"
                                            >
                                                <Truck size={14} className="mr-2" />
                                                CONFIRM DELIVERY
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border border-dashed border-purple-500/20 rounded-lg">
                                            <Truck
                                                size={24}
                                                className="text-fuchsia-500/40 mx-auto mb-2 animate-pulse"
                                            />
                                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                                                Package In Transit
                                            </p>
                                        </div>
                                    ))}

                                {/* STEP 4 ACTION: Inspection and release */}
                                {transaction.currentStep === 4 &&
                                    (userRole === "buyer" ? (
                                        <div className="space-y-3">
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Test the item. Approving will release the payment to the seller.
                                            </p>
                                            <button
                                                onClick={advanceStep}
                                                className="btn w-full bg-emerald-600 hover:bg-emerald-500 border-none text-white tracking-widest text-xs font-black uppercase h-11 shadow-lg shadow-emerald-950/40"
                                            >
                                                <CheckCircle2 size={14} className="mr-2" />
                                                RELEASE PAYMENT
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border border-dashed border-purple-500/20 rounded-lg">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block mb-2 animate-ping" />
                                            <p className="text-amber-400 text-xs uppercase font-bold tracking-wider">
                                                Buyer Testing Item
                                            </p>
                                            <p className="text-slate-500 text-[10px] mt-1 px-4">
                                                Funds will be released once testing is complete.
                                            </p>
                                        </div>
                                    ))}

                                {/* STEP 5 ACTION: Complete & Review Trigger */}
                                {transaction.currentStep === 5 && (
                                    <div className="space-y-4">
                                        <div className="text-center py-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-4">
                                            <ShieldCheck
                                                size={32}
                                                className="text-emerald-400 mx-auto mb-2"
                                            />
                                            <h4 className="text-emerald-400 text-xs font-black tracking-widest uppercase">
                                                Transaction Complete
                                            </h4>
                                            <p className="text-slate-400 text-[11px] leading-relaxed mt-1 font-medium">
                                                Funds have been released successfully.
                                            </p>
                                        </div>

                                        {/* REQUESTED BUTTON: LEAVE A REVIEW */}
                                        <button
                                            onClick={handleLeaveReview}
                                            className="btn w-full bg-fuchsia-600 hover:bg-fuchsia-500 border-none text-white tracking-widest text-xs font-black uppercase h-11 shadow-md rounded-lg font-sans"
                                        >
                                            <Star size={14} className="mr-2 fill-white" />
                                            Leave a Review
                                        </button>
                                    </div>
                                )}

                                {/* GLOBAL DISPUTE ESCALATION BLOCK */}
                                {/* Accessible logic: Dispute option is highlighted during inspection, but available at any active shipping phase */}
                                {transaction.currentStep > 1 && transaction.currentStep < 5 && (
                                    <div className="pt-2 border-t border-purple-500/15 mt-4">
                                        <div className="bg-rose-950/10 border border-rose-500/10 rounded-lg p-3 space-y-2">
                                            <p className="text-slate-400 text-[10px] leading-normal font-sans">
                                                {transaction.currentStep === 4 
                                                    ? "Issues with testing hardware? You can open an official dispute protocol to freeze funds."
                                                    : "Experiencing shipment or communication failure?"}
                                            </p>
                                            
                                            {/* REQUESTED BUTTON: LAUNCH DISPUTE */}
                                            <button
                                                onClick={handleLaunchDispute}
                                                className={`btn btn-xs w-full font-sans uppercase font-bold tracking-wider ${
                                                    transaction.currentStep === 4
                                                        ? "bg-rose-950 text-rose-400 border border-rose-500/30 hover:bg-rose-900"
                                                        : "btn-ghost text-slate-500 hover:text-rose-400 text-[9px]"
                                                }`}
                                            >
                                                <AlertTriangle size={12} className="mr-1.5" />
                                                Launch Dispute Protocol
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}