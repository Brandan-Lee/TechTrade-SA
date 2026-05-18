import React, { useState } from "react";
import { Terminal, CheckCheck, Eye, EyeOff } from "lucide-react";
import BaseModal from "../../ui/BaseModal";
import NotificationItem from "./NotificationItem";

const NotificationModal = ({ isOpen, onClose }) => {
    // 1. Unified State Core Matrix with coherent boolean markers
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "offer",
            status: "pending",
            title: "OFFER_RECEIVED",
            time: "2M_AGO",
            offerAmount: "8,500",
            listingName: "RTX 3080",
            buyerName: "Thabo M.",
            isRead: false
        },
        {
            id: 2,
            type: "bridge",
            status: "active",
            title: "SECURE_BRIDGE_ONLINE",
            time: "1H_AGO",
            listingName: "PlayStation 5",
            sellerName: "Sarah K.",
            isRead: false
        },
        {
            id: 3,
            type: "counter",
            status: "pending",
            title: "COUNTER_MUTATION_ALERT",
            time: "3H_AGO",
            offerAmount: "9,000",
            listingName: "Gaming Chair",
            sellerName: "Mike D.",
            isRead: false
        },
        {
            id: 4,
            type: "offer",
            status: "accepted",
            title: "PAYLOAD_TRANSFER_SUCCESS",
            time: "5H_AGO",
            offerAmount: "12,000",
            listingName: "AMD Ryzen 9 7950X",
            isRead: false
        },
        {
            id: 5,
            type: "offer",
            status: "declined",
            title: "TRANSACTION_TERMINATED",
            time: "1D_AGO",
            listingName: "RTX 3060 Ti",
            isRead: true
        },
        {
            id: 6,
            type: "bridge",
            status: "expired",
            title: "LINK_DEGRADATION_SIGNAL",
            time: "2D_AGO",
            listingName: "Mechanical Keyboard",
            isRead: true
        }
    ]);

    // 2. Data Disposal Pipeline
    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // 3. Operational State Mutator (Accept / Decline logs)
    const handleAction = (id, actionType) => {
        setNotifications(prev => prev.map(n => {
            if (n.id === id) {
                return { 
                    ...n, 
                    status: actionType === "accept" ? "accepted" : "declined",
                    isRead: true 
                };
            }
            return n;
        }));
    };

    // 4. Global Override Index Update
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const hasUnread = notifications.some(n => !n.isRead);

    // Interactive Action Block Header Link Custom Asset
    const notificationActions = notifications.length > 0 ? (
        <button 
            onClick={markAllAsRead}
            disabled={!hasUnread}
            className={`font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 px-2 py-1 rounded border transition-all focus:outline-none ${
                hasUnread
                    ? "text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/[0.02] hover:bg-fuchsia-500/[0.08] hover:border-fuchsia-500/50 cursor-pointer focus:ring-1 focus:ring-fuchsia-400"
                    : "text-slate-600 border-white/5 bg-transparent cursor-not-allowed opacity-40"
            }`}
        >
            <CheckCheck size={12} />
            <span>MARK_READ_ALL</span>
        </button>
    ) : null;

    // Derived operational streams
    const unreadNotifications = notifications.filter(n => !n.isRead);
    const readNotifications = notifications.filter(n => n.isRead);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="User Notifications"
            icon={<Terminal size={16} className="text-fuchsia-500" />}
            headerAction={notificationActions}
            footerText={`${unreadNotifications.length} unread notifications`}
            centerContent={false}
            className="bg-[#08080a] border border-purple-500/20 rounded-xl max-w-2xl w-full mx-auto shadow-[0_0_30px_rgba(0,0,0,0.8)]"
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-purple-900/40 scrollbar-track-transparent">
                
                {/* ACTIVE BROADCAST MATRIX SECTION */}
                {unreadNotifications.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-fuchsia-500 px-1">
                            <Eye size={12} className="animate-pulse" />
                            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em]">
                                NEW
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {unreadNotifications.map((notif) => (
                                <NotificationItem
                                    key={notif.id}
                                    {...notif}
                                    onAction={handleAction}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ARCHIVED DATA HISTORIC LOGS SECTION */}
                {readNotifications.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-slate-500 px-1">
                            <EyeOff size={12} />
                            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em]">
                                EARLIER
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {readNotifications.map((notif) => (
                                <NotificationItem
                                    key={notif.id}
                                    {...notif}
                                    onAction={handleAction}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ZERO STATE CONNECTION LINK BROKEN TERMINAL */}
                {notifications.length === 0 && (
                    <div 
                        role="status" 
                        aria-live="polite"
                        className="py-12 px-4 border border-dashed border-white/5 bg-black/20 rounded-lg text-center font-mono space-y-2"
                    >
                        <p className="text-slate-600 text-xs uppercase tracking-widest font-bold">
                            [STATUS_CLEARED]: NO_ACTIVE_STREAM_DETECTIONS
                        </p>
                        <p className="text-[10px] text-slate-700 uppercase tracking-wider">
                            Awaiting incoming network diagnostics connection...
                        </p>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default NotificationModal;